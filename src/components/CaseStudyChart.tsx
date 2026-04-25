import { useMemo } from 'react'
import type { IndicatorKey } from '../data/indicatorLessons'

/* ---------- types ---------- */
type Candle = {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type SeriesPoint = Candle & {
  sma20?: number | null
  ema20?: number | null
  rsi14?: number | null
  dif?: number | null
  dea?: number | null
  hist?: number | null
  volMa5?: number | null
  volMa10?: number | null
}

type Props = {
  indicatorKey: IndicatorKey
  trend: 'up' | 'down' | 'range'
  volatility: number
  entryIndex: number
  stopIndex: number
  width?: number
  height?: number
}

/* ---------- helpers ---------- */
const RISE = '#ff4d4f'
const FALL = '#52c41a'

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function avg(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function calcEma(values: number[], period: number): (number | null)[] {
  if (values.length < period) return values.map(() => null)
  const result: (number | null)[] = values.map(() => null)
  const k = 2 / (period + 1)
  let ema = avg(values.slice(0, period))
  result[period - 1] = ema
  for (let i = period; i < values.length; i++) {
    ema = values[i] * k + ema * (1 - k)
    result[i] = ema
  }
  return result
}

function calcSma(values: number[], period: number, idx: number) {
  if (idx + 1 < period) return null
  return avg(values.slice(idx - period + 1, idx + 1))
}

function calcRsi(values: number[], period: number, idx: number): number | null {
  if (idx + 1 <= period) return null
  let gain = 0, loss = 0
  for (let j = idx - period + 1; j <= idx; j++) {
    const d = values[j] - values[j - 1]
    if (d > 0) gain += d
    else loss += Math.abs(d)
  }
  if (loss === 0) return 100
  return 100 - 100 / (1 + gain / loss)
}

/* ---------- data generator ---------- */
function generateData(props: Props): { data: SeriesPoint[]; basePrice: number } {
  const { trend, volatility, entryIndex, stopIndex } = props
  const rand = seeded(42)
  const N = 60
  const basePrice = 100
  const volScale = volatility * 0.003

  /* build price series with scenario bias */
  const prices: number[] = [basePrice]
  let trendDuration = 0
  let currentTrend = trend

  for (let i = 1; i < N; i++) {
    trendDuration--
    if (trendDuration <= 0) {
      const r = rand()
      if (currentTrend === 'up') {
        currentTrend = r < 0.7 ? 'up' : r < 0.85 ? 'range' : 'down'
      } else if (currentTrend === 'down') {
        currentTrend = r < 0.7 ? 'down' : r < 0.85 ? 'range' : 'up'
      } else {
        currentTrend = r < 0.4 ? 'up' : r < 0.6 ? 'down' : 'range'
      }
      trendDuration = 5 + Math.floor(rand() * 12)
    }

    /* bias */
    const bias = currentTrend === 'up' ? 0.003 : currentTrend === 'down' ? -0.003 : 0
    const noise = (rand() - 0.5) * volScale
    const ret = bias + noise
    const prev = prices[prices.length - 1]
    prices.push(Math.max(prev * 0.95, prev * (1 + ret)))
  }

  /* adjust so entry/stop indices make sense — make sure the area around entry has a pullback */
  const entryIdx = Math.floor(N * entryIndex)
  const stopIdx = Math.floor(N * stopIndex)
  if (trend === 'up') {
    /* pullback before entry */
    for (let i = entryIdx - 3; i <= entryIdx; i++) {
      if (i >= 0 && i < N) prices[i] *= 0.97
    }
    /* ensure stop is a local low */
    if (stopIdx >= 0 && stopIdx < N) {
      prices[stopIdx] = Math.min(prices[stopIdx], prices[Math.max(0, stopIdx - 1)] * 0.97)
    }
  } else if (trend === 'down') {
    for (let i = entryIdx - 3; i <= entryIdx; i++) {
      if (i >= 0 && i < N) prices[i] *= 1.03
    }
    if (stopIdx >= 0 && stopIdx < N) {
      prices[stopIdx] = Math.max(prices[stopIdx], prices[Math.max(0, stopIdx - 1)] * 1.03)
    }
  }

  /* build candles */
  const candles: Candle[] = prices.map((p, i) => {
    const r1 = rand(), r2 = rand(), r3 = rand()
    const bodyPct = 0.003 + r1 * 0.012
    const wickPct = 0.002 + r2 * 0.008
    let open: number, close: number
    if (i === 0) {
      open = p * (1 - bodyPct / 2)
      close = p * (1 + bodyPct / 2)
    } else if (p > prices[i - 1]) {
      open = p - p * bodyPct * (0.3 + r3 * 0.4)
      close = p + p * bodyPct * (0.3 + r3 * 0.4)
    } else {
      open = p + p * bodyPct * (0.3 + r3 * 0.4)
      close = p - p * bodyPct * (0.3 + r3 * 0.4)
    }
    const high = Math.max(open, close) * (1 + wickPct * r1)
    const low = Math.min(open, close) * (1 - wickPct * r2)
    const volume = Math.round(1000 + rand() * 3000 + Math.abs(close - open) / open * 50000)
    return {
      time: `${Math.floor(i / 12)}月${(i % 12) * 2 + 1}日`,
      open, high, low, close, volume,
    }
  })

  /* compute indicators */
  const closes = candles.map(c => c.close)
  const volumes = candles.map(c => c.volume)
  const ema20S = calcEma(closes, 20)
  const ema12S = calcEma(closes, 12)
  const ema26S = calcEma(closes, 26)
  const difS = closes.map((_, i) => {
    if (ema12S[i] === null || ema26S[i] === null) return null
    return (ema12S[i] as number) - (ema26S[i] as number)
  })
  const difVals = difS.filter((v): v is number => v !== null)
  const deaRaw = calcEma(difVals, 9)
  let dc = 0
  const deaS = difS.map(d => { if (d === null) return null; const v = deaRaw[dc]; dc++; return v ?? null })
  const macdS = difS.map((d, i) => d !== null && deaS[i] !== null ? d! - deaS[i]! : null)

  const series: SeriesPoint[] = candles.map((c, i) => ({
    ...c,
    sma20: calcSma(closes, 20, i),
    ema20: ema20S[i],
    rsi14: calcRsi(closes, 14, i),
    dif: difS[i],
    dea: deaS[i],
    hist: macdS[i],
    volMa5: calcSma(volumes, 5, i),
    volMa10: calcSma(volumes, 10, i),
  }))

  return { data: series, basePrice }
}

/* ---------- SVG chart ---------- */
function priceToY(price: number, minP: number, maxP: number, h: number, pad: number) {
  return pad + ((maxP - price) / Math.max(1, maxP - minP)) * (h - 2 * pad)
}

export default function CaseStudyChart(props: Props) {
  const { indicatorKey, entryIndex, stopIndex, width = 800, height = 420 } = props
  const { data } = useMemo(() => generateData(props), [indicatorKey, entryIndex, stopIndex])

  const pad = { top: 24, right: 60, bottom: 28, left: 56 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const N = data.length
  const stepX = innerW / Math.max(1, N)
  const candleW = Math.max(2, stepX * 0.65)
  const xCenter = (i: number) => pad.left + i * stepX + stepX / 2

  const minPrice = Math.min(...data.map(d => d.low)) * 0.97
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.03
  const yPrice = (p: number) => priceToY(p, minPrice, maxPrice, height, pad.top)

  const entryIdx = Math.min(Math.max(0, Math.floor(N * entryIndex)), N - 1)
  const stopIdx = Math.min(Math.max(0, Math.floor(N * stopIndex)), N - 1)

  const entryX = xCenter(entryIdx)
  const entryY = yPrice(data[entryIdx].close)
  const stopX = xCenter(stopIdx)
  const stopY = yPrice(data[stopIdx].low)

  /* chart type */
  const hasMacd = ['dif', 'dea', 'macd'].includes(indicatorKey)
  const hasRsi = indicatorKey === 'rsi14'
  const showVol = ['volMa5', 'volMa10'].includes(indicatorKey)

  /* MACD sub-chart */
  const macdData = data.map(d => d.hist ?? 0)
  const maxMacd = Math.max(...macdData.map(Math.abs), 0.01)
  const macdMin = -maxMacd * 1.2
  const macdMax = maxMacd * 1.2
  const macdH = hasMacd ? 80 : 0
  const macdY = (v: number) => height - pad.bottom - macdH + ((macdMax - v) / Math.max(1, macdMax - macdMin)) * macdH
  const macdZeroY = macdY(0)

  /* RSI sub-chart */
  const rsiH = hasRsi ? 80 : 0
  const rsiY = (v: number) => height - pad.bottom - rsiH + ((100 - v) / 100) * rsiH
  const rsiOverY = rsiY(70)
  const rsiUnderY = rsiY(30)

  /* volume sub-chart */
  const volH = showVol ? 80 : 0
  const maxVol = Math.max(...data.map(d => d.volume), 1) * 1.1
  /* grid config */
  const yTicks = 5

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" style={{ fontFamily: 'inherit' }}>
      {/* background */}
      <rect x={0} y={0} width={width} height={height} fill="transparent" />

      {/* ---- MAIN CHART AREA ---- */}
      {/* horizontal grid */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const yy = pad.top + (innerH * i) / yTicks
        const p = maxPrice - ((maxPrice - minPrice) * i) / yTicks
        return (
          <g key={`yg-${i}`}>
            <line x1={pad.left} y1={yy} x2={width - pad.right} y2={yy} stroke="rgba(255,255,255,0.07)" strokeDasharray="3 3" />
            <text x={pad.left - 8} y={yy + 4} textAnchor="end" fontSize="11" fill="rgba(255,255,255,0.55)">{p.toFixed(2)}</text>
          </g>
        )
      })}

      {/* vertical grid */}
      {Array.from({ length: 8 }).map((_, i) => {
        const xx = pad.left + (innerW * (i + 1)) / 9
        const idx = Math.min(N - 1, Math.floor((N - 1) * (i + 1) / 9))
        return (
          <g key={`xg-${i}`}>
            <line x1={xx} y1={pad.top} x2={xx} y2={height - pad.bottom} stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <text x={xx - 20} y={height - pad.bottom + 16} fontSize="10" fill="rgba(255,255,255,0.45)">
              {data[idx]?.time ?? ''}
            </text>
          </g>
        )
      })}

      {/* SMA20 line (if relevant) */}
      {!hasMacd && !hasRsi && (
        <polyline
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeDasharray="6 3"
          points={data.map((d, i) => d.sma20 != null ? `${xCenter(i)},${yPrice(d.sma20)}` : '').filter(Boolean).join(' ')}
        />
      )}

      {/* EMA20 line */}
      {['sma20', 'ema20'].includes(indicatorKey) && (
        <polyline
          fill="none"
          stroke="#ffd666"
          strokeWidth="1.8"
          points={data.map((d, i) => d.ema20 != null ? `${xCenter(i)},${yPrice(d.ema20)}` : '').filter(Boolean).join(' ')}
        />
      )}

      {/* candlesticks */}
      {data.map((d, i) => {
        const xc = xCenter(i)
        const yo = yPrice(d.open)
        const yc = yPrice(d.close)
        const yh = yPrice(d.high)
        const yl = yPrice(d.low)
        const isUp = d.close > d.open
        const color = isUp ? RISE : d.close < d.open ? FALL : '#8c8c8c'
        const top = Math.min(yo, yc)
        const h = Math.max(1, Math.abs(yo - yc))
        return (
          <g key={`c-${i}`}>
            <line x1={xc} y1={yh} x2={xc} y2={yl} stroke={color} strokeWidth="1" />
            <rect x={xc - candleW / 2} y={top} width={candleW} height={h} fill={isUp ? 'transparent' : color} stroke={color} strokeWidth="1" />
          </g>
        )
      })}

      {/* ---- VOLUME BARS ---- */}
      {(showVol || indicatorKey === 'sma20' || indicatorKey === 'ema20') && (
        <g transform={`translate(0, ${-volH})`}>
          {data.map((d, i) => {
            if (i < 5) return null
            const xc = xCenter(i)
            const vh = (d.volume / maxVol) * innerH
            const isUp = d.close > d.open
            return (
              <rect
                key={`v-${i}`}
                x={xc - candleW / 2}
                y={pad.top + innerH - vh}
                width={Math.max(1, candleW * 0.6)}
                height={vh}
                fill={isUp ? `${RISE}33` : `${FALL}33`}
              />
            )
          })}
          {showVol && indicatorKey === 'volMa5' && (
            <polyline fill="none" stroke="#ffffff" strokeWidth="1.4"
              points={data.map((d, i) => d.volMa5 != null ? `${xCenter(i)},${pad.top + innerH - (d.volMa5 / maxVol) * innerH}` : '').filter(Boolean).join(' ')} />
          )}
          {showVol && indicatorKey === 'volMa10' && (
            <polyline fill="none" stroke="#ffd666" strokeWidth="1.4"
              points={data.map((d, i) => d.volMa10 != null ? `${xCenter(i)},${pad.top + innerH - (d.volMa10 / maxVol) * innerH}` : '').filter(Boolean).join(' ')} />
          )}
        </g>
      )}

      {/* ---- RSI SUB-CHART ---- */}
      {hasRsi && (
        <g>
          <rect x={pad.left} y={pad.top + innerH + 4} width={innerW} height={rsiH - 4} fill="rgba(0,0,0,0.3)" rx="4" />
          {/* 70 overbought line */}
          <line x1={pad.left} y1={rsiOverY} x2={width - pad.right} y2={rsiOverY} stroke="#ff4d4f44" strokeDasharray="4 4" />
          <text x={width - pad.right + 4} y={rsiOverY + 4} fontSize="9" fill="#ff4d4f88">70</text>
          {/* 30 oversold line */}
          <line x1={pad.left} y1={rsiUnderY} x2={width - pad.right} y2={rsiUnderY} stroke="#52c41a44" strokeDasharray="4 4" />
          <text x={width - pad.right + 4} y={rsiUnderY + 4} fontSize="9" fill="#52c41a88">30</text>
          {/* RSI line */}
          <polyline fill="none" stroke="#9dd6ff" strokeWidth="1.8"
            points={data.map((d, i) => d.rsi14 != null ? `${xCenter(i)},${rsiY(d.rsi14)}` : '').filter(Boolean).join(' ')} />
          {/* 50 midline */}
          <line x1={pad.left} y1={rsiY(50)} x2={width - pad.right} y2={rsiY(50)} stroke="rgba(255,255,255,0.15)" strokeDasharray="2 2" />
          <text x={width - pad.right + 4} y={rsiY(50) + 4} fontSize="9" fill="rgba(255,255,255,0.3)">50</text>
          <text x={pad.left + 4} y={pad.top + innerH + 14} fontSize="10" fill="rgba(255,255,255,0.5)">RSI(14)</text>
        </g>
      )}

      {/* ---- MACD SUB-CHART ---- */}
      {hasMacd && (
        <g>
          <rect x={pad.left} y={pad.top + innerH + 4} width={innerW} height={macdH - 4} fill="rgba(0,0,0,0.3)" rx="4" />
          {/* zero line */}
          <line x1={pad.left} y1={macdZeroY} x2={width - pad.right} y2={macdZeroY} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* histogram bars */}
          {data.map((d, i) => {
            const v = d.hist ?? 0
            const xc = xCenter(i)
            const y0 = macdZeroY
            const y1 = macdY(v)
            const barW = Math.max(1, candleW * 0.5)
            return <rect key={`m-${i}`} x={xc - barW / 2} y={Math.min(y0, y1)} width={barW} height={Math.abs(y1 - y0)} fill={v >= 0 ? RISE : FALL} opacity={0.7} />
          })}
          {/* DIF line */}
          <polyline fill="none" stroke="#ffffff" strokeWidth="1.4"
            points={data.map((d, i) => d.dif != null ? `${xCenter(i)},${macdY(d.dif)}` : '').filter(Boolean).join(' ')} />
          {/* DEA line */}
          <polyline fill="none" stroke="#ffd666" strokeWidth="1.4"
            points={data.map((d, i) => d.dea != null ? `${xCenter(i)},${macdY(d.dea)}` : '').filter(Boolean).join(' ')} />
          <text x={pad.left + 4} y={pad.top + innerH + 14} fontSize="10" fill="rgba(255,255,255,0.5)">MACD(12,26,9)</text>
        </g>
      )}

      {/* ---- ENTRY / STOP MARKERS ---- */}
      {/* entry arrow */}
      <g>
        <line x1={entryX} y1={pad.top + 8} x2={entryX} y2={entryY - 10} stroke="#00ff41" strokeWidth="1.5" strokeDasharray="4 3" />
        <polygon points={`${entryX},${entryY - 14} ${entryX - 6},${entryY - 4} ${entryX + 6},${entryY - 4}`} fill="#00ff41" />
        <rect x={entryX - 28} y={pad.top + 4} width={56} height={18} rx="3" fill="#00ff41" />
        <text x={entryX} y={pad.top + 16} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#000">入场</text>
      </g>

      {/* stop marker */}
      {stopIdx !== entryIdx && (
        <g>
          {/* vertical line from top of chart down to stop candle */}
          <line x1={stopX} y1={pad.top + 30} x2={stopX} y2={stopY + 14} stroke="#ff4d4f" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* X marker */}
          <circle cx={stopX} cy={stopY} r="8" fill="none" stroke="#ff4d4f" strokeWidth="2" />
          <line x1={stopX - 5} y1={stopY - 5} x2={stopX + 5} y2={stopY + 5} stroke="#ff4d4f" strokeWidth="2" />
          <line x1={stopX + 5} y1={stopY - 5} x2={stopX - 5} y2={stopY + 5} stroke="#ff4d4f" strokeWidth="2" />
          <rect x={stopX - 28} y={pad.top + 30} width={56} height={18} rx="3" fill="#ff4d4f" />
          <text x={stopX} y={pad.top + 42} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fff">止损</text>
        </g>
      )}

      {/* ---- LEGEND ---- */}
      <g transform={`translate(${width - pad.right - 160}, ${pad.top + 8})`}>
        <rect x="0" y="0" width="160" height="20" rx="4" fill="rgba(0,0,0,0.6)" />
        {/* legend text */}
        <text x="8" y="14" fontSize="10" fill="rgba(255,255,255,0.7)">
          价格 (K线)   |
          {['sma20', 'ema20'].includes(indicatorKey) && (
            <tspan fill="#ffd666"> EMA20</tspan>
          )}
          {indicatorKey === 'sma20' && <tspan fill="#fff"> SMA20</tspan>}
          {hasRsi && <tspan fill="#9dd6ff"> RSI(14)</tspan>}
          {hasMacd && <tspan fill="#fff"> DIF</tspan>}
          {hasMacd && <tspan fill="#ffd666"> DEA</tspan>}
          {showVol && <tspan fill="#fff"> VOL</tspan>}
        </text>
      </g>

      {/* ---- axis labels ---- */}
      <text x={pad.left} y={pad.top - 6} fontSize="10" fill="rgba(255,255,255,0.35)">
        主图
      </text>
    </svg>
  )
}

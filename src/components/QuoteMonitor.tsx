import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Customized,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router'
import { indicatorLessons, type IndicatorKey } from '../data/indicatorLessons'
import { useTrading } from '../contexts/TradingContext'

type MarketType = 'stock' | 'futures'
type TrendState = 'up' | 'flat' | 'down'
type Timeframe = '1m' | '5m' | '15m' | '30m' | '60m' | '1d'

type MinutePoint = {
  time: string
  unix: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  amount: number
  avgPrice: number
  pct: number
  trendStrength: number
}

type CandlePoint = MinutePoint & {
  ma5?: number | null
  ma10?: number | null
  ma20?: number | null
  sma20?: number | null
  ema20?: number | null
  rsi6?: number | null
  rsi12?: number | null
  rsi24?: number | null
  rsi14?: number | null
  dif?: number | null
  dea?: number | null
  hist?: number | null
  volMa5?: number | null
  volMa10?: number | null
}

type IndicatorData = {
  sma20: number | null
  ema20: number | null
  rsi14: number | null
  macd: number | null
  signal: number | null
  hist: number | null
}

const indicatorAnchorMeta: Record<
  IndicatorKey,
  { anchorNo: string; anchorText: string }
> = {
  sma20: { anchorNo: '①', anchorText: '主图均线区' },
  ema20: { anchorNo: '①', anchorText: '主图均线区' },
  rsi14: { anchorNo: '②', anchorText: '顶部指标栏' },
  volMa5: { anchorNo: '③', anchorText: '成交量副图' },
  volMa10: { anchorNo: '③', anchorText: '成交量副图' },
  dif: { anchorNo: '④', anchorText: 'MACD副图' },
  dea: { anchorNo: '④', anchorText: 'MACD副图' },
  macd: { anchorNo: '④', anchorText: 'MACD副图' },
}

const timeframeOptions: Array<{ label: string; value: Timeframe }> = [
  { label: '分时', value: '1m' },
  { label: '5分钟', value: '5m' },
  { label: '15分钟', value: '15m' },
  { label: '30分钟', value: '30m' },
  { label: '60分钟', value: '60m' },
  { label: '日K', value: '1d' },
]

const riseColor = '#ff4d4f'
const fallColor = '#52c41a'
const flatColor = '#8c8c8c'

const timeframeConfig: Record<Timeframe, { stepMs: number; points: number; maxPoints: number; aggregateMinutes: number }> = {
  '1m': { stepMs: 60 * 1000, points: 240, maxPoints: 240, aggregateMinutes: 1 },
  '5m': { stepMs: 60 * 1000, points: 240, maxPoints: 240, aggregateMinutes: 5 },
  '15m': { stepMs: 60 * 1000, points: 240, maxPoints: 240, aggregateMinutes: 15 },
  '30m': { stepMs: 60 * 1000, points: 240, maxPoints: 240, aggregateMinutes: 30 },
  '60m': { stepMs: 60 * 1000, points: 240, maxPoints: 240, aggregateMinutes: 60 },
  '1d': { stepMs: 60 * 1000, points: 240, maxPoints: 240, aggregateMinutes: 240 },
}

function average(values: number[]) {
  if (!values.length) return null
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

function hashSeed(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) + 1
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function gaussianFromSeed(seed: number) {
  const u1 = Math.max(1e-12, seededRandom(seed))
  const u2 = Math.max(1e-12, seededRandom(seed + 999))
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

function formatPercent(value: number | null) {
  if (value === null || Number.isNaN(value)) return '--'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

function formatVolumeHands(volume: number | null) {
  if (volume === null || Number.isNaN(volume)) return '--'
  if (volume >= 10000) return `${(volume / 10000).toFixed(2)} 万手`
  return `${Math.round(volume)} 手`
}

function formatNum(value: number | null, digits = 2) {
  if (value === null || Number.isNaN(value)) return '--'
  return value.toFixed(digits)
}

function normalizeSymbol(marketType: MarketType, rawCode: string) {
  const code = rawCode.trim().toUpperCase()
  if (!code) return ''
  if (code.includes('.')) return code
  if (code.includes('=')) return code

  if (marketType === 'stock' && /^\d{6}$/.test(code)) {
    if (code.startsWith('6') || code.startsWith('9')) return `${code}.SS`
    return `${code}.SZ`
  }
  if (marketType === 'futures' && /^[A-Z]+$/.test(code)) return `${code}=F`
  return code
}

function getBasePrice(marketType: MarketType, symbol: string) {
  const seed = hashSeed(symbol)
  if (marketType === 'stock') return 8 + (seed % 3500) / 10
  return 1200 + (seed % 120000) / 10
}

function toDisplayTime(unix: number, timeframe: Timeframe, marketType: MarketType) {
  const date = new Date(unix * 1000)
  if (timeframe === '1m' && marketType === 'stock') {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  if (timeframe === '1d') return date.toISOString().slice(0, 10)
  return `${date.toISOString().slice(0, 10)} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function aShareSessionMinuteOffsets() {
  const offsets: number[] = []
  for (let m = 0; m < 120; m += 1) offsets.push(m)
  for (let m = 0; m < 120; m += 1) offsets.push(210 + m)
  return offsets
}

function getIntradayVolMultiplier(index: number) {
  if (index < 60) return 1.5
  if (index < 210) return 1
  return 1.2
}

function trendParams(state: TrendState) {
  if (state === 'up') return { mu: 0.045, sigma: 0.17, strength: 1 }
  if (state === 'down') return { mu: -0.045, sigma: 0.19, strength: -1 }
  return { mu: 0.004, sigma: 0.1, strength: 0.25 }
}

function sampleDuration(seed: number) {
  return 5 + Math.floor(seededRandom(seed) * 26)
}

function nextState(current: TrendState, seed: number): TrendState {
  const r = seededRandom(seed)
  if (current === 'up') return r < 0.62 ? 'up' : r < 0.83 ? 'flat' : 'down'
  if (current === 'down') return r < 0.62 ? 'down' : r < 0.83 ? 'flat' : 'up'
  return r < 0.35 ? 'up' : r < 0.7 ? 'down' : 'flat'
}

function calcEmaSeries(values: number[], period: number): Array<number | null> {
  if (values.length < period) return values.map(() => null)
  const result: Array<number | null> = values.map(() => null)
  const k = 2 / (period + 1)
  let ema = average(values.slice(0, period)) as number
  result[period - 1] = ema
  for (let i = period; i < values.length; i += 1) {
    ema = values[i] * k + ema * (1 - k)
    result[i] = ema
  }
  return result
}

function calcRsiSeries(values: number[], period: number): Array<number | null> {
  if (values.length <= period) return values.map(() => null)
  const result: Array<number | null> = values.map(() => null)
  for (let i = period; i < values.length; i += 1) {
    let gain = 0
    let loss = 0
    for (let j = i - period + 1; j <= i; j += 1) {
      const diff = values[j] - values[j - 1]
      if (diff > 0) gain += diff
      else loss += Math.abs(diff)
    }
    if (loss === 0) result[i] = 100
    else {
      const rs = gain / loss
      result[i] = 100 - 100 / (1 + rs)
    }
  }
  return result
}

function calcMa(values: number[], period: number, index: number) {
  if (index + 1 < period) return null
  return average(values.slice(index - period + 1, index + 1))
}

function enrichSeries(raw: MinutePoint[], prevClose: number) {
  let cumAmount = 0
  let cumVolume = 0
  const closes = raw.map((p) => p.close)
  const rsi6Series = calcRsiSeries(closes, 6)
  const rsi12Series = calcRsiSeries(closes, 12)
  const rsi24Series = calcRsiSeries(closes, 24)

  return raw.map((item, idx) => {
    cumAmount += item.amount
    cumVolume += item.volume
    const avgPrice = cumVolume > 0 ? cumAmount / (cumVolume * 100) : item.close
    return {
      ...item,
      avgPrice,
      pct: ((item.close - prevClose) / prevClose) * 100,
      ma5: calcMa(closes, 5, idx),
      ma10: calcMa(closes, 10, idx),
      ma20: calcMa(closes, 20, idx),
      rsi6: rsi6Series[idx],
      rsi12: rsi12Series[idx],
      rsi24: rsi24Series[idx],
    }
  })
}

function calcIndicators(series: CandlePoint[]): IndicatorData {
  const closes = series.map((s) => s.close)
  const sma20 = average(closes.slice(-20))
  const ema20 = calcEmaSeries(closes, 20).at(-1) ?? null
  const rsi14 = calcRsiSeries(closes, 14).at(-1) ?? null
  const ema12 = calcEmaSeries(closes, 12)
  const ema26 = calcEmaSeries(closes, 26)
  const dif = closes.map((_, i) => {
    if (ema12[i] === null || ema26[i] === null) return null
    return (ema12[i] as number) - (ema26[i] as number)
  })
  const difValues = dif.filter((v): v is number => v !== null)
  const deaRaw = calcEmaSeries(difValues, 9)
  let cursor = 0
  const dea = dif.map((d) => {
    if (d === null) return null
    const value = deaRaw[cursor] ?? null
    cursor += 1
    return value
  })
  const macd = dif.at(-1) ?? null
  const signal = dea.at(-1) ?? null
  const hist = macd !== null && signal !== null ? macd - signal : null
  return { sma20, ema20, rsi14, macd, signal, hist }
}

function applyIndicators(series: CandlePoint[], prevClose: number): CandlePoint[] {
  const closes = series.map((s) => s.close)
  const volumes = series.map((s) => s.volume)
  const ema20Series = calcEmaSeries(closes, 20)
  const ema12Series = calcEmaSeries(closes, 12)
  const ema26Series = calcEmaSeries(closes, 26)
  const rsi14Series = calcRsiSeries(closes, 14)
  const rsi6Series = calcRsiSeries(closes, 6)
  const rsi12Series = calcRsiSeries(closes, 12)
  const rsi24Series = calcRsiSeries(closes, 24)
  const difSeries = closes.map((_, i) => {
    if (ema12Series[i] === null || ema26Series[i] === null) return null
    return (ema12Series[i] as number) - (ema26Series[i] as number)
  })
  const difValues = difSeries.filter((v): v is number => v !== null)
  const deaRaw = calcEmaSeries(difValues, 9)
  let deaCursor = 0
  const deaSeries = difSeries.map((d) => {
    if (d === null) return null
    const v = deaRaw[deaCursor] ?? null
    deaCursor += 1
    return v
  })

  let cumAmount = 0
  let cumVolume = 0
  return series.map((item, idx) => {
    cumAmount += item.amount
    cumVolume += item.volume
    const avgPrice = cumVolume > 0 ? cumAmount / (cumVolume * 100) : item.close
    const sma20 = calcMa(closes, 20, idx)
    const dif = difSeries[idx]
    const dea = deaSeries[idx]
    const hist = dif !== null && dea !== null ? dif - dea : null
    return {
      ...item,
      avgPrice,
      pct: ((item.close - prevClose) / prevClose) * 100,
      ma5: calcMa(closes, 5, idx),
      ma10: calcMa(closes, 10, idx),
      ma20: calcMa(closes, 20, idx),
      sma20,
      ema20: ema20Series[idx],
      rsi6: rsi6Series[idx],
      rsi12: rsi12Series[idx],
      rsi24: rsi24Series[idx],
      rsi14: rsi14Series[idx],
      dif,
      dea,
      hist,
      volMa5: calcMa(volumes, 5, idx),
      volMa10: calcMa(volumes, 10, idx),
    }
  })
}

function aggregateFromMinute(minuteSeries: MinutePoint[], timeframe: Timeframe, marketType: MarketType, prevClose: number): CandlePoint[] {
  const chunkSize = timeframeConfig[timeframe].aggregateMinutes
  if (chunkSize === 1) return applyIndicators(minuteSeries, prevClose)
  const result: CandlePoint[] = []

  for (let i = 0; i < minuteSeries.length; i += chunkSize) {
    const chunk = minuteSeries.slice(i, i + chunkSize)
    if (!chunk.length) continue
    const first = chunk[0]
    const last = chunk[chunk.length - 1]
    const high = Math.max(...chunk.map((p) => p.high))
    const low = Math.min(...chunk.map((p) => p.low))
    const volume = chunk.reduce((s, p) => s + p.volume, 0)
    const amount = chunk.reduce((s, p) => s + p.amount, 0)
    result.push({
      time: toDisplayTime(first.unix, timeframe, marketType),
      unix: first.unix,
      open: first.open,
      high,
      low,
      close: last.close,
      volume,
      amount,
      avgPrice: last.close,
      pct: 0,
      trendStrength: chunk.reduce((s, p) => s + p.trendStrength, 0) / chunk.length,
    })
  }

  return applyIndicators(result, prevClose)
}

function createMinuteSeries(marketType: MarketType, symbol: string): { points: MinutePoint[]; prevClose: number } {
  const cfg = timeframeConfig['1m']
  const seedBase = hashSeed(`${marketType}-${symbol}-1m`)
  const basePrice = getBasePrice(marketType, symbol)
  const gapProb = seededRandom(seedBase + 11)
  const gapPct = gapProb > 0.55 ? (seededRandom(seedBase + 23) * 1.5 + 0.5) / 100 : 0
  const gapSign = seededRandom(seedBase + 29) > 0.5 ? 1 : -1
  const openPrice = basePrice * (1 + gapPct * gapSign)
  const prevClose = basePrice

  let trendState: TrendState = 'flat'
  let trendLeft = sampleDuration(seedBase + 41)
  let lastClose = openPrice
  const raw: MinutePoint[] = []

  const start = new Date()
  start.setHours(9, 30, 0, 0)
  const startUnix = Math.floor(start.getTime() / 1000)
  const aShareOffsets = marketType === 'stock' ? aShareSessionMinuteOffsets() : null

  for (let i = 0; i < cfg.points; i += 1) {
    if (trendLeft <= 0) {
      trendState = nextState(trendState, seedBase + i * 17)
      trendLeft = sampleDuration(seedBase + i * 19)
    }
    trendLeft -= 1
    const params = trendParams(trendState)
    const dt = 1 / 240
    const intradaySigmaMultiplier = marketType === 'stock' ? getIntradayVolMultiplier(i) : 1
    const sigma = params.sigma * intradaySigmaMultiplier
    const drift = (params.mu - 0.5 * sigma * sigma) * dt
    const shock = sigma * Math.sqrt(dt) * gaussianFromSeed(seedBase + i * 97 + 3)
    const ret = drift + shock
    const open = lastClose
    const close = Math.max(0.01, open * Math.exp(ret))
    const high = Math.max(open, close) * (1 + Math.abs(gaussianFromSeed(seedBase + i * 101 + 1)) * 0.0022)
    const low = Math.min(open, close) * (1 - Math.abs(gaussianFromSeed(seedBase + i * 103 + 2)) * 0.0022)

    const priceDiffPct = Math.abs((close - open) / open)
    let trendStrength = Math.min(1, Math.abs(params.strength) + priceDiffPct * 100)
    let volumeFactor = 1 + 0.8 * priceDiffPct * 100 + 0.5 * trendStrength
    if (trendState === 'flat') volumeFactor *= 0.3 + seededRandom(seedBase + i * 37) * 0.4
    if (priceDiffPct > 0.008 || trendState !== 'flat') volumeFactor *= 1.5 + seededRandom(seedBase + i * 31) * 1.5

    const baseVolume = marketType === 'stock' ? 1500 + (seedBase % 1200) : 2600 + (seedBase % 1800)
    const volume = Math.max(100, Math.round(baseVolume * volumeFactor))
    const amount = close * volume * 100

    const minuteOffset = aShareOffsets ? aShareOffsets[i] : i
    const unix = startUnix + Math.floor(minuteOffset * 60)
    raw.push({
      time: toDisplayTime(unix, '1m', marketType),
      unix,
      open,
      high,
      low,
      close,
      volume,
      amount,
      avgPrice: close,
      pct: 0,
      trendStrength,
    })
    lastClose = close
  }

  return { points: enrichSeries(raw, prevClose), prevClose }
}

function nextMinuteTick(series: MinutePoint[], marketType: MarketType, symbol: string, prevClose: number, tick: number) {
  const cfg = timeframeConfig['1m']
  const seed = hashSeed(`${symbol}-1m-${tick}`)
  const last = series[series.length - 1]
  const params = trendParams(seededRandom(seed + 1) > 0.66 ? 'up' : seededRandom(seed + 2) > 0.5 ? 'flat' : 'down')
  const dt = 1 / 240
  const sigma = params.sigma
  const ret = (params.mu - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * gaussianFromSeed(seed + 9)
  const open = last.close
  const close = Math.max(0.01, open * Math.exp(ret))
  const high = Math.max(open, close) * (1 + Math.abs(gaussianFromSeed(seed + 10)) * 0.0018)
  const low = Math.min(open, close) * (1 - Math.abs(gaussianFromSeed(seed + 11)) * 0.0018)
  const diffPct = Math.abs((close - open) / open)
  const trendStrength = Math.min(1, Math.abs(params.strength) + diffPct * 100)
  let volumeFactor = 1 + 0.8 * diffPct * 100 + 0.5 * trendStrength
  if (Math.abs(close - open) / open > 0.006) volumeFactor *= 1.5 + seededRandom(seed + 21) * 1.5
  const baseVolume = marketType === 'stock' ? 2000 : 3500
  const volume = Math.max(100, Math.round(baseVolume * volumeFactor))
  const amount = close * volume * 100
  const unix = last.unix + Math.floor(cfg.stepMs / 1000)

  const next: MinutePoint = {
    time: toDisplayTime(unix, '1m', marketType),
    unix,
    open,
    high,
    low,
    close,
    volume,
    amount,
    avgPrice: close,
    pct: ((close - prevClose) / prevClose) * 100,
    trendStrength,
  }

  const raw = [...series, next].slice(-cfg.maxPoints)
  return enrichSeries(raw, prevClose)
}

function CandlestickLayer(props: any) {
  const { points, xAxisMap, yAxisMap } = props
  const data: CandlePoint[] = points ?? []
  const xAxis = (Object.values(xAxisMap ?? {})[0] as any) ?? null
  const yAxisCandidates = Object.values(yAxisMap ?? {}) as any[]
  const yAxis =
    yAxisCandidates.find((axis) => axis?.yAxisId === 'left') ??
    yAxisCandidates.find((axis) => axis?.orientation !== 'right') ??
    yAxisCandidates[0] ??
    null
  if (!xAxis || !yAxis || !data.length) return null
  const xScale = xAxis.scale
  const yScale = yAxis.scale
  if (typeof yScale !== 'function') return null
  const bandwidth = typeof xAxis.bandwidth === 'function' ? xAxis.bandwidth() : Math.max(4, (xAxis.width ?? 600) / Math.max(1, data.length))
  const candleWidth = Math.max(2, bandwidth * 0.7)

  return (
    <g>
      {data.map((d, idx) => {
        const scaled = typeof xScale === 'function' ? xScale(d.time) : null
        const xCenter =
          typeof scaled === 'number'
            ? scaled + bandwidth / 2
            : (xAxis.x ?? 0) + ((idx + 0.5) * (xAxis.width ?? 600)) / Math.max(1, data.length)
        const yOpen = yScale(d.open)
        const yClose = yScale(d.close)
        const yHigh = yScale(d.high)
        const yLow = yScale(d.low)
        if (![xCenter, yOpen, yClose, yHigh, yLow].every((v) => Number.isFinite(v))) return null
        const isUp = d.close > d.open
        const isDown = d.close < d.open
        const color = isUp ? riseColor : isDown ? fallColor : flatColor
        const top = Math.min(yOpen, yClose)
        const height = Math.max(1, Math.abs(yOpen - yClose))
        return (
          <g key={`candle-${d.unix}`}>
            <line x1={xCenter} y1={yHigh} x2={xCenter} y2={yLow} stroke={color} strokeWidth={1.2} />
            <rect
              x={xCenter - candleWidth / 2}
              y={top}
              width={candleWidth}
              height={height}
              fill={isDown ? color : isUp ? '#050505' : color}
              stroke={color}
              strokeWidth={1.2}
            />
          </g>
        )
      })}
    </g>
  )
}

function SimpleCandleSvg({
  data,
  prevClose,
}: {
  data: CandlePoint[]
  prevClose: number
}) {
  const width = 1000
  const height = 420
  const padding = { top: 20, right: 56, bottom: 28, left: 56 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  if (!data.length) return null

  const minPrice = Math.min(...data.map((d) => d.low), prevClose * 0.9)
  const maxPrice = Math.max(...data.map((d) => d.high), prevClose * 1.1)
  const y = (price: number) => padding.top + ((maxPrice - price) / Math.max(1e-6, maxPrice - minPrice)) * innerH
  const stepX = innerW / Math.max(1, data.length)
  const candleW = Math.max(2, stepX * 0.7)
  const xCenter = (idx: number) => padding.left + idx * stepX + stepX / 2

  const linePath = (values: Array<number | null | undefined>) => {
    const points = values
      .map((v, i) => (v == null ? null : `${xCenter(i)},${y(v)}`))
      .filter((p): p is string => p !== null)
    return points.join(' ')
  }

  const yTicks = 6
  const xTicks = 8

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <rect x={0} y={0} width={width} height={height} fill="transparent" />

      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const yy = padding.top + (innerH * i) / yTicks
        const price = maxPrice - ((maxPrice - minPrice) * i) / yTicks
        return (
          <g key={`yg-${i}`}>
            <line x1={padding.left} y1={yy} x2={width - padding.right} y2={yy} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <text x={8} y={yy + 4} fontSize="11" fill="rgba(255,255,255,0.65)">
              {price.toFixed(2)}
            </text>
            <text x={width - padding.right + 8} y={yy + 4} fontSize="11" fill="rgba(255,255,255,0.65)">
              {formatPercent(((price - prevClose) / prevClose) * 100)}
            </text>
          </g>
        )
      })}

      {Array.from({ length: xTicks + 1 }).map((_, i) => {
        const xx = padding.left + (innerW * i) / xTicks
        const idx = Math.min(data.length - 1, Math.floor((data.length - 1) * (i / xTicks)))
        return (
          <g key={`xg-${i}`}>
            <line x1={xx} y1={padding.top} x2={xx} y2={height - padding.bottom} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <text x={xx - 24} y={height - 8} fontSize="11" fill="rgba(255,255,255,0.65)">
              {data[idx]?.time ?? ''}
            </text>
          </g>
        )
      })}

      <line x1={padding.left} y1={y(prevClose)} x2={width - padding.right} y2={y(prevClose)} stroke="#8c8c8c" strokeDasharray="4 4" />
      <line x1={padding.left} y1={y(prevClose * 1.1)} x2={width - padding.right} y2={y(prevClose * 1.1)} stroke={riseColor} strokeDasharray="4 4" />
      <line x1={padding.left} y1={y(prevClose * 0.9)} x2={width - padding.right} y2={y(prevClose * 0.9)} stroke={fallColor} strokeDasharray="4 4" />

      <polyline fill="none" stroke="#ffffff" strokeWidth="1.4" points={linePath(data.map((d) => d.sma20))} />
      <polyline fill="none" stroke="#ffd666" strokeWidth="1.4" points={linePath(data.map((d) => d.ema20))} />

      {data.map((d, i) => {
        const xc = xCenter(i)
        const yo = y(d.open)
        const yc = y(d.close)
        const yh = y(d.high)
        const yl = y(d.low)
        const isUp = d.close > d.open
        const isDown = d.close < d.open
        const color = isUp ? riseColor : isDown ? fallColor : flatColor
        const top = Math.min(yo, yc)
        const h = Math.max(1, Math.abs(yo - yc))

        return (
          <g key={`svg-candle-${d.unix}`}>
            <line x1={xc} y1={yh} x2={xc} y2={yl} stroke={color} strokeWidth="1.2" />
            <rect x={xc - candleW / 2} y={top} width={candleW} height={h} fill={isDown ? color : isUp ? '#050505' : color} stroke={color} strokeWidth="1.2" />
          </g>
        )
      })}
    </svg>
  )
}

type QuoteMonitorProps = {
  marketType: MarketType
  defaultCode: string
  title: string
  examples: string[]
}

export default function QuoteMonitor({ marketType, defaultCode, title, examples }: QuoteMonitorProps) {
  const [codeInput, setCodeInput] = useState(defaultCode)
  const [activeCode, setActiveCode] = useState(defaultCode)
  const [loading, setLoading] = useState(false)
  const [minutePoints, setMinutePoints] = useState<MinutePoint[]>([])
  const [updatedAt, setUpdatedAt] = useState('')
  const [timeframe, setTimeframe] = useState<Timeframe>('1m')
  const [prevClose, setPrevClose] = useState<number>(0)
  const [visibleCount, setVisibleCount] = useState(90)
  const [panOffset, setPanOffset] = useState(0)
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorKey | null>(null)
  const [hoverLineLabel, setHoverLineLabel] = useState('')
  const { updatePrice, setPanelOpen, setTradePrefill } = useTrading()

  const symbol = useMemo(() => normalizeSymbol(marketType, activeCode), [activeCode, marketType])
  const points = useMemo(() => aggregateFromMinute(minutePoints, timeframe, marketType, prevClose), [minutePoints, timeframe, marketType, prevClose])
  const latest = points.at(-1)
  const indicators = useMemo(() => calcIndicators(points), [points])
  const visibleData = useMemo(() => {
    const safeCount = Math.min(Math.max(20, visibleCount), Math.max(20, points.length))
    const maxPan = Math.max(0, points.length - safeCount)
    const safePan = Math.min(Math.max(0, panOffset), maxPan)
    const end = points.length - safePan
    const start = Math.max(0, end - safeCount)
    return points.slice(start, end)
  }, [points, visibleCount, panOffset])
  const displayPoint = latest ?? null

  useEffect(() => {
    if (!symbol) return undefined
    setLoading(true)
    const initial = createMinuteSeries(marketType, symbol)
    setMinutePoints(initial.points)
    setPrevClose(initial.prevClose)
    setVisibleCount(timeframe === '1m' ? 120 : 80)
    setPanOffset(0)
    setUpdatedAt(new Date().toLocaleTimeString())
    setLoading(false)

    let tick = 0
    const timer = setInterval(() => {
      tick += 1
      setMinutePoints((prev) => {
        if (!prev.length) return prev
        return nextMinuteTick(prev, marketType, symbol, initial.prevClose, tick)
      })
      setUpdatedAt(new Date().toLocaleTimeString())
    }, 2000)

    return () => clearInterval(timer)
  }, [marketType, symbol])

  useEffect(() => {
    setVisibleCount(timeframe === '1m' ? 120 : 80)
    setPanOffset(0)
  }, [timeframe])

  /* sync price to trading system */
  useEffect(() => {
    if (symbol && latest) {
      updatePrice(symbol, latest.close)
    }
  }, [symbol, latest, updatePrice])

  return (
    <section className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-white/70">教学虚拟行情（增强 GBM + 马尔可夫趋势切换），每秒实时更新。</p>
      <p className="mt-1 text-xs text-white/50">
        模型包含：量价关系、开盘跳空、日内波动率模式；周期通过分钟数据聚合得到。
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <input
          className="min-w-[240px] flex-1 rounded-lg border border-white/20 bg-black/40 px-4 py-2 outline-none focus:border-[#00ff41]"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder={marketType === 'stock' ? '输入股票代码（如 600519）' : '输入期货代码（如 CL）'}
        />
        <button type="button" onClick={() => setActiveCode(codeInput)} className="rounded-lg bg-[#00ff41] px-5 py-2 font-semibold text-black">
          查询
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setCodeInput(item)
              setActiveCode(item)
            }}
            className="rounded-md border border-white/20 px-3 py-1 text-xs text-white/80 hover:border-[#00ff41] hover:text-[#00ff41]"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {timeframeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTimeframe(option.value)}
            className={`rounded-md px-3 py-1 text-xs ${
              timeframe === option.value ? 'border border-[#3f56a6] bg-[#1f2d5a] text-white' : 'border border-white/20 text-white/80'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-[#0b0b0b] px-3 py-2 text-xs text-white/85">
        <span className="mr-4">代码 {symbol || '--'}</span>
        <span className="mr-4">时间 {displayPoint?.time ?? '--'}</span>
        <span className="mr-4">开 {formatNum(displayPoint?.open ?? null, 2)}</span>
        <span className="mr-4">高 {formatNum(displayPoint?.high ?? null, 2)}</span>
        <span className="mr-4">低 {formatNum(displayPoint?.low ?? null, 2)}</span>
        <span className="mr-4">收 {formatNum(displayPoint?.close ?? null, 2)}</span>
        <span>量 {formatVolumeHands(displayPoint?.volume ?? null)}</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border border-white/10 bg-black/40 p-3">
          <p className="text-xs text-white/60">代码</p>
          <p className="mt-1 font-mono text-lg">{symbol || '--'}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/40 p-3">
          <p className="text-xs text-white/60">最新价</p>
          <p className="mt-1 text-lg">{latest ? formatNum(latest.close, 2) : '--'}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/40 p-3">
          <p className="text-xs text-white/60">涨跌幅</p>
          <p className="mt-1 text-lg" style={{ color: latest ? (latest.pct > 0 ? riseColor : latest.pct < 0 ? fallColor : flatColor) : '#fff' }}>
            {latest ? formatPercent(latest.pct) : '--'}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/40 p-3">
          <p className="text-xs text-white/60">成交量</p>
          <p className="mt-1 text-lg">{latest ? formatVolumeHands(latest.volume) : '--'}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/40 p-3">
          <p className="text-xs text-white/60">刷新时间</p>
          <p className="mt-1 text-lg">{updatedAt || '--'}</p>
        </div>
      </div>

      {/* quick trade buttons */}
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => {
            if (symbol && latest) {
              setTradePrefill({ symbol, price: latest.close, marketType })
              setPanelOpen(true)
            }
          }}
          disabled={!symbol || !latest}
          className="flex-1 rounded-lg bg-[#f44]/90 py-2.5 text-sm font-semibold text-white transition hover:bg-[#f44] disabled:opacity-30"
        >
          买入 {symbol || '--'}
        </button>
        <button
          type="button"
          onClick={() => {
            if (symbol && latest) {
              setTradePrefill({ symbol, price: latest.close, marketType })
              setPanelOpen(true)
            }
          }}
          disabled={!symbol || !latest}
          className="flex-1 rounded-lg bg-[#52c41a]/90 py-2.5 text-sm font-semibold text-white transition hover:bg-[#52c41a] disabled:opacity-30"
        >
          卖出 {symbol || '--'}
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-white/85">
        <button type="button" onClick={() => setSelectedIndicator('sma20')} className="mr-4 hover:text-[#00ff41]">简单均线SMA20 {formatNum(indicators.sma20, 2)}</button>
        <button type="button" onClick={() => setSelectedIndicator('ema20')} className="mr-4 text-[#ffd666] hover:text-[#00ff41]">指数均线EMA20 {formatNum(indicators.ema20, 2)}</button>
        <button type="button" onClick={() => setSelectedIndicator('rsi14')} className="mr-4 hover:text-[#00ff41]">强弱指标RSI14 {formatNum(indicators.rsi14, 2)}</button>
        <button type="button" onClick={() => setSelectedIndicator('dif')} className="mr-4 hover:text-[#00ff41]">快线DIF {formatNum(indicators.macd, 4)}</button>
        <button type="button" onClick={() => setSelectedIndicator('dea')} className="mr-4 text-[#ffd666] hover:text-[#00ff41]">慢线DEA {formatNum(indicators.signal, 4)}</button>
        <button type="button" onClick={() => setSelectedIndicator('macd')} className="hover:text-[#00ff41]">动能柱MACD {formatNum(indicators.hist, 4)}</button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-white/10 bg-black/30 p-4">
          {visibleData.length === 0 ? (
            <p className="text-sm text-white/50">{loading ? '正在加载...' : '暂无数据'}</p>
          ) : (
            <div className="space-y-3 select-none">
              <div className="h-[420px]">
                <div className="mb-2 text-xs text-white/70">
                主图指标
                <span className="ml-2 rounded bg-[#1f2d5a] px-1.5 py-0.5 text-[10px] text-white">①</span>
                <button
                  type="button"
                  onClick={() => setSelectedIndicator('sma20')}
                  onMouseEnter={() => setHoverLineLabel('你正在看：SMA20（白色线）')}
                  onMouseLeave={() => setHoverLineLabel('')}
                  className="ml-3 text-white hover:text-[#00ff41]"
                >
                  简单均线SMA20 {formatNum(displayPoint?.sma20 ?? null, 2)}
                  </button>
                <button
                  type="button"
                  onClick={() => setSelectedIndicator('ema20')}
                  onMouseEnter={() => setHoverLineLabel('你正在看：EMA20（黄色线）')}
                  onMouseLeave={() => setHoverLineLabel('')}
                  className="ml-3 text-[#ffd666] hover:text-[#00ff41]"
                >
                  指数均线EMA20 {formatNum(displayPoint?.ema20 ?? null, 2)}
                  </button>
                </div>
              {hoverLineLabel ? <p className="mb-2 text-xs text-[#9dd6ff]">{hoverLineLabel}</p> : null}
                {timeframe === '1m' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={visibleData} syncId="quote-sync">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" minTickGap={24} stroke="rgba(255,255,255,0.5)" />
                      <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" domain={['auto', 'auto']} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="rgba(255,255,255,0.5)"
                        tickFormatter={(value) => formatPercent(((value - prevClose) / prevClose) * 100)}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip
                        contentStyle={{ background: '#101010', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8 }}
                        labelStyle={{ color: '#fff' }}
                        formatter={(value: number, name: string) => {
                          if (name === 'volume') return [formatVolumeHands(value), '成交量']
                          return [typeof value === 'number' ? value.toFixed(2) : value, name]
                        }}
                      />
                      <ReferenceLine yAxisId="left" y={prevClose} stroke="#8c8c8c" strokeDasharray="4 4" />
                      <ReferenceLine yAxisId="left" y={prevClose * 1.1} stroke={riseColor} strokeDasharray="4 4" />
                      <ReferenceLine yAxisId="left" y={prevClose * 0.9} stroke={fallColor} strokeDasharray="4 4" />
                      <Area yAxisId="left" type="monotone" dataKey="close" stroke="#ffffff" fill="rgba(255,255,255,0.15)" strokeWidth={1.8} />
                      <Line yAxisId="left" type="monotone" dataKey="avgPrice" stroke="#ffd666" dot={false} strokeWidth={1.8} />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <SimpleCandleSvg data={visibleData} prevClose={prevClose} />
                )}
              </div>

              <div className="h-[180px]">
                <div className="mb-1 text-xs text-white/70">
                成交量(万手)
                <span className="ml-2 rounded bg-[#1f2d5a] px-1.5 py-0.5 text-[10px] text-white">③</span>
                <button
                  type="button"
                  onClick={() => setSelectedIndicator('volMa5')}
                  onMouseEnter={() => setHoverLineLabel('你正在看：VOL MA5（白色量均线）')}
                  onMouseLeave={() => setHoverLineLabel('')}
                  className="ml-3 text-white hover:text-[#00ff41]"
                >
                  量均线MA5 {formatNum(displayPoint?.volMa5 ?? null, 2)}
                  </button>
                <button
                  type="button"
                  onClick={() => setSelectedIndicator('volMa10')}
                  onMouseEnter={() => setHoverLineLabel('你正在看：VOL MA10（黄色量均线）')}
                  onMouseLeave={() => setHoverLineLabel('')}
                  className="ml-3 text-[#ffd666] hover:text-[#00ff41]"
                >
                  量均线MA10 {formatNum(displayPoint?.volMa10 ?? null, 2)}
                  </button>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={visibleData} syncId="quote-sync">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="time" hide />
                    <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(v) => `${(v / 10000).toFixed(1)}`} />
                    <Tooltip contentStyle={{ background: '#101010', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8 }} />
                    <Bar dataKey="volume">
                      {visibleData.map((p) => {
                        const color = p.close > p.open ? riseColor : p.close < p.open ? fallColor : flatColor
                        return <Cell key={`v-${p.unix}`} fill={color} />
                      })}
                    </Bar>
                    <Line type="monotone" dataKey="volMa5" stroke="#ffffff" dot={false} strokeWidth={1.2} />
                    <Line type="monotone" dataKey="volMa10" stroke="#ffd666" dot={false} strokeWidth={1.2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="h-[150px]">
                <div className="mb-1 text-xs text-white/70">
                MACD(12,26,9)
                <span className="ml-2 rounded bg-[#1f2d5a] px-1.5 py-0.5 text-[10px] text-white">④</span>
                <button
                  type="button"
                  onClick={() => setSelectedIndicator('dif')}
                  onMouseEnter={() => setHoverLineLabel('你正在看：DIF（MACD白线）')}
                  onMouseLeave={() => setHoverLineLabel('')}
                  className="ml-3 text-white hover:text-[#00ff41]"
                >
                  快线DIF {formatNum(displayPoint?.dif ?? null, 4)}
                  </button>
                <button
                  type="button"
                  onClick={() => setSelectedIndicator('dea')}
                  onMouseEnter={() => setHoverLineLabel('你正在看：DEA（MACD黄线）')}
                  onMouseLeave={() => setHoverLineLabel('')}
                  className="ml-3 text-[#ffd666] hover:text-[#00ff41]"
                >
                  慢线DEA {formatNum(displayPoint?.dea ?? null, 4)}
                  </button>
                <button
                  type="button"
                  onClick={() => setSelectedIndicator('macd')}
                  onMouseEnter={() => setHoverLineLabel('你正在看：MACD柱体（红绿动能柱）')}
                  onMouseLeave={() => setHoverLineLabel('')}
                  className="ml-3 hover:text-[#00ff41]"
                >
                  动能柱HIST {formatNum(displayPoint?.hist ?? null, 4)}
                  </button>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={visibleData} syncId="quote-sync">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="time" minTickGap={24} stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{ background: '#101010', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8 }} />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" />
                    <Bar dataKey="hist">
                      {visibleData.map((p) => (
                        <Cell key={`m-${p.unix}`} fill={(p.hist ?? 0) >= 0 ? riseColor : fallColor} />
                      ))}
                    </Bar>
                    <Line type="monotone" dataKey="dif" stroke="#ffffff" dot={false} strokeWidth={1.4} />
                    <Line type="monotone" dataKey="dea" stroke="#ffd666" dot={false} strokeWidth={1.4} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-lg border border-white/10 bg-[#0c1119] p-3 lg:sticky lg:top-4 lg:h-fit">
          <p className="text-sm font-semibold text-[#9dd6ff]">右侧学习小窗（点击进入详情）</p>
          <p className="mt-1 text-xs text-white/60">每个小窗左侧“引线编号”对应图中同编号位置。</p>
          <div className="mt-3 space-y-2">
            {(Object.keys(indicatorLessons) as IndicatorKey[]).map((key) => {
              const item = indicatorLessons[key]
              const active = selectedIndicator === key
              const anchor = indicatorAnchorMeta[key]
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedIndicator(key)}
                  className={`relative w-full rounded-md border p-2 text-left transition ${
                    active ? 'border-[#00ff41] bg-[#0f1c13]' : 'border-white/10 bg-black/20 hover:border-[#00ff41]/60'
                  }`}
                >
                  <span className="absolute -left-10 top-1/2 hidden h-px w-8 -translate-y-1/2 bg-[#00ff41]/60 lg:block" />
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#1f2d5a] px-1.5 py-0.5 text-[10px] text-white">{anchor.anchorNo}</span>
                    <span className="inline-block h-px w-6 bg-[#00ff41]/60" />
                    <span className="text-xs font-semibold text-white">{item.shortName}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#9dd6ff]">图中位置：{anchor.anchorText}</p>
                  <p className="mt-1 text-xs text-white/70">{item.summary}</p>
                </button>
              )
            })}
          </div>

          {selectedIndicator ? (
            <div className="mt-3 rounded-md border border-[#00ff41]/40 bg-[#0a1a11] p-3 text-xs">
              <p className="font-semibold text-[#7ee7b8]">{indicatorLessons[selectedIndicator].name}</p>
              <p className="mt-1 text-white/85">{indicatorLessons[selectedIndicator].formula}</p>
              <p className="mt-2 text-white/75">{indicatorLessons[selectedIndicator].interpretation[0]}</p>
              <p className="mt-2 text-[11px] text-[#9dd6ff]">
                对应图中：{indicatorAnchorMeta[selectedIndicator].anchorNo} {indicatorAnchorMeta[selectedIndicator].anchorText}
              </p>
              <Link
                to={`/learn/indicator/${selectedIndicator}`}
                className="mt-3 inline-block rounded border border-[#00ff41] px-2 py-1 text-[#00ff41] hover:bg-[#00ff41]/10"
              >
                打开该指标详情页
              </Link>
            </div>
          ) : null}
        </aside>
      </div>

      {loading && <p className="mt-3 text-xs text-white/60">正在刷新行情...</p>}

    </section>
  )
}

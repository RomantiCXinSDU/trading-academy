/* ---------- SVG illustrations for course content ---------- */

const colors = {
  rise: '#ff4d4f',
  fall: '#52c41a',
  text: 'rgba(255,255,255,0.7)',
  textDim: 'rgba(255,255,255,0.45)',
  grid: 'rgba(255,255,255,0.08)',
  bg: 'rgba(0,0,0,0.3)',
  accent: '#00ff41',
}

/* ---------- 1. Candlestick Anatomy ---------- */
export function CandleAnatomy({ className }: { className?: string }) {
  const w = 260, h = 220, cx = 130
  const oY = 120, cY = 60, hY = 30, lY = 180

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className}>
      <rect x={0} y={0} width={w} height={h} fill={colors.bg} rx="8" />
      {/* body */}
      <rect x={cx - 18} y={cY} width={36} height={oY - cY} fill="transparent" stroke={colors.rise} strokeWidth="2" />
      {/* wicks */}
      <line x1={cx} y1={hY} x2={cx} y2={oY} stroke={colors.rise} strokeWidth="1.5" />
      <line x1={cx} y1={cY} x2={cx} y2={lY} stroke={colors.rise} strokeWidth="1.5" />
      {/* labels */}
      <text x={cx + 28} y={hY + 4} fontSize="11" fill={colors.text}>最高价</text>
      <line x1={cx + 20} y1={hY + 1} x2={cx + 26} y2={hY + 1} stroke={colors.text} strokeWidth="1" />
      <text x={cx + 28} y={cY + 4} fontSize="11" fill={colors.text}>收盘价</text>
      <line x1={cx + 20} y1={cY + 1} x2={cx + 26} y2={cY + 1} stroke={colors.text} strokeWidth="1" />
      <text x={cx + 28} y={oY + 4} fontSize="11" fill={colors.text}>开盘价</text>
      <line x1={cx + 20} y1={oY + 1} x2={cx + 26} y2={oY + 1} stroke={colors.text} strokeWidth="1" />
      <text x={cx + 28} y={lY + 4} fontSize="11" fill={colors.text}>最低价</text>
      <line x1={cx + 20} y1={lY + 1} x2={cx + 26} y2={lY + 1} stroke={colors.text} strokeWidth="1" />
      {/* annotations */}
      <text x={cx - 16} y={oY + (cY - oY) / 2 + 4} fontSize="10" fill={colors.rise} textAnchor="middle">实体</text>
      <text x={cx + 14} y={hY + (cY - hY) / 2 + 14} fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="end">上影线</text>
      <text x={cx + 14} y={lY + (lY - oY) / 2 - 2} fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="end">下影线</text>
      <text x={cx} y={hY - 8} fontSize="11" fill={colors.accent} textAnchor="middle" fontWeight="bold">K线构成要素</text>
    </svg>
  )
}

/* ---------- 2. Bullish vs Bearish ---------- */
export function BullBearCandle({ className }: { className?: string }) {
  const w = 280, h = 200
  const leftX = 70, rightX = 210
  const top = 30, bot = 170, mid = 100

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className}>
      <rect x={0} y={0} width={w} height={h} fill={colors.bg} rx="8" />
      {/* bullish */}
      <text x={leftX} y={20} fontSize="12" fill={colors.rise} textAnchor="middle" fontWeight="bold">阳线</text>
      <rect x={leftX - 16} y={mid} width={32} height={bot - mid} fill="transparent" stroke={colors.rise} strokeWidth="2" />
      <line x1={leftX} y1={top + 5} x2={leftX} y2={bot - 5} stroke={colors.rise} strokeWidth="1.2" />
      <text x={leftX} y={top + 20} fontSize="10" fill={colors.textDim}>高 {100.50}</text>
      <text x={leftX} y={mid - 6} fontSize="10" fill={colors.rise}>收 {99.80}</text>
      <text x={leftX} y={mid + 16} fontSize="10" fill={colors.rise}>开 {98.60}</text>
      <text x={leftX} y={bot - 8} fontSize="10" fill={colors.textDim}>低 {97.80}</text>
      <text x={leftX} y={bot + 16} fontSize="9" fill={colors.textDim}>收 &gt; 开 → 上涨</text>

      {/* bearish */}
      <text x={rightX} y={20} fontSize="12" fill={colors.fall} textAnchor="middle" fontWeight="bold">阴线</text>
      <rect x={rightX - 16} y={top + 20} width={32} height={mid - top - 20} fill={colors.fall} stroke={colors.fall} strokeWidth="2" />
      <line x1={rightX} y1={top + 5} x2={rightX} y2={bot - 5} stroke={colors.fall} strokeWidth="1.2" />
      <text x={rightX} y={top + 20} fontSize="10" fill={colors.textDim}>高 {99.80}</text>
      <text x={rightX} y={mid - 6} fontSize="10" fill={colors.fall}>开 {98.60}</text>
      <text x={rightX} y={mid + 16} fontSize="10" fill={colors.fall}>收 {97.50}</text>
      <text x={rightX} y={bot - 8} fontSize="10" fill={colors.textDim}>低 {96.30}</text>
      <text x={rightX} y={bot + 16} fontSize="9" fill={colors.textDim}>收 &lt; 开 → 下跌</text>
    </svg>
  )
}

/* ---------- 3. Special Single Candles ---------- */
export function SpecialCandles({ className }: { className?: string }) {
  const w = 400, h = 200
  const centers = [60, 140, 220, 300]
  const labels = ['十字星', '锤子线', '倒锤子', '光头光脚']
  const top = 25, bot = 170

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className}>
      <rect x={0} y={0} width={w} height={h} fill={colors.bg} rx="8" />
      {centers.map((cx, i) => {
        const isDoji = i === 0
        const isHammer = i === 1
        const isShooter = i === 2
        const isFull = i === 3

        const bodyH = isDoji ? 4 : 22
        const bodyTop = isDoji ? top + 75 : isHammer ? top + 45 : isShooter ? top + 25 : top + 30
        const bodyBot = bodyTop + bodyH
        const high = isDoji ? top + 10 : isHammer ? bodyTop - 5 : isShooter ? top + 5 : bodyTop
        const low = isDoji ? bot - 10 : isHammer ? bot - 5 : isShooter ? bot - 5 : bodyBot
        const color = i % 2 === 0 ? colors.rise : colors.fall

        return (
          <g key={i}>
            <text x={cx} y={14} fontSize="11" fill={colors.text} textAnchor="middle">{labels[i]}</text>
            <rect x={cx - (isDoji ? 14 : 18)} y={bodyTop} width={isDoji ? 28 : 36} height={bodyH} fill={isDoji ? '#8c8c8c' : 'transparent'} stroke={color} strokeWidth={isDoji ? 1.5 : 2} />
            <line x1={cx} y1={high} x2={cx} y2={bodyBot} stroke={color} strokeWidth="1.2" />
            <line x1={cx} y1={bodyTop} x2={cx} y2={low} stroke={color} strokeWidth="1.2" />
            {/* annotation arrows for hammer/shooter */}
            {isHammer && <text x={cx} y={low + 14} fontSize="9" fill={colors.accent} textAnchor="middle">长下影支撑</text>}
            {isShooter && <text x={cx} y={high - 6} fontSize="9" fill={colors.accent} textAnchor="middle">长上影阻力</text>}
          </g>
        )
      })}
    </svg>
  )
}

/* ---------- 4. Bullish Engulfing ---------- */
export function BullishEngulfing({ className }: { className?: string }) {
  const w = 220, h = 200
  const cx = 110
  const greenTop = 45, greenBot = 130, greenH = greenBot - greenTop
  const redTop = 25, redBot = 155, redH = redBot - redTop

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className}>
      <rect x={0} y={0} width={w} height={h} fill={colors.bg} rx="8" />
      <text x={cx} y={18} fontSize="12" fill={colors.accent} textAnchor="middle" fontWeight="bold">看涨吞没</text>
      {/* green (bear) candle day 1 */}
      <rect x={cx - 14} y={greenTop} width={28} height={greenH} fill={colors.fall} stroke={colors.fall} strokeWidth="1.5" />
      <line x1={cx} y1={greenTop - 5} x2={cx} y2={greenBot + 5} stroke={colors.fall} strokeWidth="1" />
      <text x={cx} y={greenTop - 10} fontSize="10" fill={colors.textDim} textAnchor="middle">D1 阴线</text>
      {/* red (bull) candle day 2 */}
      <rect x={cx - 18} y={redTop} width={36} height={redH} fill="transparent" stroke={colors.rise} strokeWidth="2" />
      <line x1={cx} y1={redTop - 5} x2={cx} y2={redBot + 5} stroke={colors.rise} strokeWidth="1" />
      <text x={cx} y={redBot + 20} fontSize="10" fill={colors.textDim} textAnchor="middle">D2 阳线覆盖</text>
      {/* arrow */}
      <text x={cx - 24} y={90} fontSize="16" fill={colors.accent}>←</text>
    </svg>
  )
}

/* ---------- 5. Bearish Engulfing ---------- */
export function BearishEngulfing({ className }: { className?: string }) {
  const w = 220, h = 200
  const cx = 110
  const redTop = 45, redBot = 130, redH = redBot - redTop
  const greenTop = 25, greenBot = 155, greenH = greenBot - greenTop

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className}>
      <rect x={0} y={0} width={w} height={h} fill={colors.bg} rx="8" />
      <text x={cx} y={18} fontSize="12" fill="#ffcf8b" textAnchor="middle" fontWeight="bold">看跌吞没</text>
      {/* red (bull) candle day 1 */}
      <rect x={cx - 14} y={redTop} width={28} height={redH} fill="transparent" stroke={colors.rise} strokeWidth="1.5" />
      <line x1={cx} y1={redTop - 5} x2={cx} y2={redBot + 5} stroke={colors.rise} strokeWidth="1" />
      <text x={cx} y={redTop - 10} fontSize="10" fill={colors.textDim} textAnchor="middle">D1 阳线</text>
      {/* green (bear) candle day 2 */}
      <rect x={cx - 18} y={greenTop} width={36} height={greenH} fill={colors.fall} stroke={colors.fall} strokeWidth="2" />
      <line x1={cx} y1={greenTop - 5} x2={cx} y2={greenBot + 5} stroke={colors.fall} strokeWidth="1" />
      <text x={cx} y={greenBot + 20} fontSize="10" fill={colors.textDim} textAnchor="middle">D2 阴线覆盖</text>
      {/* arrow */}
      <text x={cx + 24} y={90} fontSize="16" fill={colors.fall}>→</text>
    </svg>
  )
}

/* ---------- 6. Morning Star ---------- */
export function MorningStar({ className }: { className?: string }) {
  const w = 280, h = 200
  const c1 = 50, c2 = 140, c3 = 230
  const top = 30, bot = 170

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className}>
      <rect x={0} y={0} width={w} height={h} fill={colors.bg} rx="8" />
      <text x={w / 2} y={18} fontSize="12" fill={colors.accent} textAnchor="middle" fontWeight="bold">早晨之星（底部反转）</text>
      {/* D1: big bear */}
      <rect x={c1 - 16} y={top + 10} width={32} height={100} fill={colors.fall} stroke={colors.fall} strokeWidth="1.5" />
      <line x1={c1} y1={top} x2={c1} y2={bot} stroke={colors.fall} strokeWidth="1" />
      <text x={c1} y={bot + 14} fontSize="10" fill={colors.textDim} textAnchor="middle">D1 大阴</text>
      {/* D2: doji */}
      <rect x={c2 - 10} y={top + 55} width={20} height={4} fill="#8c8c8c" stroke="#8c8c8c" strokeWidth="1" />
      <line x1={c2} y1={top + 30} x2={c2} y2={bot - 20} stroke="#8c8c8c" strokeWidth="1" />
      <text x={c2} y={bot + 14} fontSize="10" fill={colors.textDim} textAnchor="middle">D2 十字星</text>
      {/* D3: big bull */}
      <rect x={c3 - 16} y={top + 30} width={32} height={100} fill="transparent" stroke={colors.rise} strokeWidth="2" />
      <line x1={c3} y1={top} x2={c3} y2={bot} stroke={colors.rise} strokeWidth="1" />
      <text x={c3} y={bot + 14} fontSize="10" fill={colors.textDim} textAnchor="middle">D3 大阳</text>
      {/* arrows indicating the three steps */}
      <text x={c1 + 24} y={top + 60} fontSize="12" fill={colors.textDim}>→</text>
      <text x={c2 + 22} y={top + 60} fontSize="12" fill={colors.textDim}>→</text>
    </svg>
  )
}

/* ---------- 7. Evening Star ---------- */
export function EveningStar({ className }: { className?: string }) {
  const w = 280, h = 200
  const c1 = 50, c2 = 140, c3 = 230
  const top = 30, bot = 170

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className}>
      <rect x={0} y={0} width={w} height={h} fill={colors.bg} rx="8" />
      <text x={w / 2} y={18} fontSize="12" fill="#ffcf8b" textAnchor="middle" fontWeight="bold">黄昏之星（顶部反转）</text>
      {/* D1: big bull */}
      <rect x={c1 - 16} y={top + 30} width={32} height={100} fill="transparent" stroke={colors.rise} strokeWidth="1.5" />
      <line x1={c1} y1={top} x2={c1} y2={bot} stroke={colors.rise} strokeWidth="1" />
      <text x={c1} y={bot + 14} fontSize="10" fill={colors.textDim} textAnchor="middle">D1 大阳</text>
      {/* D2: doji */}
      <rect x={c2 - 10} y={top + 55} width={20} height={4} fill="#8c8c8c" stroke="#8c8c8c" strokeWidth="1" />
      <line x1={c2} y1={top + 30} x2={c2} y2={bot - 20} stroke="#8c8c8c" strokeWidth="1" />
      <text x={c2} y={bot + 14} fontSize="10" fill={colors.textDim} textAnchor="middle">D2 十字星</text>
      {/* D3: big bear */}
      <rect x={c3 - 16} y={top + 10} width={32} height={100} fill={colors.fall} stroke={colors.fall} strokeWidth="2" />
      <line x1={c3} y1={top} x2={c3} y2={bot} stroke={colors.fall} strokeWidth="1" />
      <text x={c3} y={bot + 14} fontSize="10" fill={colors.textDim} textAnchor="middle">D3 大阴</text>
      <text x={c1 + 24} y={top + 60} fontSize="12" fill={colors.textDim}>→</text>
      <text x={c2 + 22} y={top + 60} fontSize="12" fill={colors.textDim}>→</text>
    </svg>
  )
}

/* ---------- 8. Volume-Price Matrix ---------- */
export function VolumePriceMatrix({ className }: { className?: string }) {
  const w = 400, h = 240

  const cellW = 170, cellH = 36, gap = 6
  const startX = 30, startY = 36

  const scenarios = [
    { label: '价涨 + 量增', desc: '健康上涨', color: colors.rise },
    { label: '价涨 + 量缩', desc: '上涨乏力', color: '#ffcf8b' },
    { label: '价跌 + 量增', desc: '恐慌/见底', color: '#ffcf8b' },
    { label: '价跌 + 量缩', desc: '下跌衰竭', color: colors.fall },
  ]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className}>
      <rect x={0} y={0} width={w} height={h} fill={colors.bg} rx="8" />
      <text x={w / 2} y={18} fontSize="12" fill={colors.text} textAnchor="middle" fontWeight="bold">量价关系矩阵</text>
      {scenarios.map((s, i) => {
        const col = i % 2
        const row = Math.floor(i / 2)
        const x = startX + col * (cellW + gap)
        const y = startY + row * (cellH + gap)
        return (
          <g key={i}>
            <rect x={x} y={y} width={cellW} height={cellH} rx="6" fill="rgba(255,255,255,0.05)" stroke={s.color} strokeWidth="1.2" />
            <text x={x + 12} y={y + 16} fontSize="11" fill={s.color} fontWeight="bold">{s.label}</text>
            <text x={x + 12} y={y + 30} fontSize="10" fill={colors.textDim}>{s.desc}</text>
          </g>
        )
      })}
      {/* explanation */}
      <text x={startX} y={startY + 2 * (cellH + gap) + 20} fontSize="10" fill={colors.accent}>
        ✓ 量价同步 = 趋势健康可持续
      </text>
      <text x={startX} y={startY + 2 * (cellH + gap) + 36} fontSize="10" fill="#ffcf8b">
        ⚠ 量价背离 = 趋势可能逆转，提高警惕
      </text>
    </svg>
  )
}

/* ---------- 9. Risk Management Flow ---------- */
export function RiskManagement({ className }: { className?: string }) {
  const w = 400, h = 220

  const steps = [
    { x: 30, y: 20, label: '确定总资金', sub: '¥100,000' },
    { x: 30, y: 80, label: '单笔风险 ≤ 2%', sub: '≤ ¥2,000' },
    { x: 30, y: 140, label: '设置止损位', sub: '-5% = ¥40,000' },
    { x: 230, y: 140, label: '计算仓位', sub: '40,000 ÷ 50 = 800股' },
    { x: 230, y: 80, label: '确定入场价', sub: '¥50.00' },
    { x: 230, y: 20, label: '确定止损价', sub: '¥47.50 (-5%)' },
  ]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className}>
      <rect x={0} y={0} width={w} height={h} fill={colors.bg} rx="8" />
      <text x={w / 2} y={16} fontSize="12" fill={colors.accent} textAnchor="middle" fontWeight="bold">仓位计算示例</text>
      {steps.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={s.y} width={150} height={44} rx="6" fill="rgba(255,255,255,0.06)" stroke={colors.textDim} strokeWidth="1" />
          <text x={s.x + 10} y={s.y + 18} fontSize="11" fill={colors.text}>{s.label}</text>
          <text x={s.x + 10} y={s.y + 34} fontSize="11" fill={colors.accent}>{s.sub}</text>
        </g>
      ))}
      {/* arrows connecting steps */}
      <text x={105} y={68} fontSize="14" fill={colors.textDim} textAnchor="middle">↓</text>
      <text x={105} y={128} fontSize="14" fill={colors.textDim} textAnchor="middle">↓</text>
      <text x={120} y={166} fontSize="14" fill={colors.textDim} textAnchor="middle">→</text>
      <text x={305} y={128} fontSize="14" fill={colors.textDim} textAnchor="middle">↓</text>
      <text x={305} y={68} fontSize="14" fill={colors.textDim} textAnchor="middle">↑</text>
      {/* formula */}
      <text x={195} y={200} fontSize="10" fill="#ffcf8b" textAnchor="middle">
        仓位 = 止损金额 ÷ (入场价 - 止损价) = ¥2,000 ÷ (50 - 47.50) = 800股
      </text>
    </svg>
  )
}

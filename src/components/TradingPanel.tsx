import { useState, useEffect } from 'react'
import { X, Plus, Minus, TrendingUp, Wallet, RotateCcw } from 'lucide-react'
import { useTrading } from '../contexts/TradingContext'

type Tab = 'trade' | 'positions' | 'orders'

/* ---------- helpers ---------- */
function fmt(n: number) { return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

/* ---------- component ---------- */
export default function TradingPanel() {
  const {
    cash, positions, orders, buy, sell, getPosition,
    panelOpen, setPanelOpen, tradePrefill, setTradePrefill, resetPortfolio,
  } = useTrading()

  const [tab, setTab] = useState<Tab>('trade')
  const [symbol, setSymbol] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  /* prefill from QuoteMonitor */
  useEffect(() => {
    if (tradePrefill && panelOpen) {
      setSymbol(tradePrefill.symbol)
      setPrice(String(tradePrefill.price))
      setQuantity('')
      setTradeType('buy')
      setTab('trade')
      setTradePrefill(null)
    }
  }, [tradePrefill, panelOpen, setTradePrefill])

  /* position for current symbol */
  const pos = getPosition(symbol)

  const handleTrade = () => {
    const p = parseFloat(price)
    const q = parseInt(quantity, 10)
    if (isNaN(p) || p <= 0) { setMessage({ text: '请输入有效价格', ok: false }); return }
    if (isNaN(q) || q <= 0) { setMessage({ text: '请输入有效数量', ok: false }); return }

    let ok: boolean
    if (tradeType === 'buy') {
      ok = buy(symbol, p, q, 'stock')
      if (!ok) { setMessage({ text: '现金不足！', ok: false }); return }
    } else {
      ok = sell(symbol, p, q, 'stock')
      if (!ok) { setMessage({ text: '持仓不足！', ok: false }); return }
    }
    setMessage({ text: `${tradeType === 'buy' ? '买入' : '卖出'}成功！`, ok: true })
    setTimeout(() => setMessage(null), 2500)
  }

  const totalValue = positions.reduce((sum, p) => sum + p.currentPrice * p.quantity, 0)

  return (
    <>
      {/* backdrop */}
      {panelOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setPanelOpen(false)} />
      )}

      {/* drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-[420px] max-w-[calc(100vw-3rem)] flex-col border-l border-white/10 bg-[#0a0a0a] transition-transform duration-300 ${
          panelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-[#00ff41]">
            <TrendingUp className="size-5" />
            虚拟交易系统
          </h2>
          <button type="button" onClick={() => setPanelOpen(false)} className="rounded-lg p-1.5 text-white/60 hover:bg-white/5 hover:text-white">
            <X className="size-5" />
          </button>
        </div>

        {/* tabs */}
        <div className="flex border-b border-white/10 text-sm">
          {([['trade', '交易'], ['positions', '持仓'], ['orders', '委托']] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => { setTab(key); setMessage(null) }}
              className={`flex-1 py-3 text-center transition-colors ${
                tab === key ? 'border-b-2 border-[#00ff41] text-[#00ff41]' : 'text-white/60 hover:text-white/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'trade' && (
            <div className="space-y-4 p-5">
              {/* cash */}
              <div className="rounded-lg border border-white/10 bg-black/30 p-3 text-center">
                <p className="text-xs text-white/50">可用资金</p>
                <p className="mt-1 text-2xl font-bold text-white">¥ {fmt(cash)}</p>
              </div>

              {/* symbol */}
              <div>
                <label className="mb-1 block text-xs text-white/60">标的代码</label>
                <input
                  value={symbol}
                  onChange={e => setSymbol(e.target.value.toUpperCase())}
                  placeholder="例：600519 / AAPL"
                  className="w-full rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-sm outline-none focus:border-[#00ff41]"
                />
              </div>

              {/* price */}
              <div>
                <label className="mb-1 block text-xs text-white/60">成交价格</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-sm outline-none focus:border-[#00ff41]"
                />
              </div>

              {/* quantity */}
              <div>
                <label className="mb-1 block text-xs text-white/60">数量（股/手）</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => String(Math.max(0, (parseInt(prev) || 0) - (tradeType === 'buy' ? 100 : 1))))}
                    className="rounded-lg border border-white/20 px-3 py-2 text-white/60 hover:bg-white/5"
                  >
                    <Minus className="size-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="flex-1 rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-sm text-center outline-none focus:border-[#00ff41]"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => String((parseInt(prev) || 0) + (tradeType === 'buy' ? 100 : 1)))}
                    className="rounded-lg border border-white/20 px-3 py-2 text-white/60 hover:bg-white/5"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              {/* estimated total */}
              {symbol && price && quantity && (
                <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm">
                  <span className="text-white/60">预估成交额：</span>
                  <span className="font-semibold text-white">¥ {fmt(parseFloat(price) * parseInt(quantity))}</span>
                </div>
              )}

              {/* current position hint */}
              {pos && (
                <div className="rounded-lg border border-blue-900/40 bg-blue-950/20 px-3 py-2 text-xs text-blue-300">
                  当前持仓：{pos.quantity} 股，均价 ¥ {fmt(pos.avgCost)}
                </div>
              )}

              {/* buy/sell buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setTradeType('buy'); handleTrade() }}
                  className={`flex-1 rounded-lg py-3 font-semibold text-sm transition-opacity hover:opacity-90 ${
                    tradeType === 'buy'
                      ? 'bg-[#f44] text-white ring-2 ring-[#f44]/50'
                      : 'bg-[#f44]/80 text-white'
                  }`}
                >
                  买入
                </button>
                <button
                  type="button"
                  onClick={() => { setTradeType('sell'); handleTrade() }}
                  className={`flex-1 rounded-lg py-3 font-semibold text-sm transition-opacity hover:opacity-90 ${
                    tradeType === 'sell'
                      ? 'bg-[#52c41a] text-white ring-2 ring-[#52c41a]/50'
                      : 'bg-[#52c41a]/80 text-white'
                  }`}
                >
                  卖出
                </button>
              </div>

              {/* message */}
              {message && (
                <div className={`rounded-lg px-3 py-2 text-sm text-center ${
                  message.ok ? 'bg-[#00ff41]/10 text-[#00ff41]' : 'bg-red-950/40 text-red-400'
                }`}>
                  {message.text}
                </div>
              )}
            </div>
          )}

          {tab === 'positions' && (
            <div className="p-5">
              <div className="mb-3 rounded-lg border border-white/10 bg-black/30 p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">总资产</span>
                  <span className="font-bold text-white">¥ {fmt(cash + totalValue)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/60">持仓市值</span>
                  <span className={totalValue >= 0 ? 'text-white' : 'text-red-400'}>¥ {fmt(totalValue)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/60">可用现金</span>
                  <span className="text-[#00ff41]">¥ {fmt(cash)}</span>
                </div>
              </div>

              {positions.length === 0 ? (
                <p className="mt-8 text-center text-sm text-white/40">暂无持仓</p>
              ) : (
                <div className="space-y-2">
                  {positions.map(p => {
                    const pl = (p.currentPrice - p.avgCost) * p.quantity
                    const plPct = ((p.currentPrice - p.avgCost) / p.avgCost) * 100
                    return (
                      <div key={p.symbol} className="rounded-lg border border-white/10 bg-black/20 p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{p.symbol}</span>
                          <span className={`text-sm font-semibold ${pl >= 0 ? 'text-red-400' : 'text-[#52c41a]'}`}>
                            {pl >= 0 ? '+' : ''}{fmt(pl)} ({plPct >= 0 ? '+' : ''}{plPct.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-white/50">
                          <span>{p.quantity} 股</span>
                          <span>均价 ¥ {fmt(p.avgCost)}</span>
                          <span>现价 ¥ {fmt(p.currentPrice)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* reset button */}
              <button
                type="button"
                onClick={resetPortfolio}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs text-white/50 transition hover:border-red-900 hover:text-red-400"
              >
                <RotateCcw className="size-3" />
                重置模拟交易（清空所有数据）
              </button>
            </div>
          )}

          {tab === 'orders' && (
            <div className="p-5">
              {orders.length === 0 ? (
                <p className="mt-8 text-center text-sm text-white/40">暂无委托记录</p>
              ) : (
                <div className="space-y-1.5">
                  {[...orders].reverse().map(o => (
                    <div key={o.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${o.type === 'buy' ? 'text-red-400' : 'text-[#52c41a]'}`}>
                          {o.type === 'buy' ? '买' : '卖'}
                        </span>
                        <span className="text-sm font-semibold text-white">{o.symbol}</span>
                      </div>
                      <div className="text-right text-xs text-white/60">
                        <div>{o.quantity} 股 × ¥ {fmt(o.price)}</div>
                        <div className="text-white/40">{new Date(o.timestamp).toLocaleString('zh-CN')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/* ---------- floating trigger button ---------- */
export function TradingTrigger() {
  const { setPanelOpen, positions } = useTrading()
  const totalPositions = positions.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <button
      type="button"
      onClick={() => setPanelOpen(true)}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-[#00ff41] px-5 py-3 font-semibold text-black shadow-lg shadow-[#00ff41]/30 transition hover:scale-105 hover:shadow-xl"
    >
      <Wallet className="size-5" />
      <span className="text-sm">交易</span>
      {totalPositions > 0 && (
        <span className="flex size-5 items-center justify-center rounded-full bg-black text-[10px] text-[#00ff41]">
          {totalPositions}
        </span>
      )}
    </button>
  )
}

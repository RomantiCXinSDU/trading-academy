import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

/* ---------- types ---------- */
export type Position = {
  symbol: string
  quantity: number
  avgCost: number
  currentPrice: number
  marketType: 'stock' | 'futures'
}

export type Order = {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  price: number
  quantity: number
  total: number
  timestamp: number
  marketType: 'stock' | 'futures'
}

export type TradePrefill = {
  symbol: string
  price: number
  marketType: 'stock' | 'futures'
}

type TradingContextType = {
  cash: number
  positions: Position[]
  orders: Order[]
  buy: (symbol: string, price: number, quantity: number, marketType: 'stock' | 'futures') => boolean
  sell: (symbol: string, price: number, quantity: number, marketType: 'stock' | 'futures') => boolean
  getPosition: (symbol: string) => Position | undefined
  updatePrice: (symbol: string, price: number) => void
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
  tradePrefill: TradePrefill | null
  setTradePrefill: (prefill: TradePrefill | null) => void
  resetPortfolio: () => void
}

const TradingContext = createContext<TradingContextType | null>(null)

const INITIAL_CASH = 1_000_000
const STORAGE_KEY = 'app-virtual-trading'

/* ---------- provider ---------- */
export function TradingProvider({ children }: { children: ReactNode }) {
  const [cash, setCash] = useState(INITIAL_CASH)
  const [positions, setPositions] = useState<Position[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [tradePrefill, setTradePrefill] = useState<TradePrefill | null>(null)

  /* load from localStorage on mount */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        setCash(data.cash ?? INITIAL_CASH)
        setPositions(data.positions ?? [])
        setOrders(data.orders ?? [])
      }
    } catch { /* ignore */ }
  }, [])

  /* persist on change */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cash, positions, orders }))
  }, [cash, positions, orders])

  const buy = useCallback< TradingContextType['buy']>((symbol, price, quantity, marketType) => {
    const total = price * quantity
    if (total > cash) return false

    setCash(prev => prev - total)
    setPositions(prev => {
      const existing = prev.find(p => p.symbol === symbol)
      if (existing) {
        const newQty = existing.quantity + quantity
        const newAvg = (existing.avgCost * existing.quantity + total) / newQty
        return prev.map(p =>
          p.symbol === symbol ? { ...p, quantity: newQty, avgCost: newAvg, currentPrice: price } : p
        )
      }
      return [...prev, { symbol, quantity, avgCost: price, currentPrice: price, marketType }]
    })
    setOrders(prev => [
      ...prev,
      {
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        symbol,
        type: 'buy',
        price,
        quantity,
        total,
        timestamp: Date.now(),
        marketType,
      },
    ])
    return true
  }, [cash])

  const sell = useCallback<TradingContextType['sell']>((symbol, price, quantity, marketType) => {
    const pos = positions.find(p => p.symbol === symbol)
    if (!pos || pos.quantity < quantity) return false

    const total = price * quantity
    setCash(prev => prev + total)
    setPositions(prev => {
      const updated = prev
        .map(p => {
          if (p.symbol !== symbol) return p
          const newQty = p.quantity - quantity
          return newQty <= 0 ? null : { ...p, quantity: newQty, currentPrice: price }
        })
        .filter(Boolean) as Position[]
      return updated
    })
    setOrders(prev => [
      ...prev,
      {
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        symbol,
        type: 'sell',
        price,
        quantity,
        total,
        timestamp: Date.now(),
        marketType,
      },
    ])
    return true
  }, [positions])

  const getPosition = useCallback<TradingContextType['getPosition']>(
    (symbol) => positions.find(p => p.symbol === symbol),
    [positions],
  )

  const updatePrice = useCallback<TradingContextType['updatePrice']>((symbol, price) => {
    setPositions(prev =>
      prev.map(p => (p.symbol === symbol ? { ...p, currentPrice: price } : p)),
    )
  }, [])

  const resetPortfolio = useCallback(() => {
    setCash(INITIAL_CASH)
    setPositions([])
    setOrders([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <TradingContext.Provider
      value={{
        cash,
        positions,
        orders,
        buy,
        sell,
        getPosition,
        updatePrice,
        panelOpen,
        setPanelOpen,
        tradePrefill,
        setTradePrefill,
        resetPortfolio,
      }}
    >
      {children}
    </TradingContext.Provider>
  )
}

/* ---------- hook ---------- */
export function useTrading() {
  const ctx = useContext(TradingContext)
  if (!ctx) throw new Error('useTrading must be used within TradingProvider')
  return ctx
}

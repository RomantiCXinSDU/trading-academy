import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Home, TrendingUp, BarChart3, BookOpen, ArrowLeft } from 'lucide-react'
import TradingPanel, { TradingTrigger } from './TradingPanel'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/stocks', label: '股票', icon: TrendingUp },
  { path: '/futures', label: '期货', icon: BarChart3 },
]

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#050505] text-[#f5f5f5]">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
        className={`fixed left-0 top-0 z-30 flex h-full flex-col border-r border-white/10 bg-[#050505] transition-all duration-300 ${
          isSidebarOpen ? 'w-56' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-white/10">
          <Link
            to="/"
            className={`flex items-center text-[#00ff41] transition-all ${
              isSidebarOpen ? 'gap-2 px-5' : 'w-full justify-center'
            }`}
          >
            <BookOpen className="size-5 shrink-0" />
            {isSidebarOpen && (
              <span className="truncate font-display text-lg font-bold">观澜交易学堂</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-lg text-sm transition-colors ${
                  isSidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center py-3'
                } ${
                  isActive
                    ? 'bg-[#00ff41]/10 text-[#00ff41]'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
                title={isSidebarOpen ? undefined : item.label}
              >
                <Icon className="size-5 shrink-0" />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {isSidebarOpen && (
          <div className="border-t border-white/10 px-5 py-4 text-xs text-white/40">
            专注金融交易教学
          </div>
        )}
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-56' : 'ml-16'
        }`}
      >
        {!isHome && (
          <div className="sticky top-0 z-20 border-b border-white/5 bg-[#050505]/60 backdrop-blur-sm">
            <div className="flex items-center px-4 py-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft className="size-4" />
                返回
              </button>
            </div>
          </div>
        )}
        {children}
      </main>

      {/* Virtual Trading System */}
      <TradingTrigger />
      <TradingPanel />
    </div>
  )
}

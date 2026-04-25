import { Routes, Route } from 'react-router'
import { TradingProvider } from './contexts/TradingContext'
import AppLayout from './components/AppLayout'
import Home from './pages/Home'
import Stocks from './pages/Stocks'
import Futures from './pages/Futures'
import IndicatorDetail from './pages/IndicatorDetail'
import IndicatorProDetail from './pages/IndicatorProDetail'
import CourseDetail from './pages/CourseDetail'

export default function App() {
  return (
    <TradingProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/futures" element={<Futures />} />
          <Route path="/learn/indicator/:indicatorId" element={<IndicatorDetail />} />
          <Route path="/learn/indicator/:indicatorId/pro" element={<IndicatorProDetail />} />
          <Route path="/course/stock-basics" element={<CourseDetail />} />
        </Routes>
      </AppLayout>
    </TradingProvider>
  )
}

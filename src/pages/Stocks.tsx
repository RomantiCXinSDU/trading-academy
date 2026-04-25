import QuoteMonitor from '../components/QuoteMonitor'

const stockTopics = [
  '股票交易规则与市场结构',
  '趋势识别：均线、形态与量价配合',
  '交易计划：入场、加仓、止损、止盈',
  '盘后复盘与交易日志写作',
]

export default function Stocks() {
  return (
    <div>
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-3 text-sm tracking-[0.2em] text-[#00ff41]">股票专区</p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">股票交易教学页面</h1>
        <p className="mt-4 max-w-3xl text-white/75">
          这里聚焦A股与港美股常见交易方法，帮助你建立从认知到执行的完整流程。
        </p>

        <QuoteMonitor
          marketType="stock"
          defaultCode="600519"
          title="股票实时行情与指标"
          examples={['600519', '000001', 'AAPL', 'TSLA']}
        />

        <section className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-2xl font-semibold">你将学习</h2>
          <ul className="space-y-3 text-white/85">
            {stockTopics.map((topic) => (
              <li key={topic} className="rounded-lg border border-white/10 bg-black/30 px-4 py-3">
                {topic}
              </li>
            ))}
          </ul>
        </section>

      </main>
    </div>
  )
}

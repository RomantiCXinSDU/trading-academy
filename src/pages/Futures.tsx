import QuoteMonitor from '../components/QuoteMonitor'

const futuresTopics = [
  '期货合约、保证金与杠杆机制',
  '主力与次主力切换的风险点',
  '日内与波段策略的执行差异',
  '风险控制：回撤限制与仓位管理',
]

export default function Futures() {
  return (
    <div>
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-3 text-sm tracking-[0.2em] text-[#00ff41]">期货专区</p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">期货交易教学页面</h1>
        <p className="mt-4 max-w-3xl text-white/75">
          这里围绕商品期货与股指期货交易，讲解策略思路、执行纪律与风险保护。
        </p>

        <QuoteMonitor
          marketType="futures"
          defaultCode="GC=F"
          title="期货实时行情与指标"
          examples={['GC=F', 'CL=F', 'ES=F', 'NQ=F']}
        />

        <section className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-2xl font-semibold">你将学习</h2>
          <ul className="space-y-3 text-white/85">
            {futuresTopics.map((topic) => (
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

import { Link, useParams } from 'react-router'
import { ArrowUpRight, ShieldAlert, Target, TrendingUp, BarChart3, Volume2 } from 'lucide-react'
import { indicatorLessons, type IndicatorKey } from '../data/indicatorLessons'
import CaseStudyChart from '../components/CaseStudyChart'

export default function IndicatorProDetail() {
  const { indicatorId } = useParams()
  const key = indicatorId as IndicatorKey | undefined
  const lesson = key ? indicatorLessons[key] : undefined

  if (!lesson) {
    return (
      <div className="px-6 py-16">
        <p>未找到该指标专业页。</p>
        <Link to="/" className="mt-4 inline-block rounded border border-white/20 px-3 py-2">返回首页</Link>
      </div>
    )
  }

  const cs = lesson.caseStudy
  const sc = lesson.chartScenario

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <main className="mx-auto max-w-6xl">
        {/* header */}
        <div className="mb-6">
          <p className="text-sm tracking-[0.2em] text-[#00ff41]">专业进阶实战</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{lesson.name}</h1>
          <p className="mt-2 text-sm text-white/70">这一页聚焦"图上怎么读线、怎么执行交易、怎么做风控"。</p>
        </div>

        {sc && (
          <section className="mb-6 rounded-xl border border-white/10 bg-black/30 p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-sm text-white/70">
              <BarChart3 className="size-4 text-[#00ff41]" />
              <span>实盘场景回放 · {sc.feature}</span>
            </div>
            <div className="h-[400px] sm:h-[480px]">
              <CaseStudyChart
                indicatorKey={lesson.key}
                trend={sc.trend}
                volatility={sc.volatility}
                entryIndex={sc.entryIndex}
                stopIndex={sc.stopIndex}
              />
            </div>
          </section>
        )}

        {/* case study detail */}
        {cs && (
          <div className="mb-6 grid gap-4 lg:grid-cols-3">
            {/* background & entry */}
            <section className="rounded-xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <TrendingUp className="size-5 text-[#00ff41]" />
                {cs.title}
              </h2>
              <p className="mb-1 text-xs text-white/50">{cs.instrument}</p>
              <p className="mb-4 text-sm leading-7 text-white/80">{cs.background}</p>

              <h3 className="mb-2 text-sm font-semibold text-[#00ff41]">入场逻辑</h3>
              <ol className="mb-4 space-y-2">
                {cs.entryRationale.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-6 text-white/85">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#00ff41]/20 text-xs text-[#00ff41]">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-sm text-red-400">
                    <ShieldAlert className="size-4" />
                    止损设置
                  </div>
                  <p className="text-sm leading-6 text-white/80">{cs.stopLoss}</p>
                </div>
                <div className="rounded-lg border border-blue-900/50 bg-blue-950/20 p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-sm text-blue-400">
                    <Target className="size-4" />
                    仓位建议
                  </div>
                  <p className="text-sm leading-6 text-white/80">{cs.positionSizing}</p>
                </div>
              </div>
            </section>

            {/* key levels & outcome */}
            <section className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Target className="size-4 text-[#ffd666]" />
                关键价位
              </h3>
              <div className="space-y-2">
                {cs.keyLevels.map((kl) => (
                  <div key={kl.label} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                    <span className="text-xs text-white/60">{kl.label}</span>
                    <span className="font-mono text-sm font-semibold text-[#ffd666]">{kl.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-[#00ff41]/30 bg-[#00ff41]/5 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-sm text-[#00ff41]">
                  <ArrowUpRight className="size-4" />
                  结果
                </div>
                <p className="text-sm leading-6 text-white/85">{cs.outcome}</p>
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-white/50">
                <Volume2 className="size-3" />
                图中绿色标注为入场点，红色标注为止损位
              </div>
            </section>
          </div>
        )}

        {/* 3. pro advanced */}
        <section className="rounded-xl border border-[#1f5f3a] bg-[#0a2015] p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-[#7ee7b8]">
            <BarChart3 className="size-5" />
            进阶理解
          </h2>
          <ul className="space-y-2">
            {(lesson.proAdvanced ?? ['先做单指标熟悉，再做多指标组合验证。']).map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-white/90">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#7ee7b8]" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

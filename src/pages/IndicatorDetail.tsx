import { Link, useParams } from 'react-router'
import { ArrowUpRight, ShieldAlert, Target, TrendingUp } from 'lucide-react'
import { indicatorLessons, type IndicatorKey } from '../data/indicatorLessons'

export default function IndicatorDetail() {
  const { indicatorId } = useParams()
  const key = indicatorId as IndicatorKey | undefined
  const lesson = key ? indicatorLessons[key] : undefined

  if (!lesson) {
    return (
      <div className="px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-lg font-semibold">未找到该指标详情</p>
          <p className="mt-3 text-sm text-white/75">请从股票或期货页面点击指标进入详情页。</p>
          <Link to="/" className="mt-6 inline-block rounded-lg border border-white/20 px-4 py-2 text-sm hover:border-[#00ff41] hover:text-[#00ff41]">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  const cs = lesson.caseStudy

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <main className="mx-auto max-w-5xl">
        {/* header */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <p className="text-sm tracking-[0.2em] text-[#00ff41]">指标学习详情</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{lesson.name}</h1>
          <p className="mt-4 text-sm leading-7 text-white/80">{lesson.summary}</p>
          <div className="mt-4 rounded-lg border border-[#1f5f3a] bg-[#0a2015] p-4">
            <p className="text-sm text-[#7ee7b8]">先用通俗话理解</p>
            <p className="mt-1 text-white/90">{lesson.plainIntro ?? '先把这个指标当作观察趋势强弱的工具。'}</p>
          </div>
          <Link
            to={`/learn/indicator/${lesson.key}/pro`}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#00ff41] px-4 py-2 text-sm text-[#00ff41] transition hover:bg-[#00ff41]/10"
          >
            进入专业实战页（带图案例）
            <ArrowUpRight className="size-4" />
          </Link>
        </section>

        {/* detailed sections */}
        <section className="mt-6 grid gap-4">
          {/* 1. formula */}
          <article className="rounded-xl border border-white/10 bg-black/30 p-5">
            <h2 className="text-lg font-semibold">1. 计算公式</h2>
            <p className="mt-2 text-sm leading-7 text-white/90">{lesson.formula}</p>
          </article>

          {/* 2. parameters */}
          <article className="rounded-xl border border-white/10 bg-black/30 p-5">
            <h2 className="text-lg font-semibold">2. 参数说明</h2>
            <ul className="mt-2 space-y-1.5">
              {lesson.parameters.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6 text-white/85">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white/30" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          {/* 3. interpretation */}
          <article className="rounded-xl border border-white/10 bg-black/30 p-5">
            <h2 className="text-lg font-semibold">3. 指标含义（小白版）</h2>
            <ul className="mt-2 space-y-1.5">
              {lesson.interpretation.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6 text-white/85">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white/30" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          {/* 4. usage */}
          <article className="rounded-xl border border-white/10 bg-black/30 p-5">
            <h2 className="text-lg font-semibold">4. 实战怎么用</h2>
            <ul className="mt-2 space-y-1.5">
              {lesson.usage.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6 text-white/85">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white/30" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          {/* 5. mistakes */}
          <article className="rounded-xl border border-[#6b3f1a] bg-[#24160a] p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#ffcf8b]">
              <ShieldAlert className="size-5" />
              5. 常见误区（一定要避免）
            </h2>
            <ul className="mt-2 space-y-1.5">
              {lesson.mistakes.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6 text-white/90">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full text-[#ffcf8b]">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          {/* 6. study steps */}
          <article className="rounded-xl border border-[#1f5f3a] bg-[#0a2015] p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#7ee7b8]">
              <TrendingUp className="size-5" />
              6. 建议学习路径
            </h2>
            <ul className="mt-2 space-y-1.5">
              {lesson.studySteps.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6 text-white/90">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#7ee7b8]" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          {/* 7. line style */}
          <article className="rounded-xl border border-[#2a4365] bg-[#101a2a] p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#93c5fd]">
              <Target className="size-5" />
              7. 图中线条怎么看
            </h2>
            <p className="mt-2 text-sm leading-7 text-white/90">{lesson.lineStyle ?? '该指标通常以曲线或柱体方式叠加在图表中，请结合右侧图例识别。'}</p>
            <div className="mt-3 rounded-md border border-white/15 bg-black/30 p-3 text-xs text-white/70">
              线条提示：先看线的方向，再看线与价格的相对位置，最后看是否与成交量共振。
            </div>
          </article>

          {/* 8. practical examples — UPGRADED */}
          <article className="rounded-xl border border-[#7c2d12] bg-[#2a140c] p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#fdba74]">
              <ArrowUpRight className="size-5" />
              8. 实战例子（从信号到执行）
            </h2>

            {cs ? (
              <div className="mt-4 space-y-4">
                {/* case header */}
                <div>
                  <h3 className="flex items-center gap-2 text-base font-semibold text-white">{cs.title}</h3>
                  <p className="mt-0.5 text-xs text-white/50">{cs.instrument}</p>
                  <p className="mt-2 text-sm leading-7 text-white/85">{cs.background}</p>
                </div>

                {/* entry logic */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-[#00ff41]">入场逻辑</h4>
                  <ol className="space-y-2">
                    {cs.entryRationale.map((step, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-6 text-white/85">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#fdba74]/20 text-xs text-[#fdba74]">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* stop loss & sizing */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-3">
                    <p className="mb-1 text-xs text-red-400">止损设置</p>
                    <p className="text-sm leading-6 text-white/80">{cs.stopLoss}</p>
                  </div>
                  <div className="rounded-lg border border-blue-900/50 bg-blue-950/20 p-3">
                    <p className="mb-1 text-xs text-blue-400">仓位建议</p>
                    <p className="text-sm leading-6 text-white/80">{cs.positionSizing}</p>
                  </div>
                </div>

                {/* key levels & outcome */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#ffd666]">关键价位</p>
                    <div className="space-y-1.5">
                      {cs.keyLevels.map((kl) => (
                        <div key={kl.label} className="flex items-center justify-between rounded border border-white/10 bg-black/30 px-3 py-1.5">
                          <span className="text-xs text-white/60">{kl.label}</span>
                          <span className="font-mono text-sm font-semibold text-[#ffd666]">{kl.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#00ff41]/30 bg-[#00ff41]/5 p-4">
                    <p className="mb-1 flex items-center gap-1.5 text-sm text-[#00ff41]">
                      <ArrowUpRight className="size-4" />
                      结果
                    </p>
                    <p className="text-sm leading-6 text-white/85">{cs.outcome}</p>
                  </div>
                </div>

                <Link
                  to={`/learn/indicator/${lesson.key}/pro`}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#00ff41] px-4 py-2 text-sm text-[#00ff41] transition hover:bg-[#00ff41]/10"
                >
                  查看带图案例回放
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {(lesson.practicalExample ?? ['先确认趋势方向，再等待指标与价格共振信号。', '设置止损并复盘结果，逐步形成自己的规则。']).map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-white/90">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full text-[#fdba74]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      </main>
    </div>
  )
}

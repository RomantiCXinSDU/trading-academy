import { useState } from 'react'
import { CheckCircle, Lightbulb, ChevronRight } from 'lucide-react'
import { stockBasicsCourse, type CourseModule } from '../data/courseStockBasics'
import {
  CandleAnatomy,
  BullBearCandle,
  SpecialCandles,
  BullishEngulfing,
  BearishEngulfing,
  MorningStar,
  EveningStar,
  VolumePriceMatrix,
  RiskManagement,
} from '../components/CourseIllustrations'

/* ---------- module illustration mapping ---------- */
const moduleIllustrations: Record<string, React.ReactNode> = {
  'candlestick-structure': (
    <div className="grid gap-4 sm:grid-cols-2">
      <CandleAnatomy className="w-full" />
      <BullBearCandle className="w-full" />
      <div className="sm:col-span-2">
        <SpecialCandles className="w-full" />
      </div>
    </div>
  ),
  'candle-patterns': (
    <div className="grid gap-4 sm:grid-cols-2">
      <BullishEngulfing className="w-full" />
      <BearishEngulfing className="w-full" />
      <MorningStar className="w-full" />
      <EveningStar className="w-full" />
    </div>
  ),
  'volume-price': (
    <div>
      <VolumePriceMatrix className="w-full" />
    </div>
  ),
  'risk-control': (
    <div>
      <RiskManagement className="w-full" />
    </div>
  ),
}

/* ---------- component ---------- */
export default function CourseDetail() {
  const [activeModule, setActiveModule] = useState(stockBasicsCourse.modules[0].id)
  const course = stockBasicsCourse

  const currentModule = course.modules.find((m) => m.id === activeModule) ?? course.modules[0]
  const currentIndex = course.modules.findIndex((m) => m.id === activeModule)

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Course Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[#0a1a10] to-[#050505]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#00ff41]/15 px-3 py-1 text-xs text-[#00ff41]">
              {course.level}
            </span>
            <span className="text-xs text-white/50">{course.duration}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{course.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">{course.subtitle}</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Module Navigation - Sidebar */}
          <aside className="shrink-0 lg:w-64">
            <nav className="space-y-1 rounded-xl border border-white/10 bg-black/30 p-3 lg:sticky lg:top-4">
              {course.modules.map((mod, i) => {
                const isActive = mod.id === activeModule
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setActiveModule(mod.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-[#00ff41]/10 text-[#00ff41]'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">
                      {i + 1}
                    </span>
                    <span className="flex-1">{mod.title}</span>
                    {isActive && <ChevronRight className="size-4 shrink-0" />}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            {/* Module Title */}
            <div className="mb-6">
              <span className="text-sm text-white/50">
                第 {currentIndex + 1} 章
              </span>
              <h2 className="mt-1 text-2xl font-bold">{currentModule.title}</h2>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {currentModule.sections.map((section, si) => (
                <SectionCard key={si} section={section} />

              ))}
            </div>

            {/* module illustrations */}
            {moduleIllustrations[currentModule.id] && (
              <div className="mt-8 rounded-xl border border-white/10 bg-black/20 p-4 sm:p-6">
                <h3 className="mb-4 text-sm font-semibold text-white/60 uppercase tracking-wider">
                  图解说明
                </h3>
                {moduleIllustrations[currentModule.id]}
              </div>
            )}

            {/* Module Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
              {currentIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => setActiveModule(course.modules[currentIndex - 1].id)}
                  className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-[#00ff41] hover:text-[#00ff41]"
                >
                  ← {course.modules[currentIndex - 1].title}
                </button>
              ) : (
                <div />
              )}
              {currentIndex < course.modules.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveModule(course.modules[currentIndex + 1].id)}
                  className="flex items-center gap-2 rounded-lg bg-[#00ff41] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  {course.modules[currentIndex + 1].title} →
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Section Card ---------- */
function SectionCard({
  section,
}: {
  section: CourseModule['sections'][number]
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <h3 className="text-xl font-semibold text-white">{section.title}</h3>

      {section.paragraphs.map((p, i) => (
        <p key={i} className="mt-4 text-sm leading-7 text-white/80">{p}</p>
      ))}

      {/* Key Points */}
      {section.keyPoints && section.keyPoints.length > 0 && (
        <div className="mt-5 rounded-lg border border-[#00ff41]/20 bg-[#00ff41]/5 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-[#00ff41]">
            <CheckCircle className="size-4" />
            核心要点
          </div>
          <ul className="space-y-1.5">
            {section.keyPoints.map((kp, i) => (
              <li key={i} className="flex gap-2 text-sm leading-6 text-white/85">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#00ff41]" />
                {kp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips */}
      {section.tips && section.tips.length > 0 && (
        <div className="mt-4 rounded-lg border border-[#ffcf8b]/20 bg-[#2a2010] p-4">
          <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-[#ffcf8b]">
            <Lightbulb className="size-4" />
            实战提示
          </div>
          <ul className="space-y-1.5">
            {section.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm leading-6 text-white/85">
                <span className="mt-1.5 text-[#ffcf8b]">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

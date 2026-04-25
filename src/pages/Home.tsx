import { useState } from 'react'
import { Link } from 'react-router'
import { ExternalLink, ChevronDown } from 'lucide-react'

const courseItems = [
  {
    title: '股票交易基础',
    level: '入门',
    detail: 'K线结构、量价关系、交易规则、风险控制四个核心模块。',
    path: '/course/stock-basics',
  },
  {
    title: '期货交易实战',
    level: '进阶',
    detail: '趋势跟踪与区间策略结合，包含止损、仓位与复盘框架。',
    path: '/futures',
  },
  {
    title: '量化思维训练',
    level: '系统化',
    detail: '把主观判断转化为规则，建立可复用的交易决策流程。',
    path: '/stocks',
  },
]

const articleItems = [
  {
    title: 'K线形态速查手册：95%的交易者不知道的秘密',
    creator: 'Rayner Teo',
    platform: 'YouTube',
    description: '从单根K线到复杂组合形态，系统讲解如何识别高概率交易信号，包含吞没、十字星、锤子线等实战用法。',
    url: 'https://www.tradingwithrayner.com/ultimate-candlestick-patterns-trading-course/',
    tags: ['K线', '技术分析', '入门'],
  },
  {
    title: '如何像赌场一样交易：持续盈利的秘密',
    creator: 'Adam Khoo',
    platform: 'YouTube',
    description: '70%的盈利来自心态管理。讲解仓位控制、2%风险原则和"赌场思维"——关注系统优势而非单笔盈亏。',
    url: 'https://www.youtube.com/@AdamKhoo',
    tags: ['交易心理', '风控', '进阶'],
  },
  {
    title: '股票投资入门30讲：从零搭建知识框架',
    creator: '财经公开课',
    platform: 'Bilibili',
    description: '系统课程涵盖股票分类、财务分析、估值方法、技术分析、资产配置，从零到一构建完整投资体系。',
    url: 'https://www.bilibili.com/video/BV1DWu2zREp8/',
    tags: ['系统课程', '入门', 'A股'],
  },
  {
    title: '别再交学费了！B站炒股博主从入门到进阶',
    creator: '精选合集',
    platform: 'Bilibili',
    description: '盘点B站优质财经UP主：巫师财经的财经故事、硬核的半佛仙人防骗科普、所长林博的实战分析、小Lin的宏观经济解读。',
    url: 'https://baijiahao.baidu.com/s?id=1845019786442235213',
    tags: ['UP主推荐', '入门', '防坑'],
  },
]

const experienceItems = [
  {
    step: '01',
    title: '先学会不亏钱',
    summary: '新手入市第一课——不是怎么赚钱，而是怎么不亏钱。',
    color: '#ff4d4f',
    details: [
      '不要重仓单只股票。把全部资金压在一只股票上是亏损最快的途径——它跌30%，你的总资金就亏了24%。单只股票仓位建议不超过总资金的20%，分散风险是长期生存的基础。',
      '永远设止损。买入之前就想清楚：跌到多少钱我认错离场？把价格记下来，到了就坚决执行。没有止损的交易就像开车没有刹车——不是会不会出事，而是什么时候出事。',
      '不要追涨杀跌。大涨怕错过（FOMO）冲进去、大跌恐慌割肉——这是新手亏钱的标准流程。反过来想：大涨后买成本高风险大，大跌后卖往往卖在最低点。',
    ],
  },
  {
    step: '02',
    title: '看懂K线就够了',
    summary: '别被MACD、KDJ、RSI搞晕——K线和成交量才是技术分析的根本。',
    color: '#00ff41',
    details: [
      '技术指标的本质是对价格和成交量的数学加工，必然存在滞后性。MACD金叉时股价可能已经涨了10%，追进去就成了接盘侠。指标是辅助，不能作为决策核心。',
      'K线包含最原始的市场信息：开盘、收盘、最高、最低。先学会单根K线（阳线、阴线、十字星、锤子线），再学组合形态（吞没、早晨之星、黄昏之星），足以判断大部分市场状态。',
      '成交量验证价格趋势。上涨放量说明有真实买盘支撑，上涨缩量说明涨不动了；下跌放量可能是恐慌见底，下跌缩量说明抛压减轻。量价关系比任何指标都可靠。',
    ],
  },
  {
    step: '03',
    title: '先模拟交易100笔',
    summary: '实盘之前，在模拟环境中完成至少100笔交易来验证策略。',
    color: '#00ff41',
    details: [
      '本网站提供了虚拟交易系统（右下角绿色按钮），你可以用模拟资金检验交易策略，无需承担真实亏损。在投入真金白银之前，先用模拟盘验证想法是否可行。',
      '模拟交易的目标不是赚钱，而是建立完整的交易流程：分析市场→制定计划→执行交易→记录日志→复盘改进。重复这个循环至少100次，形成交易习惯。',
      '提醒一点：模拟盘没有真实资金的"痛感"，转实盘时心态完全不同。模拟盘的核心价值是检验策略的逻辑可行性，并非模拟交易心态。',
    ],
  },
  {
    step: '04',
    title: '坚持写交易日志',
    summary: '没有记录的交易等于没做——你无法从模糊记忆中吸取教训。',
    color: '#00ff41',
    details: [
      '每笔交易至少记录：入场日期、交易标的、买入理由、买入价格、仓位大小、止损位、出场日期、出场价格、盈亏金额、交易类型（计划内/冲动交易）。',
      '每周花30分钟复盘交易日志。找对正确的模式并重复，找对错误的模式并列入"禁止清单"，贴在电脑前时刻提醒自己。',
      '大部分亏损不是因为不知道什么该做，而是管不住手做了不该做的事。交易日志让你看清自己的行为模式，逐步消除冲动交易。',
    ],
  },
  {
    step: '05',
    title: '风险管理大于一切',
    summary: '长期盈利的秘密不是预测准确，而是控制风险、活得更久。',
    color: '#ffcf8b',
    details: [
      '单笔风险不超过总资金的2%。有10万资金，单笔最多亏2000元。若买入一只股票止损位-5%，则投入金额不超过4万元。这就是著名的"2%原则"。',
      '胜率不重要，盈亏比才重要。胜率40%但盈亏比3:1的系统，长期期望值 = 0.4×3 - 0.6×1 = +0.6，仍然是赚钱的。不要追求高胜率，追求高盈亏比。',
      '连续亏损时主动暂停。连续亏3笔就停下来，不要试图"翻本"——翻本心态是爆仓的开始。出去走走，复盘找原因，等心态平复了再交易。',
    ],
  },
  {
    step: '06',
    title: '保持学习与独立思考',
    summary: '市场是最好的老师，但前提是你有系统的学习框架。',
    color: '#00ff41',
    details: [
      '不要盲从任何"大神"或"带单老师"。真正能稳定盈利的人不需要靠带单赚钱。学会独立思考，对任何交易建议都保持审慎。',
      '推荐学习路径：K线基础 → 量价关系 → 形态识别 → 趋势分析 → 交易策略 → 风险管理 → 心理控制 → 复盘优化。每一步扎实了再走下一步。',
      '本网站的「股票交易基础」课程提供了系统入门知识，精选资源栏目也整理了优质学习视频。交易是一辈子的事，保持每天进步一点点的节奏。',
    ],
  },
]

export default function Home() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  return (
    <div>
      <main>
        <section className="relative overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-35"
            src="/videos/hero-fluid.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#050505]" />
          <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[#00ff41]">金融交易学习平台</p>
            <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
              面向股票与期货交易者的教学与信息分享网站
            </h2>
            <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
              聚焦交易认知、策略框架、风险管理与盘后复盘，让学习从“看懂市场”走向“执行系统”。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/stocks"
                className="rounded-lg bg-[#00ff41] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              >
                进入股票学习页面
              </Link>
              <Link
                to="/futures"
                className="rounded-lg border border-[#00ff41] px-6 py-3 text-sm font-semibold text-[#00ff41] transition hover:bg-[#00ff41]/10"
              >
                进入期货学习页面
              </Link>
            </div>
          </div>
        </section>

        <section id="courses" className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <h3 className="font-display text-2xl font-bold md:text-3xl">教学课程</h3>
            <span className="text-sm text-white/60">每周持续更新</span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {courseItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="group block rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-[#00ff41]/60 hover:bg-white/[0.07]"
              >
                <p className="mb-3 inline-block rounded-full bg-[#00ff41]/15 px-3 py-1 text-xs text-[#00ff41] group-hover:bg-[#00ff41]/25">
                  {item.level}
                </p>
                <h4 className="mb-3 text-xl font-semibold transition group-hover:text-[#00ff41]">{item.title}</h4>
                <p className="text-sm leading-6 text-white/75">{item.detail}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-white/10">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-20"
            src="/videos/grid-terrain.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="relative mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2">
            <div id="articles">
              <h3 className="mb-6 font-display text-2xl font-bold md:text-3xl">精选资源</h3>
              <div className="space-y-4">
                {articleItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-lg border border-white/10 bg-black/40 p-4 transition hover:border-[#00ff41]/60 hover:bg-black/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-white/90 transition group-hover:text-[#00ff41]">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-xs leading-5 text-white/60">{item.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-white/40">{item.creator}</span>
                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/50">{item.platform}</span>
                          {item.tags.map((tag) => (
                            <span key={tag} className="rounded bg-[#00ff41]/10 px-1.5 py-0.5 text-[10px] text-[#00ff41]">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <ExternalLink className="mt-1 size-4 shrink-0 text-white/30 transition group-hover:text-[#00ff41]" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div id="community" className="rounded-xl border border-white/10 bg-black/40 p-6">
              <h3 className="mb-4 font-display text-2xl font-bold">交流与分享</h3>
              <p className="mb-4 text-sm leading-7 text-white/80">
                提供每日市场观察、交易复盘要点、策略讨论话题，帮助你在实盘环境中持续优化认知与执行。
              </p>
              <p className="text-sm leading-7 text-white/80">
                适合人群：交易新手、想系统化提升的投资者、需要稳定执行框架的短中线交易者。
              </p>
            </div>
          </div>
        </section>

        {/* 经验分享 */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10">
            <h3 className="font-display text-2xl font-bold md:text-3xl">经验分享</h3>
            <p className="mt-2 text-sm text-white/60">给交易新手的入门建议 · 从基础到进阶</p>
          </div>
          <div className="space-y-3">
            {experienceItems.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/5 transition hover:border-white/20"
              >
                <button
                  type="button"
                  onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                  className="group flex w-full items-center gap-4 p-5 text-left"
                >
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                    style={{ backgroundColor: `${item.color}20`, color: item.color }}
                  >
                    {item.step}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-white/90 transition-colors group-hover:text-white">
                      {item.title}
                    </h4>
                    <p className="mt-0.5 text-sm text-white/60">{item.summary}</p>
                  </div>
                  <ChevronDown
                    className={`size-5 shrink-0 text-white/40 transition-transform duration-300 ${
                      expandedStep === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedStep === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-white/10 px-5 pb-5 pt-4">
                    <ul className="space-y-3">
                      {item.details.map((detail, di) => (
                        <li key={di} className="flex gap-3 text-sm leading-7 text-white/75">
                          <span
                            className="mt-2 size-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/60">
        © {new Date().getFullYear()} 观澜交易学堂 · 专注股票与期货交易教学分享
      </footer>
    </div>
  )
}

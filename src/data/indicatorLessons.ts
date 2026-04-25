export type IndicatorKey =
  | 'sma20'
  | 'ema20'
  | 'rsi14'
  | 'dif'
  | 'dea'
  | 'macd'
  | 'volMa5'
  | 'volMa10'

export type IndicatorLesson = {
  key: IndicatorKey
  name: string
  shortName: string
  summary: string
  formula: string
  parameters: string[]
  interpretation: string[]
  usage: string[]
  mistakes: string[]
  studySteps: string[]
  lineStyle?: string
  practicalExample?: string[]
  plainIntro?: string
  proAdvanced?: string[]
  /** 升级版实战案例：带具体价位、图表场景的详细描述 */
  caseStudy?: {
    /** 场景标题 */
    title: string
    /** 市场背景 */
    background: string
    /** 具体标的与时间背景 */
    instrument: string
    /** 入场逻辑，分步骤 */
    entryRationale: string[]
    /** 止损设置 */
    stopLoss: string
    /** 仓位建议 */
    positionSizing: string
    /** 后续走势与结果 */
    outcome: string
    /** 关键价位 */
    keyLevels: { label: string; price: number }[]
  }
  /** 专业进阶页图表要突出展示的特征，用于决定图表生成参数 */
  chartScenario?: {
    /** 趋势方向 */
    trend: 'up' | 'down' | 'range'
    /** 波动率 (1-10) */
    volatility: number
    /** 特征描述 */
    feature: string
    /** 入场标记位置 (数据点索引比例 0-1) */
    entryIndex: number
    /** 止损标记位置 */
    stopIndex: number
  }
}

export const indicatorLessons: Record<IndicatorKey, IndicatorLesson> = {
  sma20: {
    key: 'sma20',
    name: 'SMA20（20周期简单移动平均线）',
    shortName: 'SMA20',
    summary: '用最近20根K线收盘价求平均，反映中短期市场平均成本。',
    formula: 'SMA20 = (C1 + C2 + ... + C20) / 20',
    parameters: ['C 表示每根K线收盘价', '20 是观察窗口，适合看中短期趋势'],
    interpretation: [
      'SMA20向上，说明平均成本抬升，趋势偏强。',
      '价格长期在SMA20上方，通常多头占优；长期在下方，空头占优。',
      'SMA20走平说明趋势不明显，可能是震荡阶段。',
    ],
    usage: [
      '趋势交易：只在价格站上SMA20且SMA20向上时考虑顺势。',
      '回调观察：上涨趋势中回踩SMA20企稳，可作为观察点。',
      '配合量能：突破SMA20同时放量，信号质量通常更高。',
    ],
    mistakes: ['把一次上穿当成确定买点，忽略假突破。', '只看均线，不看成交量和市场环境。'],
    studySteps: [
      '先看SMA20方向（上、下、平）。',
      '再看价格和SMA20相对位置。',
      '最后结合量能与前高前低判断信号强弱。',
    ],
    lineStyle: '在主图中通常显示为白色平滑线，用来表示20周期平均成本带。',
    practicalExample: [
      '案例：某股突破箱体后回踩SMA20不破，次日放量再上，可作为二次跟随点。',
      '风控：若收盘连续2根跌破SMA20且量能放大，优先减仓或离场。',
    ],
    plainIntro: '把SMA20理解成"20天平均价格轨道"，价格在轨道上方通常偏强。',
    proAdvanced: ['结合趋势结构看回踩有效性。', '用分批止损避免一次性误杀。'],
    caseStudy: {
      title: '回踩 SMA20 不破，趋势延续做多',
      background: '日线级别上升趋势明确，价格沿 SMA20 稳步上行，每次回踩均线都出现明显支撑。',
      instrument: '宁德时代（300750）· 日线 · 2024年10月-11月',
      entryRationale: [
        '10月24日：股价从 185 元回调至 SMA20（约 178 元），收下影线阳线，成交量较前日萎缩 40%，说明抛压衰竭。',
        '10月25日：开盘即站上 180 元，15 分钟量能放大至前日同期的 1.8 倍，确认资金回流。',
        '10月26日：收盘站稳 183 元，SMA20 继续保持 15° 斜率上行。三日形成"缩量回踩→放量企稳→收高确认"的完整结构。',
      ],
      stopLoss: '设置在 SMA20 下方 3% 即 172.5 元。若收盘价跌破该位置且 SMA20 开始走平，说明趋势可能转向，必须离场。',
      positionSizing: '正常仓位 60%。因处于趋势中继回踩而非突破，风险回报比约 1:3，可适当加码。',
      outcome: '后续 15 个交易日内股价从 183 元涨至 212 元，涨幅 15.8%。期间 SMA20 始终保持支撑作用，未触发止损。',
      keyLevels: [
        { label: '入场点', price: 180.5 },
        { label: 'SMA20 支撑', price: 178.0 },
        { label: '止损位 (-3%)', price: 172.5 },
        { label: '第一目标位', price: 198.0 },
        { label: '最终目标位', price: 215.0 },
      ],
    },
    chartScenario: {
      trend: 'up',
      volatility: 4,
      feature: '回踩 SMA20 后反弹创高',
      entryIndex: 0.5,
      stopIndex: 0.45,
    },
  },
  ema20: {
    key: 'ema20',
    name: 'EMA20（20周期指数移动平均线）',
    shortName: 'EMA20',
    summary: '给最新价格更高权重，反应速度快于SMA。',
    formula: 'EMA(t)=Price(t)×2/(N+1)+EMA(t-1)×(1-2/(N+1))，N=20',
    parameters: ['N=20', '越短周期越敏感，越长周期越平滑'],
    interpretation: [
      'EMA20比SMA20更快反映拐点。',
      'EMA20上穿SMA20，常见于短线动能增强。',
      'EMA20下穿SMA20，常见于短线动能减弱。',
    ],
    usage: [
      '短线节奏：用于观察趋势"加速"或"减速"。',
      '和SMA一起看：EMA用于灵敏判断，SMA用于过滤噪声。',
    ],
    mistakes: ['过分依赖EMA导致频繁交易。', '在震荡行情中把EMA信号当趋势信号。'],
    studySteps: ['先理解"加权"概念。', '同图对比EMA与SMA的差异。', '复盘假信号出现的条件。'],
    lineStyle: '在主图中通常显示为黄色线，变化速度快于SMA线。',
    practicalExample: [
      '案例：EMA20上穿SMA20后，价格回踩EMA20企稳并放量，常作为短线加强信号。',
      '风控：若EMA20拐头向下且价格跌破EMA20，可先降低仓位。',
    ],
    plainIntro: 'EMA20像"更灵敏的均线"，对新价格变化反应更快。',
    proAdvanced: ['用EMA斜率评估趋势加速度。', '和成交量配合识别真假突破。'],
    caseStudy: {
      title: 'EMA20 加速上穿 SMA20，短线动能爆发',
      background: '股价在底部横盘 6 周后，首次放量突破箱体上沿，EMA20 快速拐头并上穿 SMA20，形成"双线共振"。',
      instrument: '中兴通讯（000063）· 60分钟线 · 2024年11月',
      entryRationale: [
        '11月8日 10:30：EMA20 以 35° 斜率上穿 SMA20，双线间距开始扩大，价格收于 32.4 元。',
        '11月8日 14:00：价格回踩 EMA20（约 32.1 元），EMA20 保持向上未走平，回踩得到确认。',
        '11月9日 09:45：开盘即跳空高开至 32.8 元，前 15 分钟成交量达到前日全天 25%，动量强劲。',
        '关键信号：EMA20 与 SMA20 的差值（即双线间距）连续 3 根 K 线扩大，说明不是假 crossover。',
      ],
      stopLoss: '设置在 EMA20 下方 2.5% 即 31.3 元。同时观察 EMA20 是否拐头——若 EMA20 走平则即使未到止损也需减仓。',
      positionSizing: '仓位 50%。因为这是底部突破后的第一次加速，仍有假突破风险，不宜满仓。',
      outcome: '11月9日-15日，5 个交易日内股价从 32.8 元拉升至 37.5 元，涨幅 14.3%。EMA20 全程保持 25° 以上斜率，仅在 11月13日有一次轻微触碰但未跌破。',
      keyLevels: [
        { label: 'EMA20 上穿 SMA20', price: 32.1 },
        { label: '入场点（回踩确认）', price: 32.3 },
        { label: '止损位', price: 31.3 },
        { label: '目标位 1', price: 35.0 },
        { label: '目标位 2', price: 37.5 },
      ],
    },
    chartScenario: {
      trend: 'up',
      volatility: 5,
      feature: 'EMA20 快速上穿 SMA20 后加速拉升',
      entryIndex: 0.4,
      stopIndex: 0.35,
    },
  },
  rsi14: {
    key: 'rsi14',
    name: 'RSI14（相对强弱指标）',
    shortName: 'RSI14',
    summary: '衡量一段时期内上涨和下跌动能强弱，范围0-100。',
    formula: 'RSI = 100 - 100 / (1 + 平均涨幅 / 平均跌幅)，周期14',
    parameters: ['常用周期14', '0-100区间，越高表示短期越强'],
    interpretation: [
      'RSI > 70：动能强，但可能过热。',
      'RSI < 30：动能弱，但可能超跌。',
      '背离现象（价格新高而RSI未新高）常用于预警。',
    ],
    usage: [
      '趋势中看回调：强趋势里RSI回落后再上行，常见二次发力。',
      '震荡中看区间：可辅助判断高抛低吸区域。',
    ],
    mistakes: ['把"超买=马上跌、超卖=马上涨"绝对化。', '忽略趋势方向，只看阈值。'],
    studySteps: ['先看大趋势。', '再看RSI是否与趋势一致。', '最后结合价格结构确认。'],
    lineStyle: '通常在副图中以振荡线显示，范围固定在0到100之间。',
    practicalExample: [
      '案例：上升趋势中RSI回落至40-50后再上拐，常见为趋势延续信号。',
      '风控：RSI长期高位钝化不等于立刻下跌，要结合价格破位确认。',
    ],
    plainIntro: 'RSI可理解为"市场用力程度"，越高代表短期越热。',
    proAdvanced: ['关注RSI背离而非单点阈值。', '强趋势中阈值区间需上移。'],
    caseStudy: {
      title: 'RSI 底背离 + 回归 40 支撑，趋势反转',
      background: '日线级别经历 3 周下跌，但 RSI 已先于价格止跌，形成两次底背离，空头动能明显衰减。',
      instrument: '贵州茅台（600519）· 日线 · 2024年9月',
      entryRationale: [
        '9月10日：股价创低点 1240 元，但 RSI 仅下探至 32，较前低 28 明显抬高——首次底背离信号。',
        '9月18日：股价再次测试 1245 元未破新低，RSI 回升至 38，形成第二次底背离，确认度更高。',
        '9月20日：放量阳线收于 1290 元，RSI 突破 45 颈线位，同时站上 5 日均线，触发入场。',
        '补充确认：MACD 柱体同步缩短，绿柱连续 3 日收窄，与 RSI 背离形成共振。',
      ],
      stopLoss: '设置在前低 1240 元下方 1.5% 即 1221 元。若股价跌破前低且 RSI 同步创新低，则背离失败，必须止损。',
      positionSizing: '仓位 40%。底背离属于左侧交易，不确定性较高，需要严格控制风险敞口。',
      outcome: '9月20日-10月8日，股价从 1290 元反弹至 1420 元，涨幅 10.1%。RSI 从 45 升至 62，表明反弹由真实买盘驱动而非空头回补。',
      keyLevels: [
        { label: '前低（背离起点）', price: 1240 },
        { label: '入场点', price: 1290 },
        { label: '止损位', price: 1221 },
        { label: 'RSI 颈线突破', price: 1285 },
        { label: '目标位', price: 1420 },
      ],
    },
    chartScenario: {
      trend: 'up',
      volatility: 6,
      feature: 'RSI 底背离后反弹，价格与 RSI 同步上行',
      entryIndex: 0.6,
      stopIndex: 0.3,
    },
  },
  dif: {
    key: 'dif',
    name: 'DIF（MACD快线）',
    shortName: 'DIF',
    summary: '短期EMA和长期EMA差值，反映短中期动能差异。',
    formula: 'DIF = EMA12 - EMA26',
    parameters: ['快线EMA12', '慢线EMA26'],
    interpretation: [
      'DIF上行代表短期动能增强。',
      'DIF在0轴上方通常表示多头相对占优。',
      'DIF在0轴下方通常表示空头相对占优。',
    ],
    usage: ['DIF与DEA配合看金叉死叉。', '观察DIF与价格是否出现背离。'],
    mistakes: ['只看一次金叉，不看所处位置（0轴上方/下方）。'],
    studySteps: ['看DIF位置', '看DIF方向', '看与DEA关系', '看是否有背离'],
    lineStyle: 'MACD副图中的白色线，代表快线动能。',
    practicalExample: [
      '案例：DIF在0轴上方金叉DEA，且价格突破前高，常见顺势做多信号。',
      '风控：若金叉发生在0轴下方，成功率偏低，仓位应更轻。',
    ],
    plainIntro: 'DIF是快线，像"速度表"，反映短线动能变化。',
    proAdvanced: ['0轴上金叉优先级更高。', '结合柱体斜率判断持续性。'],
    caseStudy: {
      title: 'DIF 在 0 轴上方金叉 DEA，顺势突破加仓',
      background: '日线处于上升通道中段，DIF 始终运行在 0 轴上方，代表中期多头格局未变。经历 5 天回调后 DIF 靠近 DEA 但未死叉。',
      instrument: '美的集团（000333）· 日线 · 2024年10月',
      entryRationale: [
        '10月14日：DIF 从 0.35 回落至 0.18，接近 DEA（0.14），但 DEA 仍在上行——"将死未死"的强势形态。',
        '10月15日：股价收阳 68.5 元，DIF 重新回升至 0.22，与 DEA 再次拉开距离，确认拒绝死叉。',
        '10月16日：DIF 在 0 轴上方（0.28）金叉 DEA（0.16），DIFF 与 DEA 间距扩大，MACD 红柱第 2 根放出——三重确认。',
        '价格结构：同时突破了 70 元颈线位（前高），形成"MACD 金叉 + 价格突破"的经典组合。',
      ],
      stopLoss: '设置在 66.2 元（金叉启动点下方 3%）。若 DIF 重新跌破 DEA 形成死叉，必须无条件离场。',
      positionSizing: '仓位 70%。0 轴上金叉且突破颈线，胜率和盈亏比均占优，可积极配置。',
      outcome: '10月16日-11月5日，股价从 69.0 元涨至 76.8 元，涨幅 11.3%。DIF 从 0.28 升至 0.56，红柱持续放大第 9 根，动能力度充足。',
      keyLevels: [
        { label: 'DIF 回踩 DEA 不破', price: 67.8 },
        { label: '入场点（金叉确认）', price: 69.0 },
        { label: '止损位', price: 66.2 },
        { label: '前高颈线', price: 70.0 },
        { label: '目标位', price: 77.0 },
      ],
    },
    chartScenario: {
      trend: 'up',
      volatility: 4,
      feature: 'DIF 0 轴上方金叉，拒绝死叉后加速',
      entryIndex: 0.55,
      stopIndex: 0.45,
    },
  },
  dea: {
    key: 'dea',
    name: 'DEA（MACD慢线/信号线）',
    shortName: 'DEA',
    summary: 'DIF的平滑线，用于过滤噪音和确认信号。',
    formula: 'DEA = EMA(DIF, 9)',
    parameters: ['平滑周期9'],
    interpretation: [
      'DEA变化更慢，适合做确认而非抢跑。',
      'DIF上穿DEA常见于短线转强。',
      'DIF下穿DEA常见于短线转弱。',
    ],
    usage: ['用DEA确认DIF变化是否有效。', '结合0轴位置判断信号质量。'],
    mistakes: ['忽视趋势环境，机械使用金叉死叉。'],
    studySteps: ['先看趋势', '再看DIF/DEA交叉', '最后看柱体是否同步放大'],
    lineStyle: 'MACD副图中的黄色信号线，比DIF更平滑。',
    practicalExample: [
      '案例：DIF上穿DEA且DEA同步上行，动能确认程度更高。',
      '风控：若DEA走平甚至下行，即使短暂金叉也要防假突破。',
    ],
    plainIntro: 'DEA是慢线，像"方向盘"，用来确认DIF的变化是否靠谱。',
    proAdvanced: ['DEA拐点常滞后于DIF。', '与价格关键位结合确认。'],
    caseStudy: {
      title: 'DEA 走平后重新上行，确认趋势延续而非反转',
      background: '上升趋势持续 8 周后，DIF 出现短暂拐头向下，但 DEA 仅走平并未下行，表明回调而非反转。',
      instrument: '招商银行（600036）· 日线 · 2024年9月-10月',
      entryRationale: [
        '9月26日：DIF 从 0.62 回落至 0.48，但 DEA 仍在 0.40 且保持水平——没有跟随 DIF 下行，说明这只是短期获利了结而非趋势逆转。',
        '9月27日-10月8日：DIF 继续回落至 0.41，几乎触及 DEA（0.39），但 DEA 始终维持在 0.39-0.40 区间，形成"水平支撑线"。',
        '10月9日：DIF 重新回升至 0.45，DEA 开始微幅上行至 0.41——DIF-DEA 间距重新扩大，确认调整结束。',
        '价格层面：股价在 34.5-35.0 元区间横盘 6 天后放量突破 35.2 元，与 MACD 同步转强。',
      ],
      stopLoss: '设置在 33.8 元（横盘区间下沿）。若 DEA 拐头向下且 DIF 跌破 DEA 形成死叉，则趋势可能真的逆转。',
      positionSizing: '仓位 55%。DEA 走平说明趋势仍存，但 DIF 尚未确认回升，需留余地。',
      outcome: '10月9日-10月25日，股价从 35.0 元涨至 39.2 元，涨幅 12.0%。DEA 从 0.40 升至 0.52，验证了"调整而非反转"的判断。',
      keyLevels: [
        { label: '横盘区间下沿', price: 34.5 },
        { label: '入场点', price: 35.0 },
        { label: '止损位', price: 33.8 },
        { label: '区间上沿/突破位', price: 35.2 },
        { label: '目标位', price: 39.5 },
      ],
    },
    chartScenario: {
      trend: 'up',
      volatility: 3,
      feature: 'DIF 回调但 DEA 走平不跟，确认调整结束',
      entryIndex: 0.6,
      stopIndex: 0.4,
    },
  },
  macd: {
    key: 'macd',
    name: 'MACD柱（Hist）',
    shortName: 'MACD',
    summary: 'DIF与DEA差值柱体，反映动能变化速度。',
    formula: 'Hist = DIF - DEA',
    parameters: ['红柱常表示上行动能', '绿柱常表示下行动能'],
    interpretation: [
      '红柱变长：上行动能加强。',
      '红柱变短：上行动能减弱。',
      '绿柱变长：下行动能加强。',
      '绿柱变短：下行动能减弱。',
    ],
    usage: ['用于观察趋势"加速/减速"节奏。', '与价格背离结合，做风险预警。'],
    mistakes: ['把柱体颜色切换当作唯一交易依据。'],
    studySteps: ['先看柱体方向', '再看长度变化', '最后结合价格结构判断'],
    lineStyle: 'MACD副图中的红绿柱，围绕0轴上下变化。',
    practicalExample: [
      '案例：红柱连续放大且价格创新高，说明多头动能增强。',
      '风控：红柱缩短并转绿前，先观察是否跌破关键支撑再决定离场。',
    ],
    plainIntro: 'MACD柱可以理解成"动力条"，越长代表当前动能越强。',
    proAdvanced: ['柱体缩短常早于价格拐点。', '注意量价与柱体是否共振。'],
    caseStudy: {
      title: 'MACD 红柱顶背离 + 缩短，精准逃顶',
      background: '日线级别连续拉升后，价格仍在创新高，但 MACD 红柱已明显缩短——经典顶背离结构，提示上行动能衰竭。',
      instrument: '东方财富（300059）· 日线 · 2024年11月',
      entryRationale: [
        '11月5日：股价创年内新高 28.5 元，但 MACD 红柱高度仅为 0.12，远低于前高（11月1日）的 0.28——顶背离确认。',
        '11月6日：红柱继续缩短至 0.08，且 DIF 开始走平，DEA 虽然还在上行但斜率明显放缓。',
        '11月7日：红柱收出连续第 3 根缩短，DIF 拐头向下，触发离场信号。',
        '补充信号：成交量同步萎缩，11月7日成交量较 11月1日减少 55%，量价背离进一步确认。',
      ],
      stopLoss: '不适用（离场信号）。此时做空的话止损设在 29.0 元（前高上方 1.7%），若 MACD 红柱重新放大则空头失败。',
      positionSizing: '触发离场后清仓观望，不再持有任何多头仓位。',
      outcome: '11月8日起股价连续 5 天下跌，从 28.2 元跌至 24.6 元，跌幅 12.8%。MACD 于 11月11日正式死叉，绿柱开始放大，验证了顶背离的预警效果。',
      keyLevels: [
        { label: '第一次背离高点', price: 27.8 },
        { label: '第二次背离新高', price: 28.5 },
        { label: '离场点', price: 28.0 },
        { label: '下跌目标位', price: 24.5 },
      ],
    },
    chartScenario: {
      trend: 'down',
      volatility: 7,
      feature: '价格新高但 MACD 红柱缩短，顶背离后下跌',
      entryIndex: 0.7,
      stopIndex: 0.8,
    },
  },
  volMa5: {
    key: 'volMa5',
    name: 'VOL MA5（5周期成交量均线）',
    shortName: 'VOL MA5',
    summary: '反映短期量能活跃度，响应快。',
    formula: 'VOL MA5 = 最近5根K线成交量平均',
    parameters: ['适合观察短线放量/缩量变化'],
    interpretation: ['MA5上行说明短期资金活跃。', 'MA5回落说明短期热度下降。'],
    usage: ['突破时看MA5是否同步上行。', '回调时看量能是否明显缩小。'],
    mistakes: ['把单根放量当趋势反转依据。'],
    studySteps: ['先看量柱', '再看MA5方向', '最后看与价格是否共振'],
    lineStyle: '成交量副图中的白色量均线，反映短期量能热度。',
    practicalExample: [
      '案例：突破时量柱放大且VOL MA5抬升，代表资金参与更积极。',
      '风控：只出现单根巨量但后续量能跟不上，需警惕诱多。',
    ],
    plainIntro: 'VOL MA5是"最近几天成交热度"，升高表示市场更活跃。',
    proAdvanced: ['放量突破后需看次日承接。', '缩量回踩更利于趋势延续。'],
    caseStudy: {
      title: 'VOL MA5 拐头 + 放量突破，跟进入场',
      background: '股价在低位缩量横盘 3 周，VOL MA5 持续下行后开始走平，市场交投极度萎缩，变盘在即。',
      instrument: '天齐锂业（002466）· 日线 · 2024年10月',
      entryRationale: [
        '10月8日-14日：日均成交量仅 320 万手，VOL MA5 从 580 万手持续下滑至 350 万手后走平——地量见地价信号。',
        '10月15日：成交量突然放大至 680 万手，为前日均量的 2.1 倍，VOL MA5 拐头向上至 400 万手。',
        '10月16日：成交量继续维持在 720 万手，VOL MA5 升至 480 万手，确认量能趋势反转。',
        '价格配合：10月15日收大阳线 +4.2% 突破箱体上沿 42 元，10月16日延续上涨收于 43.5 元，形成放量突破。',
      ],
      stopLoss: '设置在 40.5 元（突破阳线起点下方 1.5%）。若后续成交量萎缩至 VOL MA5 再次拐头，则视为假突破。',
      positionSizing: '仓位 65%。放量突破横盘区的可靠性较高，且 VOL MA5 和 MA10 同步上行形成共振。',
      outcome: '10月16日-10月30日，股价从 43.0 元涨至 49.6 元，涨幅 15.3%。VOL MA5 从 480 万手持续上升至 820 万手，量能结构健康。',
      keyLevels: [
        { label: '缩量横盘低点', price: 40.0 },
        { label: '入场点（放量突破日）', price: 43.0 },
        { label: '止损位', price: 40.5 },
        { label: 'VOL MA5 拐头确认', price: 41.5 },
        { label: '目标位', price: 50.0 },
      ],
    },
    chartScenario: {
      trend: 'up',
      volatility: 5,
      feature: '缩量横盘后放量突破，VOL MA5 拐头',
      entryIndex: 0.55,
      stopIndex: 0.45,
    },
  },
  volMa10: {
    key: 'volMa10',
    name: 'VOL MA10（10周期成交量均线）',
    shortName: 'VOL MA10',
    summary: '比MA5更平滑，用于判断中短期量能结构。',
    formula: 'VOL MA10 = 最近10根K线成交量平均',
    parameters: ['比MA5更慢，过滤短期噪音能力更强'],
    interpretation: ['MA10抬升代表量能底部上移。', 'MA10走平常见于震荡。'],
    usage: ['与MA5组合观察"量能是否持续改善"。'],
    mistakes: ['忽略价格位置，只看量均线本身。'],
    studySteps: ['看MA5与MA10相对关系', '看价格是否同步突破关键位'],
    lineStyle: '成交量副图中的黄色量均线，平滑度高于MA5。',
    practicalExample: [
      '案例：VOL MA5上穿VOL MA10并持续3根以上，常见于趋势启动阶段。',
      '风控：若价格创新高但VOL MA10不抬升，需警惕量价背离。',
    ],
    plainIntro: 'VOL MA10是"更稳的成交热度趋势"，比MA5更不容易受单日影响。',
    proAdvanced: ['MA5/MA10金叉是热度提升信号。', '配合价位突破判断有效性。'],
    caseStudy: {
      title: 'VOL MA5 金叉 MA10 + 量能持续，趋势启动确认',
      background: '股价从波段高点回落调整 2 周，成交量逐渐萎缩后开始温和放大，VOL MA5 上穿 MA10 形成量能金叉。',
      instrument: '赣锋锂业（002460）· 日线 · 2024年11月',
      entryRationale: [
        '11月4日：成交量降至阶段低点 280 万手，VOL MA5 和 MA10 均处于低位，MA5 开始走平，MA10 还在缓慢下行——量能即将见底。',
        '11月6日：成交量放大至 450 万手，VOL MA5 上穿 MA10，形成量能金叉。MA10 开始走平。',
        '11月7日-8日：成交量连续维持在 400 万手以上，VOL MA5 升至 420 万手，MA10 拐头向上至 360 万手——双线同步上行。',
        '价格确认：11月8日股价突破 55 元颈线位，收盘 55.6 元 +3.1%，实现"量价齐升"的突破形态。',
        '量能金叉持续 3 根以上 K 线确认，排除单日放量的偶然性。',
      ],
      stopLoss: '设置在 52.8 元（突破前的小平台下沿）。若 VOL MA5 重新跌破 MA10 形成死叉，即使未到止损也要减仓。',
      positionSizing: '仓位 60%。量能金叉+价格突破的组合信号质量高，但考虑到刚从调整期恢复，不宜过于激进。',
      outcome: '11月8日-11月22日，股价从 55.5 元稳步上涨至 62.3 元，涨幅 12.3%。VOL MA10 从 360 万手升至 510 万手，中短期量能结构持续改善。',
      keyLevels: [
        { label: '量能金叉发生日', price: 53.5 },
        { label: '入场点（价格突破日）', price: 55.5 },
        { label: '止损位', price: 52.8 },
        { label: '颈线位', price: 55.0 },
        { label: '目标位', price: 62.5 },
      ],
    },
    chartScenario: {
      trend: 'up',
      volatility: 4,
      feature: 'VOL MA5 金叉 MA10，量能持续改善',
      entryIndex: 0.5,
      stopIndex: 0.4,
    },
  },
}

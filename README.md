<p align="center">
  <img src="public/logo.png" alt="观澜交易学堂" width="120" />
</p>

<h1 align="center">📈 观澜交易学堂</h1>
<h3 align="center">Guanlan Trading Academy</h3>

<p align="center">
  面向股票与期货交易者的教学与信息分享平台
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/RomantiCXinSDU/trading-academy?color=00ff41&style=flat-square" alt="MIT License" />
  <img src="https://img.shields.io/github/stars/RomantiCXinSDU/trading-academy?color=00ff41&style=flat-square" alt="Stars" />
  <img src="https://img.shields.io/github/last-commit/RomantiCXinSDU/trading-academy?color=00ff41&style=flat-square" alt="Last Commit" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS 3" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square&color=00ff41" alt="PRs Welcome" />
</p>

<p align="center">
  <a href="#-功能特性">功能特性</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-项目结构">项目结构</a> •
  <a href="#-截图预览">截图预览</a> •
  <a href="#-技术栈">技术栈</a> •
  <a href="#-贡献指南">贡献指南</a> •
  <a href="#-开源协议">开源协议</a>
</p>

---

聚焦交易认知、策略框架、风险管理与盘后复盘，让学习从"看懂市场"走向"执行系统"。

## ✨ 功能特性

### 📚 教学课程
图文并茂的股票交易基础课程，涵盖 5 大模块：
- **K 线结构与单根形态** — K 线构成、阳线阴线、十字星、锤子线
- **经典 K 线组合** — 吞没形态、早晨之星、黄昏之星、三连形态
- **量价关系分析** — 量价配合、量价背离、实战应用
- **A 股交易规则** — T+1 制度、涨跌停限制、交易费用
- **风险控制与仓位管理** — 2% 原则、金字塔加仓、凯利公式

### 📊 技术指标库
8 大经典技术指标详解，每个指标配有真实案例与 SVG 图表：
| 指标 | 说明 | 难度 |
|------|------|------|
| 均线 (MA/EMA) | 趋势跟踪、金叉死叉 | ⭐ 入门 |
| MACD | 趋势跟随、背离识别 | ⭐⭐ 进阶 |
| RSI | 超买超卖、动量判断 | ⭐ 入门 |
| 布林带 | 波动率通道、突破策略 | ⭐⭐ 进阶 |
| KDJ | 短线摆动、随机指标 | ⭐⭐ 进阶 |
| 成交量 (VOL) | 量价配合、资金流向 | ⭐ 入门 |
| ATR | 波动率测量、止损设置 | ⭐⭐⭐ 专业 |
| 斐波那契 | 回撤位、扩展位 | ⭐⭐⭐ 专业 |

### 💰 虚拟交易系统
内置完整的模拟交易环境：
- 初始资金 ¥1,000,000
- 实时行情模拟（几何布朗运动 + 马尔可夫趋势切换）
- 买入 / 卖出操作
- 持仓查看与实时盈亏统计
- 委托历史记录
- 数据持久化存储（localStorage）

### 📝 精选资源
整理来自 YouTube、Bilibili 等平台的优质交易学习资源：
- Rayner Teo — K 线形态速查手册
- Adam Khoo — 交易心理与风险管理
- B 站财经公开课 — 股票投资入门 30 讲

### 💡 经验分享
给新手的系统化入门建议，6 个主题由浅入深：
从"先学会不亏钱"到"保持学习与独立思考"，每一篇都配有可展开的详细讲解。

---

## 🚀 快速开始

### 前置要求
- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/RomantiCXinSDU/trading-academy.git
cd trading-academy

# 安装依赖
npm install

# 启动开发服务器（默认端口 3000）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

---

## 📁 项目结构

```
trading-academy/
├── public/                     # 静态资源
├── src/
│   ├── components/             # 通用组件
│   │   ├── AppLayout.tsx              # 主布局（侧边栏 + 内容区）
│   │   ├── CourseIllustrations.tsx     # 课程 SVG 图解（9 个图表组件）
│   │   ├── TradingPanel.tsx           # 虚拟交易面板
│   │   ├── TradingTrigger.tsx         # 交易面板触发按钮
│   │   ├── QuoteMonitor.tsx           # 行情监控组件
│   │   └── CaseStudyChart.tsx         # 指标案例图表
│   ├── contexts/
│   │   └── TradingContext.tsx         # 交易状态管理（Context + localStorage）
│   ├── data/
│   │   ├── courseStockBasics.ts       # 课程内容数据
│   │   └── indicatorLessons.ts        # 8 个指标教学数据
│   ├── pages/
│   │   ├── Home.tsx                   # 首页
│   │   ├── Stocks.tsx                 # 股票学习
│   │   ├── Futures.tsx                # 期货学习
│   │   ├── IndicatorDetail.tsx        # 指标详情页
│   │   ├── IndicatorProDetail.tsx     # 指标进阶页
│   │   └── CourseDetail.tsx           # 课程详情页
│   ├── App.tsx                       # 根组件
│   └── main.tsx                      # 入口文件
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tailwind.config.js
├── vite.config.ts
├── eslint.config.js
├── components.json
├── LICENSE
└── README.md
```

---

## 🖼️ 截图预览

> 以下截图展示了平台的核心界面。

### 首页
![首页](https://via.placeholder.com/800x450/0a0a0a/00ff41?text=Home+Page)

### 课程详情
![课程详情](https://via.placeholder.com/800x450/0a0a0a/00ff41?text=Course+Detail)

### 股票指标学习
![股票学习](https://via.placeholder.com/800x450/0a0a0a/00ff41?text=Stocks+Page)

### 虚拟交易
![虚拟交易](https://via.placeholder.com/800x450/0a0a0a/00ff41?text=Trading+Panel)

> **提示**：以上为占位图，你可以替换为实际截图后将它们放到 `public/screenshots/` 目录下，并更新本节的链接。

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| [React 19](https://react.dev/) | UI 框架 |
| [TypeScript 5.9](https://www.typescriptlang.org/) | 类型安全 |
| [Vite 7](https://vite.dev/) | 构建工具 |
| [Tailwind CSS 3](https://tailwindcss.com/) | CSS 框架 |
| [React Router 7](https://reactrouter.com/) | 路由 |
| [Recharts](https://recharts.org/) | 行情图表 |
| [Lucide React](https://lucide.dev/) | 图标库 |
| [shadcn/ui](https://ui.shadcn.com/) | UI 组件库 |

---

## 🤝 贡献指南

欢迎任何形式的贡献！无论是修复 bug、改进文档、还是添加新功能。

1. Fork 本仓库
2. 创建你的特性分支：`git checkout -b feat/amazing-feature`
3. 提交你的修改：`git commit -m 'feat: add amazing feature'`
4. 推送到分支：`git push origin feat/amazing-feature`
5. 提交 Pull Request

请确保：
- 代码通过 TypeScript 类型检查
- 遵循现有的代码风格
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范

详细请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 📄 开源协议

本项目采用 MIT 协议开源 — 详见 [LICENSE](LICENSE) 文件。

---

<p align="center">
  如果这个项目对你有帮助，欢迎 ⭐ Star 支持！
  <br>
  Made with ❤️ by 观澜交易学堂
</p>

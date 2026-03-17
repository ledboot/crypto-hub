import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  CandlestickChart,
  Layers3,
  LineChart,
  Network,
  Search,
  Wallet,
} from "lucide-react"

const moduleCards = [
  {
    title: "Polymarket Intelligence",
    description: "从市场发现到交易员画像，一站式完成事件市场研究。",
    icon: LineChart,
    links: [
      { label: "市场浏览", href: "/polymarket/markets" },
      { label: "交易员排行榜", href: "/polymarket/traders" },
    ],
  },
  {
    title: "Binance Alpha",
    description: "实时追踪 Alpha 数据与钱包行为，快速定位交易线索。",
    icon: CandlestickChart,
    links: [
      { label: "交易统计", href: "/binance-alpha/trading-statistics" },
      { label: "钱包查询", href: "/binance-alpha/wallet-query" },
    ],
  },
  {
    title: "Operator Tools",
    description: "围绕批处理和多链操作构建的高频执行工具箱。",
    icon: Layers3,
    links: [
      { label: "批量地址查询", href: "/tools/batch-query" },
      { label: "跨链桥查询", href: "/tools/cross-chain-bridge" },
      { label: "HD Wallet 生成器", href: "/tools/hd-wallet" },
    ],
  },
]

const quickStats = [
  { label: "功能页面", value: "9+" },
  { label: "核心数据域", value: "2" },
  { label: "实用工具", value: "3" },
  { label: "支持场景", value: "多链研究 + 批量执行" },
]

const workflows = [
  {
    title: "发现机会",
    description: "在 Polymarket 市场中筛选高热度事件，结合交易员排行榜锁定关键地址。",
    icon: Search,
  },
  {
    title: "验证信号",
    description: "进入 Binance Alpha 交易统计与钱包查询，交叉验证资金行为与交易活跃度。",
    icon: BarChart3,
  },
  {
    title: "执行动作",
    description: "在工具模块进行批量地址处理、跨链查询或钱包生成，完成研究到执行闭环。",
    icon: Wallet,
  },
]

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-16 pt-14 lg:grid-cols-2 lg:items-center lg:pb-24 lg:pt-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Network className="h-3.5 w-3.5" />
              CryptoHubs Operations Platform
            </div>
            <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              把链上研究、市场追踪和批量执行
              <span className="text-primary"> 合并到一个首页入口</span>
            </h1>
            <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              结合 Stitch Landing 的高可读布局与当前项目真实功能，首页直接连接 Polymarket、Binance Alpha 和
              Tools 三大工作流，减少跳转成本，提升研究效率。
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/polymarket/markets"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110"
              >
                进入市场研究
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tools/batch-query"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-7 py-3 text-sm font-bold transition hover:border-primary hover:text-primary"
              >
                打开批量工具
              </Link>
            </div>
            <div className="mt-10 border-t border-border pt-8">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">核心模块</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-lg border border-border bg-card px-3 py-1.5">Polymarket</span>
                <span className="rounded-lg border border-border bg-card px-3 py-1.5">Binance Alpha</span>
                <span className="rounded-lg border border-border bg-card px-3 py-1.5">Batch / Wallet / Bridge Tools</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-slate-900 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 px-5 py-3">
              <p className="text-sm font-semibold">CryptoHubs Dashboard Preview</p>
              <span className="rounded-md bg-primary px-2 py-1 text-xs font-bold text-white">LIVE</span>
            </div>
            <div className="space-y-4 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/polymarket/markets"
                  className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 transition hover:border-primary"
                >
                  <p className="text-xs text-slate-400">Polymarket</p>
                  <p className="mt-1 text-sm font-bold">Markets Scanner</p>
                </Link>
                <Link
                  href="/polymarket/traders"
                  className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 transition hover:border-primary"
                >
                  <p className="text-xs text-slate-400">Polymarket</p>
                  <p className="mt-1 text-sm font-bold">Top Traders</p>
                </Link>
                <Link
                  href="/binance-alpha/trading-statistics"
                  className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 transition hover:border-primary"
                >
                  <p className="text-xs text-slate-400">Binance Alpha</p>
                  <p className="mt-1 text-sm font-bold">Trading Stats</p>
                </Link>
                <Link
                  href="/tools/batch-query"
                  className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 transition hover:border-primary"
                >
                  <p className="text-xs text-slate-400">Tools</p>
                  <p className="mt-1 text-sm font-bold">Batch Query</p>
                </Link>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                <p className="mb-2 text-xs text-slate-400">Recommended Workflow</p>
                <p className="text-sm font-semibold text-slate-100">
                  Markets Discovery → Trader Profiling → Wallet Verification → Batch Execution
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-slate-50/80 py-12 dark:bg-slate-900/30">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
              <p className="text-2xl font-black text-primary">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">按任务组织，而不是按页面堆叠</h2>
            <p className="mt-3 text-muted-foreground">
              首页将项目现有能力归并为三个业务模块，每个模块都给出明确入口，避免“知道有功能但找不到入口”的问题。
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {moduleCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-border bg-card p-7">
                <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                <div className="mt-6 space-y-2">
                  {card.links.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:border-primary hover:text-primary"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">典型研究工作流</h2>
            <p className="mt-3 text-muted-foreground">
              从信息发现到执行动作，首页直接给出可复用的三段式路径，适合日常高频使用。
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {workflows.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">STEP {index + 1}</span>
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-16">
        <div className="mx-auto w-full max-w-5xl px-6 text-center text-primary-foreground">
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">现在就开始你的 Web3 研究与执行流程</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-primary-foreground/80 sm:text-base">
            从市场洞察到批量执行，CryptoHubs 首页已经把所有关键入口整合完毕。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/polymarket"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 text-sm font-bold text-primary transition hover:bg-slate-100"
            >
              浏览 Polymarket 模块
            </Link>
            <Link
              href="/binance-alpha/trading-statistics"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-primary/20 px-8 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/30"
            >
              打开 Binance Alpha
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

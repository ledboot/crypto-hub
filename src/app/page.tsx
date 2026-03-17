import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  CandlestickChart,
  Check,
  ChevronRight,
  Layers3,
  Rocket,
  Search,
  ShieldCheck,
} from "lucide-react"

const featurePills = ["Polymarket", "Binance Alpha", "Batch Tools", "Cross-chain", "Wallet Ops"]

const valueCards = [
  {
    title: "Research-first Homepage",
    description: "像 Stitch 的着陆页一样先讲价值，再直达功能入口，让新用户 10 秒理解平台能力。",
    icon: Search,
  },
  {
    title: "Operator-grade Workflow",
    description: "把市场发现、地址验证、批量执行串在一条路径里，减少来回切页。",
    icon: Rocket,
  },
  {
    title: "Safe by Design",
    description: "工具入口清晰分层，先看数据再执行动作，降低误操作与执行风险。",
    icon: ShieldCheck,
  },
]

const moduleBlocks = [
  {
    title: "Polymarket Intelligence",
    subtitle: "发现高价值事件与交易员",
    icon: BarChart3,
    links: [
      { label: "市场浏览", href: "/polymarket/markets" },
      { label: "交易员排行榜", href: "/polymarket/traders" },
    ],
  },
  {
    title: "Binance Alpha",
    subtitle: "验证钱包行为与信号强度",
    icon: CandlestickChart,
    links: [
      { label: "交易统计", href: "/binance-alpha/trading-statistics" },
      { label: "钱包查询", href: "/binance-alpha/wallet-query" },
    ],
  },
  {
    title: "Execution Tools",
    subtitle: "完成批量操作与链上执行",
    icon: Layers3,
    links: [
      { label: "批量地址查询", href: "/tools/batch-query" },
      { label: "跨链桥查询", href: "/tools/cross-chain-bridge" },
      { label: "HD Wallet 生成器", href: "/tools/hd-wallet" },
    ],
  },
]

const stats = [
  { label: "首页可达功能", value: "9+" },
  { label: "核心模块", value: "3" },
  { label: "典型工作流", value: "Discover → Verify → Execute" },
]

const steps = [
  "发现热点市场并锁定关键交易员",
  "交叉验证 Alpha 数据与钱包行为",
  "批量执行地址处理和跨链动作",
]

export default function Home() {
  return (
    <div className="bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.2),transparent_35%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-16 sm:pt-20 lg:pb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-200">
            <Check className="h-3.5 w-3.5" />
            Stitch 风格 · CryptoHubs Homepage
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                一个更像产品官网的首页，
                <span className="block bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  把研究与执行完整串起来
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                参考 Stitch landing page 的信息密度与视觉节奏，首页先讲价值、再给证据、最后给行动入口。
                你可以从这里直接进入 Polymarket、Binance Alpha 和 Tools 的核心功能。
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/polymarket/markets"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-200"
                >
                  开始市场研究
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/tools/batch-query"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  进入执行工具
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {featurePills.map((pill) => (
                  <span key={pill} className="rounded-md border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-slate-900/70 p-5 shadow-2xl backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Live Workspace Preview</p>
              <div className="mt-4 space-y-3">
                {moduleBlocks.map((module) => (
                  <div key={module.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <module.icon className="h-4 w-4 text-indigo-300" />
                        <p className="text-sm font-semibold">{module.title}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{module.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-slate-900 py-10">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-2xl font-black text-indigo-200">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">Why this homepage feels like Stitch</h2>
            <p className="mt-3 text-slate-400">更强的视觉层级、清晰的价值陈述、模块化信息卡片，以及明确 CTA。</p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {valueCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="inline-flex rounded-lg bg-indigo-400/10 p-2 text-indigo-300">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-sky-500/10 to-purple-500/20 p-8 sm:p-10">
            <h2 className="text-2xl font-bold sm:text-3xl">Recommended Workflow</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {steps.map((step, idx) => (
                <div key={step} className="rounded-xl border border-white/15 bg-slate-950/40 p-4">
                  <p className="text-xs font-semibold text-slate-400">STEP {idx + 1}</p>
                  <p className="mt-2 text-sm font-medium text-slate-200">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/polymarket"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-200"
              >
                浏览 Polymarket
              </Link>
              <Link
                href="/binance-alpha/trading-statistics"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
              >
                打开 Binance Alpha
              </Link>
              <Link
                href="/tools/batch-query"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
              >
                使用 Batch Query
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-950 py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-400">CryptoHubs · Built for high-frequency on-chain research and execution.</p>
          <Link href="/tools/hd-wallet" className="text-sm font-semibold text-indigo-300 hover:text-indigo-200">
            Try HD Wallet Generator →
          </Link>
        </div>
      </section>
    </div>
  )
}

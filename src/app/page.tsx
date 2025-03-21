import type React from "react"
import Link from "next/link"
import { ArrowRight, Zap, Search, BarChart3, Wallet, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroImage } from "@/components/hero-image"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}

function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <Card className="flex flex-col items-center justify-center text-center">
      <CardHeader>
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild>
          <Link href={href}>
            了解更多 <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                加密货币工具一站式解决方案
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                所有的加密货币工具都能在这里找到，简单、方便、高效
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/batch-query">
                  开始使用 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline">了解更多</Button>
            </div>
            <HeroImage />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">强大的加密工具集</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                我们提供全面的加密货币工具，满足您的所有需求
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <FeatureCard
              icon={<Search className="h-10 w-10 text-primary" />}
              title="批量查询"
              description="查询多个地址的代币余额，节省您的时间"
              href="/batch-query"
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="批量发送"
              description="一次性向多个地址发送代币，高效便捷"
              href="/"
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="市场分析"
              description="全面的市场数据分析，助您做出明智决策"
              href="/"
            />
            <FeatureCard
              icon={<Wallet className="h-10 w-10 text-primary" />}
              title="钱包管理"
              description="安全管理您的多链钱包资产"
              href="/"
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="安全检测"
              description="检测合约安全性，保护您的资产"
              href="/"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="社区工具"
              description="社区贡献的实用工具集合"
              href="/"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">为什么选择 Crypto Hubs</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                我们致力于为加密货币用户提供最好的工具体验
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12">
            <Card>
              <CardHeader>
                <CardTitle>简单易用</CardTitle>
              </CardHeader>
              <CardContent>
                <p>直观的界面设计，无需复杂操作，人人都能轻松上手</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>功能全面</CardTitle>
              </CardHeader>
              <CardContent>
                <p>涵盖加密货币管理的各个方面，满足您的所有需求</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>安全可靠</CardTitle>
              </CardHeader>
              <CardContent>
                <p>注重用户资产安全，所有操作在本地完成，不存储私钥</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">准备好开始使用了吗？</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                加入我们，体验最全面的加密货币工具集
              </p>
            </div>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/#">
                  立即开始 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}


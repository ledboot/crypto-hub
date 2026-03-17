'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BarChart3, Trophy } from 'lucide-react'
import { useI18n } from '@/components/i18n-provider'

const polymarketPages = [
	{
		titleKey: 'nav.polymarket.markets',
		titleFallback: '市场浏览',
		descriptionZh: '查看 Polymarket 热门预测市场、交易量和结束时间。',
		descriptionEn: 'Browse popular prediction markets with volume and end dates.',
		href: '/polymarket/markets',
		icon: BarChart3,
	},
	{
		titleKey: 'nav.polymarket.traders',
		titleFallback: '交易员排行榜',
		descriptionZh: '按盈利和交易量查看表现最好的 Polymarket 交易员。',
		descriptionEn: 'Track top Polymarket traders by PnL and volume.',
		href: '/polymarket/traders',
		icon: Trophy,
	},
]

export function PolymarketHome() {
	const { t, locale } = useI18n()

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">{t('polymarket.landing.title', 'Polymarket')}</h1>
				<p className="text-muted-foreground mt-2">
					{t('polymarket.landing.subtitle', 'Quick access to market discovery and trader analytics.')}
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{polymarketPages.map((item) => (
					<Link key={item.href} href={item.href}>
						<Card className="h-full transition-all duration-200 hover:border-primary/40 hover:shadow-md">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<item.icon className="h-5 w-5" />
									{t(item.titleKey, item.titleFallback)}
								</CardTitle>
								<CardDescription>{locale === 'zh' ? item.descriptionZh : item.descriptionEn}</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
									{t('polymarket.landing.enter', 'Open')}
									<ArrowRight className="h-4 w-4" />
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	)
}

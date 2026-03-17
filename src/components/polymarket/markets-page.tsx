'use client'

import { MarketsExplorer } from '@/components/polymarket/markets-list'
import { useI18n } from '@/components/i18n-provider'

export function PolymarketMarketsPageContent() {
	const { t } = useI18n()

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex flex-col gap-2 mb-6">
				<h1 className="text-3xl font-bold tracking-tight">{t('polymarket.markets.title', 'Explore Markets')}</h1>
				<p className="text-muted-foreground">
					{t('polymarket.markets.subtitle', 'Discover and browse prediction markets on Polymarket')}
				</p>
			</div>

			<MarketsExplorer />
		</div>
	)
}

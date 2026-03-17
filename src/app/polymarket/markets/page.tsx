import { MarketsExplorer } from '@/components/polymarket/markets-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Active Prediction Markets | Polymarket | CryptoHub',
	description:
		'Browse active prediction markets on Polymarket. View volume, open interest, and end dates for trending markets.',
	keywords: ['Polymarket', 'Prediction Markets', 'Crypto', 'Betting', 'Finance', 'Events'],
	openGraph: {
		title: 'Active Prediction Markets | Polymarket | CryptoHub',
		description:
			'Browse active prediction markets on Polymarket. View volume, open interest, and end dates for trending markets.',
		type: 'website',
	},
}

export default function MarketsPage() {
	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex flex-col gap-2 mb-6">
				<h1 className="text-3xl font-bold tracking-tight">Explore Markets</h1>
				<p className="text-muted-foreground">Discover and browse prediction markets on Polymarket</p>
			</div>

			<MarketsExplorer />
		</div>
	)
}

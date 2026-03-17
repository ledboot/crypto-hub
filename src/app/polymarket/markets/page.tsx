import { Metadata } from 'next'
import { PolymarketMarketsPageContent } from '@/components/polymarket/markets-page'

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
		<div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100">
			<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
				<PolymarketMarketsPageContent />
			</div>
		</div>
	)
}

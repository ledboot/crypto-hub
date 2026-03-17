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
	return <PolymarketMarketsPageContent />
}

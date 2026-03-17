import { Metadata } from 'next'
import { TradersView } from '@/components/polymarket/traders-view'

export const metadata: Metadata = {
	title: 'Polymarket Traders Leaderboard | CryptoHub',
	description: 'Track top Polymarket traders ranked by profit and volume.',
	keywords: ['Polymarket', 'Traders', 'Leaderboard', 'PNL', 'Volume'],
	openGraph: {
		title: 'Polymarket Traders Leaderboard | CryptoHub',
		description: 'Track top Polymarket traders ranked by profit and volume.',
		type: 'website',
	},
}

export default function PolymarketTradersPage() {
	return <TradersView />
}

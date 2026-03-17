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
	return (
		<div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100">
			<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
				<TradersView />
			</div>
		</div>
	)
}

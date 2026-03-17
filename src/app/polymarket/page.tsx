import { Metadata } from 'next'
import { PolymarketHome } from '@/components/polymarket/polymarket-home'

export const metadata: Metadata = {
	title: 'Polymarket Tools | CryptoHub',
	description: 'Browse Polymarket markets and track top traders in one place.',
	keywords: ['Polymarket', 'Prediction Markets', 'Traders', 'Leaderboard', 'CryptoHub'],
}

export default function PolymarketPage() {
	return (
		<div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100">
			<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
				<PolymarketHome />
			</div>
		</div>
	)
}

import { Metadata } from 'next'
import { PolymarketHome } from '@/components/polymarket/polymarket-home'

export const metadata: Metadata = {
	title: 'Polymarket Tools | CryptoHub',
	description: 'Browse Polymarket markets and track top traders in one place.',
	keywords: ['Polymarket', 'Prediction Markets', 'Traders', 'Leaderboard', 'CryptoHub'],
}

export default function PolymarketPage() {
	return <PolymarketHome />
}

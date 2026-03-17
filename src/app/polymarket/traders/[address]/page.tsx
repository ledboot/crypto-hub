import { Metadata } from 'next'
import { TraderProfile } from '@/components/polymarket/trader-profile'

interface TraderProfilePageProps {
	params: Promise<{ address: string }>
}

export const metadata: Metadata = {
	title: 'Polymarket Trader Profile | CryptoHub',
	description: 'View trader profile and active positions on Polymarket.',
	keywords: ['Polymarket', 'Trader Profile', 'Positions', 'Leaderboard'],
}

export default async function TraderProfilePage({ params }: TraderProfilePageProps) {
	const { address } = await params
	return <TraderProfile id={address} />
}

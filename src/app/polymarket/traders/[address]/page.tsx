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
	return (
		<div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100">
			<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
				<TraderProfile id={address} />
			</div>
		</div>
	)
}

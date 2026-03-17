'use client'

import { TraderDetails } from '@/components/polymarket/trader-details'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useI18n } from '@/components/i18n-provider'

export interface TraderProfile {
	address: string
	username?: string
	profileImage?: string
	bio?: string
	volume: number
	pnl: number
	positions: number
	positionsValue: number
	marketsTraded: number
}

export interface Position {
	market: {
		id: string
		question: string
		slug: string
		endDate: string
		image?: string
	}
	outcome: string
	size: number
	avgPrice: number
	currentPrice: number
	pnl: number
}

interface TraderProfileProps {
	id: string
}

export function TraderProfile({ id }: TraderProfileProps) {
	const router = useRouter()
	const { t } = useI18n()
	const [profile, setProfile] = useState<TraderProfile | null>(null)
	const [positions, setPositions] = useState<Position[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchTraderData() {
			try {
				setLoading(true)
				setError(null)

				const res = await fetch(`/api/polymarket/traders/${id}`)
				const data = await res.json()

				if (data.error) {
					setError(data.error)
					return
				}

				if (data.profile) {
					setProfile(data.profile)
				}

				if (data.positions && Array.isArray(data.positions)) {
					const formattedPositions: Position[] = data.positions.map((p: any) => ({
						market: {
							id: p.conditionId,
							question: p.title || '',
							slug: p.slug || '',
							endDate: p.endDate || '',
							image: p.icon,
						},
						outcome: p.outcome || '',
						size: p.size || 0,
						avgPrice: p.avgPrice || 0,
						currentPrice: p.curPrice || 0,
						pnl: p.cashPnl || 0,
					}))
					setPositions(formattedPositions)
				}
			} catch (err) {
				console.error('Error fetching trader:', err)
				setError('FETCH_FAILED')
			} finally {
				setLoading(false)
			}
		}

		if (id) {
			fetchTraderData()
		}
	}, [id])

	if (loading) {
		return (
			<div className="container mx-auto py-20 flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		)
	}

	if (error || !profile) {
		return (
			<div className="container mx-auto py-8 px-4">
				<Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all" onClick={() => router.back()}>
					<ChevronLeft className="h-4 w-4 mr-2" />
					{t('polymarket.profile.back', 'Back to Leaderboard')}
				</Button>
				<div className="text-center py-20 text-muted-foreground">
					<p className="text-lg">{t('polymarket.profile.notFound', 'Trader not found')}</p>
					<p className="text-sm mt-2">
						{error === 'FETCH_FAILED'
							? t('polymarket.profile.loadFailed', 'Failed to load trader profile')
							: error || t('polymarket.profile.loadFailed', 'Failed to load trader profile')}
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all" onClick={() => router.back()}>
				<ChevronLeft className="h-4 w-4 mr-2" />
				{t('polymarket.profile.back', 'Back to Leaderboard')}
			</Button>

			<TraderDetails profile={profile} positions={positions} />
		</div>
	)
}

import { NextRequest, NextResponse } from 'next/server'

const DATA_API_BASE = 'https://data-api.polymarket.com'

interface TraderLeaderboardEntry {
	rank: string
	proxyWallet: string
	userName: string
	xUsername: string
	verifiedBadge: boolean
	vol: number
	pnl: number
	profileImage: string
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams

	const limit = parseInt(searchParams.get('limit') || '50')
	const offset = parseInt(searchParams.get('offset') || '0')
	const search = searchParams.get('search') || ''
	const sortBy = searchParams.get('sortBy') || 'pnl'

	const timePeriod = searchParams.get('timePeriod') || 'ALL'
	const category = searchParams.get('category') || 'OVERALL'

	try {
		const orderBy = sortBy === 'volume' ? 'VOL' : 'PNL'

		const params = new URLSearchParams({
			limit: Math.min(limit, 50).toString(),
			offset: offset.toString(),
			orderBy,
			timePeriod,
			category,
		})

		const res = await fetch(`${DATA_API_BASE}/v1/leaderboard?${params.toString()}`, {
			headers: {
				Accept: 'application/json',
			},
			next: { revalidate: 30 },
		})

		if (!res.ok) {
			throw new Error(`Data API error: ${res.status}`)
		}

		const data: TraderLeaderboardEntry[] = await res.json()

		let traders = data.map((t) => ({
			address: t.proxyWallet,
			username: t.userName || undefined,
			profileImage: t.profileImage || undefined,
			volume: t.vol,
			volumeYesterday: 0,
			pnl: t.pnl,
			pnlYesterday: 0,
			positions: 0,
			positionsValue: 0,
			marketsTraded: 0,
		}))

		if (search) {
			const searchLower = search.toLowerCase()
			traders = traders.filter(
				(t) =>
					t.address.toLowerCase().includes(searchLower) ||
					(t.username && t.username.toLowerCase().includes(searchLower))
			)
		}

		return NextResponse.json({
			traders,
			hasMore: data.length === limit,
			offset,
			isDemo: false,
		})
	} catch (error) {
		console.error('Error fetching traders:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch traders', traders: [], hasMore: false, isDemo: false },
			{ status: 500 }
		)
	}
}

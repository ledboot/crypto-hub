import { NextRequest, NextResponse } from 'next/server'

const GAMMA_API_BASE = 'https://gamma-api.polymarket.com'
const DATA_API_BASE = 'https://data-api.polymarket.com'

type Params = Promise<{ address: string }>

export async function GET(request: NextRequest, { params }: { params: Params }) {
	const { address } = await params

	try {
		const [profileRes, positionsRes] = await Promise.all([
			fetch(`${GAMMA_API_BASE}/public-profile?address=${address}`, {
				headers: { Accept: 'application/json' },
				next: { revalidate: 60 },
			}),
			fetch(`${DATA_API_BASE}/positions?user=${address}&limit=50`, {
				headers: { Accept: 'application/json' },
				next: { revalidate: 60 },
			}),
		])

		let profile = null
		if (profileRes.ok) {
			const data = await profileRes.json()
			profile = {
				address: data.proxyWallet || address,
				username: data.name || data.pseudonym,
				profileImage: data.profileImage,
				bio: data.bio,
				volume: 0,
				pnl: 0,
				positions: 0,
				positionsValue: 0,
				marketsTraded: 0,
			}
		}

		let positions = []
		if (positionsRes.ok) {
			positions = await positionsRes.json()
		}

		return NextResponse.json({
			profile,
			positions,
		})
	} catch (error) {
		console.error('Error fetching trader profile:', error)
		return NextResponse.json({ error: 'Failed to fetch trader profile', profile: null, positions: [] }, { status: 500 })
	}
}

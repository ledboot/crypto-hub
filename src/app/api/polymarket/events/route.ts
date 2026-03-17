import { NextRequest, NextResponse } from 'next/server'

const GAMMA_API_BASE = 'https://gamma-api.polymarket.com'

interface GammaEvent {
	id: string
	title: string
	slug: string
	description: string
	endDate: string
	image: string
	icon: string
	volume: number
	openInterest: number
	tags?: { id: string; label: string; slug: string }[]
	active: boolean
	closed: boolean
}

interface TransformedEvent {
	id: string
	title: string
	slug: string
	description: string
	endDate: string
	image: string
	icon: string
	volume: number
	openInterest: number
	tags: { id: string; label: string; slug: string }[]
	active: boolean
	closed: boolean
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams

	const limit = searchParams.get('limit') || '20'
	const offset = searchParams.get('offset') || '0'
	const search = searchParams.get('search') || ''
	const tag = searchParams.get('tag') || ''

	try {
		const params = new URLSearchParams({
			limit,
			offset,
			closed: 'false',
			active: 'true',
			order: 'volume',
			ascending: 'false',
		})

		if (search) {
			params.set('title_contains', search)
		}

		if (tag && tag !== 'all') {
			params.set('tag_slug', tag)
		}

		const res = await fetch(`${GAMMA_API_BASE}/events?${params.toString()}`, {
			headers: {
				Accept: 'application/json',
			},
			next: { revalidate: 30 },
		})

		if (!res.ok) {
			throw new Error(`Gamma API error: ${res.status}`)
		}

		const events: GammaEvent[] = await res.json()

		const transformedEvents: TransformedEvent[] = events.map((event) => ({
			id: event.id,
			title: event.title,
			slug: event.slug,
			description: event.description,
			endDate: event.endDate,
			image: event.image,
			icon: event.icon,
			volume: event.volume,
			openInterest: event.openInterest,
			tags: event.tags || [],
			active: event.active,
			closed: event.closed,
		}))

		return NextResponse.json({
			events: transformedEvents,
			hasMore: events.length === parseInt(limit),
			offset: parseInt(offset),
		})
	} catch (error) {
		console.error('Error fetching polymarket events:', error)
		return NextResponse.json({ error: 'Failed to fetch events', events: [], hasMore: false }, { status: 500 })
	}
}

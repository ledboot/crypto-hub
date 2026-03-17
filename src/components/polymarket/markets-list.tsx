'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Loader2, TrendingUp, Flame, Globe, Landmark, Trophy, Cpu, Film, Sparkles } from 'lucide-react'
import { useI18n } from '@/components/i18n-provider'

export interface Market {
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

interface EventsResponse {
	events: Market[]
	hasMore: boolean
	offset: number
}

// Category definitions with icons
const CATEGORIES = [
	{ id: 'all', labelKey: 'polymarket.category.all', label: 'All', icon: Sparkles, slug: '' },
	{ id: 'trending', labelKey: 'polymarket.category.trending', label: 'Trending', icon: Flame, slug: '' },
	{ id: 'politics', labelKey: 'polymarket.category.politics', label: 'Politics', icon: Landmark, slug: 'politics' },
	{ id: 'sports', labelKey: 'polymarket.category.sports', label: 'Sports', icon: Trophy, slug: 'sports' },
	{ id: 'crypto', labelKey: 'polymarket.category.crypto', label: 'Crypto', icon: TrendingUp, slug: 'crypto' },
	{ id: 'science', labelKey: 'polymarket.category.science', label: 'Science', icon: Cpu, slug: 'science' },
	{
		id: 'entertainment',
		labelKey: 'polymarket.category.entertainment',
		label: 'Entertainment',
		icon: Film,
		slug: 'entertainment',
	},
	{ id: 'world', labelKey: 'polymarket.category.world', label: 'World', icon: Globe, slug: 'world' },
]

const PAGE_SIZE = 20

export function MarketsExplorer() {
	const { t } = useI18n()
	const [events, setEvents] = useState<Market[]>([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [offset, setOffset] = useState(0)
	const [searchQuery, setSearchQuery] = useState('')
	const [activeCategory, setActiveCategory] = useState('all')
	const [debouncedSearch, setDebouncedSearch] = useState('')

	const loaderRef = useRef<HTMLDivElement>(null)

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery)
		}, 300)
		return () => clearTimeout(timer)
	}, [searchQuery])

	// Fetch events
	const fetchEvents = useCallback(
		async (reset: boolean = false) => {
			const currentOffset = reset ? 0 : offset

			if (reset) {
				setLoading(true)
			} else {
				setLoadingMore(true)
			}

			try {
				const params = new URLSearchParams({
					limit: PAGE_SIZE.toString(),
					offset: currentOffset.toString(),
				})

				if (debouncedSearch) {
					params.set('search', debouncedSearch)
				}

				const category = CATEGORIES.find((c) => c.id === activeCategory)
				if (category?.slug) {
					params.set('tag', category.slug)
				}

				const res = await fetch(`/api/polymarket/events?${params.toString()}`)
				const data: EventsResponse = await res.json()

				if (reset) {
					setEvents(data.events)
				} else {
					setEvents((prev) => [...prev, ...data.events])
				}

				setHasMore(data.hasMore)
				setOffset(currentOffset + data.events.length)
			} catch (error) {
				console.error('Error fetching events:', error)
			} finally {
				setLoading(false)
				setLoadingMore(false)
			}
		},
		[offset, debouncedSearch, activeCategory]
	)

	// Initial fetch and refetch on filter changes
	useEffect(() => {
		setOffset(0)
		fetchEvents(true)
	}, [debouncedSearch, activeCategory])

	// Infinite scroll observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
					fetchEvents(false)
				}
			},
			{ threshold: 0.1 }
		)

		if (loaderRef.current) {
			observer.observe(loaderRef.current)
		}

		return () => observer.disconnect()
	}, [hasMore, loading, loadingMore, fetchEvents])

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
			notation: 'compact',
			compactDisplay: 'short',
		}).format(value)
	}

	return (
		<div className="space-y-6">
			{/* Search Bar */}
			<div className="relative max-w-md">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder={t('polymarket.markets.search', 'Search events...')}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="pl-10"
				/>
			</div>

			{/* Category Navigation */}
			<div className="flex flex-wrap gap-2 pb-2">
				{CATEGORIES.map((category) => {
					const Icon = category.icon
					const isActive = activeCategory === category.id
					return (
						<button
							key={category.id}
							onClick={() => setActiveCategory(category.id)}
							className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                transition-all duration-200
                ${
									isActive
										? 'bg-primary text-primary-foreground shadow-md'
										: 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
								}
              `}
						>
							<Icon className="h-4 w-4" />
							{t(category.labelKey, category.label)}
						</button>
					)
				})}
			</div>

			{/* Loading State */}
			{loading && (
				<div className="flex items-center justify-center py-20">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			)}

			{/* Events Grid */}
			{!loading && (
				<>
					{events.length === 0 ? (
						<div className="text-center py-20 text-muted-foreground">
							<p className="text-lg">{t('polymarket.markets.empty', 'No events found')}</p>
							<p className="text-sm mt-2">{t('polymarket.markets.emptyTip', 'Try adjusting your search or filters')}</p>
						</div>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{events.map((event) => (
								<EventCard key={event.id} event={event} formatCurrency={formatCurrency} />
							))}
						</div>
					)}

					{/* Load More Trigger */}
					<div ref={loaderRef} className="h-20 flex items-center justify-center">
						{loadingMore && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
						{!hasMore && events.length > 0 && (
							<p className="text-sm text-muted-foreground">{t('polymarket.markets.noMore', 'No more events')}</p>
						)}
					</div>
				</>
			)}
		</div>
	)
}

// Compact Event Card Component
function EventCard({ event, formatCurrency }: { event: Market; formatCurrency: (value: number) => string }) {
	const { t } = useI18n()

	return (
		<Link href={`https://polymarket.com/event/${event.slug}`} target="_blank">
			<Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200 cursor-pointer flex flex-col overflow-hidden group">
				{/* Image */}
				<div className="relative h-24 w-full bg-muted">
					{event.image ? (
						<Image
							src={event.image}
							alt={event.title}
							fill
							className="object-cover group-hover:scale-105 transition-transform duration-200"
							sizes="(max-width: 768px) 50vw, 25vw"
						/>
					) : (
						<div className="flex items-center justify-center h-full text-muted-foreground text-xs">
							{t('polymarket.markets.noImage', 'No Image')}
						</div>
					)}
					{event.icon && (
						<div className="absolute -bottom-3 left-3 h-8 w-8 rounded-full border-2 border-background bg-background overflow-hidden shadow-sm">
							<Image src={event.icon} alt="icon" width={32} height={32} className="object-cover" />
						</div>
					)}
				</div>

				{/* Content */}
				<CardHeader className="pt-5 pb-1 px-3">
					{event.tags.length > 0 && (
						<div className="flex gap-1 mb-1">
							<Badge variant="secondary" className="text-[9px] px-1.5 h-4">
								{event.tags[0].label}
							</Badge>
						</div>
					)}
					<CardTitle className="text-sm line-clamp-2 leading-tight min-h-[2.25rem]">{event.title}</CardTitle>
				</CardHeader>

				<CardContent className="flex-1 pb-2 px-3">
					<p className="text-[11px] text-muted-foreground line-clamp-2">{event.description}</p>
				</CardContent>

				{/* Footer */}
				<CardFooter className="flex justify-between items-center border-t pt-2 pb-2 px-3 bg-muted/20 text-[10px] text-muted-foreground">
					<div className="flex flex-col">
						<span className="font-semibold text-foreground text-xs">{formatCurrency(event.volume)}</span>
						<span>{t('polymarket.markets.volumeShort', 'Vol')}</span>
					</div>
					<div className="flex flex-col items-end">
						<span className="font-semibold text-foreground text-xs">
							{event.endDate ? format(new Date(event.endDate), 'MMM d') : 'N/A'}
						</span>
						<span>{t('polymarket.profile.ends', 'Ends')}</span>
					</div>
				</CardFooter>
			</Card>
		</Link>
	)
}

// Legacy export for backward compatibility
export { MarketsExplorer as MarketsList }

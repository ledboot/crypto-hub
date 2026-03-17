'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { TradersTable, Trader } from '@/components/polymarket/traders-table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Loader2, ArrowUpDown, TrendingUp, DollarSign } from 'lucide-react'
import { useI18n } from '@/components/i18n-provider'

interface TradersResponse {
	traders: Trader[]
	hasMore: boolean
	offset: number
	isDemo?: boolean
}

const SORT_OPTIONS = [
	{ value: 'pnl', labelKey: 'polymarket.traders.sort.pnl', label: 'PnL (Highest)', icon: TrendingUp },
	{ value: 'volume', labelKey: 'polymarket.traders.sort.volume', label: 'Volume (Highest)', icon: DollarSign },
]

const TIME_PERIOD_OPTIONS = [
	{ value: 'DAY', label: '24h' },
	{ value: 'WEEK', label: '7d' },
	{ value: 'MONTH', label: '30d' },
	{ value: 'ALL', label: 'All Time' },
]

const PAGE_SIZE = 50

export function TradersView() {
	const { t } = useI18n()
	const [traders, setTraders] = useState<Trader[]>([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [offset, setOffset] = useState(0)
	const [searchQuery, setSearchQuery] = useState('')
	const [debouncedSearch, setDebouncedSearch] = useState('')
	const [sortBy, setSortBy] = useState('pnl')
	const [timePeriod, setTimePeriod] = useState('ALL')

	const loaderRef = useRef<HTMLDivElement>(null)

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery)
		}, 300)
		return () => clearTimeout(timer)
	}, [searchQuery])

	// Fetch traders
	const fetchTraders = useCallback(
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
					sortBy,
					timePeriod,
				})

				if (debouncedSearch) {
					params.set('search', debouncedSearch)
				}

				const res = await fetch(`/api/polymarket/traders?${params.toString()}`)
				const data: TradersResponse = await res.json()

				if (reset) {
					setTraders(data.traders)
				} else {
					setTraders((prev) => [...prev, ...data.traders])
				}

				setHasMore(data.hasMore)
				setOffset(currentOffset + data.traders.length)
			} catch (error) {
				console.error('Error fetching traders:', error)
			} finally {
				setLoading(false)
				setLoadingMore(false)
			}
		},
		[offset, debouncedSearch, sortBy, timePeriod]
	)

	// Initial fetch and refetch on filter changes
	useEffect(() => {
		setOffset(0)
		fetchTraders(true)
	}, [debouncedSearch, sortBy, timePeriod])

	// Infinite scroll observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
					fetchTraders(false)
				}
			},
			{ threshold: 0.1 }
		)

		if (loaderRef.current) {
			observer.observe(loaderRef.current)
		}

		return () => observer.disconnect()
	}, [hasMore, loading, loadingMore, fetchTraders])

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex flex-col gap-2 mb-6">
				<h1 className="text-3xl font-bold tracking-tight">{t('polymarket.traders.title', 'Traders Leaderboard')}</h1>
				<p className="text-muted-foreground">
					{t('polymarket.traders.subtitle', 'Top performing traders on Polymarket ranked by profit and volume')}
				</p>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4 mb-6">
				{/* Search */}
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={t('polymarket.traders.search', 'Search by username or address...')}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>

				{/* Sort */}
				<Select value={sortBy} onValueChange={setSortBy}>
					<SelectTrigger className="w-[180px]">
						<ArrowUpDown className="h-4 w-4 mr-2" />
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						{SORT_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								<div className="flex items-center gap-2">
									<option.icon className="h-4 w-4" />
									{t(option.labelKey, option.label)}
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Time Period */}
				<Select value={timePeriod} onValueChange={setTimePeriod}>
					<SelectTrigger className="w-[120px]">
						<SelectValue placeholder="Time" />
					</SelectTrigger>
					<SelectContent>
						{TIME_PERIOD_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Loading State */}
			{loading && (
				<div className="flex items-center justify-center py-20">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			)}

			{/* Traders Table */}
			{!loading && (
				<>
					{traders.length === 0 ? (
						<div className="text-center py-20 text-muted-foreground">
							<p className="text-lg">{t('polymarket.traders.empty', 'No traders found')}</p>
							<p className="text-sm mt-2">{t('polymarket.traders.emptyTip', 'Try adjusting your search')}</p>
						</div>
					) : (
						<TradersTable data={traders} />
					)}

					{/* Load More Trigger */}
					<div ref={loaderRef} className="h-20 flex items-center justify-center">
						{loadingMore && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
						{!hasMore && traders.length > 0 && (
							<p className="text-sm text-muted-foreground">{t('polymarket.traders.noMore', 'No more traders to load')}</p>
						)}
					</div>
				</>
			)}
		</div>
	)
}

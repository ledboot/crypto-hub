'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ExternalLink, TrendingUp, TrendingDown, Wallet, BarChart3, DollarSign, Activity } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'

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

interface TraderDetailsProps {
	profile: TraderProfile
	positions: Position[]
}

export function TraderDetails({ profile, positions }: TraderDetailsProps) {
	const [isFavorite, setIsFavorite] = useState(false)

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

	const formatPnL = (value: number) => {
		const formatted = formatCurrency(Math.abs(value))
		return value >= 0 ? `+${formatted}` : `-${formatted}`
	}

	const shortenAddress = (address: string) => {
		return `${address.slice(0, 6)}...${address.slice(-4)}`
	}

	const getDisplayName = () => {
		return profile.username || shortenAddress(profile.address)
	}

	const getAvatarUrl = () => {
		if (profile.profileImage) return profile.profileImage
		return `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.address}`
	}

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="h-20 w-20 rounded-full overflow-hidden bg-secondary border-4 border-background shadow-lg">
						<img src={getAvatarUrl()} alt={getDisplayName()} className="h-full w-full object-cover" />
					</div>
					<div>
						<h1 className="text-3xl font-bold">{getDisplayName()}</h1>
						<p className="text-sm text-muted-foreground mt-1 font-mono">{shortenAddress(profile.address)}</p>
						{profile.bio && <p className="text-sm text-muted-foreground mt-2 max-w-md">{profile.bio}</p>}
					</div>
				</div>
				<div className="flex gap-3">
					<Button
						variant={isFavorite ? 'default' : 'outline'}
						onClick={() => setIsFavorite(!isFavorite)}
						className="gap-2"
					>
						<Star className={`h-4 w-4 ${isFavorite ? 'fill-primary-foreground' : ''}`} />
						{isFavorite ? 'Favorited' : 'Favorite'}
					</Button>
					<Button
						variant="outline"
						onClick={() => window.open(`https://polymarket.com/profile/${profile.address}`, '_blank')}
						className="gap-2"
					>
						<ExternalLink className="h-4 w-4" />
						View on Polymarket
					</Button>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<DollarSign className="h-4 w-4" />
							Total Volume
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatCurrency(profile.volume)}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<TrendingUp className="h-4 w-4" />
							Total PnL
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div
							className={`text-2xl font-bold flex items-center gap-2 ${profile.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}
						>
							{profile.pnl >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
							{formatPnL(profile.pnl)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Wallet className="h-4 w-4" />
							Position Value
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatCurrency(profile.positionsValue)}</div>
						<p className="text-xs text-muted-foreground mt-1">{profile.positions} positions</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<BarChart3 className="h-4 w-4" />
							Markets Traded
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{profile.marketsTraded}</div>
					</CardContent>
				</Card>
			</div>

			{/* Active Positions */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="h-5 w-5" />
						Active Positions ({positions.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					{positions.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<p>No active positions</p>
						</div>
					) : (
						<div className="space-y-4">
							{positions.slice(0, 10).map((position, index) => (
								<div
									key={index}
									className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded-lg transition-colors cursor-pointer"
									onClick={() => window.open(`https://polymarket.com/event/${position.market.slug}`, '_blank')}
								>
									<div className="flex flex-col flex-1 min-w-0">
										<span className="font-medium text-sm line-clamp-2">{position.market.question}</span>
										<div className="flex items-center gap-2 mt-1">
											<Badge variant={position.outcome.toLowerCase() === 'yes' ? 'default' : 'secondary'}>
												{position.outcome}
											</Badge>
											<span className="text-xs text-muted-foreground">
												{position.size} shares @ {(position.avgPrice * 100).toFixed(1)}¢
											</span>
										</div>
										{position.market.endDate && (
											<span className="text-xs text-muted-foreground mt-1">
												Ends {format(new Date(position.market.endDate), 'MMM d, yyyy')}
											</span>
										)}
									</div>
									<div className="flex flex-col items-end ml-4">
										<span className={`text-sm font-medium ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
											{formatPnL(position.pnl)}
										</span>
										<span className="text-xs text-muted-foreground">
											Current: {(position.currentPrice * 100).toFixed(1)}¢
										</span>
									</div>
								</div>
							))}
							{positions.length > 10 && (
								<div className="text-center pt-4">
									<Button
										variant="outline"
										onClick={() => window.open(`https://polymarket.com/profile/${profile.address}`, '_blank')}
									>
										View all {positions.length} positions on Polymarket
									</Button>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

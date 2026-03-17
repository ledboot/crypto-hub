'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { useI18n } from '@/components/i18n-provider'

export interface Trader {
	address: string
	username?: string
	profileImage?: string
	volume: number
	pnl: number
}

interface TradersTableProps {
	data: Trader[]
}

export function TradersTable({ data }: TradersTableProps) {
	const router = useRouter()
	const { t } = useI18n()

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

	const getDisplayName = (trader: Trader) => {
		return trader.username || shortenAddress(trader.address)
	}

	const getAvatarUrl = (trader: Trader) => {
		if (trader.profileImage) return trader.profileImage
		// Generate a consistent avatar based on address
		return `https://api.dicebear.com/7.x/identicon/svg?seed=${trader.address}`
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[60px]">#</TableHead>
						<TableHead>{t('polymarket.table.trader', 'Trader')}</TableHead>
						<TableHead className="text-right">{t('polymarket.table.volume', 'Volume')}</TableHead>
						<TableHead className="text-right">PnL</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((trader, index) => (
						<TableRow
							key={trader.address}
							className="cursor-pointer hover:bg-muted/50"
							onClick={() => router.push(`/polymarket/traders/${trader.address}`)}
						>
							<TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
							<TableCell>
								<div className="flex items-center gap-3">
									<div className="h-9 w-9 rounded-full overflow-hidden bg-secondary flex-shrink-0">
										<img
											src={getAvatarUrl(trader)}
											alt={getDisplayName(trader)}
											className="h-full w-full object-cover"
										/>
									</div>
									<div className="flex flex-col min-w-0">
										<div className="flex items-center gap-2">
											<span className="font-medium truncate">{getDisplayName(trader)}</span>
											<button
												type="button"
												className="text-muted-foreground hover:text-foreground transition-colors"
												onClick={(event) => {
													event.stopPropagation()
													window.open(`https://polymarket.com/profile/${trader.address}`, '_blank')
												}}
												aria-label={t('polymarket.table.openProfile', 'Open profile on Polymarket')}
											>
												<ExternalLink className="h-3 w-3 flex-shrink-0" />
											</button>
										</div>
										{trader.username && (
											<span className="text-xs text-muted-foreground truncate">{shortenAddress(trader.address)}</span>
										)}
									</div>
								</div>
							</TableCell>
							<TableCell className="text-right">
								<span className="font-medium">{formatCurrency(trader.volume)}</span>
							</TableCell>
							<TableCell className="text-right">
								<span className={`font-medium ${trader.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
									{formatPnL(trader.pnl)}
								</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

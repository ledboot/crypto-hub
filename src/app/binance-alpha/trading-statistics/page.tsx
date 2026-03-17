import { AlphaTradingStats } from '@/components/alpha-trading-stats'

export default function TradingStatistics() {
	return (
		<div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100">
			<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
				<AlphaTradingStats />
			</div>
		</div>
	)
}

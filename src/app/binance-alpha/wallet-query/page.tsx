import { AlphaWalletQuery } from '@/components/alpha-wallet-query'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Crypto Hubs - 币安Alpha钱包地址查询',
	description: '输入钱包地址，快速查询币安链钱包的交易统计、积分、损耗、Gas等数据，支持每日分组和详细分析。',
	keywords: ['Crypto Hubs', '币安 alpha', 'Binance Alpha', 'BSC Chain', '钱包查询', '交易统计', '区块链分析'],
	openGraph: {
		title: 'Crypto Hubs - 币安Alpha钱包地址查询',
		description: '输入钱包地址，快速查询币安链钱包的交易统计、积分、损耗、Gas等数据，支持每日分组和详细分析。',
		url: 'https://cryptohub.lol/binance-alpha/wallet-query',
		siteName: 'Crypto Hubs',
		type: 'website',
	},
}

export default function WalletQuery() {
	return (
		<div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100">
			<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
				<AlphaWalletQuery />
			</div>
		</div>
	)
}

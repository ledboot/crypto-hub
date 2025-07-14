'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Search, Settings, TrendingUp, TrendingDown, DollarSign, Zap, ChevronDown } from 'lucide-react'
import BnApiUtils from '@/utils/bn-api'
import TransactionUtils from '@/utils/transaction'
import dayjs from 'dayjs'
import { formatMoney, formatTokenAmount, formatTransactionHash } from '@/utils/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { TransactionDay, TodaySummary, Summary, Transaction } from '@/types/bn-alpha'


export function AlphaWalletQuery() {
	const [walletAddress, setWalletAddress] = useState('')
	const [filterTokenAddresses, setFilterTokenAddresses] = useState<string>('')
	const [isLoading, setIsLoading] = useState(false)
	const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})
	const [transactionsData, setTransactionsData] = useState<TransactionDay[]>([])
	const [todaySummary, setTodaySummary] = useState<TodaySummary | null>(null)
	const [summary, setSummary] = useState<Summary | null>(null)
	const [openDialog, setOpenDialog] = useState(false)

	const todayStr = dayjs().format('YYYY-MM-DD')

	useEffect(() => {
		// 自动填充过滤代币地址
		const saved = localStorage.getItem('filterTokenAddresses')
		if (saved) {
			setFilterTokenAddresses(JSON.parse(saved).join('\n'))
		}
	}, [])

	useEffect(() => {
		const summary = getSummaryStats(transactionsData)
		console.log('summary', summary)
		setSummary(summary)

		const todayData = transactionsData.find((day) => day.date === todayStr)
		if (todayData) {
			const n = todayData.totalValue > 0 ? Math.floor(Math.log2(todayData.totalValue)) : 0
			const lower = Math.pow(2, n)
			const upper = Math.pow(2, n + 1)
			const progressPercentSegment =
				todayData.totalValue > 0 ? ((todayData.totalValue - lower) / (upper - lower)) * 100 : 0
			setTodaySummary({
				totalValue: todayData.totalValue,
				totalPoints: todayData.totalPoints,
				totalLoss: todayData.totalLoss,
				totalLossWithGas: todayData.totalLossWithGas,
				totalGas: todayData.totalGas,
				totalGasUsd: todayData.totalGasUsd,
				progressPercentSegment: progressPercentSegment,
				upper: upper,
			})
		}
	}, [transactionsData])

	const handleSaveFilter = () => {
		const arr = filterTokenAddresses
			.split('\n')
			.map((addr) => addr.trim())
			.filter(Boolean)
		localStorage.setItem('filterTokenAddresses', JSON.stringify(arr))
		toast.success('保存成功')
		setOpenDialog(false)
	}

	const handleSearch = async () => {
		setIsLoading(true)
		// 过滤地址数组
		const filterArr = filterTokenAddresses
			.split('\n')
			.map(addr => addr.trim().toLowerCase())
			.filter(Boolean)
		// 只保留不包含过滤地址的交易
		const data = (await BnApiUtils.fetchAddressData(walletAddress)).filter(
			(item: any) =>
				!Object.values(item.tokens).some(
					(token: any) => filterArr.includes(token.address?.toLowerCase())
				) &&
				item.tokens['BSC-USD'] &&
				(item.tokens['BSC-USD'].inflow !== 0 || item.tokens['BSC-USD'].outflow !== 0)
		)
		const res = TransactionUtils.groupTransactionsByDay(data).map((item: any) => item[1])
		const resWithStats = await Promise.all(
			res.map(async (day: TransactionDay) => {
				const stats = await TransactionUtils.calculateStatistics(day.transactions)
				return { ...day, ...stats }
			})
		)
		setTransactionsData(resWithStats)
		setIsLoading(false)
	}

	const getSummaryStats = (days: TransactionDay[]) => {
		let totalValue = 0
		let totalPoints = 0
		let totalLoss = 0
		let totalGas = 0
		let totalGasUsd = 0
		let totalLossWithGas = 0

		for (const day of days) {
			// 总交易量
			totalValue += day.totalValue

			// 获得积分
			totalPoints += day.totalPoints

			// 总损耗（以BSC-USD为例）
			totalLoss += day.totalLoss
			totalLossWithGas += day.totalLossWithGas

			// Gas费用
			totalGas += day.totalGas
			totalGasUsd += day.totalGasUsd
		}

		return {
			totalValue,
			totalPoints,
			totalLoss,
			totalGas,
			totalGasUsd,
			totalLossWithGas,
		}
	}

	const getFlowData = (transactions: Transaction[]): any[] => {
		const res: any[] = []
		transactions.forEach((item) => {
			const t = item as Transaction
			if (!t.tokens) return
			Object.entries(t.tokens).forEach(([key, value]) => {
				if (value.inflow === 0 && value.outflow === 0) return
				res.push({
					hash: t.hash,
					time: t.timeStamp ? dayjs(Number(t.timeStamp) * 1000).format('HH:mm:ss') : '-',
					coin: key,
					inflow: value.inflow ? formatTokenAmount(value.inflow) : '–',
					outflow: value.outflow ? formatTokenAmount(value.outflow) : '–',
					status: t.status ? (
						<span
							className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${t.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
							{t.status === 'success' ? 'success' : 'failed'}
						</span>
					) : (
						'-'
					),
				})
			})
		})
		return res
	}

	const getConsumeFormat = (amount: number): string => {
		if (amount < 0) {
			return '-$' + Math.abs(amount).toFixed(2)
		}
		return '$' + Math.abs(amount).toFixed(2)
	}

	return (
		<div className="container mx-auto space-y-6 py-20">
			{/* Wallet Address Input */}
			<Card>
				<CardHeader>
					<CardTitle>钱包地址查询</CardTitle>
					<CardDescription>输入钱包地址查看交易统计</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex space-x-2">
						<Input
							placeholder="输入钱包地址"
							value={walletAddress}
							onChange={(e) => setWalletAddress(e.target.value)}
							className="flex-1"
						/>
						<Button onClick={handleSearch} disabled={isLoading || !walletAddress}>
							<Search className="mr-2 h-4 w-4" />
							{isLoading ? '查询中...' : '查询'}
						</Button>
						<Dialog open={openDialog} onOpenChange={setOpenDialog}>
							<DialogTrigger asChild>
								<Button variant="outline">
									<Settings className="mr-2 h-4 w-4" />
									设置
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>过滤设置</DialogTitle>
									<DialogDescription>设置要过滤的代币地址</DialogDescription>
								</DialogHeader>
								<div className="space-y-4">
									<div>
										<Label htmlFor="filtered-tokens">过滤代币地址</Label>
										<Textarea
											id="filtered-tokens"
											placeholder="输入要过滤的代币合约地址，每行一个"
											value={filterTokenAddresses}
											onChange={(e) => setFilterTokenAddresses(e.target.value)}
											rows={6}
										/>
									</div>
									<Button className="w-full" onClick={handleSaveFilter}>
										保存设置
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</CardContent>
			</Card>

			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">总交易量</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${formatMoney(summary?.totalValue)}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">获得积分</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{summary?.totalPoints}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">总损耗</CardTitle>
						<TrendingDown className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{getConsumeFormat(summary?.totalLoss || 0)}</div>
						<p className="text-xs text-muted-foreground">包含Gas费用</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Gas费用</CardTitle>
						<Zap className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							${formatMoney(summary?.totalGasUsd)}{' '}
							<span className="text-xs text-muted-foreground">({summary?.totalGas} BNB)</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* 当日进度 */}
			<div className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle>当日进度</CardTitle>
						<CardDescription>今日交易数据</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div>
								<div className="text-gray-400 mb-1">今日交易量</div>
								<div className="font-bold">${formatMoney(todaySummary?.totalValue || 0)}</div>
							</div>
							<div>
								<div className="text-gray-400 mb-1">今日积分</div>
								<div className="font-bold">{todaySummary?.totalPoints || 0}</div>
							</div>
							<div>
								<div className="text-gray-400 mb-1">今日损耗(包含Gas)</div>
								<Tooltip>
									<TooltipTrigger>
										<div className="font-bold underline">{getConsumeFormat(todaySummary?.totalLossWithGas || 0)}</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>消耗: {getConsumeFormat(todaySummary?.totalLoss || 0)}</p>
										<p>Gas: ${formatMoney(todaySummary?.totalGasUsd || 0)}</p>
									</TooltipContent>
								</Tooltip>
							</div>
							<div>
								<div className="text-gray-400 mb-1">
									进度 {Number(todaySummary?.progressPercentSegment || 0).toFixed(2)}%
								</div>
								<div className="mt-2">
									<div className="w-full bg-gray-200 rounded-full h-3">
										<div
											className="bg-green-500 h-3 rounded-full transition-all"
											style={{
												width: `${todaySummary?.progressPercentSegment || 0}%`,
											}}
										/>
									</div>
									<div className="text-xs text-gray-500 mt-1 text-right">
										${formatMoney(todaySummary?.totalValue || 0)} / ${formatMoney(todaySummary?.upper || 0)} 交易量
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Trading Records */}
			<Card>
				<CardHeader>
					<CardTitle>交易记录</CardTitle>
					<CardDescription>按天分组的交易历史</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{transactionsData.length > 0 ? (
							transactionsData.map((dayRecord) => {
								const date = dayRecord.date
								const isExpanded = expandedDays[date]
								const flowData = getFlowData(dayRecord.transactions)
								return (
									<div
										key={date}
										className="border rounded-lg overflow-hidden cursor-pointer bg-white"
										onClick={() =>
											setExpandedDays((prev) => ({
												...prev,
												[date]: !isExpanded,
											}))
										}>
										<div className="p-4 flex justify-between items-center">
											<h4 className="text-base font-medium">{date}</h4>
											<span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
												<ChevronDown className="w-5 h-5" />
											</span>
										</div>
										<div className="p-4 pt-0">
											<div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
												<div>
													<p className="text-gray-400 mb-1">有效交易次数</p>
													<p className="font-medium">{dayRecord.transactionCount} 笔</p>
												</div>
												<div>
													<p className="text-gray-400 mb-1">有效交易量</p>
													<p className="font-medium">{formatMoney(dayRecord.totalValue)}</p>
												</div>
												<div>
													<p className="text-gray-400 mb-1">损耗(包含Gas)</p>
													<Tooltip>
														<TooltipTrigger>
															<p className="underline">{getConsumeFormat(dayRecord.totalLossWithGas)}</p>
														</TooltipTrigger>
														<TooltipContent>
															<p>消耗: {getConsumeFormat(dayRecord.totalLoss)}</p>
															<p>Gas: ${formatMoney(dayRecord.totalGasUsd)}</p>
														</TooltipContent>
													</Tooltip>
												</div>
												<div>
													<p className="text-gray-400 mb-1">Gas(USD)</p>
													<Tooltip>
														<TooltipTrigger>
															<span className="underline">${formatMoney(dayRecord.totalGasUsd)}</span>
														</TooltipTrigger>
														<TooltipContent>
															<p>{dayRecord.totalGas} BNB</p>
														</TooltipContent>
													</Tooltip>
												</div>
												<div>
													<p className="text-gray-400 mb-1">获得积分</p>
													<p className="font-medium text-yellow-500">{dayRecord.totalPoints}</p>
												</div>
											</div>
										</div>
										{isExpanded && (
											<div className="border-t p-4 overflow-auto bg-gray-50">
												<table className="w-full table-auto rounded-lg overflow-hidden shadow-md">
													<thead className="bg-white text-gray-400">
														<tr>
															<th className="px-4 py-3 text-left text-sm font-medium">交易哈希</th>
															<th className="px-4 py-3 text-left text-sm font-medium">时间</th>
															<th className="px-4 py-3 text-left text-sm font-medium">代币</th>
															<th className="px-4 py-3 text-left text-sm font-medium">转入</th>
															<th className="px-4 py-3 text-left text-sm font-medium">转出</th>
															<th className="px-4 py-3 text-left text-sm font-medium">状态</th>
														</tr>
													</thead>
													<tbody className="divide-y">
														{flowData.map((row, transIndex) => (
															<tr key={transIndex}>
																<td className="px-4 py-3 text-sm">
																	{row.hash ? (
																		<a
																			href={`https://bscscan.com/tx/${row.hash}`}
																			target="_blank"
																			rel="noopener noreferrer"
																			className="text-yellow-500 hover:underline">
																			{formatTransactionHash(row.hash)}
																		</a>
																	) : (
																		'–'
																	)}
																</td>
																<td className="px-4 py-3 text-sm">{row.time}</td>
																<td className="px-4 py-3 text-sm">{row.coin}</td>
																<td className="px-4 py-3 text-sm text-green-500">{row.inflow}</td>
																<td className="px-4 py-3 text-sm text-red-500">{row.outflow}</td>
																<td className="px-4 py-3 text-sm">{row.status}</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										)}
									</div>
								)
							})
						) : (
							<div className="border rounded-lg text-sm p-5 text-center text-gray-400">未找到该地址下的交易记录</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

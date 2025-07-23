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
import { Search, Settings, TrendingUp, TrendingDown, DollarSign, Zap, ChevronDown, History, Clock, Trash2, Calculator } from 'lucide-react'
import BnApiUtils from '@/utils/bn-api'
import TransactionUtils from '@/utils/transaction'
import dayjs from 'dayjs'
import { formatMoney, formatTokenAmount, formatTransactionHash } from '@/utils/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { TransactionDay, TodaySummary, Summary, Transaction } from '@/types/bn-alpha'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

// 历史记录类型
interface QueryHistory {
	id: string
	address: string
	timestamp: number
}

// 本地存储键名
const HISTORY_STORAGE_KEY = 'wallet-query-history'
const MAX_HISTORY_COUNT = 10


export function AlphaWalletQuery() {
	const [walletAddress, setWalletAddress] = useState('')
	const [filterTokenAddresses, setFilterTokenAddresses] = useState<string>('')
	const [isLoading, setIsLoading] = useState(false)
	const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})
	const [transactionsData, setTransactionsData] = useState<TransactionDay[]>([])
	const [todaySummary, setTodaySummary] = useState<TodaySummary | null>(null)
	const [summary, setSummary] = useState<Summary | null>(null)
	const [openDialog, setOpenDialog] = useState(false)
	const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([])
	const [isHistoryOpen, setIsHistoryOpen] = useState(false)
	const [showCalculator, setShowCalculator] = useState(false)
	const [pointValue, setPointValue] = useState(10)

	const todayStr = dayjs().format('YYYY-MM-DD')

	useEffect(() => {
		// 自动填充过滤代币地址
		const saved = localStorage.getItem('filterTokenAddresses')
		if (saved) {
			setFilterTokenAddresses(JSON.parse(saved).join('\n'))
		}
		
		// 加载查询历史记录
		loadHistory()
	}, [])

	// 从本地存储加载历史记录
	const loadHistory = () => {
		try {
			const stored = localStorage.getItem(HISTORY_STORAGE_KEY)
			if (stored) {
				const history = JSON.parse(stored)
				setQueryHistory(history)
			}
		} catch (error) {
			console.error('加载历史记录失败:', error)
		}
	}

	// 保存历史记录到本地存储
	const saveHistory = (history: QueryHistory[]) => {
		try {
			localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
		} catch (error) {
			console.error('保存历史记录失败:', error)
		}
	}

	// 添加新的查询记录
	const addToHistory = (address: string) => {
		if (!address.trim()) return

		const newHistory: QueryHistory = {
			id: Date.now().toString(),
			address: address.trim(),
			timestamp: Date.now(),
		}

		// 检查是否已存在相同的地址
		const existingIndex = queryHistory.findIndex(
			item => item.address.toLowerCase() === address.trim().toLowerCase()
		)

		let updatedHistory: QueryHistory[]
		
		if (existingIndex !== -1) {
			// 如果已存在，更新现有记录的时间戳并移到顶部
			updatedHistory = [
				{ ...queryHistory[existingIndex], timestamp: Date.now() },
				...queryHistory.filter((_, index) => index !== existingIndex)
			]
		} else {
			// 如果不存在，添加新记录
			updatedHistory = [newHistory, ...queryHistory]
			
			// 限制历史记录数量
			if (updatedHistory.length > MAX_HISTORY_COUNT) {
				updatedHistory = updatedHistory.slice(0, MAX_HISTORY_COUNT)
			}
		}

		setQueryHistory(updatedHistory)
		saveHistory(updatedHistory)
	}

	// 从历史记录中选择地址
	const selectFromHistory = (history: QueryHistory) => {
		setWalletAddress(history.address)
		setIsHistoryOpen(false)
	}

	// 删除历史记录
	const deleteHistory = (id: string) => {
		const updatedHistory = queryHistory.filter(item => item.id !== id)
		setQueryHistory(updatedHistory)
		saveHistory(updatedHistory)
	}

	// 清空所有历史记录
	const clearAllHistory = () => {
		setQueryHistory([])
		localStorage.removeItem(HISTORY_STORAGE_KEY)
	}

	// 格式化时间
	const formatTime = (timestamp: number) => {
		const date = new Date(timestamp)
		const now = new Date()
		const diff = now.getTime() - timestamp
		
		if (diff < 60000) { // 1分钟内
			return '刚刚'
		} else if (diff < 3600000) { // 1小时内
			return `${Math.floor(diff / 60000)}分钟前`
		} else if (diff < 86400000) { // 1天内
			return `${Math.floor(diff / 3600000)}小时前`
		} else {
			return date.toLocaleDateString()
		}
	}

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
		
		// 添加到历史记录
		addToHistory(walletAddress)
		
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
		<div className="container mx-auto space-y-4 sm:space-y-6 py-10 sm:py-20 px-2 sm:px-4 md:px-10">
			{/* Wallet Address Input */}
			<div className="flex flex-col sm:flex-row gap-2">
			<Card className="p-2 sm:p-4 w-full">
				<CardHeader className="p-2 sm:p-4">
					<CardTitle className="text-base sm:text-xl">钱包地址查询</CardTitle>
					<CardDescription className="text-xs sm:text-sm">输入钱包地址查看交易统计</CardDescription>
				</CardHeader>
				<CardContent className="p-2 sm:p-4">
					<div className="flex space-x-1 sm:space-x-2">
						<div className="flex-1 relative">
							<Input
								placeholder="输入钱包地址"
								value={walletAddress}
								onChange={(e) => setWalletAddress(e.target.value)}
								className="text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-2 pr-8"
							/>
							<Popover open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
										title="查询历史记录"
									>
										<History className="h-3 w-3" />
									</Button>
								</PopoverTrigger>
									<PopoverContent className="w-72 sm:w-80 max-w-[90vw] p-2 mt-2 sm:mt-4 translate-x-2.5 sm:translate-x-0" align="end">
										<div className="space-y-3 sm:space-y-4">
											<div className="flex items-center justify-between">
												<h4 className="font-medium text-xs sm:text-sm">查询历史记录</h4>
												<Button
													variant="ghost"
													size="sm"
													onClick={clearAllHistory}
													className="text-red-500 hover:text-red-700 text-xs"
												>
													清空
												</Button>
											</div>
											
											{queryHistory.length === 0 ? (
												<div className="text-center py-6 sm:py-8 text-muted-foreground">
													<Clock className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
													<p className="text-xs sm:text-sm">暂无查询记录</p>
												</div>
											) : (
												<div className="space-y-1.5 sm:space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
													{queryHistory.map((item) => (
														<div
															key={item.id}
															className="flex items-center justify-between p-1.5 sm:p-2 border rounded-lg hover:bg-gray-50 cursor-pointer group"
															onClick={() => selectFromHistory(item)}
														>
															<div className="flex-1 min-w-0">
																<div className="text-xs sm:text-sm font-medium truncate">
																	{item.address}
																</div>
																<div className="text-xs text-muted-foreground">
																	{formatTime(item.timestamp)}
																</div>
															</div>
															<Button
																variant="ghost"
																size="sm"
																onClick={(e) => {
																	e.stopPropagation()
																	deleteHistory(item.id)
																}}
																className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 h-5 w-5 sm:h-6 sm:w-6 p-0"
															>
																<Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
															</Button>
														</div>
													))}
												</div>
											)}
										</div>
									</PopoverContent>
								</Popover>
						</div>
						<Button onClick={handleSearch} disabled={isLoading || !walletAddress} className="px-2 py-1 text-xs sm:text-sm md:px-4 md:py-2 md:text-base">
							<Search className="mr-1 sm:mr-2 h-4 w-4" />
							{isLoading ? '查询中...' : '查询'}
						</Button>
						<Dialog open={openDialog} onOpenChange={setOpenDialog}>
							<DialogTrigger asChild>
								<Button
									variant="outline"
									className="px-2 py-1 text-xs sm:text-sm md:px-4 md:py-2 md:text-base"
								>
									<Settings className="mr-1 sm:mr-2 h-4 w-4" />
									<span className="sm:inline">设置</span>
								</Button>
							</DialogTrigger>
							<DialogContent className="p-2 sm:p-4">
								<DialogHeader>
									<DialogTitle className="text-base sm:text-lg">过滤设置</DialogTitle>
									<DialogDescription className="text-xs sm:text-sm">设置要过滤的代币地址</DialogDescription>
								</DialogHeader>
								<div className="space-y-2 sm:space-y-4">
									<div>
										<Label htmlFor="filtered-tokens" className="text-xs sm:text-sm">过滤代币地址</Label>
										<Textarea
											id="filtered-tokens"
											placeholder="输入要过滤的代币合约地址，每行一个"
											value={filterTokenAddresses}
											onChange={(e) => setFilterTokenAddresses(e.target.value)}
											rows={4}
											className="text-xs sm:text-sm"
										/>
									</div>
									<Button className="w-full text-xs sm:text-sm py-1 sm:py-2" onClick={handleSaveFilter}>
										保存设置
									</Button>
								</div>
							</DialogContent>
						</Dialog>
						<Button className="px-2 py-1 text-xs sm:text-sm md:px-4 md:py-2 md:text-base" onClick={() => setShowCalculator(v => !v)}>
							<Calculator className="mr-1 sm:mr-2 h-4 w-4" />
							<span className="sm:inline">计算器</span>
						</Button>
					</div>
				</CardContent>
			</Card>
			{/* 积分计算器Card */}
			{showCalculator && (
			<Card className='w-full sm:w-[350px]'>
				<CardHeader>
					<CardTitle>积分计算器</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 items-start">
						<div className="w-full flex flex-col items-start">
							<label htmlFor="point-range" className="mb-2 text-sm">积分：<span className="font-bold text-lg text-blue-600">{pointValue}</span></label>
							<input
								type="range"
								id="point-range"
								min={1}
								max={30}
								value={pointValue}
								onChange={e => setPointValue(Number(e.target.value))}
								className="w-full max-w-xs"
							/>
						</div>
						<div className="text-sm mt-2">所需交易量：<span className="font-bold text-lg text-green-600">${Math.pow(2, pointValue).toLocaleString()}</span></div>
					</div>
				</CardContent>
			</Card>
			)}
			</div>


			{/* Summary Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
				<Card className="p-2 sm:p-4">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-4">
						<CardTitle className="text-xs sm:text-sm font-medium">总交易量</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="p-2 sm:p-4">
						<div className="text-lg sm:text-2xl font-bold">${formatMoney(summary?.totalValue)}</div>
					</CardContent>
				</Card>
				<Card className="p-2 sm:p-4">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-4">
						<CardTitle className="text-xs sm:text-sm font-medium">获得积分</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="p-2 sm:p-4">
						<div className="text-lg sm:text-2xl font-bold">{summary?.totalPoints}</div>
					</CardContent>
				</Card>
				<Card className="p-2 sm:p-4">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-4">
						<CardTitle className="text-xs sm:text-sm font-medium">总损耗</CardTitle>
						<TrendingDown className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="p-2 sm:p-4">
						<div className="text-lg sm:text-2xl font-bold">{getConsumeFormat(summary?.totalLoss || 0)}</div>
						<p className="text-xs text-muted-foreground">包含Gas费用</p>
					</CardContent>
				</Card>
				<Card className="p-2 sm:p-4">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-4">
						<CardTitle className="text-xs sm:text-sm font-medium">Gas费用</CardTitle>
						<Zap className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="p-2 sm:p-4">
						<div className="text-lg sm:text-2xl font-bold">
							${formatMoney(summary?.totalGasUsd)}{' '}
							<span className="text-xs text-muted-foreground">({summary?.totalGas} BNB)</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* 当日进度 */}
			<div className="mt-2 sm:mt-4">
				<Card className="p-2 sm:p-4">
					<CardHeader className="p-2 sm:p-4">
						<CardTitle className="text-base sm:text-lg">当日进度</CardTitle>
						<CardDescription className="text-xs sm:text-sm">今日交易数据</CardDescription>
					</CardHeader>
					<CardContent className="p-2 sm:p-4">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
							<div>
								<div className="text-gray-400 mb-1 text-xs sm:text-sm">今日交易量</div>
								<div className="font-bold text-base sm:text-lg">${formatMoney(todaySummary?.totalValue || 0)}</div>
							</div>
							<div>
								<div className="text-gray-400 mb-1 text-xs sm:text-sm">今日积分</div>
								<div className="font-bold text-base sm:text-lg">{todaySummary?.totalPoints || 0}</div>
							</div>
							<div>
								<div className="text-gray-400 mb-1 text-xs sm:text-sm">今日损耗(包含Gas)</div>
								<Tooltip>
									<TooltipTrigger>
										<div className="font-bold underline text-base sm:text-lg">{getConsumeFormat(todaySummary?.totalLossWithGas || 0)}</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>消耗: {getConsumeFormat(todaySummary?.totalLoss || 0)}</p>
										<p>Gas: ${formatMoney(todaySummary?.totalGasUsd || 0)}</p>
									</TooltipContent>
								</Tooltip>
							</div>
							<div>
								<div className="text-gray-400 mb-1 text-xs sm:text-sm">
									进度 {Number(todaySummary?.progressPercentSegment || 0).toFixed(2)}%
								</div>
								<div className="mt-1 sm:mt-2">
									<div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
										<div
											className="bg-green-500 h-2 sm:h-3 rounded-full transition-all"
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
			<Card className="p-2 sm:p-4">
				<CardHeader className="p-2 sm:p-4">
					<CardTitle className="text-base sm:text-lg">交易记录</CardTitle>
					<CardDescription className="text-xs sm:text-sm">按天分组的交易历史</CardDescription>
				</CardHeader>
				<CardContent className="p-2 sm:p-4">
					<div className="space-y-2 sm:space-y-4">
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
										}
									>
										<div className="p-2 sm:p-4 flex justify-between items-center">
											<h4 className="text-sm sm:text-base font-medium">{date}</h4>
											<span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
												<ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
											</span>
										</div>
										<div className="p-2 sm:p-4 pt-0">
											<div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 text-xs sm:text-sm">
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
											<div className="border-t p-2 sm:p-4 overflow-auto bg-gray-50">
												<table className="w-full table-auto rounded-lg overflow-hidden shadow-md text-xs sm:text-sm">
													<thead className="bg-white text-gray-400">
														<tr>
															<th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium">交易哈希</th>
															<th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium">时间</th>
															<th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium">代币</th>
															<th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium">转入</th>
															<th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium">转出</th>
															<th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium">状态</th>
														</tr>
													</thead>
													<tbody className="divide-y">
														{flowData.map((row, transIndex) => (
															<tr key={transIndex}>
																<td className="px-2 sm:px-4 py-2 sm:py-3">
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
																<td className="px-2 sm:px-4 py-2 sm:py-3">{row.time}</td>
																<td className="px-2 sm:px-4 py-2 sm:py-3">{row.coin}</td>
																<td className="px-2 sm:px-4 py-2 sm:py-3 text-green-500">{row.inflow}</td>
																<td className="px-2 sm:px-4 py-2 sm:py-3 text-red-500">{row.outflow}</td>
																<td className="px-2 sm:px-4 py-2 sm:py-3">{row.status}</td>
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
							<div className="border rounded-lg text-xs sm:text-sm p-3 sm:p-5 text-center text-gray-400">未找到该地址下的交易记录</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

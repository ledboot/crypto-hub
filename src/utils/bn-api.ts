import TransactionUtils from './transaction'

/**
 * API相关工具函数 (TypeScript重写)
 */
export default class BnApiUtils {
	static BSC_SCAN_API_URL = '/api/bscscan-proxy'
	static BINANCE_API_URL = '/api/binance-proxy'
	static TARGET_CONTRACT = '0xb300000b72DEAEb607a12d5f54773D1C19c7028d'.toLowerCase()

	static priceCache: Map<string, number> = new Map()
	static cacheExpiry: Map<string, number> = new Map()
	static CACHE_DURATION = 60 * 1000 // 1分钟缓存
	static pendingRequests: Map<string, Promise<number>> = new Map()

	static defaultPrices: Record<string, string> = {
		USDC: '1',
		'BSC-USD': '1',
		USDT: '1',
	}

	/**
	 * 从BSCScan API获取交易（通过代理）
	 */
	static async fetchTransactions(address: string, action: string, apiKey?: string): Promise<any[]> {
		try {
			const url = `${this.BSC_SCAN_API_URL}?action=${action}&address=${address}`
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			
			const data = await response.json()
			
			// 检查代理 API 是否返回错误
			if (data.error) {
				throw new Error(data.error)
			}
			
			if (data.status === '1') {
				return data.result || []
			} else if (data.status === '0' && data.message === 'No transactions found') {
				return []
			} else {
				console.warn(`获取${action}时API返回错误:`, data.message)
				return []
			}
		} catch (error) {
			console.error(`获取${action}时出错:`, error)
			throw new Error(`获取${action}数据失败`)
		}
	}

	/**
	 * 批量获取多个地址的交易数据
	 */
	static async fetchMultipleAddressesData(
		addresses: string[],
		progressCallback?: (completed: number, total: number) => void
	): Promise<Record<string, any[]>> {
		const transactionsData: Record<string, any[]> = {}
		let completed = 0
		for (const address of addresses) {
			try {
				const transactions = await this.fetchAddressData(address)
				transactionsData[address] = transactions
				completed++
				if (progressCallback) {
					progressCallback(completed, addresses.length)
				}
			} catch (error) {
				console.error(`获取地址 ${address} 的交易数据失败:`, error)
			}
		}
		return transactionsData
	}

	static async fetchTokenPrice(symbol: string): Promise<number> {
		const localPriceTokens = ['USDC', 'BSC-USD', 'USDT']
		if (localPriceTokens.includes(symbol)) {
			return parseFloat(this.defaultPrices[symbol] || '1')
		}
		const cacheKey = symbol.toUpperCase()
		const now = Date.now()
		if (
			this.priceCache.has(cacheKey) &&
			this.cacheExpiry.has(cacheKey) &&
			(this.cacheExpiry.get(cacheKey) as number) > now
		) {
			return this.priceCache.get(cacheKey) as number
		}
		if (this.pendingRequests.has(cacheKey)) {
			return await (this.pendingRequests.get(cacheKey) as Promise<number>)
		}
		const requestPromise = this.fetchTokenPriceFromAPI(symbol, cacheKey, now)
		this.pendingRequests.set(cacheKey, requestPromise)
		try {
			const price = await requestPromise
			return price
		} finally {
			this.pendingRequests.delete(cacheKey)
		}
	}

	static async fetchTokenPriceFromAPI(symbol: string, cacheKey: string, now: number): Promise<number> {
		try {
			let tradingPair = `${symbol.toUpperCase()}USDT`
			if (symbol.toUpperCase() === 'BNB') {
				tradingPair = 'BNBUSDT'
			} else if (symbol.toUpperCase() === 'ETH') {
				tradingPair = 'ETHUSDT'
			} else if (symbol.toUpperCase() === 'BTC') {
				tradingPair = 'BTCUSDT'
			}
			
			// 使用代理 API
			const url = `${this.BINANCE_API_URL}?symbol=${tradingPair}`
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			
			const data = await response.json()
			
			// 检查代理 API 是否返回错误
			if (data.error) {
				throw new Error(data.error)
			}
			
			if (data.price) {
				const price = parseFloat(data.price)
				this.priceCache.set(cacheKey, price)
				this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION)
				return price
			} else {
				throw new Error('Invalid response format')
			}
		} catch (error: any) {
			console.warn(`获取 ${symbol} 价格失败:`, error.message)
			this.priceCache.set(cacheKey, 0)
			this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION)
			return 0
		}
	}

	/**
	 * 批量获取代币价格（使用代理 API）
	 */
	static async fetchMultipleTokenPrices(symbols: string[]): Promise<Record<string, number>> {
		const priceMap: Record<string, number> = {}
		const uniqueSymbols = [...new Set(symbols)]
		
		try {
			// 使用批量代理 API
			const response = await fetch('/api/binance-proxy/batch', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ symbols: uniqueSymbols }),
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			
			if (data.error) {
				throw new Error(data.error)
			}

			// 处理结果
			Object.entries(data.results).forEach(([symbol, result]: [string, any]) => {
				if (result && result.price) {
					priceMap[symbol] = parseFloat(result.price)
				} else {
					priceMap[symbol] = 0
				}
			})

			// 处理本地价格代币
			uniqueSymbols.forEach(symbol => {
				if (!priceMap[symbol]) {
					const localPriceTokens = ['USDC', 'BSC-USD', 'USDT']
					if (localPriceTokens.includes(symbol.toUpperCase())) {
						priceMap[symbol] = parseFloat(this.defaultPrices[symbol.toUpperCase()] || '1')
					} else {
						priceMap[symbol] = 0
					}
				}
			})

			if (data.errors && data.errors.length > 0) {
				console.warn('批量获取价格时出现错误:', data.errors)
			}

		} catch (error) {
			console.warn('批量获取价格失败，回退到单个获取:', error)
			
			// 回退到原来的单个获取方法
			const BATCH_SIZE = 5
			for (let i = 0; i < uniqueSymbols.length; i += BATCH_SIZE) {
				const batch = uniqueSymbols.slice(i, i + BATCH_SIZE)
				const pricePromises = batch.map(async (symbol) => {
					try {
						const price = await this.fetchTokenPrice(symbol)
						return { symbol, price }
					} catch (error) {
						console.warn(`获取 ${symbol} 价格失败:`, error)
						return { symbol, price: 0 }
					}
				})
				const results = await Promise.all(pricePromises)
				results.forEach(({ symbol, price }) => {
					priceMap[symbol] = price
				})
				if (i + BATCH_SIZE < uniqueSymbols.length) {
					await new Promise((resolve) => setTimeout(resolve, 100))
				}
			}
		}
		
		return priceMap
	}

	/**
	 * 获取地址的所有交易数据
	 */
	static async fetchAddressData(address: string, apiKey?: string): Promise<any[]> {
		try {
			const normalTxList = await this.fetchTransactions(address, 'txlist')
			const internalTxList = await this.fetchTransactions(address, 'txlistinternal')
			const tokenTxList = await this.fetchTransactions(address, 'tokentx')
			const allTransactions = TransactionUtils.processTransactions(address, normalTxList, internalTxList, tokenTxList)
			// 筛选与目标合约的交易
			const filteredTransactions = allTransactions.filter(
				(tx: any) => tx.to.toLowerCase() === this.TARGET_CONTRACT || tx.from.toLowerCase() === this.TARGET_CONTRACT
			)
			return filteredTransactions.slice(0, 15 * 100)
		} catch (error) {
			console.error(`获取地址 ${address} 的交易数据时出错:`, error)
			throw error
		}
	}

	/**
	 * 清除价格缓存
	 */
	static clearPriceCache() {
		this.priceCache.clear()
		this.cacheExpiry.clear()
	}

	/**
	 * 获取缓存统计信息
	 */
	static getCacheStats() {
		const now = Date.now()
		let validCacheCount = 0
		let expiredCacheCount = 0
		this.cacheExpiry.forEach((expiry: number) => {
			if (expiry > now) {
				validCacheCount++
			} else {
				expiredCacheCount++
			}
		})
		return {
			totalCached: this.priceCache.size,
			validCache: validCacheCount,
			expiredCache: expiredCacheCount,
		}
	}
}

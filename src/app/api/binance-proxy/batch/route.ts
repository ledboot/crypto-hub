import { NextRequest, NextResponse } from 'next/server'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { createServerApi } from '@/lib/api';

const httpsAgent = process.env.HTTP_PROXY ? new HttpsProxyAgent(process.env.HTTP_PROXY) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { symbols } = body
    
    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        { error: 'Missing or invalid symbols array' },
        { status: 400 }
      )
    }

    // 去重并限制批量大小
    const uniqueSymbols = [...new Set(symbols)].slice(0, 20) // 最多20个符号
    
    const results: Record<string, any> = {}
    const errors: string[] = []
    const api = createServerApi(request)

    // 并发获取价格，但限制并发数量
    const BATCH_SIZE = 5
    for (let i = 0; i < uniqueSymbols.length; i += BATCH_SIZE) {
      const batch = uniqueSymbols.slice(i, i + BATCH_SIZE)
      
      const batchPromises = batch.map(async (symbol) => {
        try {
          let tradingPair = `${symbol.toUpperCase()}USDT`
          if (symbol.toUpperCase() === 'BNB') {
            tradingPair = 'BNBUSDT'
          } else if (symbol.toUpperCase() === 'ETH') {
            tradingPair = 'ETHUSDT'
          } else if (symbol.toUpperCase() === 'BTC') {
            tradingPair = 'BTCUSDT'
          }

          const binanceUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${tradingPair}`
          
          const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
          }
          

          const requestConfig: any = {
            headers,
          }
          
          // 只有当代理存在时才添加到请求配置中
          if (httpsAgent) {
            requestConfig.httpsAgent = httpsAgent
            requestConfig.httpAgent = httpsAgent
          }

          const response = await api.get(binanceUrl, requestConfig)

          if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}`)
          }

          const data = response.data
          return { symbol, data }
        } catch (error) {
          console.warn(`获取 ${symbol} 价格失败:`, error)
          return { symbol, error: error instanceof Error ? error.message : 'Unknown error' }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      
      batchResults.forEach(({ symbol, data, error }) => {
        if (error) {
          errors.push(`${symbol}: ${error}`)
        } else {
          results[symbol] = data
        }
      })

      // 批次间延迟，避免请求过于频繁
      if (i + BATCH_SIZE < uniqueSymbols.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return NextResponse.json({
      results,
      errors: errors.length > 0 ? errors : undefined,
      total: uniqueSymbols.length,
      success: Object.keys(results).length,
      failed: errors.length
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })

  } catch (error) {
    console.error('Batch Binance proxy error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process batch request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
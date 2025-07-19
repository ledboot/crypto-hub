import { NextRequest, NextResponse } from 'next/server'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { createServerApi } from '@/lib/api';

const httpsAgent = new HttpsProxyAgent(process.env.HTTP_PROXY || "");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Missing symbol parameter' },
        { status: 400 }
      )
    }

    const api = createServerApi(request)

    // 构建 Binance API URL
    const binanceUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    
    // 设置请求头，模拟浏览器请求
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
    }
    const response = await api.get(binanceUrl, {
      headers,
      httpsAgent,
      httpAgent: httpsAgent,
    })

    if (response.status !== 200) {
      throw new Error(`Binance API responded with status: ${response.status}`)
    }

    const data = response.data

    // 返回数据给客户端
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=60', // 缓存1分钟
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })

  } catch (error) {
    console.error('Binance proxy error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch data from Binance API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { createServerApi } from '@/lib/api';

const httpsAgent = process.env.HTTP_PROXY ? new HttpsProxyAgent(process.env.HTTP_PROXY) : null;


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const address = searchParams.get('address')
    
    if (!action || !address) {
      return NextResponse.json(
        { error: 'Missing required parameters: action and address' },
        { status: 400 }
      )
    }

    // 从环境变量获取 API 密钥
    const apiKey = process.env.NEXT_PUBLIC_BSC_SCAN_API_KEY || process.env.BSC_SCAN_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'BSC Scan API key not configured' },
        { status: 500 }
      )
    }

    const api = createServerApi(request)

    // 构建 BSC Scan API URL
    const bscScanUrl = `https://api.bscscan.com/api?module=account&action=${action}&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
    
    // 设置请求头
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
    }

    // 发起请求到 BSC Scan API
    const requestConfig: any = {
      headers,
    }
    
    // 只有当代理存在时才添加到请求配置中
    if (httpsAgent) {
      requestConfig.httpsAgent = httpsAgent
      requestConfig.httpAgent = httpsAgent
    }
    
    const response = await api.get(bscScanUrl, requestConfig)

    if (response.status !== 200) {
      throw new Error(`BSC Scan API responded with status: ${response.status}`)
    }

    const data = response.data

    // 处理 BSC Scan API 的响应
    if (data.status === '1') {
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, max-age=3', // 缓存3秒
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    } else if (data.status === '0' && data.message === 'No transactions found') {
      return NextResponse.json({
        status: '1',
        message: 'OK',
        result: []
      }, {
        headers: {
          'Cache-Control': 'public, max-age=3',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    } else {
      console.warn(`BSC Scan API error for ${action}:`, data.message)
      return NextResponse.json({
        status: '0',
        message: data.message || 'API Error',
        result: []
      }, {
        headers: {
          'Cache-Control': 'public, max-age=3', // 错误时缓存3秒
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }

  } catch (error) {
    console.error('BSC Scan proxy error:', error)
    
    return NextResponse.json(
      { 
        status: '0',
        message: 'Failed to fetch data from BSC Scan API',
        result: []
      },
      { status: 500 }
    )
  }
}
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ApiTestPage() {
  const [symbol, setSymbol] = useState('BTC')
  const [singleResult, setSingleResult] = useState<any>(null)
  const [batchSymbols, setBatchSymbols] = useState('BTC,ETH,BNB,ADA')
  const [batchResult, setBatchResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [batchLoading, setBatchLoading] = useState(false)
  
  // BSC Scan 测试状态
  const [bscAddress, setBscAddress] = useState('0x8894e0a0c962cb723c1976a4421c95949be2d4e3')
  const [bscAction, setBscAction] = useState('txlist')
  const [bscResult, setBscResult] = useState<any>(null)
  const [bscLoading, setBscLoading] = useState(false)

  const testSingleApi = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/binance-proxy?symbol=${symbol}USDT`)
      const data = await response.json()
      setSingleResult(data)
    } catch (error) {
      setSingleResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  const testBatchApi = async () => {
    setBatchLoading(true)
    try {
      const symbols = batchSymbols.split(',').map(s => s.trim())
      const response = await fetch('/api/binance-proxy/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols }),
      })
      const data = await response.json()
      setBatchResult(data)
    } catch (error) {
      setBatchResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setBatchLoading(false)
    }
  }

  const testBscScanApi = async () => {
    setBscLoading(true)
    try {
      const response = await fetch(`/api/bscscan-proxy?action=${bscAction}&address=${bscAddress}`)
      const data = await response.json()
      setBscResult(data)
    } catch (error) {
      setBscResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setBscLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Binance API 代理测试</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 单个 API 测试 */}
        <Card>
          <CardHeader>
            <CardTitle>单个价格查询</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="输入代币符号"
              />
              <Button onClick={testSingleApi} disabled={loading}>
                {loading ? '查询中...' : '查询'}
              </Button>
            </div>
            
            {singleResult && (
              <div className="space-y-2">
                <Badge variant={singleResult.error ? 'destructive' : 'default'}>
                  {singleResult.error ? '错误' : '成功'}
                </Badge>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(singleResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 批量 API 测试 */}
        <Card>
          <CardHeader>
            <CardTitle>批量价格查询</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value={batchSymbols}
                onChange={(e) => setBatchSymbols(e.target.value)}
                placeholder="输入代币符号，用逗号分隔"
              />
              <Button onClick={testBatchApi} disabled={batchLoading}>
                {batchLoading ? '查询中...' : '批量查询'}
              </Button>
            </div>
            
            {batchResult && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Badge variant={batchResult.error ? 'destructive' : 'default'}>
                    {batchResult.error ? '错误' : '成功'}
                  </Badge>
                  {!batchResult.error && (
                    <>
                      <Badge variant="secondary">总计: {batchResult.total}</Badge>
                      <Badge variant="secondary">成功: {batchResult.success}</Badge>
                      {batchResult.failed > 0 && (
                        <Badge variant="destructive">失败: {batchResult.failed}</Badge>
                      )}
                    </>
                  )}
                </div>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
                  {JSON.stringify(batchResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* BSC Scan API 测试 */}
        <Card>
          <CardHeader>
            <CardTitle>BSC Scan 查询</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value={bscAddress}
                onChange={(e) => setBscAddress(e.target.value)}
                placeholder="输入 BSC 地址"
              />
              <select
                value={bscAction}
                onChange={(e) => setBscAction(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="txlist">普通交易</option>
                <option value="txlistinternal">内部交易</option>
                <option value="tokentx">代币交易</option>
              </select>
              <Button onClick={testBscScanApi} disabled={bscLoading}>
                {bscLoading ? '查询中...' : '查询'}
              </Button>
            </div>
            
            {bscResult && (
              <div className="space-y-2">
                <Badge variant={bscResult.status === '1' ? 'default' : 'destructive'}>
                  {bscResult.status === '1' ? '成功' : '错误'}
                </Badge>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
                  {JSON.stringify(bscResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• 单个查询：输入代币符号（如 BTC、ETH、BNB）</p>
            <p>• 批量查询：输入多个代币符号，用逗号分隔</p>
            <p>• 代理 API 会自动处理 USDT 交易对</p>
            <p>• 支持常见代币：BTC、ETH、BNB、ADA、DOT 等</p>
            <p>• 如果代理 API 失败，系统会自动回退到单个查询模式</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Settings, TrendingUp, TrendingDown, DollarSign, Zap } from "lucide-react"

export function AlphaWalletQuery() {
  const [walletAddress, setWalletAddress] = useState("")
  const [filteredTokens, setFilteredTokens] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mock data
  const summary = {
    totalVolume: "$125,430",
    totalPoints: "2,847",
    totalLoss: "$3,240",
    gasUsed: "$1,120",
  }

  const tradingRecords = [
    {
      date: "2025-01-10",
      transactions: [
        {
          time: "14:30",
          token: "PEPE",
          type: "Buy",
          amount: "1000",
          price: "$0.00001234",
          pnl: "+$45.20",
          gas: "$12.50",
        },
        {
          time: "16:45",
          token: "SHIB",
          type: "Sell",
          amount: "50000",
          price: "$0.00002156",
          pnl: "-$23.10",
          gas: "$15.30",
        },
      ],
    },
    {
      date: "2025-01-09",
      transactions: [
        { time: "09:15", token: "DOGE", type: "Buy", amount: "500", price: "$0.3456", pnl: "+$78.90", gas: "$18.20" },
        {
          time: "11:30",
          token: "FLOKI",
          type: "Sell",
          amount: "2000",
          price: "$0.00012",
          pnl: "+$12.40",
          gas: "$14.80",
        },
      ],
    },
  ]

  const handleSearch = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trading Statistics</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
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
                  value={filteredTokens}
                  onChange={(e) => setFilteredTokens(e.target.value)}
                  rows={6}
                />
              </div>
              <Button className="w-full">保存设置</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
              {isLoading ? "查询中..." : "查询"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {walletAddress && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总交易量</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalVolume}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">获得积分</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalPoints}</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总损耗</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalLoss}</div>
                <p className="text-xs text-muted-foreground">包含Gas费用</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gas费用</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.gasUsed}</div>
                <p className="text-xs text-muted-foreground">平均 $8.50 per tx</p>
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
              <div className="space-y-6">
                {tradingRecords.map((dayRecord) => (
                  <div key={dayRecord.date}>
                    <h3 className="text-lg font-semibold mb-3">{dayRecord.date}</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>时间</TableHead>
                          <TableHead>代币</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>数量</TableHead>
                          <TableHead>价格</TableHead>
                          <TableHead>盈亏</TableHead>
                          <TableHead>Gas费</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dayRecord.transactions.map((tx, index) => (
                          <TableRow key={index}>
                            <TableCell>{tx.time}</TableCell>
                            <TableCell className="font-medium">{tx.token}</TableCell>
                            <TableCell>
                              <Badge variant={tx.type === "Buy" ? "default" : "secondary"}>{tx.type}</Badge>
                            </TableCell>
                            <TableCell>{tx.amount}</TableCell>
                            <TableCell>{tx.price}</TableCell>
                            <TableCell>
                              <Badge variant={tx.pnl.startsWith("+") ? "default" : "destructive"}>{tx.pnl}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{tx.gas}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

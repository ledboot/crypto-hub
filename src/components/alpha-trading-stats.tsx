"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function AlphaTradingStats() {   
  const [timeFilter, setTimeFilter] = useState("24h")
  const [sortBy, setSortBy] = useState("volume")

  // Mock data for charts
  const topTokensData = [
    { name: "PEPE", volume: 2500000, score: 95, change: 15.2 },
    { name: "SHIB", volume: 1800000, score: 88, change: 8.7 },
    { name: "DOGE", volume: 1200000, score: 82, change: -2.1 },
    { name: "FLOKI", volume: 980000, score: 79, change: 12.5 },
    { name: "BONK", volume: 750000, score: 75, change: 5.3 },
    { name: "WIF", volume: 650000, score: 72, change: -1.8 },
    { name: "POPCAT", volume: 580000, score: 69, change: 8.9 },
    { name: "MEW", volume: 520000, score: 67, change: 3.4 },
    { name: "BRETT", volume: 480000, score: 64, change: -4.2 },
    { name: "NEIRO", volume: 420000, score: 62, change: 7.1 },
  ]

  const dailyVolumeData = [
    { date: "01-06", volume: 6800000, transactions: 12350, avgScore: 82 },
    { date: "01-07", volume: 7500000, transactions: 14200, avgScore: 80 },
    { date: "01-08", volume: 9100000, transactions: 18900, avgScore: 75 },
    { date: "01-09", volume: 6800000, transactions: 12350, avgScore: 82 },
    { date: "01-10", volume: 8200000, transactions: 15420, avgScore: 78 },
    { date: "01-11", volume: 9800000, transactions: 17650, avgScore: 85 },
    { date: "01-12", volume: 11200000, transactions: 19800, avgScore: 88 },
  ]

  const scoreDistributionData = [
    { range: "90-100", count: 45, percentage: 3.6, color: "#22c55e" },
    { range: "80-89", count: 156, percentage: 12.5, color: "#3b82f6" },
    { range: "70-79", count: 324, percentage: 26.0, color: "#f59e0b" },
    { range: "60-69", count: 487, percentage: 39.1, color: "#ef4444" },
    { range: "0-59", count: 235, percentage: 18.8, color: "#6b7280" },
  ]

  const hourlyTrendData = [
    { hour: "00:00", volume: 450000, transactions: 1200 },
    { hour: "04:00", volume: 320000, transactions: 850 },
    { hour: "08:00", volume: 680000, transactions: 1800 },
    { hour: "12:00", volume: 920000, transactions: 2400 },
    { hour: "16:00", volume: 1100000, transactions: 2800 },
    { hour: "20:00", volume: 850000, transactions: 2200 },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alpha Stats</h1>
        <div className="flex items-center space-x-4">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10min">Last 10min</SelectItem>
              <SelectItem value="1h">Last 1h</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7d</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volume">By Volume</SelectItem>
              <SelectItem value="token">By Token</SelectItem>
              <SelectItem value="score">By Score</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12.4M</div>
            <p className="text-xs text-muted-foreground">+20.1% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,420</div>
            <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Alpha Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.2</div>
            <p className="text-xs text-muted-foreground">+2.1% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tokens</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+5.2% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Tokens Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Tokens by Volume</CardTitle>
          <CardDescription>Trading volume in the {timeFilter}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topTokensData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Volume and Transactions Trend */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Volume Trend</CardTitle>
            <CardDescription>7-day volume trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyVolumeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis
                  className="text-muted-foreground"
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Transactions</CardTitle>
            <CardDescription>7-day transaction count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyVolumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="transactions"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alpha Score vs Volume Scatter */}
      <Card>
        <CardHeader>
          <CardTitle>Alpha Score vs Volume</CardTitle>
          <CardDescription>Relationship between alpha score and trading volume</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topTokensData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-muted-foreground" />
              <YAxis yAxisId="left" className="text-muted-foreground" />
              <YAxis yAxisId="right" orientation="right" className="text-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="score" fill="hsl(var(--primary))" name="Alpha Score" />
              <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#ff7300" name="Volume" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Hourly Activity */}
      <Card>
        <CardHeader>
          <CardTitle>24h Activity Pattern</CardTitle>
          <CardDescription>Hourly trading activity pattern</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="hour" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="transactions"
                stackId="1"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alpha Score Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alpha Score Distribution</CardTitle>
            <CardDescription>Distribution of alpha scores across all tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, percentage }) => `${range}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {scoreDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score Distribution Details</CardTitle>
            <CardDescription>Detailed breakdown by score ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreDistributionData.map((item) => (
                <div key={item.range} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium">{item.range}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{item.count}</div>
                    <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Token Performance Comparison</CardTitle>
          <CardDescription>Price change vs Alpha Score for top tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {topTokensData.slice(0, 5).map((token) => (
              <div key={token.name} className="text-center p-4 border rounded-lg">
                <div className="font-bold text-lg">{token.name}</div>
                <div className="text-2xl font-bold my-2">
                  <Badge variant="outline">{token.score}</Badge>
                </div>
                <div className="text-sm">
                  <Badge variant={token.change > 0 ? "default" : "destructive"}>
                    {token.change > 0 ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {token.change > 0 ? "+" : ""}
                    {token.change}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

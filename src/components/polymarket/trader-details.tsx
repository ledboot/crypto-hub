'use client';

import { Trader } from "@/lib/mock-polymarket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

interface TraderDetailsProps {
  trader: Trader;
}

export function TraderDetails({ trader }: TraderDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-secondary border-4 border-background shadow-sm">
            <img src={trader.avatar} alt={trader.username} className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{trader.username}</h1>
            <div className="flex gap-2 mt-2">
              {trader.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant={isFavorite ? "default" : "outline"} 
            onClick={() => setIsFavorite(!isFavorite)}
            className="gap-2"
          >
            <Star className={`h-4 w-4 ${isFavorite ? "fill-primary-foreground" : ""}`} />
            {isFavorite ? "Favorited" : "Favorite"}
          </Button>
          <Button variant="outline" onClick={() => window.open(`https://polymarket.com/profile/${trader.id}`, '_blank')}>
            View on Polymarket
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(trader.currentValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall PnL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${trader.overallPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
              {trader.overallPnL >= 0 ? "+" : ""}{formatCurrency(trader.overallPnL)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trader.winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {trader.totalWins}W - {trader.totalLosses}L
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trader.totalPositions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {trader.activePositions} Active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>PnL History (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trader.history}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).getDate().toString()}
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), "Value"]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">Bought "Yes" on Market #{1000 + i}</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">+$500.00</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming Avatar exists or I'll use simple img
import { useRouter } from "next/navigation";
import { Trader } from "@/lib/mock-polymarket";

// I'll assume Avatar component might not exist in ui folder based on previous ls, so I'll check or just use img for now.
// Actually I didn't see avatar.tsx in the list. I'll use standard img tag or check if I missed it.
// Checking the list again: alert, badge, button, card, checkbox, dialog, input, label, navigation-menu, popover, select, table, tabs, textarea, tooltip.
// No avatar.tsx. I'll use a simple div/img.

interface TradersTableProps {
  data: Trader[];
}

export function TradersTable({ data }: TradersTableProps) {
  const router = useRouter();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPnL = (value: number) => {
    const formatted = formatCurrency(Math.abs(value));
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Rank</TableHead>
            <TableHead>Trader</TableHead>
            <TableHead className="text-right">Positions</TableHead>
            <TableHead className="text-right">Win Rate</TableHead>
            <TableHead className="text-right">Current Value</TableHead>
            <TableHead className="text-right">Overall PnL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((trader) => (
            <TableRow 
              key={trader.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/polymarket/traders/${trader.id}`)}
            >
              <TableCell className="font-medium">#{trader.rank}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-secondary">
                    <img src={trader.avatar} alt={trader.username} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{trader.username}</span>
                    <div className="flex gap-1 mt-1">
                      {trader.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1 h-4">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col">
                  <span>{trader.totalPositions} Total</span>
                  <span className="text-xs text-muted-foreground">{trader.activePositions} Active</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className={trader.winRate >= 50 ? "text-green-600" : "text-red-600"}>
                    {trader.winRate.toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {trader.totalWins}W - {trader.totalLosses}L
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(trader.currentValue)}
              </TableCell>
              <TableCell className={`text-right font-medium ${trader.overallPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatPnL(trader.overallPnL)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

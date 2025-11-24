'use client';

import { useState, useEffect } from 'react';
import { TradersFilter } from '@/components/polymarket/traders-filter';
import { TradersTable } from '@/components/polymarket/traders-table';
import { generateTraders, Trader } from '@/lib/mock-polymarket';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function TradersView() {
  const [data, setData] = useState<Trader[]>([]);
  const [filteredData, setFilteredData] = useState<Trader[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    username: '',
    tag: 'all',
    winRate: 'all',
    pnl: 'all',
  });

  const ITEMS_PER_PAGE = 100;

  useEffect(() => {
    // Generate mock data once
    const mockData = generateTraders(500); // Generate 500 traders for demo
    setData(mockData);
    setFilteredData(mockData);
  }, []);

  useEffect(() => {
    let result = [...data];

    if (filters.username) {
      result = result.filter(t => 
        t.username.toLowerCase().includes(filters.username.toLowerCase()) || 
        t.id.includes(filters.username)
      );
    }

    if (filters.tag !== 'all') {
      result = result.filter(t => t.tags.includes(filters.tag));
    }

    if (filters.winRate !== 'all') {
      if (filters.winRate === 'high') {
        result = result.filter(t => t.winRate > 60);
      } else if (filters.winRate === 'medium') {
        result = result.filter(t => t.winRate >= 40 && t.winRate <= 60);
      } else if (filters.winRate === 'low') {
        result = result.filter(t => t.winRate < 40);
      }
    }

    if (filters.pnl !== 'all') {
      if (filters.pnl === 'positive') {
        result = result.filter(t => t.overallPnL > 0);
      } else if (filters.pnl === 'negative') {
        result = result.filter(t => t.overallPnL < 0);
      }
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [filters, data]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Traders Leaderboard</h1>
        <p className="text-muted-foreground">
          Top performing traders on Polymarket. Filter by performance, tags, and more.
        </p>
      </div>

      <TradersFilter onFilterChange={setFilters} />

      <TradersTable data={currentData} />

      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} traders
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

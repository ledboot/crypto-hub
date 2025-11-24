'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface TradersFilterProps {
  onFilterChange: (filters: any) => void;
}

export function TradersFilter({ onFilterChange }: TradersFilterProps) {
  const [filters, setFilters] = useState({
    username: '',
    tag: 'all',
    winRate: 'all',
    pnl: 'all',
  });

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/30 rounded-lg border">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search by Username or ID"
          value={filters.username}
          onChange={(e) => handleChange('username', e.target.value)}
          className="bg-background"
        />
      </div>
      
      <div className="w-[180px]">
        <Select value={filters.tag} onValueChange={(value) => handleChange('tag', value)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Filter by Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            <SelectItem value="Whale">Whale</SelectItem>
            <SelectItem value="Degen">Degen</SelectItem>
            <SelectItem value="Smart Money">Smart Money</SelectItem>
            <SelectItem value="Bot">Bot</SelectItem>
            <SelectItem value="Insider">Insider</SelectItem>
            <SelectItem value="Contrarian">Contrarian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-[180px]">
        <Select value={filters.winRate} onValueChange={(value) => handleChange('winRate', value)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Win Rate" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Win Rate</SelectItem>
            <SelectItem value="high">{'>'} 60%</SelectItem>
            <SelectItem value="medium">40% - 60%</SelectItem>
            <SelectItem value="low">{'<'} 40%</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-[180px]">
        <Select value={filters.pnl} onValueChange={(value) => handleChange('pnl', value)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Overall PnL" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any PnL</SelectItem>
            <SelectItem value="positive">Positive (+)</SelectItem>
            <SelectItem value="negative">Negative (-)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={() => {
        const reset = { username: '', tag: 'all', winRate: 'all', pnl: 'all' };
        setFilters(reset);
        onFilterChange(reset);
      }}>
        Reset
      </Button>
    </div>
  );
}

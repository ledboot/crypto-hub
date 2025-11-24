'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export interface Market {
  id: string;
  title: string;
  slug: string;
  description: string;
  endDate: string;
  image: string;
  icon: string;
  volume: number;
  openInterest: number;
  tags: { id: string; label: string; slug: string }[];
  active: boolean;
  closed: boolean;
}

interface MarketsListProps {
  markets: Market[];
}

export function MarketsList({ markets }: MarketsListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: "compact",
      compactDisplay: "short"
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {markets.map((market) => (
        <Link href={`https://polymarket.com/event/${market.slug}`} target="_blank" key={market.id}>
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer flex flex-col overflow-hidden">
            <div className="relative h-32 w-full bg-muted">
              {market.image ? (
                <Image 
                  src={market.image} 
                  alt={market.title} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No Image
                </div>
              )}
              {market.icon && (
                <div className="absolute -bottom-4 left-4 h-10 w-10 rounded-full border-2 border-background bg-background overflow-hidden">
                   <Image 
                    src={market.icon} 
                    alt="icon" 
                    width={40} 
                    height={40} 
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <CardHeader className="pt-6 pb-2">
              <div className="flex gap-2 mb-2 overflow-hidden">
                {market.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-[10px] px-1 h-5 whitespace-nowrap">
                    {tag.label}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-base line-clamp-2 leading-tight min-h-[2.5rem]">
                {market.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
              <p className="text-xs text-muted-foreground line-clamp-3">
                {market.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-3 pb-3 bg-muted/10 text-xs text-muted-foreground">
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">{formatCurrency(market.volume)}</span>
                <span>Vol</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-foreground">
                  {market.endDate ? format(new Date(market.endDate), 'MMM d, yyyy') : 'N/A'}
                </span>
                <span>Ends</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

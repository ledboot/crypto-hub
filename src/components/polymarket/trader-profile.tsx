'use client';

import { TraderDetails } from "@/components/polymarket/trader-details";
import { generateTraders } from "@/lib/mock-polymarket";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Trader } from "@/lib/mock-polymarket";

interface TraderProfileProps {
  id: string;
}

export function TraderProfile({ id }: TraderProfileProps) {
  const router = useRouter();
  const [trader, setTrader] = useState<Trader | null>(null);

  useEffect(() => {
    // In a real app, we would fetch by ID. 
    // Here we generate a random trader but ensure the ID matches if we were using a real store.
    // For demo purposes, we just generate one consistent looking trader.
    const mockTraders = generateTraders(1);
    const mockTrader = mockTraders[0];
    if (id) {
        mockTrader.id = id;
    }
    setTrader(mockTrader);
  }, [id]);

  if (!trader) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="ghost" 
        className="mb-6 pl-0 hover:pl-2 transition-all" 
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Leaderboard
      </Button>

      <TraderDetails trader={trader} />
    </div>
  );
}

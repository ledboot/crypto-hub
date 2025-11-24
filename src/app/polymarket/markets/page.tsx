import { MarketsList, Market } from '@/components/polymarket/markets-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Active Prediction Markets | Polymarket | CryptoHub',
  description: 'Browse active prediction markets on Polymarket. View volume, open interest, and end dates for trending markets.',
  keywords: ['Polymarket', 'Prediction Markets', 'Crypto', 'Betting', 'Finance', 'Events'],
  openGraph: {
    title: 'Active Prediction Markets | Polymarket | CryptoHub',
    description: 'Browse active prediction markets on Polymarket. View volume, open interest, and end dates for trending markets.',
    type: 'website',
  },
};

async function getMarkets(): Promise<Market[]> {
  try {
    const res = await fetch('https://gamma-api.polymarket.com/events?limit=20&closed=false&active=true&volume_num_min=10000', {
      next: { revalidate: 60 }, // Revalidate every minute
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch markets');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching markets:', error);
    return [];
  }
}

export default async function MarketsPage() {
  const markets = await getMarkets();

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Active Markets</h1>
        <p className="text-muted-foreground">
          Explore trending prediction markets on Polymarket.
        </p>
      </div>

      <MarketsList markets={markets} />
    </div>
  );
}

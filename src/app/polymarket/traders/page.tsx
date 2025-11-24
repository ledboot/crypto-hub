import { Metadata } from 'next';
import { TradersView } from '@/components/polymarket/traders-view';

export const metadata: Metadata = {
  title: 'Polymarket Traders Leaderboard | CryptoHub',
  description: 'Explore top performing traders on Polymarket. View rankings, win rates, and PnL history of the best prediction market traders.',
  keywords: ['Polymarket', 'Traders', 'Leaderboard', 'Crypto', 'Prediction Markets', 'Win Rate', 'PnL'],
  openGraph: {
    title: 'Polymarket Traders Leaderboard | CryptoHub',
    description: 'Explore top performing traders on Polymarket. View rankings, win rates, and PnL history of the best prediction market traders.',
    type: 'website',
  },
};

export default function TradersPage() {
  return <TradersView />;
}

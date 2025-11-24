import { Metadata } from 'next';
import { TraderProfile } from '@/components/polymarket/trader-profile';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const id = (await params).id;

  return {
    title: `Trader ${id} Profile | Polymarket | CryptoHub`,
    description: `View detailed trading statistics, PnL history, and positions for trader ${id} on Polymarket.`,
    openGraph: {
      title: `Trader ${id} Profile | Polymarket | CryptoHub`,
      description: `View detailed trading statistics, PnL history, and positions for trader ${id} on Polymarket.`,
    },
  };
}

export default async function TraderDetailsPage({ params }: Props) {
  const id = (await params).id;
  return <TraderProfile id={id} />;
}

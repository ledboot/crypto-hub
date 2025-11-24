import { faker } from '@faker-js/faker';

export interface Trader {
  rank: number;
  id: string;
  username: string;
  avatar: string;
  totalPositions: number;
  activePositions: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  currentValue: number;
  overallPnL: number;
  tags: string[];
  history: { date: string; value: number }[];
}

export interface Market {
  id: string;
  title: string;
  volume: number;
  endDate: string;
  openInterest: number;
  tags: string[];
  description: string;
  image: string;
}

const TAGS = ['Whale', 'Degen', 'Smart Money', 'Bot', 'Insider', 'Contrarian'];
const MARKET_TAGS = ['Politics', 'Crypto', 'Sports', 'Business', 'Science', 'Pop Culture'];

export const generateTraders = (count: number = 100): Trader[] => {
  return Array.from({ length: count }).map((_, index) => {
    const totalWins = faker.number.int({ min: 10, max: 500 });
    const totalLosses = faker.number.int({ min: 10, max: 500 });
    const totalPositions = totalWins + totalLosses;
    const winRate = (totalWins / totalPositions) * 100;
    const currentValue = faker.number.float({ min: 1000, max: 1000000, fractionDigits: 2 });
    const overallPnL = faker.number.float({ min: -50000, max: 500000, fractionDigits: 2 });

    return {
      rank: index + 1,
      id: faker.string.uuid(),
      username: faker.internet.username(),
      avatar: faker.image.avatar(),
      totalPositions,
      activePositions: faker.number.int({ min: 0, max: 50 }),
      totalWins,
      totalLosses,
      winRate,
      currentValue,
      overallPnL,
      tags: faker.helpers.arrayElements(TAGS, { min: 0, max: 3 }),
      history: Array.from({ length: 30 }).map((_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: currentValue + faker.number.float({ min: -10000, max: 10000 }),
      })),
    };
  });
};

export const generateMarkets = (count: number = 20): Market[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    title: faker.company.catchPhrase(),
    volume: faker.number.float({ min: 10000, max: 10000000, fractionDigits: 2 }),
    endDate: faker.date.future().toISOString(),
    openInterest: faker.number.float({ min: 5000, max: 5000000, fractionDigits: 2 }),
    tags: faker.helpers.arrayElements(MARKET_TAGS, { min: 1, max: 3 }),
    description: faker.lorem.paragraph(),
    image: faker.image.urlLoremFlickr({ category: 'business' }),
  }));
};

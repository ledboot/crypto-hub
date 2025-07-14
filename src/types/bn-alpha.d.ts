export interface TokenFlow {
	inflow: number;
	outflow: number;
	address: string;
  }
  
  export interface Transaction {
	hash: string;
	timeStamp: number | string;
	from: string;
	to: string;
	value: string;
	gasPrice: string;
	gasUsed: string;
	status: string;
	tokens: Record<string, TokenFlow>;
	gasFee: number;
  }
  
  export interface TokenStats {
	[symbol: string]: TokenFlow;
  }
  
  export interface TransactionDay {
	date: string;
	tokenStats: TokenStats;
	transactions: Transaction[];
	totalGas: number;
	totalValue: number;
	totalLoss: number;
	totalLossWithGas: number;
	totalPoints: number;
	totalGasUsd: number;
	transactionCount: number;
  }

interface TodaySummary {
	totalValue: number
	totalPoints: number
	totalGas: number
	totalGasUsd: number
	totalLoss: number
	totalLossWithGas: number
	progressPercentSegment: number
	upper: number
}

interface Summary {
	totalValue: number
	totalPoints: number
	totalLoss: number
	totalGas: number
	totalLossWithGas: number
	totalGasUsd: number
}

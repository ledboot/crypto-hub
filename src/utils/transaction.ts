import BnApiUtils from './bn-api'
import { Transaction, TokenFlow, TokenStats, TransactionDay } from '@/types/bn-alpha'

export default class TransactionUtils {
  static processTransactions(
    userAddress: string,
    normalTxList: any[],
    internalTxList: any[],
    tokenTxList: any[]
  ): Transaction[] {
    const txMap = new Map<string, any>();
    // 普通交易
    normalTxList.forEach(tx => {
      const bnbToken = 'BNB';
      const tokens = new Map<string, TokenFlow>();
      tokens.set(bnbToken, { inflow: 0, outflow: 0, address: '' });
      if (tx.value && parseFloat(tx.value) > 0) {
        const bnbValue = parseFloat(tx.value) / 1e18;
        if (tx.to.toLowerCase() === userAddress.toLowerCase()) {
          if (tx.isError === '0') tokens.get(bnbToken)!.inflow += bnbValue;
        } else if (tx.from.toLowerCase() === userAddress.toLowerCase()) {
          if (tx.isError === '0') tokens.get(bnbToken)!.outflow += bnbValue;
        }
      }
      txMap.set(tx.hash, {
        hash: tx.hash,
        timeStamp: tx.timeStamp,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gasPrice: tx.gasPrice,
        gasUsed: tx.gasUsed,
        status: tx.isError === '0' ? 'success' : 'failed',
        tokens: tokens,
        gasFee: (parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice)) / 1e18
      });
    });
    // 内部交易
    internalTxList.forEach(tx => {
      const isUserInvolved = tx.from.toLowerCase() === userAddress.toLowerCase() ||
        tx.to.toLowerCase() === userAddress.toLowerCase();
      if (!isUserInvolved) return;
      if (txMap.has(tx.hash)) {
        const existingTx = txMap.get(tx.hash);
        const bnbToken = 'BNB';
        if (!existingTx.tokens.has(bnbToken)) {
          existingTx.tokens.set(bnbToken, { inflow: 0, outflow: 0, address: '' });
        }
        const bnbValue = parseFloat(tx.value) / 1e18;
        if (tx.to.toLowerCase() === userAddress.toLowerCase()) {
          existingTx.tokens.get(bnbToken)!.inflow += bnbValue;
        } else if (tx.from.toLowerCase() === userAddress.toLowerCase()) {
          existingTx.tokens.get(bnbToken)!.outflow += bnbValue;
        }
      } else {
        const bnbToken = 'BNB';
        const bnbValue = parseFloat(tx.value) / 1e18;
        const tokenMap = new Map<string, TokenFlow>();
        tokenMap.set(bnbToken, {
          inflow: tx.to.toLowerCase() === userAddress.toLowerCase() ? bnbValue : 0,
          outflow: tx.from.toLowerCase() === userAddress.toLowerCase() ? bnbValue : 0,
          address: ''
        });
        txMap.set(tx.hash, {
          hash: tx.hash,
          timeStamp: tx.timeStamp,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          gasPrice: '0',
          gasUsed: '0',
          status: 'success',
          tokens: tokenMap,
          gasFee: 0
        });
      }
    });
    // 代币交易
    tokenTxList.forEach(tx => {
      const isUserInvolved = tx.from.toLowerCase() === userAddress.toLowerCase() ||
        tx.to.toLowerCase() === userAddress.toLowerCase();
      if (!isUserInvolved) return;
      const txKey = tx.hash;
      const tokenSymbol = tx.tokenSymbol || 'Unknown';
      const tokenAddress = tx.contractAddress || '';
      const tokenValue = parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal));
      const isInflow = tx.to.toLowerCase() === userAddress.toLowerCase();
      const isOutflow = tx.from.toLowerCase() === userAddress.toLowerCase();
      if (txMap.has(txKey)) {
        const existingTx = txMap.get(txKey);
        if (!existingTx.tokens.has(tokenSymbol)) {
          existingTx.tokens.set(tokenSymbol, {
            inflow: 0,
            outflow: 0,
            address: tokenAddress
          });
        }
        if (isInflow) {
          existingTx.tokens.get(tokenSymbol)!.inflow += tokenValue;
        }
        if (isOutflow) {
          existingTx.tokens.get(tokenSymbol)!.outflow += tokenValue;
        }
      } else {
        const tokenMap = new Map<string, TokenFlow>();
        tokenMap.set(tokenSymbol, {
          inflow: isInflow ? tokenValue : 0,
          outflow: isOutflow ? tokenValue : 0,
          address: tokenAddress
        });
        txMap.set(txKey, {
          hash: tx.hash,
          timeStamp: tx.timeStamp,
          from: tx.from,
          to: tx.to,
          value: '0',
          gasPrice: '0',
          gasUsed: '0',
          status: 'success',
          tokens: tokenMap,
          gasFee: 0
        });
      }
    });
    // Map转对象
    return Array.from(txMap.values()).map(tx => {
      const tokensObj: Record<string, TokenFlow> = {};
      tx.tokens.forEach((value: TokenFlow, key: string) => {
        tokensObj[key] = value;
      });
      return {
        ...tx,
        tokens: tokensObj
      };
    }).sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp));
  }

  static groupTransactionsByDay(transactions: Transaction[]): [string, TransactionDay][] {
    const dayMap = new Map<string, TransactionDay>();
    transactions.forEach(tx => {
      const date = new Date(Number(tx.timeStamp) * 1000).toISOString().split('T')[0];
      if (!dayMap.has(date)) {
        dayMap.set(date, {
          date,
          tokenStats: {},
          transactions: [],
          totalGas: 0,
          totalValue: 0,
          totalLoss: 0,
          totalLossWithGas: 0,
          totalPoints: 0,
          totalGasUsd: 0,
          transactionCount: 0
        });
      }
      const dayData = dayMap.get(date)!;
      dayData.transactions.push(tx);
      dayData.totalGas += Number(tx.gasFee);
      Object.entries(tx.tokens).forEach(([tokenSymbol, tokenData]) => {
        if (!dayData.tokenStats[tokenSymbol]) {
          dayData.tokenStats[tokenSymbol] = {
            inflow: 0,
            outflow: 0,
            address: tokenData.address || ''
          };
        }
        dayData.tokenStats[tokenSymbol].inflow += tokenData.inflow;
        dayData.tokenStats[tokenSymbol].outflow += tokenData.outflow;
      });
    });
    return Array.from(dayMap.entries()).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }

  static async calculateStatistics(transactions: Transaction[]): Promise<Partial<TransactionDay>> {
    const tokenStats: TokenStats = {};
    let totalGas = 0;
    let totalValue = 0;
    let totalLoss = 0;
    let totalGasUsd = 0;
    let totalPoints = 0;
    let totalLossWithGas = 0;
    const allTokenSymbols = new Set<string>();
    transactions.forEach(tx => {
      totalGas += Number(tx.gasFee);
      Object.entries(tx.tokens).forEach(([tokenSymbol, tokenData]) => {
        if (!tokenStats[tokenSymbol]) {
          tokenStats[tokenSymbol] = {
            inflow: 0,
            outflow: 0,
            address: tokenData.address || ''
          };
        }
        tokenStats[tokenSymbol].inflow += tokenData.inflow;
        tokenStats[tokenSymbol].outflow += tokenData.outflow;
        if (tokenData.outflow > 0) {
          allTokenSymbols.add(tokenSymbol);
        }
      });
    });
    const bnbPrice = await BnApiUtils.fetchTokenPrice('BNB');
    totalValue = (tokenStats['BSC-USD']?.inflow || 0) + (tokenStats['BSC-USD']?.outflow || 0);
    totalLoss = (tokenStats['BSC-USD']?.inflow || 0) - (tokenStats['BSC-USD']?.outflow || 0);
    totalGasUsd = totalGas * bnbPrice;
    totalPoints = TransactionUtils.calculatePoints(totalValue);
    if (totalLoss < 0) {
      totalLossWithGas = (Math.abs(totalLoss) + totalGasUsd) * -1;
    }
    return {
      totalGas,
      tokenStats,
      totalValue,
      totalLoss,
      totalGasUsd,
      totalPoints,
      totalLossWithGas,
      transactionCount: transactions.length
    };
  }

  static findImbalancedTokens(tokenStats: TokenStats): any[] {
    const imbalancedTokens: any[] = [];
    Object.entries(tokenStats).forEach(([symbol, stats]) => {
      const netFlow = stats.inflow - stats.outflow;
      if (Math.abs(netFlow) > 0.000001) {
        imbalancedTokens.push({
          symbol,
          inflow: stats.inflow,
          outflow: stats.outflow,
          netFlow,
          address: stats.address || ''
        });
      }
    });
    return imbalancedTokens.sort((a, b) => Math.abs(b.netFlow) - Math.abs(a.netFlow));
  }

  static getOutflowTokens(tokenStats: TokenStats): any[] {
    const outflowTokens: any[] = [];
    Object.entries(tokenStats).forEach(([symbol, stats]) => {
      if (stats.outflow > 0.000001) {
        outflowTokens.push({
          symbol,
          outflow: stats.outflow,
          address: stats.address || ''
        });
      }
    });
    return outflowTokens.sort((a, b) => b.outflow - a.outflow);
  }

  static calculateTokenValue(symbol: string, amount: number, tokenPriceMap: Record<string, string | number>): number {
    if (tokenPriceMap[symbol] !== undefined) {
      return amount * parseFloat(tokenPriceMap[symbol] as string);
    }
    return 0;
  }

  static calculatePoints(outflowValue: number): number {
    if (outflowValue <= 0) return 0;
    const points = Math.floor(Math.log2(outflowValue));
    return points > 0 ? points : 0;
  }
} 
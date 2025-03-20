export type DerivePriKeyParams = {
    mnemonic: string;
    hdPath: string;
    coinType: CoinType;
  };

export enum CoinType {
  BTC = "0",
  ETH = "66",
  SOL = "501",
  DOGE = "3",
  XRP = "144",
  BNB = "714",
  TRX = "195",
}
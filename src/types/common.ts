export type DerivePriKeyParams = {
  mnemonic: string;
  hdPath: string;
  coinType: CoinType;
};

export type Address = {
  address: string;
  executeStatus: string;
  amount: number; // or bigint, depending on your preference
  flag: string;
  symbol: string;
  selected: boolean; // Optional property to track selection
};
export type Token = {
  address: string;
  type: string;
  symbol: string;
  decimals: number;
  logo: string;
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

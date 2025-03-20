export type Address = {
  address: string;
  executeStatus: string;
  amount: number; // or bigint, depending on your preference
  flag: string;
  symbol: string;
  selected: boolean; // Optional property to track selection
}

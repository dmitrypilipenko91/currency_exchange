export interface CurrencyRates {
  name: string;
  sell: string;
  buy: string;
}

export interface ConvertedRates {
  [key: string]: { sell: number; buy: number };
}

export interface CurrencyRates {
  name: string;
  sell: string;
  buy: string;
}

export interface ConvertedRates {
  [key: string]: { sell: number; buy: number };
}

export interface RatesForConverter {
  [key: string]: number;
}

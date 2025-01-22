import { CurrencyRates } from "../pages/types";

export interface RatesBlockProps {
  title: string;
  rates: CurrencyRates[];
  onToggleFavourite: (currency: string) => void;
  favourites: string[];
}

import { CurrencyRates } from "../../pages/CurrentRatesPage/types";

export interface RatesBlockProps {
  title: string;
  rates: CurrencyRates[];
  onToggleFavourite: (currency: string) => void;
  favourites: string[];
}

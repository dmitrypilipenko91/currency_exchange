export interface RateItemProps {
  name: string;
  sell: string;
  buy: string;
  isFavourite: boolean;
  onToggleFavourite: (currencyName: string) => void;
}

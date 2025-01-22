export const getCurrencyNameWithSuffix = (currency: string): string => {
  if (currency === "PLN") return `${currency} (10)`;
  if (currency === "RUB") return `${currency} (100)`;
  return currency;
};

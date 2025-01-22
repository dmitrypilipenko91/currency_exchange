import { APIRates } from "../hooks/types";
import { CURRENCIES } from "./constants";
import { ConvertedRates, CurrencyRates } from "./types";

export const convertRates = (
  baseCurrency: string,
  rates: APIRates
): ConvertedRates => {
  const conversionRates: ConvertedRates = {};
  const adjustmentFactor =
    baseCurrency === CURRENCIES.RUB
      ? 100
      : baseCurrency === CURRENCIES.PLN
      ? 10
      : 1;

  Object.keys(rates || {}).forEach((key) => {
    const [currency, type] = key.split("_");

    if (rates && type === "in" && parseFloat(rates[key]) > 0) {
      const rate = parseFloat(rates[key]) || 0;

      if (baseCurrency === CURRENCIES.BYN) {
        conversionRates[currency] = {
          sell: rate * adjustmentFactor,
          buy: parseFloat(rates[`${currency}_out`]) * adjustmentFactor,
        };
      } else {
        if (currency === baseCurrency) {
          conversionRates[currency] = { sell: 1, buy: 1 };
        } else {
          const baseToBYN = rates[`${baseCurrency}_in`];
          const currencyToBYN = rates[`${currency}_in`];

          if (baseToBYN && currencyToBYN) {
            const exchangeRateSell =
              (parseFloat(currencyToBYN) / parseFloat(baseToBYN)) *
              adjustmentFactor;
            const exchangeRateBuy =
              (parseFloat(rates[`${currency}_out`]) / parseFloat(baseToBYN)) *
              adjustmentFactor;

            conversionRates[currency] = {
              sell: exchangeRateSell,
              buy: exchangeRateBuy,
            };
          }
        }
      }
    }
  });

  return conversionRates;
};

export const addBYN = (
  baseCurrency: string,
  rates: APIRates
): CurrencyRates => {
  const adjustmentFactor =
    baseCurrency === CURRENCIES.RUB
      ? 100
      : baseCurrency === CURRENCIES.PLN
      ? 10
      : 1;
  const baseRateIn = parseFloat(rates?.[`${baseCurrency}_in`] || "1");
  const baseRateOut = parseFloat(rates?.[`${baseCurrency}_out`] || "1");

  return {
    name: CURRENCIES.BYN,
    sell:
      baseCurrency === CURRENCIES.BYN
        ? "1.0000"
        : ((1 / baseRateIn) * adjustmentFactor).toFixed(4),
    buy:
      baseCurrency === CURRENCIES.BYN
        ? "1.0000"
        : ((1 / baseRateOut) * adjustmentFactor).toFixed(4),
  };
};

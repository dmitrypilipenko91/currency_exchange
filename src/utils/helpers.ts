import { APIRates } from "../hooks/useGetExchangeRates";
import { RatesForConverter } from "../pages/ConverterPage/types";
import { ConvertedRates, CurrencyRates } from "../pages/CurrentRatesPage/types";
import { CURRENCIES } from "./constants";

export const ADJUSTMENT_FACTORS: Record<string, number> = {
  RUB: 100,
  PLN: 10,
  BYN: 1,
};

export const getAdjustmentFactor = (currency: string): number => {
  return ADJUSTMENT_FACTORS[currency] || 1;
};

export const processCurrency = (
  baseCurrency: string,
  currency: string,
  rates: APIRates,
  adjustmentFactor: number
): { sell: number; buy: number } | null => {
  const baseToBYN = rates[`${baseCurrency}_in`];
  const currencyToBYN = rates[`${currency}_in`];
  const currencyOut = rates[`${currency}_out`];

  if (baseToBYN && currencyToBYN && currencyOut) {
    return {
      sell:
        (parseFloat(currencyToBYN) / parseFloat(baseToBYN)) * adjustmentFactor,
      buy: (parseFloat(currencyOut) / parseFloat(baseToBYN)) * adjustmentFactor,
    };
  }

  return null;
};

export const convertRates = (
  baseCurrency: string,
  rates: APIRates
): ConvertedRates => {
  const conversionRates: ConvertedRates = {};
  const adjustmentFactor = getAdjustmentFactor(baseCurrency);

  Object.keys(rates || {}).forEach((key) => {
    const [currency, type] = key.split("_");

    if (rates && type === "in" && parseFloat(rates[key]) > 0) {
      const rate = parseFloat(rates[key]) || 0;

      if (baseCurrency === CURRENCIES.BYN) {
        conversionRates[currency] = {
          sell: rate * adjustmentFactor,
          buy: parseFloat(rates[`${currency}_out`]) * adjustmentFactor,
        };
      } else if (currency === baseCurrency) {
        conversionRates[currency] = { sell: 1, buy: 1 };
      } else {
        const processedCurrency = processCurrency(
          baseCurrency,
          currency,
          rates,
          adjustmentFactor
        );

        if (processedCurrency) {
          conversionRates[currency] = processedCurrency;
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
  const adjustmentFactor = getAdjustmentFactor(baseCurrency);
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

export const getCurrencyNameWithSuffix = (currency: string): string => {
  if (currency === "PLN") return `${currency} (10)`;
  if (currency === "RUB") return `${currency} (100)`;
  return currency;
};

export const processExchangeRates = (data?: APIRates): RatesForConverter => {
  const rates: RatesForConverter = { [CURRENCIES.BYN]: 1 }; // BYN как базовая валюта

  Object.entries(data as APIRates).forEach(([key, value]) => {
    if (key.endsWith("_in") && key.split("_").length === 2) {
      const currency = key.replace("_in", "");
      let rate = parseFloat(value as string);

      if (currency === CURRENCIES.PLN) {
        rate = rate / 10; // PLN за 1 единицу (в API за 10)
      } else if (currency === CURRENCIES.RUB) {
        rate = rate / 100; // RUB за 1 единицу (в API за 100)
      }

      if (rate > 0) {
        rates[currency] = rate;
      }
    }
  });

  return rates;
};

export const initializeAmounts = (
  currencies: RatesForConverter
): RatesForConverter => {
  return Object.keys(currencies).reduce((acc, key) => {
    acc[key] = 0; // Начальное значение для каждой валюты — 0
    return acc;
  }, {} as RatesForConverter);
};

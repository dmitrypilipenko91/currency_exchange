import { useState, useEffect } from "react";
import { useGetExchangeRates } from "../hooks/useGetExchangeRates";
import RatesBlock from "../components/RatesBlock";
import { useNavigate } from "react-router-dom";
import { paths } from "../utils/paths";
import { APIRates } from "../hooks/types";
import { ConvertedRates, CurrencyRates } from "./types";
import { addBYN, convertRates } from "./helpers";
import classes from "./CurrentRatesPage.module.css";
import {
  ALL_RATES,
  BASE_CURRENCY,
  BASE_CURRENCY_RU,
  CURRENCIES,
  CURRENCY_RATES_HEADER_TEXT,
  ERROR_TEXT,
  FAVOURITE_RATES,
  LOADER_TEXT,
  RATES_CONVERTER,
  currenciesOptions,
} from "./constants";

const CurrentRatesPage = () => {
  const { data: rates, isLoading, isError } = useGetExchangeRates();
  const [baseCurrency, setBaseCurrency] = useState(
    localStorage.getItem(BASE_CURRENCY) || CURRENCIES.BYN
  );
  const [favourites, setFavourites] = useState<string[]>([]);
  const [convertedRates, setConvertedRates] = useState<ConvertedRates>({});

  const navigate = useNavigate();

  const moveToConverter = () => {
    navigate(paths.converter);
  };

  const toggleFavourite = (currency: string) => {
    setFavourites((prev) =>
      prev.includes(currency)
        ? prev.filter((item) => item !== currency)
        : [...prev, currency]
    );
  };

  const allRates = Object.keys(rates || {})
    .reduce((acc: CurrencyRates[], key) => {
      const [currency, type] = key.split("_");
      if (
        rates &&
        type === "in" &&
        parseFloat(rates[key]) > 0 &&
        !favourites.includes(currency)
      ) {
        acc.push({
          name: currency,
          sell: rates[key],
          buy: rates[`${currency}_out`],
        });
      }
      return acc;
    }, [])
    .filter((rate) => rate.name !== CURRENCIES.BYN); // Исключение BYN явно;

  const updatedRates = [
    !favourites.includes(CURRENCIES.BYN) &&
      addBYN(baseCurrency, rates as APIRates),
    ...allRates.map((rate) => ({
      ...rate,
      sell: convertedRates[rate.name]?.sell.toFixed(4) || "1.0000",
      buy: convertedRates[rate.name]?.buy.toFixed(4) || "1.0000",
    })),
  ].filter(Boolean);

  const favouriteRates = favourites.map((currency) =>
    currency === CURRENCIES.BYN
      ? addBYN(baseCurrency, rates as APIRates)
      : {
          name: currency,
          sell: convertedRates[currency]?.sell.toFixed(4) || "1.0000",
          buy: convertedRates[currency]?.buy.toFixed(4) || "1.0000",
        }
  );

  useEffect(() => {
    localStorage.setItem(BASE_CURRENCY, baseCurrency);
  }, [baseCurrency]);

  useEffect(() => {
    if (rates) {
      setConvertedRates(convertRates(baseCurrency, rates));
    }
  }, [rates, baseCurrency]);

  if (isError) return <p>{ERROR_TEXT}</p>;

  return (
    <div>
      <h3 className={classes.header}>{CURRENCY_RATES_HEADER_TEXT}</h3>
      {isLoading && <p>{LOADER_TEXT}</p>}
      <div className={classes.base_currency_group}>
        <label>
          {BASE_CURRENCY_RU}:
          <select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
          >
            {currenciesOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <RatesBlock
        title={FAVOURITE_RATES}
        rates={favouriteRates}
        onToggleFavourite={toggleFavourite}
        favourites={favourites}
      />
      <RatesBlock
        title={ALL_RATES}
        rates={updatedRates as CurrencyRates[]}
        onToggleFavourite={toggleFavourite}
        favourites={favourites}
      />
      <button
        className={classes.move_to_converter_btn}
        onClick={moveToConverter}
      >
        {RATES_CONVERTER}
      </button>
    </div>
  );
};

export default CurrentRatesPage;

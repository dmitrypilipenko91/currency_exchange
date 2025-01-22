import { useNavigate } from "react-router-dom";
import { paths } from "../utils/paths";
import { useState, useEffect } from "react";
import { useGetExchangeRates } from "../hooks/useGetExchangeRates";
import { RatesForConverter } from "./types";
import classes from "./ConverterPage.module.css";
import {
  CURRENCIES,
  CURRENCY_RATES,
  ERROR_TEXT,
  LOADER_TEXT,
  RATES_CONVERTER,
} from "./constants";

const ConverterPage = () => {
  const { data, isLoading, isError } = useGetExchangeRates();

  const [currencies, setCurrencies] = useState<RatesForConverter>({});
  const [amounts, setAmounts] = useState<RatesForConverter>({});

  const navigate = useNavigate();
  const moveToRates = () => {
    navigate(paths.home);
  };

  useEffect(() => {
    if (data) {
      const rates: RatesForConverter = { [CURRENCIES.BYN]: 1 }; // BYN как базовая валюта
      Object.entries(data).forEach(([key, value]) => {
        if (key.endsWith("_in") && key.split("_").length === 2) {
          const currency = key.replace("_in", "");
          let rate = parseFloat(value as string);
          if (currency === CURRENCIES.PLN) {
            rate = rate / 10; // Курс для PLN за 1 единицу (в API данные за 10)
          } else if (currency === CURRENCIES.RUB) {
            rate = rate / 100; // Курс для RUB за 1 единицу (в API данные за 100)
          }
          if (rate > 0) {
            rates[currency] = rate;
          }
        }
      });
      setCurrencies(rates);

      // Инициализация значений для всех валют
      setAmounts(
        Object.keys(rates).reduce((acc, key) => {
          acc[key] = 0;
          return acc;
        }, {} as { [key: string]: number })
      );
    }
  }, [data]);

  const handleInputChange = (currency: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    const updatedAmounts: RatesForConverter = {};

    // Рассчитываем значения на основе выбранной валюты
    Object.keys(currencies).forEach((key) => {
      updatedAmounts[key] =
        numericValue * (currencies[currency] / currencies[key]);

      // Округление до двух знаков после запятой
      updatedAmounts[key] = parseFloat(updatedAmounts[key].toFixed(2));
    });

    setAmounts(updatedAmounts);
  };

  if (isError) return <p>{ERROR_TEXT}</p>;

  return (
    <div>
      <h3 className={classes.header}>{RATES_CONVERTER}</h3>
      {isLoading && <p>{LOADER_TEXT}</p>}
      {Object.keys(currencies).map((currency) => (
        <div key={currency} className={classes.converter_content}>
          <label>
            {currency}:
            <input
              type="number"
              value={amounts[currency] || ""}
              onChange={(e) => handleInputChange(currency, e.target.value)}
            />
          </label>
        </div>
      ))}
      <button className={classes.move_to_rates_btn} onClick={moveToRates}>
        {CURRENCY_RATES}
      </button>
    </div>
  );
};

export default ConverterPage;

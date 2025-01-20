import { useState, useEffect } from "react";
import { useGetExchangeRates } from "../hooks/useGetExchangeRates";
import RatesBlock from "../components/RatesBlock";
import { useNavigate } from "react-router-dom";
import { paths } from "../utils/paths";

interface CurrencyRates {
  name: string;
  sell: string;
  buy: string;
}

const CurrentRatesPage = () => {
  const { data: rates, isLoading, isError } = useGetExchangeRates();
  const [baseCurrency, setBaseCurrency] = useState(
    localStorage.getItem("baseCurrency") || "BYN"
  );
  const [favourites, setFavourites] = useState<string[]>([]);

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

  const favouriteRates: CurrencyRates[] = favourites.map((currency) => ({
    name: currency,
    sell: rates?.[`${currency}_in`],
    buy: rates?.[`${currency}_out`],
  }));

  const allRates = Object.keys(rates || {}).reduce(
    (acc: CurrencyRates[], key) => {
      const [currency, type] = key.split("_");
      if (type === "in" && rates[key] > 0 && !favourites.includes(currency)) {
        acc.push({
          name: currency,
          sell: rates[key],
          buy: rates[`${currency}_out`],
        });
      }
      return acc;
    },
    []
  );

  useEffect(() => {
    localStorage.setItem("baseCurrency", baseCurrency);
  }, [baseCurrency]);

  if (isError) return <p>Ошибка при загрузке данных</p>;

  return (
    <div>
      <h3 style={{ marginBottom: "30px" }}>
        Текущие курсы валют на {new Date().toLocaleDateString()}
      </h3>
      {isLoading && <p>Загрузка курсов валют...</p>}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Базовая валюта:
          <select
            style={{ marginLeft: "10px" }}
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
          >
            <option value="BYN">BYN</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
      </div>
      <RatesBlock
        title="Избранные курсы"
        rates={favouriteRates}
        onToggleFavourite={toggleFavourite}
        favourites={favourites}
      />
      <RatesBlock
        title="Все курсы"
        rates={allRates}
        onToggleFavourite={toggleFavourite}
        favourites={favourites}
      />
      <button
        style={{
          padding: "3px",
          borderWidth: "1px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={moveToConverter}
      >
        Конвертер валют
      </button>
    </div>
  );
};

export default CurrentRatesPage;

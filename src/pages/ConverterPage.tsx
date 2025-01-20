import { useNavigate } from "react-router-dom";
import { paths } from "../utils/paths";
import { useState, useEffect } from "react";
import { useGetExchangeRates } from "../hooks/useGetExchangeRates";

const ConverterPage = () => {
  const { data, isLoading, isError } = useGetExchangeRates();

  const [currencies, setCurrencies] = useState<{ [key: string]: number }>({});
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});

  const navigate = useNavigate();
  const moveToRates = () => {
    navigate(paths.home);
  };

  useEffect(() => {
    if (data) {
      const rates: { [key: string]: number } = { BYN: 1 }; // BYN как базовая валюта
      Object.entries(data).forEach(([key, value]) => {
        if (key.endsWith("_in") && key.split("_").length === 2) {
          const currency = key.replace("_in", "");
          let rate = parseFloat(value as string);
          if (currency === "PLN") {
            rate = rate / 10; // Курс для PLN за 1 единицу (в API данные за 10)
          } else if (currency === "RUB") {
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
    const updatedAmounts: { [key: string]: number } = {};

    // Рассчитываем значения на основе выбранной валюты
    Object.keys(currencies).forEach((key) => {
      updatedAmounts[key] =
        numericValue * (currencies[currency] / currencies[key]);

      // Округление до двух знаков после запятой
      updatedAmounts[key] = parseFloat(updatedAmounts[key].toFixed(2));
    });

    setAmounts(updatedAmounts);
  };

  if (isError) return <p>Ошибка загрузки курсов валют</p>;

  return (
    <div>
      <h3 style={{ marginBottom: "30px" }}>Конвертер валют</h3>
      {isLoading && <p>Загрузка курсов валют...</p>}
      {Object.keys(currencies).map((currency) => (
        <div key={currency} style={{ marginBottom: "10px" }}>
          <label>
            {currency}:
            <input
              type="number"
              value={amounts[currency] || ""}
              onChange={(e) => handleInputChange(currency, e.target.value)}
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>
      ))}
      <button
        style={{
          padding: "3px",
          borderWidth: "1px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={moveToRates}
      >
        Курсы валют
      </button>
    </div>
  );
};

export default ConverterPage;

import { useQuery } from "@tanstack/react-query";

const currencyRatesApiUrl =
  "https://belarusbank.by/api/kursExchange?city=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA";
const UPDATING_PERIOD = 1000 * 60 * 60 * 6; // 6 часов в миллисекундах

const fetchExchangeRates = async () => {
  const response = await fetch(currencyRatesApiUrl);
  const data = await response.json();
  return data[0];
};

export const useGetExchangeRates = () => {
  return useQuery({
    queryKey: ["exchangeRates"],
    queryFn: fetchExchangeRates,
    staleTime: UPDATING_PERIOD, // обновляем кэш каждые 6 часов
  });
};

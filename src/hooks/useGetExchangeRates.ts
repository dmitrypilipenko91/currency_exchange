import { useQuery } from "@tanstack/react-query";
import { fetchExchangeRates } from "../api/rates.api";

export type APIRates = {
  [key: string]: string;
};

const UPDATING_PERIOD = 1000 * 60 * 60 * 6; // 6 часов в миллисекундах
const CASHING_PERIOD = 1000 * 60 * 60 * 24; // 24 часа в миллисекундах

export const useGetExchangeRates = () => {
  return useQuery<APIRates, Error>({
    queryKey: ["exchangeRates"],
    queryFn: fetchExchangeRates,
    staleTime: UPDATING_PERIOD, // обновляем кэш каждые 6 часов
    gcTime: CASHING_PERIOD, // храним данные в кэше 24 часа
  });
};

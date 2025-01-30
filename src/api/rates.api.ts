const currencyRatesApiUrl =
  "https://belarusbank.by/api/kursExchange?city=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA";

export const fetchExchangeRates = async () => {
  try {
    const response = await fetch(currencyRatesApiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error("Error fetching exchange rates: ", error);
    throw error;
  }
};

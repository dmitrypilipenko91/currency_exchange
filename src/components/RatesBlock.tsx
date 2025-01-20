import { getCurrencyNameWithSuffix } from "../utils/helpers";

interface RatesBlockProps {
  title: string;
  rates: { name: string; sell: string; buy: string }[];
  onToggleFavourite: (currency: string) => void;
  favourites: string[];
}

const RatesBlock: React.FC<RatesBlockProps> = ({
  title,
  rates,
  onToggleFavourite,
  favourites,
}) => {
  return (
    <div>
      <h4 style={{ marginBottom: "10px" }}>{title}</h4>
      <div>
        {rates.map((rate) => (
          <div key={rate.name} style={{ marginBottom: "10px" }}>
            <span>
              {getCurrencyNameWithSuffix(rate.name)}: Продажа - {rate.sell},
              Покупка - {rate.buy}
            </span>
            <button
              style={{
                marginLeft: "10px",
                padding: "3px",
                borderWidth: "1px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => onToggleFavourite(rate.name)}
            >
              {favourites.includes(rate.name)
                ? "Убрать из избранного"
                : "В избранное"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatesBlock;

import {
  ADD_TO_FAVOURITES,
  BUY,
  REMOVE_FROM_FAVOURITES,
  SELL,
} from "../pages/constants";
import { getCurrencyNameWithSuffix } from "./helpers";
import { RatesBlockProps } from "./types";
import classes from "./RatesBlock.module.css";

const RatesBlock: React.FC<RatesBlockProps> = ({
  title,
  rates,
  onToggleFavourite,
  favourites,
}) => {
  return (
    <div>
      <h4 className={classes.header}>{title}</h4>
      <div>
        {rates.map((rate) => (
          <div key={rate.name} className={classes.rates_content}>
            <span>
              {getCurrencyNameWithSuffix(rate.name)}: {SELL} - {rate.sell},{" "}
              {BUY} - {rate.buy}
            </span>
            <button onClick={() => onToggleFavourite(rate.name)}>
              {favourites.includes(rate.name)
                ? REMOVE_FROM_FAVOURITES
                : ADD_TO_FAVOURITES}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatesBlock;

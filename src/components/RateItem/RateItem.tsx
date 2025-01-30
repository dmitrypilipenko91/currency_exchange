import {
  ADD_TO_FAVOURITES,
  REMOVE_FROM_FAVOURITES,
  BUY,
  SELL,
} from "../../utils/constants";
import { getCurrencyNameWithSuffix } from "../../utils/helpers";
import classes from "./RateItem.module.css";
import { RateItemProps } from "./types";

const RateItem: React.FC<RateItemProps> = ({
  name,
  sell,
  buy,
  isFavourite,
  onToggleFavourite,
}) => {
  return (
    <div className={classes.rates_content}>
      <span>
        {getCurrencyNameWithSuffix(name)}: {SELL} - {sell}, {BUY} - {buy}
      </span>
      <button onClick={() => onToggleFavourite(name)}>
        {isFavourite ? REMOVE_FROM_FAVOURITES : ADD_TO_FAVOURITES}
      </button>
    </div>
  );
};

export default RateItem;

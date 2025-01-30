import { RatesBlockProps } from "./types";
import classes from "./RatesBlock.module.css";
import RateItem from "../RateItem/RateItem";

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
          <RateItem
            key={rate.name}
            name={rate.name}
            sell={rate.sell}
            buy={rate.buy}
            isFavourite={favourites.includes(rate.name)}
            onToggleFavourite={onToggleFavourite}
          />
        ))}
      </div>
    </div>
  );
};

export default RatesBlock;

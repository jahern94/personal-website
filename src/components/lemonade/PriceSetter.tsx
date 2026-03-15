import { formatMoney, calculateCostPerCup } from "@/lib/lemonade/engine";
import { Recipe } from "@/lib/lemonade/types";

interface PriceSetterProps {
  price: number;
  recipe: Recipe;
  onChange: (price: number) => void;
}

const PRICE_STEPS = [5, 25];
const MIN_PRICE = 25;
const MAX_PRICE = 500;

export default function PriceSetter({ price, recipe, onChange }: PriceSetterProps) {
  const costPerCup = calculateCostPerCup(recipe);
  const profitPerCup = price - costPerCup;
  const margin = price > 0 ? Math.round((profitPerCup / price) * 100) : 0;

  const profitColor =
    profitPerCup > 0
      ? "text-green-600 dark:text-green-400"
      : profitPerCup === 0
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">
        Price per Cup
      </h3>

      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => onChange(Math.max(MIN_PRICE, price - PRICE_STEPS[1]))}
          disabled={price <= MIN_PRICE}
          className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors text-sm"
        >
          --
        </button>
        <button
          onClick={() => onChange(Math.max(MIN_PRICE, price - PRICE_STEPS[0]))}
          disabled={price <= MIN_PRICE}
          className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
        >
          -
        </button>
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100 w-28 text-center">
          {formatMoney(price)}
        </span>
        <button
          onClick={() => onChange(Math.min(MAX_PRICE, price + PRICE_STEPS[0]))}
          disabled={price >= MAX_PRICE}
          className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => onChange(Math.min(MAX_PRICE, price + PRICE_STEPS[1]))}
          disabled={price >= MAX_PRICE}
          className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors text-sm"
        >
          ++
        </button>
      </div>

      {/* Profit info */}
      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Cost</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{formatMoney(costPerCup)}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Profit/Cup</p>
          <p className={`font-semibold ${profitColor}`}>{formatMoney(profitPerCup)}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Margin</p>
          <p className={`font-semibold ${profitColor}`}>{margin}%</p>
        </div>
      </div>

      {/* Demand hint */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center italic">
        {price <= 75
          ? "Very affordable \u2014 expect high demand!"
          : price <= 125
            ? "Fair price \u2014 good balance of demand and profit."
            : price <= 200
              ? "Getting pricey \u2014 demand may drop."
              : "Very expensive \u2014 only a few customers will buy."}
      </p>
    </div>
  );
}

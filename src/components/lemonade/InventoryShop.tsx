import { Inventory, INGREDIENT_PRICES, INGREDIENT_LABELS } from "@/lib/lemonade/types";
import { formatMoney } from "@/lib/lemonade/engine";

interface InventoryShopProps {
  money: number;
  inventory: Inventory;
  supplyDelayActive: boolean;
  lemonShortageActive: boolean;
  onBuy: (item: keyof Inventory, quantity: number) => void;
}

const BUY_AMOUNTS = [1, 5, 10, 25];

export default function InventoryShop({
  money,
  inventory,
  supplyDelayActive,
  lemonShortageActive,
  onBuy,
}: InventoryShopProps) {
  const items = (Object.keys(INGREDIENT_PRICES) as (keyof Inventory)[]);
  const priceMultiplier = supplyDelayActive ? 1.5 : 1.0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">
        Buy Ingredients
      </h3>
      {supplyDelayActive && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mb-3 font-medium">
          Supply delay! Prices are 50% higher today.
        </p>
      )}
      <div className="space-y-3">
        {items.map((item) => {
          const basePrice = INGREDIENT_PRICES[item];
          const price = Math.round(basePrice * priceMultiplier);
          const isShortage = item === "lemons" && lemonShortageActive;

          return (
            <div key={item} className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {INGREDIENT_LABELS[item]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatMoney(price)} each &middot; Have: {inventory[item]}
                </p>
              </div>
              <div className="flex gap-1">
                {isShortage ? (
                  <span className="text-xs text-red-500 font-medium px-2 py-1">Sold out!</span>
                ) : (
                  BUY_AMOUNTS.map((qty) => {
                    const totalCost = price * qty;
                    const canAfford = money >= totalCost;
                    return (
                      <button
                        key={qty}
                        onClick={() => onBuy(item, qty)}
                        disabled={!canAfford}
                        className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                          canAfford
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        }`}
                        title={`Buy ${qty} for ${formatMoney(totalCost)}`}
                      >
                        +{qty}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

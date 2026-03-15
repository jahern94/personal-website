import { GameState, Inventory } from "@/lib/lemonade/types";
import { formatMoney, calculateMaxCups } from "@/lib/lemonade/engine";
import WeatherDisplay from "./WeatherDisplay";
import InventoryShop from "./InventoryShop";
import RecipeEditor from "./RecipeEditor";
import PriceSetter from "./PriceSetter";
import UpgradeShop from "./UpgradeShop";
import FinancialDashboard from "./FinancialDashboard";
import EventModal from "./EventModal";

interface DayPlanningProps {
  state: GameState;
  onBuyIngredient: (item: keyof Inventory, qty: number) => void;
  onRecipeChange: (recipe: GameState["recipe"]) => void;
  onPriceChange: (price: number) => void;
  onBuyUpgrade: (upgradeId: string) => void;
  onStartSelling: () => void;
  onDismissEvent: () => void;
}

function ReputationStars({ reputation }: { reputation: number }) {
  const stars = Math.round(reputation / 20);
  return (
    <span className="text-amber-500">
      {Array.from({ length: 5 }, (_, i) => (i < stars ? "\u2605" : "\u2606")).join("")}
    </span>
  );
}

export default function DayPlanning({
  state,
  onBuyIngredient,
  onRecipeChange,
  onPriceChange,
  onBuyUpgrade,
  onStartSelling,
  onDismissEvent,
}: DayPlanningProps) {
  const maxCups = calculateMaxCups(state.inventory, state.recipe);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Event modal */}
      {state.activeEvent && (
        <EventModal event={state.activeEvent} onDismiss={onDismissEvent} />
      )}

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Day {state.day} of {state.totalDays}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Plan your day, then start selling!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {formatMoney(state.money)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Reputation</p>
            <ReputationStars reputation={state.reputation} />
          </div>
        </div>
      </div>

      {/* Weather */}
      <div className="mb-6">
        <WeatherDisplay weather={state.weather} />
      </div>

      {/* Main grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <InventoryShop
            money={state.money}
            inventory={state.inventory}
            supplyDelayActive={state.supplyDelayActive}
            lemonShortageActive={state.lemonShortageActive}
            onBuy={onBuyIngredient}
          />
          <RecipeEditor recipe={state.recipe} onChange={onRecipeChange} />
        </div>
        <div className="space-y-4">
          <PriceSetter
            price={state.pricePerCup}
            recipe={state.recipe}
            onChange={onPriceChange}
          />
          <UpgradeShop
            money={state.money}
            ownedUpgrades={state.upgrades}
            onBuy={onBuyUpgrade}
          />
        </div>
      </div>

      {/* Financial history */}
      {state.history.length > 0 && (
        <div className="mb-6">
          <FinancialDashboard history={state.history} money={state.money} />
        </div>
      )}

      {/* Start selling button */}
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          You can make <strong className="text-gray-900 dark:text-gray-100">{maxCups} cups</strong> with your current inventory and recipe.
        </p>
        <button
          onClick={onStartSelling}
          disabled={maxCups === 0}
          className={`px-8 py-4 text-lg font-semibold rounded-xl transition-colors ${
            maxCups > 0
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
        >
          {maxCups > 0 ? "Start Selling!" : "Buy ingredients to start!"}
        </button>
      </div>
    </div>
  );
}

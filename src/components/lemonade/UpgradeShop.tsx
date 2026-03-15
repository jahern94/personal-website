import { ALL_UPGRADES } from "@/lib/lemonade/upgrades";
import { formatMoney } from "@/lib/lemonade/engine";

interface UpgradeShopProps {
  money: number;
  ownedUpgrades: string[];
  onBuy: (upgradeId: string) => void;
}

export default function UpgradeShop({ money, ownedUpgrades, onBuy }: UpgradeShopProps) {
  const available = ALL_UPGRADES.filter((u) => !ownedUpgrades.includes(u.id));

  if (available.length === 0 && ownedUpgrades.length > 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">
          Upgrades
        </h3>
        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
          All upgrades purchased!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">
        Upgrades
      </h3>
      <div className="space-y-2">
        {available.map((upgrade) => {
          const canAfford = money >= upgrade.cost;
          return (
            <button
              key={upgrade.id}
              onClick={() => onBuy(upgrade.id)}
              disabled={!canAfford}
              className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                canAfford
                  ? "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  : "bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed"
              }`}
            >
              <span className="text-2xl">{upgrade.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {upgrade.name}
                  </p>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {formatMoney(upgrade.cost)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{upgrade.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      {ownedUpgrades.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Owned: {ownedUpgrades.map((id) => ALL_UPGRADES.find((u) => u.id === id)?.icon).join(" ")}
          </p>
        </div>
      )}
    </div>
  );
}

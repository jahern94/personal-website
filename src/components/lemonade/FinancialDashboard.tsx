import { DayResult } from "@/lib/lemonade/types";
import { formatMoney } from "@/lib/lemonade/engine";
import SimpleChart from "./SimpleChart";

interface FinancialDashboardProps {
  history: DayResult[];
  money: number;
}

export default function FinancialDashboard({ history, money }: FinancialDashboardProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">
          Financial History
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No sales data yet. Start selling!</p>
      </div>
    );
  }

  const totalRevenue = history.reduce((sum, d) => sum + d.revenue, 0);
  const totalCosts = history.reduce((sum, d) => sum + d.ingredientCost, 0);
  const totalProfit = history.reduce((sum, d) => sum + d.profit, 0);
  const totalCups = history.reduce((sum, d) => sum + d.cupsSold, 0);

  const profitData = history.map((d) => d.profit);
  const labels = history.map((d) => `D${d.day}`);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">
        Financial History
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatMoney(money)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatMoney(totalRevenue)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Costs</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatMoney(totalCosts)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Profit</p>
          <p className={`text-lg font-bold ${totalProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {formatMoney(totalProfit)}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {totalCups} cups sold across {history.length} day{history.length !== 1 ? "s" : ""}
      </p>

      {history.length > 1 && (
        <div className="overflow-x-auto">
          <SimpleChart data={profitData} labels={labels} type="bar" height={120} />
        </div>
      )}
    </div>
  );
}

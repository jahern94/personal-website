import { DayResult } from "@/lib/lemonade/types";
import { formatMoney, calculateGrade } from "@/lib/lemonade/engine";
import SimpleChart from "./SimpleChart";

interface GameOverProps {
  history: DayResult[];
  finalMoney: number;
  startingMoney: number;
  onRestart: () => void;
}

export default function GameOver({ history, finalMoney, startingMoney, onRestart }: GameOverProps) {
  const totalRevenue = history.reduce((sum, d) => sum + d.revenue, 0);
  const totalCosts = history.reduce((sum, d) => sum + d.ingredientCost, 0);
  const totalProfit = history.reduce((sum, d) => sum + d.profit, 0);
  const totalCups = history.reduce((sum, d) => sum + d.cupsSold, 0);
  const avgSatisfaction = Math.round(
    history.reduce((sum, d) => sum + d.customerSatisfaction, 0) / history.length
  );

  const bestDay = history.reduce((best, d) => (d.profit > best.profit ? d : best), history[0]);
  const worstDay = history.reduce((worst, d) => (d.profit < worst.profit ? d : worst), history[0]);

  const grade = calculateGrade({ history } as Parameters<typeof calculateGrade>[0]);

  const gradeColor =
    grade.startsWith("A")
      ? "text-green-600 dark:text-green-400"
      : grade.startsWith("B")
        ? "text-blue-600 dark:text-blue-400"
        : grade.startsWith("C")
          ? "text-amber-600 dark:text-amber-400"
          : "text-red-600 dark:text-red-400";

  const profitData = history.map((d) => d.profit);
  const cupsData = history.map((d) => d.cupsSold);
  const dayLabels = history.map((d) => `${d.day}`);

  // Concepts learned based on game events
  const concepts: string[] = [
    "Profit & Loss",
    "Pricing Strategy",
    "Supply & Demand",
    "Inventory Management",
  ];
  if (history.some((d) => d.event?.id === "healthInspector")) concepts.push("Compliance & Regulation");
  if (history.some((d) => d.event?.id === "competition")) concepts.push("Market Competition");
  if (history.some((d) => d.weather.type === "rainy" || d.weather.type === "stormy")) concepts.push("Risk Management");
  if (history.some((d) => d.customerSatisfaction >= 80)) concepts.push("Customer Satisfaction");
  if (totalProfit > 0) concepts.push("Return on Investment");

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Grade */}
      <div className="text-center mb-10">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {history.length}-Day Challenge Complete!
        </p>
        <div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${
            grade.startsWith("A")
              ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950"
              : grade.startsWith("B")
                ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950"
                : grade.startsWith("C")
                  ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950"
                  : "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950"
          }`}
        >
          <span className={`text-4xl font-black ${gradeColor}`}>{grade}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-4">
          {grade.startsWith("A")
            ? "Business Mogul!"
            : grade.startsWith("B")
              ? "Solid Entrepreneur!"
              : grade.startsWith("C")
                ? "Learning the Ropes"
                : "Room to Grow"}
        </h1>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Final Balance</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatMoney(finalMoney)}</p>
          <p className="text-xs text-gray-400">started at {formatMoney(startingMoney)}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Profit</p>
          <p className={`text-xl font-bold ${totalProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {formatMoney(totalProfit)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatMoney(totalRevenue)}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Costs</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">{formatMoney(totalCosts)}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Cups Sold</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalCups}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg Satisfaction</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{avgSatisfaction}/100</p>
        </div>
      </div>

      {/* Best/worst days */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 dark:bg-green-950 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">Best Day</p>
          <p className="text-lg font-bold text-green-700 dark:text-green-300">Day {bestDay.day}</p>
          <p className="text-sm text-green-600 dark:text-green-400">{formatMoney(bestDay.profit)} profit</p>
        </div>
        <div className="bg-red-50 dark:bg-red-950 rounded-xl p-4 border border-red-200 dark:border-red-800">
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">Worst Day</p>
          <p className="text-lg font-bold text-red-700 dark:text-red-300">Day {worstDay.day}</p>
          <p className="text-sm text-red-600 dark:text-red-400">{formatMoney(worstDay.profit)} profit</p>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Daily Profit</h3>
          <div className="overflow-x-auto">
            <SimpleChart data={profitData} labels={dayLabels} type="line" height={160} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Cups Sold per Day</h3>
          <div className="overflow-x-auto">
            <SimpleChart data={cupsData} labels={dayLabels} type="bar" height={140} color="#0ea5e9" />
          </div>
        </div>
      </div>

      {/* Concepts learned */}
      <div className="bg-amber-50 dark:bg-amber-950 rounded-xl p-5 border border-amber-200 dark:border-amber-800 mb-8">
        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3">
          {"\u{1F4DA}"} Business Concepts Learned
        </h3>
        <div className="flex flex-wrap gap-2">
          {concepts.map((concept) => (
            <span
              key={concept}
              className="px-3 py-1 rounded-full bg-amber-200 dark:bg-amber-800 text-xs font-medium text-amber-800 dark:text-amber-200"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>

      {/* Play again */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

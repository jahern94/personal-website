import { useEffect, useState } from "react";
import { DayResult } from "@/lib/lemonade/types";
import { formatMoney } from "@/lib/lemonade/engine";
import { getWeatherEmoji } from "@/lib/lemonade/weather";
import BusinessTip from "./BusinessTip";

interface DayResultsProps {
  result: DayResult;
  isLastDay: boolean;
  onNext: () => void;
}

function AnimatedNumber({ target, prefix = "", duration = 1000 }: { target: number; prefix?: string; duration?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{prefix}{current}</span>;
}

function SatisfactionEmoji({ score }: { score: number }) {
  const emoji = score >= 80 ? "\u{1F929}" : score >= 60 ? "\u{1F60A}" : score >= 40 ? "\u{1F610}" : score >= 20 ? "\u{1F61F}" : "\u{1F620}";
  const label = score >= 80 ? "Thrilled!" : score >= 60 ? "Happy" : score >= 40 ? "Okay" : score >= 20 ? "Unhappy" : "Angry";

  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl">{emoji}</span>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{label}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{score}/100</p>
    </div>
  );
}

export default function DayResults({ result, isLastDay, onNext }: DayResultsProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Day {result.day} Results {getWeatherEmoji(result.weather.type)}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
          {result.profit > 0 ? "Great day!" : result.profit === 0 ? "Broke even!" : "Tough day..."}
        </h2>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cups Sold</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            <AnimatedNumber target={result.cupsSold} />
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">of {result.cupsMade} made</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Satisfaction</p>
          <SatisfactionEmoji score={result.customerSatisfaction} />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Revenue</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatMoney(result.revenue)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Costs</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatMoney(result.ingredientCost)}
          </p>
        </div>
      </div>

      {/* Profit banner */}
      <div
        className={`rounded-xl p-6 text-center mb-8 ${
          result.profit >= 0
            ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
        }`}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Day{"\u2019"}s Profit
        </p>
        <p
          className={`text-4xl font-bold ${
            result.profit >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {formatMoney(result.profit)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Balance: {formatMoney(result.moneyAfter)}
        </p>
      </div>

      {/* Event recap */}
      {result.event && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {result.event.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{result.event.description}</p>
        </div>
      )}

      {/* Business tip */}
      <div className="mb-8">
        <BusinessTip tip={result.tip} />
      </div>

      {/* Next button */}
      <div className="text-center">
        <button
          onClick={onNext}
          className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          {isLastDay ? "See Final Results" : "Next Day"}
        </button>
      </div>
    </div>
  );
}

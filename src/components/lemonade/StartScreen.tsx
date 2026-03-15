import { useState } from "react";

interface StartScreenProps {
  hasSave: boolean;
  onStart: (totalDays: number) => void;
  onContinue: () => void;
}

export default function StartScreen({ hasSave, onStart, onContinue }: StartScreenProps) {
  const [selectedDays, setSelectedDays] = useState(14);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24 text-center">
      <div className="text-6xl md:text-8xl mb-6">{"\u{1F34B}"}</div>
      <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Lemonade Stand
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-md mx-auto">
        Learn how to run a business by managing your own lemonade stand. Set prices,
        manage inventory, and make smart decisions to maximize profit!
      </p>

      <div className="space-y-6">
        {/* Day selection */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            How long do you want to play?
          </p>
          <div className="flex gap-3 justify-center">
            {[14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setSelectedDays(days)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedDays === days
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart(selectedDays)}
          className="w-full px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          New Game
        </button>

        {hasSave && (
          <button
            onClick={onContinue}
            className="w-full px-6 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-lg font-medium rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Continue Saved Game
          </button>
        )}
      </div>

      {/* How to play */}
      <div className="mt-12 text-left bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          How to Play
        </h2>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-2">
            <span>{"\u{1F4B0}"}</span>
            <span>You start with $20.00. Buy ingredients and set your prices each day.</span>
          </li>
          <li className="flex gap-2">
            <span>{"\u{1F327}\uFE0F"}</span>
            <span>Weather affects how many customers show up. Plan accordingly!</span>
          </li>
          <li className="flex gap-2">
            <span>{"\u2B50"}</span>
            <span>Keep quality high and prices fair to build your reputation.</span>
          </li>
          <li className="flex gap-2">
            <span>{"\u{1F4C8}"}</span>
            <span>Buy upgrades to attract more customers and boost revenue.</span>
          </li>
          <li className="flex gap-2">
            <span>{"\u{1F3AF}"}</span>
            <span>Maximize your profit by the end to get the best grade!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

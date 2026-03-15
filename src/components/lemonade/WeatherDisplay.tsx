import { WeatherForecast } from "@/lib/lemonade/types";
import { getWeatherEmoji } from "@/lib/lemonade/weather";

interface WeatherDisplayProps {
  weather: WeatherForecast;
}

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950 dark:to-sky-950 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
      <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3 uppercase tracking-wide">
        Weather Forecast
      </h3>
      <div className="flex gap-4">
        {/* Today */}
        <div className="flex-1 bg-white/60 dark:bg-gray-900/60 rounded-lg p-4 text-center">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Today</p>
          <div className="text-3xl mb-1">{getWeatherEmoji(weather.today.type)}</div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {weather.today.tempF}&deg;F
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
            {weather.today.type}
          </p>
        </div>
        {/* Tomorrow */}
        <div className="flex-1 bg-white/40 dark:bg-gray-900/40 rounded-lg p-4 text-center opacity-75">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tomorrow</p>
          <div className="text-3xl mb-1">{getWeatherEmoji(weather.tomorrow.type)}</div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {weather.tomorrow.tempF}&deg;F
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
            {weather.tomorrow.type}
          </p>
        </div>
      </div>
      <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 italic">
        {weather.today.description}
      </p>
    </div>
  );
}

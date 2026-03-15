"use client";

import { useState, useEffect, useRef } from "react";
import {
  searchCities,
  fetchWeather,
  getWeatherInfo,
  getWindDirection,
  type GeocodingResult,
  type WeatherData,
} from "@/lib/weather";

export default function WeatherPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState<GeocodingResult | null>(
    null
  );
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  function toDisplay(celsius: number): number {
    return unit === "F" ? Math.round(celsius * 9 / 5 + 32) : Math.round(celsius);
  }

  // Debounced city search
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch weather when a city is selected
  useEffect(() => {
    if (!selectedCity) return;

    async function loadWeather() {
      setLoading(true);
      setError(null);
      setWeather(null);
      try {
        const data = await fetchWeather(
          selectedCity!.latitude,
          selectedCity!.longitude
        );
        setWeather(data);
      } catch {
        setError("Could not load weather data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, [selectedCity]);

  function handleSelectCity(city: GeocodingResult) {
    setSelectedCity(city);
    setQuery(`${city.name}${city.admin1 ? `, ${city.admin1}` : ""}, ${city.country}`);
    setShowSuggestions(false);
    setSuggestions([]);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Weather
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
        Search for any city to see current conditions and a 7-day forecast.
      </p>

      {/* Search Input */}
      <div className="relative mb-10" ref={searchRef}>
        <label
          htmlFor="city-search"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Search City
        </label>
        <input
          type="text"
          id="city-search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selectedCity) setSelectedCity(null);
          }}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Type a city name..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((city) => (
              <li key={city.id}>
                <button
                  type="button"
                  onClick={() => handleSelectCity(city)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {city.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    {city.admin1 ? `${city.admin1}, ` : ""}
                    {city.country}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Unit Toggle */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-sm text-gray-500 dark:text-gray-400">Temperature unit:</span>
        <button
          onClick={() => setUnit("C")}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            unit === "C"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          &deg;C
        </button>
        <button
          onClick={() => setUnit("F")}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            unit === "F"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          &deg;F
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading weather data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setWeather(null);
              setSelectedCity(null);
              setQuery("");
            }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {/* Current Weather */}
      {weather && selectedCity && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {selectedCity.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedCity.admin1 ? `${selectedCity.admin1}, ` : ""}
                {selectedCity.country}
              </p>
            </div>
            <span className="text-5xl">
              {getWeatherInfo(weather.current.weather_code).emoji}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {toDisplay(weather.current.temperature_2m)}&deg;{unit}
            </span>
            <span className="text-lg text-gray-500 dark:text-gray-400">
              {getWeatherInfo(weather.current.weather_code).description}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Feels Like
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {toDisplay(weather.current.apparent_temperature)}&deg;{unit}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Humidity
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {weather.current.relative_humidity_2m}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Wind
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {Math.round(weather.current.wind_speed_10m)} km/h
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Precipitation
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {weather.current.precipitation} mm
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Metrics Dropdown */}
      {weather && selectedCity && (
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            {showAdvanced ? "Hide" : "Show"} Advanced Metrics
          </button>

          {showAdvanced && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Detailed Conditions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    UV Index
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {weather.current.uv_index.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {weather.current.uv_index < 3
                      ? "Low"
                      : weather.current.uv_index < 6
                        ? "Moderate"
                        : weather.current.uv_index < 8
                          ? "High"
                          : weather.current.uv_index < 11
                            ? "Very High"
                            : "Extreme"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Dew Point
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {toDisplay(weather.current.dew_point_2m)}&deg;{unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Pressure
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {Math.round(weather.current.surface_pressure)} hPa
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Visibility
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {(weather.current.visibility / 1000).toFixed(1)} km
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Cloud Cover
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {weather.current.cloud_cover}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Wind Direction
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {getWindDirection(weather.current.wind_direction_10m)} ({weather.current.wind_direction_10m}&deg;)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Wind Gusts
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {Math.round(weather.current.wind_gusts_10m)} km/h
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Precipitation
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {weather.current.precipitation} mm
                  </p>
                </div>
              </div>

              {/* Daily advanced breakdown */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">
                Daily Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 pr-4 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Day</th>
                      <th className="text-left py-2 pr-4 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">UV Max</th>
                      <th className="text-left py-2 pr-4 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Rain Chance</th>
                      <th className="text-left py-2 pr-4 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Rain Total</th>
                      <th className="text-left py-2 pr-4 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Max Wind</th>
                      <th className="text-left py-2 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Gusts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weather.daily.time.map((date, i) => {
                      const dayName = new Date(date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        { weekday: "short" }
                      );
                      return (
                        <tr key={date} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-2.5 pr-4 font-medium text-gray-900 dark:text-gray-100">
                            {i === 0 ? "Today" : dayName}
                          </td>
                          <td className="py-2.5 pr-4 text-gray-700 dark:text-gray-300">
                            {weather.daily.uv_index_max[i].toFixed(1)}
                          </td>
                          <td className="py-2.5 pr-4 text-gray-700 dark:text-gray-300">
                            {weather.daily.precipitation_probability_max[i]}%
                          </td>
                          <td className="py-2.5 pr-4 text-gray-700 dark:text-gray-300">
                            {weather.daily.precipitation_sum[i]} mm
                          </td>
                          <td className="py-2.5 pr-4 text-gray-700 dark:text-gray-300">
                            {Math.round(weather.daily.wind_speed_10m_max[i])} km/h
                          </td>
                          <td className="py-2.5 text-gray-700 dark:text-gray-300">
                            {Math.round(weather.daily.wind_gusts_10m_max[i])} km/h
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7-Day Forecast */}
      {weather && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            7-Day Forecast
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {weather.daily.time.map((date, i) => {
              const info = getWeatherInfo(weather.daily.weather_code[i]);
              const dayName = new Date(date + "T00:00:00").toLocaleDateString(
                "en-US",
                { weekday: "short" }
              );
              return (
                <div
                  key={date}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {i === 0 ? "Today" : dayName}
                  </p>
                  <span className="text-3xl block mb-2">{info.emoji}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {info.description}
                  </p>
                  <div className="flex justify-center gap-2 text-sm">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {toDisplay(weather.daily.temperature_2m_max[i])}&deg;
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">
                      {toDisplay(weather.daily.temperature_2m_min[i])}&deg;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

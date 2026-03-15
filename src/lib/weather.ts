// Types for the Open-Meteo Geocoding API response
export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // state/province
}

// Types for the Open-Meteo Weather API response
export interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    surface_pressure: number;
    cloud_cover: number;
    uv_index: number;
    visibility: number;
    dew_point_2m: number;
    wind_gusts_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    uv_index_max: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
  };
}

// Map WMO weather codes to descriptions and emojis
export function getWeatherInfo(code: number): {
  description: string;
  emoji: string;
} {
  const map: Record<number, { description: string; emoji: string }> = {
    0: { description: "Clear sky", emoji: "\u2600\uFE0F" },
    1: { description: "Mainly clear", emoji: "\uD83C\uDF24\uFE0F" },
    2: { description: "Partly cloudy", emoji: "\u26C5" },
    3: { description: "Overcast", emoji: "\u2601\uFE0F" },
    45: { description: "Foggy", emoji: "\uD83C\uDF2B\uFE0F" },
    48: { description: "Rime fog", emoji: "\uD83C\uDF2B\uFE0F" },
    51: { description: "Light drizzle", emoji: "\uD83C\uDF26\uFE0F" },
    53: { description: "Moderate drizzle", emoji: "\uD83C\uDF26\uFE0F" },
    55: { description: "Dense drizzle", emoji: "\uD83C\uDF27\uFE0F" },
    56: { description: "Freezing drizzle", emoji: "\uD83C\uDF27\uFE0F" },
    57: { description: "Dense freezing drizzle", emoji: "\uD83C\uDF27\uFE0F" },
    61: { description: "Slight rain", emoji: "\uD83C\uDF27\uFE0F" },
    63: { description: "Moderate rain", emoji: "\uD83C\uDF27\uFE0F" },
    65: { description: "Heavy rain", emoji: "\uD83C\uDF27\uFE0F" },
    66: { description: "Freezing rain", emoji: "\uD83C\uDF27\uFE0F" },
    67: { description: "Heavy freezing rain", emoji: "\uD83C\uDF27\uFE0F" },
    71: { description: "Slight snow", emoji: "\uD83C\uDF28\uFE0F" },
    73: { description: "Moderate snow", emoji: "\uD83C\uDF28\uFE0F" },
    75: { description: "Heavy snow", emoji: "\u2744\uFE0F" },
    77: { description: "Snow grains", emoji: "\u2744\uFE0F" },
    80: { description: "Light showers", emoji: "\uD83C\uDF26\uFE0F" },
    81: { description: "Moderate showers", emoji: "\uD83C\uDF27\uFE0F" },
    82: { description: "Violent showers", emoji: "\u26C8\uFE0F" },
    85: { description: "Light snow showers", emoji: "\uD83C\uDF28\uFE0F" },
    86: { description: "Heavy snow showers", emoji: "\uD83C\uDF28\uFE0F" },
    95: { description: "Thunderstorm", emoji: "\u26C8\uFE0F" },
    96: { description: "Thunderstorm with hail", emoji: "\u26C8\uFE0F" },
    99: { description: "Thunderstorm with heavy hail", emoji: "\u26C8\uFE0F" },
  };

  return map[code] ?? { description: "Unknown", emoji: "\u2753" };
}

// Convert wind direction degrees to compass label
export function getWindDirection(degrees: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(degrees / 22.5) % 16];
}

// Search cities using Open-Meteo Geocoding API
export async function searchCities(
  query: string
): Promise<GeocodingResult[]> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en`
  );
  if (!res.ok) throw new Error("Failed to search cities");
  const data = await res.json();
  return data.results ?? [];
}

// Fetch weather data using Open-Meteo Forecast API
export async function fetchWeather(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,cloud_cover,uv_index,visibility,dew_point_2m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&timezone=auto`
  );
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

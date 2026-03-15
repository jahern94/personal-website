import { WeatherType, WeatherDay, WeatherForecast } from "./types";

const WEATHER_WEIGHTS: { type: WeatherType; weight: number }[] = [
  { type: "sunny", weight: 35 },
  { type: "hot", weight: 20 },
  { type: "cloudy", weight: 25 },
  { type: "rainy", weight: 15 },
  { type: "stormy", weight: 5 },
];

const TEMP_RANGES: Record<WeatherType, [number, number]> = {
  hot: [90, 105],
  sunny: [75, 90],
  cloudy: [60, 75],
  rainy: [55, 70],
  stormy: [50, 65],
};

const WEATHER_DESCRIPTIONS: Record<WeatherType, string[]> = {
  hot: ["Scorching heat wave!", "Blazing hot day!", "Sweltering temperatures!"],
  sunny: ["Beautiful sunny day!", "Clear skies and warm!", "Perfect lemonade weather!"],
  cloudy: ["Overcast skies today.", "Cloudy but mild.", "Gray skies overhead."],
  rainy: ["Rainy day ahead.", "Showers expected.", "Bring an umbrella!"],
  stormy: ["Thunderstorms rolling in!", "Severe weather warning!", "Stay dry out there!"],
};

const WEATHER_EMOJIS: Record<WeatherType, string> = {
  hot: "\u{1F525}",
  sunny: "\u2600\uFE0F",
  cloudy: "\u2601\uFE0F",
  rainy: "\u{1F327}\uFE0F",
  stormy: "\u26C8\uFE0F",
};

function pickWeightedRandom(): WeatherType {
  const totalWeight = WEATHER_WEIGHTS.reduce((sum, w) => sum + w.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of WEATHER_WEIGHTS) {
    roll -= entry.weight;
    if (roll <= 0) return entry.type;
  }
  return "sunny";
}

function randomTemp(type: WeatherType): number {
  const [min, max] = TEMP_RANGES[type];
  return Math.round(min + Math.random() * (max - min));
}

function shiftWeather(type: WeatherType): WeatherType {
  const types: WeatherType[] = ["stormy", "rainy", "cloudy", "sunny", "hot"];
  const idx = types.indexOf(type);
  const shift = Math.random() < 0.5 ? -1 : 1;
  const newIdx = Math.max(0, Math.min(types.length - 1, idx + shift));
  return types[newIdx];
}

function makeWeatherDay(type: WeatherType): WeatherDay {
  const descriptions = WEATHER_DESCRIPTIONS[type];
  return {
    type,
    tempF: randomTemp(type),
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
  };
}

export function generateForecast(previousTomorrow?: { type: WeatherType; tempF: number }): WeatherForecast {
  let todayType: WeatherType;
  let todayTemp: number;

  if (previousTomorrow) {
    // 80% chance forecast was accurate, 20% shifts
    if (Math.random() < 0.8) {
      todayType = previousTomorrow.type;
      todayTemp = previousTomorrow.tempF + Math.round((Math.random() - 0.5) * 6);
    } else {
      todayType = shiftWeather(previousTomorrow.type);
      todayTemp = randomTemp(todayType);
    }
  } else {
    todayType = pickWeightedRandom();
    todayTemp = randomTemp(todayType);
  }

  const tomorrowType = pickWeightedRandom();

  return {
    today: {
      type: todayType,
      tempF: todayTemp,
      description: WEATHER_DESCRIPTIONS[todayType][Math.floor(Math.random() * WEATHER_DESCRIPTIONS[todayType].length)],
    },
    tomorrow: {
      type: tomorrowType,
      tempF: randomTemp(tomorrowType),
    },
  };
}

export function getWeatherEmoji(type: WeatherType): string {
  return WEATHER_EMOJIS[type];
}

export function getWeatherBaseDemand(type: WeatherType): number {
  const bases: Record<WeatherType, number> = {
    hot: 60,
    sunny: 50,
    cloudy: 30,
    rainy: 15,
    stormy: 5,
  };
  return bases[type];
}

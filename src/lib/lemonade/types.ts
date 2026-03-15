export type GamePhase = "start" | "planning" | "results" | "gameover";
export type WeatherType = "sunny" | "hot" | "cloudy" | "rainy" | "stormy";

export interface WeatherDay {
  type: WeatherType;
  tempF: number;
  description: string;
}

export interface WeatherForecast {
  today: WeatherDay;
  tomorrow: { type: WeatherType; tempF: number };
}

export interface Inventory {
  lemons: number;
  sugarCups: number;
  iceCubes: number;
  cups: number;
}

export interface Recipe {
  lemonsPerPitcher: number;
  sugarPerPitcher: number;
  icePerCup: number;
  cupsPerPitcher: number;
}

export interface BusinessTip {
  title: string;
  concept: string;
  message: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: "positive" | "negative" | "neutral";
}

export interface DayResult {
  day: number;
  weather: WeatherDay;
  cupsSold: number;
  cupsMade: number;
  revenue: number;
  ingredientCost: number;
  profit: number;
  customerSatisfaction: number;
  moneyAfter: number;
  event: GameEvent | null;
  tip: BusinessTip;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  demandMultiplier: number;
  satisfactionBonus: number;
  revenueMultiplier: number;
  specialEffect?: string;
  icon: string;
  lesson: string;
}

export interface GameState {
  phase: GamePhase;
  day: number;
  totalDays: number;
  money: number;
  reputation: number;
  weather: WeatherForecast;
  inventory: Inventory;
  recipe: Recipe;
  pricePerCup: number;
  upgrades: string[];
  history: DayResult[];
  activeEvent: GameEvent | null;
  competitionDaysLeft: number;
  supplyDelayActive: boolean;
  lemonShortageActive: boolean;
}

export const DEFAULT_RECIPE: Recipe = {
  lemonsPerPitcher: 4,
  sugarPerPitcher: 3,
  icePerCup: 3,
  cupsPerPitcher: 8,
};

export const STARTING_MONEY = 2000; // $20.00 in cents
export const DEFAULT_PRICE = 100; // $1.00 in cents

export const INGREDIENT_PRICES = {
  lemons: 25,
  sugarCups: 15,
  iceCubes: 5,
  cups: 3,
} as const;

export const INGREDIENT_LABELS: Record<keyof Inventory, string> = {
  lemons: "Lemons",
  sugarCups: "Sugar (cups)",
  iceCubes: "Ice Cubes",
  cups: "Paper Cups",
};

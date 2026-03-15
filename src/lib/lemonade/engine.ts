import {
  GameState,
  DayResult,
  Inventory,
  Recipe,
  STARTING_MONEY,
  DEFAULT_PRICE,
  DEFAULT_RECIPE,
  INGREDIENT_PRICES,
} from "./types";
import { generateForecast, getWeatherBaseDemand } from "./weather";
import { maybeGenerateEvent, applyEventEffects } from "./events";
import { getUpgradeMultipliers } from "./upgrades";
import { selectTip } from "./tips";

export function createNewGame(totalDays: number): GameState {
  return {
    phase: "planning",
    day: 1,
    totalDays,
    money: STARTING_MONEY,
    reputation: 50,
    weather: generateForecast(),
    inventory: { lemons: 0, sugarCups: 0, iceCubes: 0, cups: 0 },
    recipe: { ...DEFAULT_RECIPE },
    pricePerCup: DEFAULT_PRICE,
    upgrades: [],
    history: [],
    activeEvent: null,
    competitionDaysLeft: 0,
    supplyDelayActive: false,
    lemonShortageActive: false,
  };
}

export function calculateQuality(recipe: Recipe): number {
  const lemonDiff = Math.abs(recipe.lemonsPerPitcher - 4);
  const sugarDiff = Math.abs(recipe.sugarPerPitcher - 3);
  const iceDiff = Math.abs(recipe.icePerCup - 3);
  const penalty = (lemonDiff + sugarDiff + iceDiff) * 8;
  return Math.max(10, Math.min(100, 100 - penalty));
}

export function calculateCostPerCup(recipe: Recipe): number {
  const pitcherCost =
    recipe.lemonsPerPitcher * INGREDIENT_PRICES.lemons +
    recipe.sugarPerPitcher * INGREDIENT_PRICES.sugarCups;
  const costPerCupFromPitcher = Math.round(pitcherCost / recipe.cupsPerPitcher);
  const iceCost = recipe.icePerCup * INGREDIENT_PRICES.iceCubes;
  const cupCost = INGREDIENT_PRICES.cups;
  return costPerCupFromPitcher + iceCost + cupCost;
}

export function calculateMaxCups(inventory: Inventory, recipe: Recipe): number {
  if (
    recipe.lemonsPerPitcher === 0 ||
    recipe.sugarPerPitcher === 0 ||
    recipe.icePerCup === 0
  ) {
    return 0;
  }
  const pitchersFromLemons = Math.floor(inventory.lemons / recipe.lemonsPerPitcher);
  const pitchersFromSugar = Math.floor(inventory.sugarCups / recipe.sugarPerPitcher);
  const maxPitchers = Math.min(pitchersFromLemons, pitchersFromSugar);
  const cupsFromPitchers = maxPitchers * recipe.cupsPerPitcher;
  const cupsFromIce = Math.floor(inventory.iceCubes / recipe.icePerCup);
  const cupsFromCups = inventory.cups;
  return Math.min(cupsFromPitchers, cupsFromIce, cupsFromCups);
}

export function simulateDay(state: GameState): DayResult {
  const event = maybeGenerateEvent(state);
  const eventEffects = event
    ? applyEventEffects(state, event)
    : { demandMultiplier: 1.0, moneyChange: 0, reputationChange: 0 };

  // Calculate how many cups we can make
  const cupsMade = calculateMaxCups(state.inventory, state.recipe);
  const quality = calculateQuality(state.recipe);

  // Calculate demand
  const baseDemand = getWeatherBaseDemand(state.weather.today.type);
  const tempBonus = Math.max(0.5, 1 + (state.weather.today.tempF - 70) * 0.015);
  const priceEffect = Math.max(0.2, 1 - (state.pricePerCup - 100) / 200);
  const qualityEffect = quality / 100;
  const reputationEffect = 0.7 + state.reputation / 333;

  const upgradeMults = getUpgradeMultipliers(state.upgrades);
  let upgradeMultiplier = upgradeMults.demandMult;

  // Rain/storm penalty reduced if umbrella
  const isWetWeather =
    state.weather.today.type === "rainy" || state.weather.today.type === "stormy";
  const hasUmbrella = upgradeMults.specialEffects.includes("noRainPenalty");
  if (isWetWeather && hasUmbrella) {
    upgradeMultiplier *= 1.5; // offset rain penalty
  }

  // Competition penalty
  const competitionMult = state.competitionDaysLeft > 0 ? 0.8 : 1.0;
  // Event demand multiplier
  const eventDemandMult = eventEffects.demandMultiplier;

  const randomVariance = 0.85 + Math.random() * 0.3;

  const potentialCustomers = Math.round(
    baseDemand *
      tempBonus *
      priceEffect *
      qualityEffect *
      reputationEffect *
      upgradeMultiplier *
      competitionMult *
      eventDemandMult *
      randomVariance
  );

  const cupsSold = Math.min(Math.max(0, potentialCustomers), cupsMade);

  // Calculate finances
  const costPerCup = calculateCostPerCup(state.recipe);
  const ingredientCost = cupsSold * costPerCup;
  let revenue = cupsSold * state.pricePerCup;
  revenue = Math.round(revenue * upgradeMults.revenueMult);

  const profit = revenue - ingredientCost + eventEffects.moneyChange;

  // Customer satisfaction
  const perceivedFairPrice = 75 + quality * 0.5;
  const valueFeel = Math.max(0, Math.min(100, 100 - Math.abs(state.pricePerCup - perceivedFairPrice) * 0.5));
  const weatherMatch = isWetWeather && !hasUmbrella ? 30 : state.weather.today.type === "hot" ? 90 : 60;
  let satisfaction = Math.round(
    quality * 0.4 + valueFeel * 0.3 + weatherMatch * 0.3 + upgradeMults.satisfactionBonus
  );
  satisfaction = Math.max(0, Math.min(100, satisfaction));

  const moneyAfter = state.money + profit;

  const result: DayResult = {
    day: state.day,
    weather: state.weather.today,
    cupsSold,
    cupsMade,
    revenue,
    ingredientCost,
    profit,
    customerSatisfaction: satisfaction,
    moneyAfter,
    event,
    tip: selectTip(
      {
        day: state.day,
        weather: state.weather.today,
        cupsSold,
        cupsMade,
        revenue,
        ingredientCost,
        profit,
        customerSatisfaction: satisfaction,
        moneyAfter,
        event,
        tip: { title: "", concept: "", message: "" },
      },
      state
    ),
  };

  return result;
}

export function advanceDay(state: GameState, result: DayResult): GameState {
  // Deduct used inventory
  const pitchersUsed = Math.ceil(result.cupsSold / state.recipe.cupsPerPitcher);
  const lemonsUsed = pitchersUsed * state.recipe.lemonsPerPitcher;
  const sugarUsed = pitchersUsed * state.recipe.sugarPerPitcher;
  const iceUsed = result.cupsSold * state.recipe.icePerCup;
  const cupsUsed = result.cupsSold;

  let remainingIce = Math.max(0, state.inventory.iceCubes - iceUsed);
  // Ice melts overnight
  const hasCooler = state.upgrades.includes("cooler");
  const meltRate = hasCooler ? 0.1 : 0.3;
  remainingIce = Math.round(remainingIce * (1 - meltRate));

  const newInventory: Inventory = {
    lemons: Math.max(0, state.inventory.lemons - lemonsUsed),
    sugarCups: Math.max(0, state.inventory.sugarCups - sugarUsed),
    iceCubes: remainingIce,
    cups: Math.max(0, state.inventory.cups - cupsUsed),
  };

  // Update reputation
  let newReputation = state.reputation + (result.customerSatisfaction - 50) * 0.1;
  if (result.event) {
    const effects = applyEventEffects(state, result.event);
    newReputation += effects.reputationChange;
  }
  newReputation = Math.max(0, Math.min(100, newReputation));

  // Competition timer
  let competitionDaysLeft = state.competitionDaysLeft;
  if (result.event?.id === "competition") {
    competitionDaysLeft = 2;
  } else if (competitionDaysLeft > 0) {
    competitionDaysLeft--;
  }

  const isLastDay = state.day >= state.totalDays;

  return {
    ...state,
    phase: isLastDay ? "gameover" : "planning",
    day: state.day + 1,
    money: result.moneyAfter,
    reputation: Math.round(newReputation),
    weather: generateForecast(state.weather.tomorrow),
    inventory: newInventory,
    history: [...state.history, result],
    activeEvent: null,
    competitionDaysLeft,
    supplyDelayActive: result.event?.id === "supplyDelay",
    lemonShortageActive: result.event?.id === "lemonShortage",
  };
}

export function calculateGrade(state: GameState): string {
  const totalProfit = state.history.reduce((sum, d) => sum + d.profit, 0);
  const avgSatisfaction =
    state.history.reduce((sum, d) => sum + d.customerSatisfaction, 0) / state.history.length;
  const profitPerDay = totalProfit / state.history.length;

  // Score from 0-100 based on profit and satisfaction
  const profitScore = Math.min(50, Math.max(0, profitPerDay / 4));
  const satScore = avgSatisfaction / 2;
  const totalScore = profitScore + satScore;

  if (totalScore >= 90) return "A+";
  if (totalScore >= 80) return "A";
  if (totalScore >= 70) return "B+";
  if (totalScore >= 60) return "B";
  if (totalScore >= 50) return "C+";
  if (totalScore >= 40) return "C";
  if (totalScore >= 30) return "D";
  return "F";
}

export function formatMoney(cents: number): string {
  const negative = cents < 0;
  const abs = Math.abs(cents);
  return `${negative ? "-" : ""}$${(abs / 100).toFixed(2)}`;
}

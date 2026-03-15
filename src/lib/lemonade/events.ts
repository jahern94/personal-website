import { GameEvent, GameState } from "./types";

interface EventDefinition {
  id: string;
  title: string;
  descriptionFn: (state: GameState) => string;
  type: "positive" | "negative" | "neutral";
  canTrigger?: (state: GameState) => boolean;
}

const EVENT_DEFINITIONS: EventDefinition[] = [
  {
    id: "heatWave",
    title: "Heat Wave!",
    descriptionFn: () => "A sudden heat wave hits the neighborhood! Everyone is dying for a cold drink. Demand increases by 50% today!",
    type: "positive",
  },
  {
    id: "healthInspector",
    title: "Health Inspector Visit",
    descriptionFn: (state) => {
      const quality = calculateQualityForEvent(state);
      return quality > 60
        ? "The health inspector stopped by and gave you a passing grade! Your stand looks great."
        : "The health inspector found some issues with your setup. You've been fined $5.00.";
    },
    type: "neutral",
  },
  {
    id: "newsCoverage",
    title: "Local News Coverage!",
    descriptionFn: () => "A local news crew is doing a story on neighborhood businesses. Great exposure! Your reputation gets a big boost!",
    type: "positive",
  },
  {
    id: "supplyDelay",
    title: "Supply Truck Delay",
    descriptionFn: () => "The delivery truck got stuck in traffic! Ingredient prices are 50% higher today.",
    type: "negative",
  },
  {
    id: "competition",
    title: "New Competition!",
    descriptionFn: () => "A rival lemonade stand just opened down the street! Demand drops 20% for the next 2 days.",
    type: "negative",
  },
  {
    id: "blockParty",
    title: "Block Party!",
    descriptionFn: () => "There's a block party happening nearby! Lots of thirsty people heading your way. Demand up 40%!",
    type: "positive",
  },
  {
    id: "lemonShortage",
    title: "Lemon Shortage!",
    descriptionFn: () => "There's a lemon shortage at the market! You can't buy any lemons today. Use what you have!",
    type: "negative",
    canTrigger: (state) => state.inventory.lemons > 0,
  },
  {
    id: "celebrityVisit",
    title: "Celebrity Sighting!",
    descriptionFn: (state) => {
      const quality = calculateQualityForEvent(state);
      return quality > 70
        ? "A local celebrity tried your lemonade and loved it! Massive demand spike today (+80%)!"
        : "A local celebrity walked by but didn't seem impressed by your stand.";
    },
    type: "positive",
    canTrigger: (state) => state.day > 3,
  },
];

function calculateQualityForEvent(state: GameState): number {
  const { lemonsPerPitcher, sugarPerPitcher, icePerCup } = state.recipe;
  const lemonDiff = Math.abs(lemonsPerPitcher - 4);
  const sugarDiff = Math.abs(sugarPerPitcher - 3);
  const iceDiff = Math.abs(icePerCup - 3);
  return Math.max(10, Math.min(100, 100 - (lemonDiff + sugarDiff + iceDiff) * 8));
}

export function maybeGenerateEvent(state: GameState): GameEvent | null {
  if (Math.random() > 0.15) return null;

  const eligible = EVENT_DEFINITIONS.filter(
    (e) => !e.canTrigger || e.canTrigger(state)
  );
  if (eligible.length === 0) return null;

  const picked = eligible[Math.floor(Math.random() * eligible.length)];
  return {
    id: picked.id,
    title: picked.title,
    description: picked.descriptionFn(state),
    type: picked.type,
  };
}

export function applyEventEffects(
  state: GameState,
  event: GameEvent
): { demandMultiplier: number; moneyChange: number; reputationChange: number } {
  const quality = calculateQualityForEvent(state);

  switch (event.id) {
    case "heatWave":
      return { demandMultiplier: 1.5, moneyChange: 0, reputationChange: 0 };
    case "healthInspector":
      return quality > 60
        ? { demandMultiplier: 1.0, moneyChange: 0, reputationChange: 5 }
        : { demandMultiplier: 1.0, moneyChange: -500, reputationChange: -10 };
    case "newsCoverage":
      return { demandMultiplier: 1.0, moneyChange: 0, reputationChange: 30 };
    case "supplyDelay":
      return { demandMultiplier: 1.0, moneyChange: 0, reputationChange: 0 };
    case "competition":
      return { demandMultiplier: 0.8, moneyChange: 0, reputationChange: 0 };
    case "blockParty":
      return { demandMultiplier: 1.4, moneyChange: 0, reputationChange: 0 };
    case "lemonShortage":
      return { demandMultiplier: 1.0, moneyChange: 0, reputationChange: 0 };
    case "celebrityVisit":
      return quality > 70
        ? { demandMultiplier: 1.8, moneyChange: 0, reputationChange: 15 }
        : { demandMultiplier: 1.0, moneyChange: 0, reputationChange: -5 };
    default:
      return { demandMultiplier: 1.0, moneyChange: 0, reputationChange: 0 };
  }
}

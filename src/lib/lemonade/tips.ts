import { BusinessTip, DayResult, GameState } from "./types";

interface TipCondition {
  check: (result: DayResult, state: GameState) => boolean;
  tip: (result: DayResult, state: GameState) => BusinessTip;
  priority: number;
}

const TIP_CONDITIONS: TipCondition[] = [
  {
    priority: 10,
    check: (result) => result.profit < 0,
    tip: (result) => {
      const costPerCup = result.cupsMade > 0 ? Math.round(result.ingredientCost / result.cupsMade) : 0;
      return {
        title: "Break-Even Analysis",
        concept: "Break-Even Point",
        message: `You lost money today. Each cup cost about $${(costPerCup / 100).toFixed(2)} to make. To break even, your price needs to cover your costs per cup. Try adjusting your recipe to lower costs, or raise your price.`,
      };
    },
  },
  {
    priority: 9,
    check: (result, state) => result.profit > 0 && state.history.length === 0,
    tip: () => ({
      title: "Your First Profit!",
      concept: "Profit & Loss",
      message: "Congratulations on your first profitable day! Profit = Revenue - Costs. The goal of any business is to consistently generate profit to grow and reinvest.",
    }),
  },
  {
    priority: 8,
    check: (result) => result.cupsSold < result.cupsMade * 0.3 && result.cupsMade > 0,
    tip: (result) => ({
      title: "Price Check",
      concept: "Price Elasticity",
      message: `You only sold ${result.cupsSold} of ${result.cupsMade} cups. When prices are too high, demand drops. This is called price elasticity \u2014 the relationship between price changes and how much people buy.`,
    }),
  },
  {
    priority: 7,
    check: (result) => result.cupsSold >= result.cupsMade && result.cupsMade > 0,
    tip: () => ({
      title: "Sold Out!",
      concept: "Supply & Demand",
      message: "You sold every cup! That's great, but it also means you might have left money on the table. Try making more cups tomorrow, or consider raising your price slightly.",
    }),
  },
  {
    priority: 6,
    check: (result) => result.customerSatisfaction >= 80,
    tip: () => ({
      title: "Happy Customers",
      concept: "Customer Satisfaction",
      message: "Your customers loved it! High satisfaction builds reputation over time, which attracts even more customers. Consistency is key to building a loyal customer base.",
    }),
  },
  {
    priority: 5,
    check: (result) => result.customerSatisfaction < 40,
    tip: () => ({
      title: "Unhappy Customers",
      concept: "Quality Management",
      message: "Customers weren't thrilled today. Quality, fair pricing, and good service all affect satisfaction. A poor reputation makes it harder to attract customers in the future.",
    }),
  },
  {
    priority: 4,
    check: (_result, state) => state.upgrades.length > 0 && state.history.length <= 2,
    tip: () => ({
      title: "Smart Investment",
      concept: "Return on Investment (ROI)",
      message: "You've made your first upgrade! In business, spending money to earn more money is called capital investment. The return on investment (ROI) measures how much extra profit an investment generates.",
    }),
  },
  {
    priority: 3,
    check: (result) => result.weather.type === "rainy" || result.weather.type === "stormy",
    tip: () => ({
      title: "Weather Woes",
      concept: "External Factors",
      message: "Bad weather hurt your sales today. Smart businesses plan for factors outside their control by saving reserves, diversifying, or investing in protection (like an umbrella stand!).",
    }),
  },
  {
    priority: 2,
    check: (_result, state) => state.history.length >= 5,
    tip: (_result, state) => {
      const totalProfit = state.history.reduce((sum, d) => sum + d.profit, 0);
      return {
        title: "Running the Numbers",
        concept: "Financial Analysis",
        message: `After ${state.history.length} days, your total profit is $${(totalProfit / 100).toFixed(2)}. Regularly reviewing your financials helps you spot trends and make better decisions.`,
      };
    },
  },
  {
    priority: 1,
    check: () => true,
    tip: () => ({
      title: "Business Basics",
      concept: "Entrepreneurship",
      message: "Every day in business is a learning opportunity. Pay attention to what works and what doesn't. The best entrepreneurs adapt their strategy based on results.",
    }),
  },
];

export function selectTip(result: DayResult, state: GameState): BusinessTip {
  const sorted = [...TIP_CONDITIONS].sort((a, b) => b.priority - a.priority);
  for (const condition of sorted) {
    if (condition.check(result, state)) {
      return condition.tip(result, state);
    }
  }
  return TIP_CONDITIONS[TIP_CONDITIONS.length - 1].tip(result, state);
}

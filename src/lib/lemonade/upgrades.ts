import { Upgrade } from "./types";

export const ALL_UPGRADES: Upgrade[] = [
  {
    id: "sign",
    name: "Cardboard Sign",
    description: "A hand-drawn sign to attract customers",
    cost: 200,
    demandMultiplier: 1.10,
    satisfactionBonus: 0,
    revenueMultiplier: 1.0,
    icon: "\u{1FAA7}",
    lesson: "Marketing basics",
  },
  {
    id: "banner",
    name: "Colorful Banner",
    description: "A bright, eye-catching banner for your stand",
    cost: 500,
    demandMultiplier: 1.20,
    satisfactionBonus: 0,
    revenueMultiplier: 1.0,
    icon: "\u{1F3F3}\uFE0F",
    lesson: "Branding",
  },
  {
    id: "umbrella",
    name: "Umbrella Stand",
    description: "Keep selling even when it rains",
    cost: 800,
    demandMultiplier: 1.0,
    satisfactionBonus: 0,
    revenueMultiplier: 1.0,
    specialEffect: "noRainPenalty",
    icon: "\u2602\uFE0F",
    lesson: "Risk management",
  },
  {
    id: "cooler",
    name: "Ice Cooler",
    description: "Keeps ice from melting overnight",
    cost: 1000,
    demandMultiplier: 1.0,
    satisfactionBonus: 0,
    revenueMultiplier: 1.0,
    specialEffect: "reducedIceMelt",
    icon: "\u{1F9CA}",
    lesson: "Asset investment",
  },
  {
    id: "chairs",
    name: "Comfortable Chairs",
    description: "Customers can sit and enjoy their drinks",
    cost: 1200,
    demandMultiplier: 1.0,
    satisfactionBonus: 15,
    revenueMultiplier: 1.0,
    icon: "\u{1FA91}",
    lesson: "Customer experience",
  },
  {
    id: "premiumCups",
    name: "Premium Cups",
    description: "Fancy cups with your brand logo",
    cost: 600,
    demandMultiplier: 1.0,
    satisfactionBonus: 10,
    revenueMultiplier: 1.0,
    icon: "\u{1F964}",
    lesson: "Product quality",
  },
  {
    id: "tipJar",
    name: "Tip Jar",
    description: "A friendly tip jar boosts revenue",
    cost: 300,
    demandMultiplier: 1.0,
    satisfactionBonus: 0,
    revenueMultiplier: 1.05,
    icon: "\u{1FAD9}",
    lesson: "Revenue streams",
  },
];

export function getUpgrade(id: string): Upgrade | undefined {
  return ALL_UPGRADES.find((u) => u.id === id);
}

export function getUpgradeMultipliers(ownedIds: string[]) {
  let demandMult = 1.0;
  let satisfactionBonus = 0;
  let revenueMult = 1.0;
  const specialEffects: string[] = [];

  for (const id of ownedIds) {
    const upgrade = getUpgrade(id);
    if (upgrade) {
      demandMult *= upgrade.demandMultiplier;
      satisfactionBonus += upgrade.satisfactionBonus;
      revenueMult *= upgrade.revenueMultiplier;
      if (upgrade.specialEffect) specialEffects.push(upgrade.specialEffect);
    }
  }

  return { demandMult, satisfactionBonus, revenueMult, specialEffects };
}

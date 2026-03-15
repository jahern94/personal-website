"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GameState,
  Inventory,
  Recipe,
  INGREDIENT_PRICES,
  STARTING_MONEY,
} from "@/lib/lemonade/types";
import {
  createNewGame,
  simulateDay,
  advanceDay,
  formatMoney,
} from "@/lib/lemonade/engine";
import { getUpgrade } from "@/lib/lemonade/upgrades";
import { saveGame, loadGame, clearSave, hasSave as checkHasSave } from "@/lib/lemonade/storage";

import StartScreen from "@/components/lemonade/StartScreen";
import DayPlanning from "@/components/lemonade/DayPlanning";
import DayResults from "@/components/lemonade/DayResults";
import GameOver from "@/components/lemonade/GameOver";

export default function LemonadePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [savedGameExists, setSavedGameExists] = useState(false);
  const [lastResult, setLastResult] = useState<ReturnType<typeof simulateDay> | null>(null);

  // Check for saved game on mount
  useEffect(() => {
    setSavedGameExists(checkHasSave());
  }, []);

  // Save game on phase transitions
  useEffect(() => {
    if (gameState && gameState.phase !== "start" && gameState.phase !== "gameover") {
      saveGame(gameState);
    }
  }, [gameState?.phase, gameState?.day]);

  // --- Handlers ---

  const handleNewGame = useCallback((totalDays: number) => {
    clearSave();
    const newState = createNewGame(totalDays);
    setGameState(newState);
    setLastResult(null);
  }, []);

  const handleContinue = useCallback(() => {
    const saved = loadGame();
    if (saved) {
      setGameState(saved);
      setLastResult(null);
    }
  }, []);

  const handleBuyIngredient = useCallback(
    (item: keyof Inventory, quantity: number) => {
      setGameState((prev) => {
        if (!prev) return prev;
        const priceMultiplier = prev.supplyDelayActive ? 1.5 : 1.0;
        const unitPrice = Math.round(INGREDIENT_PRICES[item] * priceMultiplier);
        const totalCost = unitPrice * quantity;
        if (prev.money < totalCost) return prev;
        if (item === "lemons" && prev.lemonShortageActive) return prev;
        return {
          ...prev,
          money: prev.money - totalCost,
          inventory: {
            ...prev.inventory,
            [item]: prev.inventory[item] + quantity,
          },
        };
      });
    },
    []
  );

  const handleRecipeChange = useCallback((recipe: Recipe) => {
    setGameState((prev) => (prev ? { ...prev, recipe } : prev));
  }, []);

  const handlePriceChange = useCallback((price: number) => {
    setGameState((prev) => (prev ? { ...prev, pricePerCup: price } : prev));
  }, []);

  const handleBuyUpgrade = useCallback((upgradeId: string) => {
    setGameState((prev) => {
      if (!prev) return prev;
      if (prev.upgrades.includes(upgradeId)) return prev;
      const upgrade = getUpgrade(upgradeId);
      if (!upgrade || prev.money < upgrade.cost) return prev;
      return {
        ...prev,
        money: prev.money - upgrade.cost,
        upgrades: [...prev.upgrades, upgradeId],
      };
    });
  }, []);

  const handleStartSelling = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      const result = simulateDay(prev);
      setLastResult(result);
      return { ...prev, phase: "results" };
    });
  }, []);

  const handleDismissEvent = useCallback(() => {
    setGameState((prev) => (prev ? { ...prev, activeEvent: null } : prev));
  }, []);

  const handleNextDay = useCallback(() => {
    setGameState((prev) => {
      if (!prev || !lastResult) return prev;
      const next = advanceDay(prev, lastResult);
      if (next.phase === "gameover") {
        clearSave();
      }
      setLastResult(null);
      return next;
    });
  }, [lastResult]);

  const handleRestart = useCallback(() => {
    clearSave();
    setGameState(null);
    setLastResult(null);
    setSavedGameExists(false);
  }, []);

  // --- Render ---

  // Start screen
  if (!gameState) {
    return (
      <StartScreen
        hasSave={savedGameExists}
        onStart={handleNewGame}
        onContinue={handleContinue}
      />
    );
  }

  // Planning phase
  if (gameState.phase === "planning") {
    return (
      <DayPlanning
        state={gameState}
        onBuyIngredient={handleBuyIngredient}
        onRecipeChange={handleRecipeChange}
        onPriceChange={handlePriceChange}
        onBuyUpgrade={handleBuyUpgrade}
        onStartSelling={handleStartSelling}
        onDismissEvent={handleDismissEvent}
      />
    );
  }

  // Results phase
  if (gameState.phase === "results" && lastResult) {
    return (
      <DayResults
        result={lastResult}
        isLastDay={gameState.day >= gameState.totalDays}
        onNext={handleNextDay}
      />
    );
  }

  // Game over
  if (gameState.phase === "gameover") {
    return (
      <GameOver
        history={gameState.history}
        finalMoney={gameState.money}
        startingMoney={STARTING_MONEY}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}

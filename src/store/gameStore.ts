import { useState, useCallback } from 'react';

export interface GameState {
  screen: 'menu' | 'levels' | 'game' | 'result' | 'shop';
  coins: number;
  totalScore: number;
  currentLevel: number | null;
  currentPuzzleIndex: number;
  completedLevels: number[];
  scores: Record<number, number>;
  inventory: Record<string, number>;
  sessionScore: number;
  sessionCoins: number;
  lastAnswerCorrect: boolean | null;
}

const DEFAULT_STATE: GameState = {
  screen: 'menu',
  coins: 32000000000000000,
  totalScore: 0,
  currentLevel: null,
  currentPuzzleIndex: 0,
  completedLevels: [],
  scores: {},
  inventory: {
    fifty_fifty: 1,
    extra_time: 0,
    hint: 1,
    skip: 0,
    double_points: 0,
    freeze: 0,
  },
  sessionScore: 0,
  sessionCoins: 0,
  lastAnswerCorrect: null,
};

export function useGameStore() {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);

  const goTo = useCallback((screen: GameState['screen']) => {
    setState(s => ({ ...s, screen }));
  }, []);

  const startLevel = useCallback((levelId: number) => {
    setState(s => ({
      ...s,
      screen: 'game',
      currentLevel: levelId,
      currentPuzzleIndex: 0,
      sessionScore: 0,
      sessionCoins: 0,
      lastAnswerCorrect: null,
    }));
  }, []);

  const answerPuzzle = useCallback((correct: boolean, points: number, timeBonus: number, doublePoints: boolean) => {
    const earned = correct ? Math.round((points + timeBonus) * (doublePoints ? 2 : 1)) : 0;
    setState(s => ({
      ...s,
      sessionScore: s.sessionScore + earned,
      lastAnswerCorrect: correct,
    }));
    return earned;
  }, []);

  const nextPuzzle = useCallback(() => {
    setState(s => ({ ...s, currentPuzzleIndex: s.currentPuzzleIndex + 1, lastAnswerCorrect: null }));
  }, []);

  const finishLevel = useCallback((levelId: number, score: number, reward: number) => {
    setState(s => ({
      ...s,
      screen: 'result',
      totalScore: s.totalScore + score,
      coins: s.coins + reward,
      sessionCoins: reward,
      completedLevels: s.completedLevels.includes(levelId) ? s.completedLevels : [...s.completedLevels, levelId],
      scores: { ...s.scores, [levelId]: Math.max(s.scores[levelId] || 0, score) },
    }));
  }, []);

  const buyItem = useCallback((key: string, price: number): boolean => {
    let ok = false;
    setState(s => {
      if (s.coins < price) return s;
      ok = true;
      return {
        ...s,
        coins: s.coins - price,
        inventory: { ...s.inventory, [key]: (s.inventory[key] || 0) + 1 },
      };
    });
    return ok;
  }, []);

  const useItem = useCallback((key: string) => {
    setState(s => ({
      ...s,
      inventory: { ...s.inventory, [key]: Math.max(0, (s.inventory[key] || 0) - 1) },
    }));
  }, []);

  const unlockLevel = useCallback((cost: number): boolean => {
    let ok = false;
    setState(s => {
      if (s.coins < cost) return s;
      ok = true;
      return { ...s, coins: s.coins - cost };
    });
    return ok;
  }, []);

  return { state, goTo, startLevel, answerPuzzle, nextPuzzle, finishLevel, buyItem, useItem, unlockLevel };
}
import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { LEVELS } from '@/data/puzzles';
import MenuScreen from '@/components/game/MenuScreen';
import LevelsScreen from '@/components/game/LevelsScreen';
import GameScreen from '@/components/game/GameScreen';
import ShopScreen from '@/components/game/ShopScreen';
import ResultScreen from '@/components/game/ResultScreen';

export default function Index() {
  const { state, goTo, startLevel, answerPuzzle, nextPuzzle, finishLevel, buyItem, useItem, unlockLevel } = useGameStore();

  if (state.screen === 'menu') {
    return (
      <MenuScreen
        coins={state.coins}
        totalScore={state.totalScore}
        completedLevels={state.completedLevels}
        onStart={() => goTo('levels')}
        onShop={() => goTo('shop')}
      />
    );
  }

  if (state.screen === 'levels') {
    return (
      <LevelsScreen
        coins={state.coins}
        completedLevels={state.completedLevels}
        scores={state.scores}
        onSelectLevel={startLevel}
        onUnlock={(_id, cost) => unlockLevel(cost)}
        onBack={() => goTo('menu')}
      />
    );
  }

  if (state.screen === 'game' && state.currentLevel !== null) {
    const level = LEVELS.find(l => l.id === state.currentLevel)!;
    if (state.currentPuzzleIndex >= level.puzzles.length) {
      return null;
    }
    return (
      <GameScreen
        levelId={state.currentLevel}
        puzzleIndex={state.currentPuzzleIndex}
        coins={state.coins}
        inventory={state.inventory}
        onAnswer={answerPuzzle}
        onNext={nextPuzzle}
        onFinish={finishLevel}
        onUseItem={useItem}
      />
    );
  }

  if (state.screen === 'result' && state.currentLevel !== null) {
    return (
      <ResultScreen
        levelId={state.currentLevel}
        score={state.sessionScore}
        coinsEarned={state.sessionCoins}
        totalCoins={state.coins}
        onReplay={() => startLevel(state.currentLevel!)}
        onLevels={() => goTo('levels')}
        onMenu={() => goTo('menu')}
      />
    );
  }

  if (state.screen === 'shop') {
    return (
      <ShopScreen
        coins={state.coins}
        inventory={state.inventory}
        onBuy={buyItem}
        onBack={() => goTo('menu')}
      />
    );
  }

  return null;
}

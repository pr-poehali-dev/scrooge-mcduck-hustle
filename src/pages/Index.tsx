import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { LEVELS, DONALD_PUZZLES } from '@/data/puzzles';
import MenuScreen from '@/components/game/MenuScreen';
import LevelsScreen from '@/components/game/LevelsScreen';
import GameScreen from '@/components/game/GameScreen';
import ShopScreen from '@/components/game/ShopScreen';
import ResultScreen from '@/components/game/ResultScreen';

export default function Index() {
  const { state, goTo, startLevel, activateDonald, answerPuzzle, nextPuzzle, finishLevel, buyItem, useItem, unlockLevel } = useGameStore();

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
    const puzzleList = state.donaldMode ? DONALD_PUZZLES : (LEVELS.find(l => l.id === state.currentLevel)?.puzzles ?? []);
    if (state.currentPuzzleIndex >= puzzleList.length) {
      return null;
    }
    return (
      <GameScreen
        levelId={state.currentLevel}
        puzzleIndex={state.currentPuzzleIndex}
        coins={state.coins}
        inventory={state.inventory}
        donaldMode={state.donaldMode}
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
        onReplay={state.donaldMode ? activateDonald : () => startLevel(state.currentLevel!)}
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
        onActivateDonald={activateDonald}
        onBack={() => goTo('menu')}
      />
    );
  }

  return null;
}

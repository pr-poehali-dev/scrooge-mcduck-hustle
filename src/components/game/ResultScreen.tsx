import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { LEVELS } from '@/data/puzzles';

interface Props {
  levelId: number;
  score: number;
  coinsEarned: number;
  totalCoins: number;
  onReplay: () => void;
  onLevels: () => void;
  onMenu: () => void;
}

export default function ResultScreen({ levelId, score, coinsEarned, totalCoins, onReplay, onLevels, onMenu }: Props) {
  const level = LEVELS.find(l => l.id === levelId) ?? null;
  const isDonaldMode = levelId === -1;
  const [displayScore, setDisplayScore] = useState(0);
  const [showCoins, setShowCoins] = useState(false);

  useEffect(() => {
    const step = Math.ceil(score / 30);
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + step, score);
      setDisplayScore(current);
      if (current >= score) {
        clearInterval(interval);
        setTimeout(() => setShowCoins(true), 300);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [score]);

  const puzzleCount = isDonaldMode ? 17 : (level?.puzzles.length ?? 3);
  const stars = score > puzzleCount * 350 ? 3 : score > puzzleCount * 200 ? 2 : score > 0 ? 1 : 0;

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center px-4 py-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl animate-pulse ${isDonaldMode ? 'bg-red-500/10' : 'bg-gold/8'}`} />
      </div>

      <div className="max-w-md mx-auto w-full flex flex-col items-center gap-6 relative z-10">
        <div className="animate-scale-in text-center">
          {isDonaldMode ? (
            <img
              src="https://cdn.poehali.dev/projects/55519ddb-2563-46a6-93e0-f3902bfb09ff/files/24746f84-1be4-4127-8e76-5dfa77c94361.jpg"
              alt="Дональд"
              className="w-28 h-28 object-contain mx-auto mb-2 animate-float"
            />
          ) : (
            <div className="text-6xl mb-4 animate-float">{stars >= 3 ? '🏆' : stars >= 2 ? '🥈' : stars >= 1 ? '🥉' : '😤'}</div>
          )}
          <h2 className={`font-display text-4xl font-bold tracking-widest uppercase ${isDonaldMode ? 'text-red-400' : 'text-foreground'}`}>
            {isDonaldMode
              ? (stars >= 3 ? 'ВЫЖИЛ!!!' : stars >= 1 ? 'КВААААК!!!' : 'КРЕТИН!')
              : (stars >= 3 ? 'Превосходно!' : stars >= 2 ? 'Отлично!' : stars >= 1 ? 'Пройдено!' : 'Попробуй ещё')
            }
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {isDonaldMode ? '17 вопросов от Дональда Дака' : level?.title}
          </p>
        </div>

        <div className="animate-fade-in flex gap-2 text-3xl">
          {[1, 2, 3].map(i => (
            <span key={i} className={`transition-all duration-500 ${stars >= i ? 'opacity-100 scale-110' : 'opacity-20'}`}
              style={{ transitionDelay: `${i * 200}ms` }}>
              ⭐
            </span>
          ))}
        </div>

        <div className="glass rounded-2xl p-6 w-full animate-fade-in">
          <div className="text-center mb-4">
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Набрано очков</div>
            <div className="font-display text-5xl font-bold text-gold tabular-nums">{displayScore.toLocaleString()}</div>
          </div>

          {showCoins && (
            <div className="border-t border-border pt-4 animate-scale-in">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Награда за уровень</span>
                <span className="font-display font-bold text-gold flex items-center gap-1">
                  <span>🪙</span> +{coinsEarned}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Всего монет</span>
                <span className="font-display font-bold text-foreground flex items-center gap-1">
                  <span>🪙</span> {totalCoins.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-3 animate-fade-in stagger-4">
          <button
            onClick={onReplay}
            className="w-full py-4 rounded-xl font-display font-bold text-lg tracking-widest uppercase
              bg-gold text-background hover:bg-yellow-400 transition-all duration-200 gold-glow active:scale-95"
          >
            Сыграть снова
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onLevels}
              className="py-3.5 rounded-xl font-display font-bold text-sm tracking-wider uppercase
                glass border border-border hover:border-gold/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon name="List" size={16} /> Уровни
            </button>
            <button
              onClick={onMenu}
              className="py-3.5 rounded-xl font-display font-bold text-sm tracking-wider uppercase
                glass border border-border hover:border-gold/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon name="Home" size={16} /> Меню
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
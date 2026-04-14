import React from 'react';
import Icon from '@/components/ui/icon';

interface Props {
  coins: number;
  totalScore: number;
  completedLevels: number[];
  onStart: () => void;
  onShop: () => void;
}

export default function MenuScreen({ coins, totalScore, completedLevels, onStart, onShop }: Props) {
  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gold/3 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
        <div className="animate-fade-in stagger-1 flex flex-col items-center gap-2">
          <div className="text-6xl animate-float">🧩</div>
          <h1 className="font-display text-5xl font-bold tracking-widest text-gold uppercase mt-2">
            МозгоБанк
          </h1>
          <p className="text-muted-foreground text-sm tracking-widest uppercase">
            Логические головоломки с вознаграждением
          </p>
        </div>

        <div className="animate-fade-in stagger-2 w-full grid grid-cols-2 gap-3">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-display font-bold text-gold">{coins.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
              <span>🪙</span> монет
            </div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-display font-bold text-foreground">{totalScore.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
              <Icon name="Star" size={12} className="text-gold" /> очков
            </div>
          </div>
        </div>

        {completedLevels.length > 0 && (
          <div className="animate-fade-in stagger-2 w-full glass rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center">
              <Icon name="CheckCircle" size={16} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-medium">Пройдено уровней</div>
              <div className="text-xs text-muted-foreground">{completedLevels.length} из 4</div>
            </div>
            <div className="ml-auto font-display font-bold text-gold">{completedLevels.length}/4</div>
          </div>
        )}

        <div className="animate-fade-in stagger-3 w-full flex flex-col gap-3">
          <button
            onClick={onStart}
            className="w-full py-4 rounded-xl font-display font-bold text-lg tracking-widest uppercase
              bg-gold text-background hover:bg-yellow-400 transition-all duration-200
              gold-glow animate-pulse-gold active:scale-95"
          >
            Начать игру
          </button>

          <button
            onClick={onShop}
            className="w-full py-3.5 rounded-xl font-display font-bold text-base tracking-widest uppercase
              glass border border-gold/30 text-gold hover:border-gold/60 hover:bg-gold/5
              transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>🛒</span> Магазин
          </button>
        </div>

        <div className="animate-fade-in stagger-4 text-center">
          <p className="text-xs text-muted-foreground">
            Отвечай быстрее — получай больше монет
          </p>
        </div>
      </div>
    </div>
  );
}

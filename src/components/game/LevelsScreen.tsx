import React from 'react';
import Icon from '@/components/ui/icon';
import { LEVELS } from '@/data/puzzles';

interface Props {
  coins: number;
  completedLevels: number[];
  scores: Record<number, number>;
  onSelectLevel: (id: number) => void;
  onUnlock: (levelId: number, cost: number) => boolean;
  onBack: () => void;
}

const DIFF_COLORS = {
  easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  hard: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  expert: 'text-ruby bg-ruby/10 border-ruby/20',
};

const DIFF_LABELS = {
  easy: 'Легко',
  medium: 'Средне',
  hard: 'Сложно',
  expert: 'Эксперт',
};

export default function LevelsScreen({ coins, completedLevels, scores, onSelectLevel, onUnlock, onBack }: Props) {
  const [unlockedLevels, setUnlockedLevels] = React.useState<number[]>([1, 2]);

  const handleUnlock = (levelId: number, cost: number) => {
    const success = onUnlock(levelId, cost);
    if (success) setUnlockedLevels(prev => [...prev, levelId]);
  };

  const isUnlocked = (id: number) => unlockedLevels.includes(id);
  const isCompleted = (id: number) => completedLevels.includes(id);

  return (
    <div className="min-h-screen grid-bg flex flex-col px-4 py-6">
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-6 animate-fade-in stagger-1">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
            <span className="text-sm">Меню</span>
          </button>
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
            <span>🪙</span>
            <span className="font-display font-bold text-gold">{coins.toLocaleString()}</span>
          </div>
        </div>

        <div className="animate-fade-in stagger-1 mb-6">
          <h2 className="font-display text-3xl font-bold text-foreground uppercase tracking-wider">Уровни</h2>
          <p className="text-muted-foreground text-sm mt-1">Решай задачи — зарабатывай монеты</p>
        </div>

        <div className="flex flex-col gap-4">
          {LEVELS.map((level, idx) => {
            const unlocked = isUnlocked(level.id);
            const completed = isCompleted(level.id);
            const best = scores[level.id];

            return (
              <div
                key={level.id}
                className={`animate-fade-in glass rounded-2xl p-5 transition-all duration-200 ${
                  unlocked ? 'cursor-pointer hover:border-gold/40 active:scale-[0.98]' : 'opacity-60'
                } ${completed ? 'border border-gold/20' : ''}`}
                style={{ animationDelay: `${0.05 + idx * 0.08}s`, opacity: 0 }}
                onClick={() => unlocked && onSelectLevel(level.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    completed ? 'bg-gold/15' : unlocked ? 'bg-secondary' : 'bg-muted'
                  }`}>
                    {completed ? '✅' : unlocked ? level.icon : '🔒'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-lg tracking-wide">{level.title}</h3>
                      {completed && (
                        <div className="flex items-center gap-1 text-xs text-gold">
                          <Icon name="Crown" size={12} />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{level.subtitle}</p>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${DIFF_COLORS[level.difficulty]}`}>
                        {DIFF_LABELS[level.difficulty]}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon name="HelpCircle" size={12} /> {level.puzzles.length} задачи
                      </span>
                    </div>

                    {best && (
                      <div className="mt-2 text-xs text-gold/80 flex items-center gap-1">
                        <Icon name="Star" size={11} />
                        Лучший счёт: {best.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1 text-gold font-display font-bold">
                      <span>🪙</span>
                      <span>{level.reward}</span>
                    </div>
                    {!unlocked && (
                      <button
                        onClick={e => { e.stopPropagation(); handleUnlock(level.id, level.unlockCost); }}
                        className="text-xs bg-gold/10 border border-gold/30 text-gold px-2.5 py-1 rounded-lg hover:bg-gold/20 transition-colors font-medium flex items-center gap-1"
                      >
                        <Icon name="Unlock" size={11} />
                        {level.unlockCost} 🪙
                      </button>
                    )}
                    {unlocked && !completed && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon name="Play" size={11} /> Играть
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

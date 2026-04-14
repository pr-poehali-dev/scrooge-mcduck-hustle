import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { LEVELS, Puzzle } from '@/data/puzzles';

interface Props {
  levelId: number;
  puzzleIndex: number;
  coins: number;
  inventory: Record<string, number>;
  onAnswer: (correct: boolean, points: number, timeBonus: number, doublePoints: boolean) => number;
  onNext: () => void;
  onFinish: (levelId: number, score: number, reward: number) => void;
  onUseItem: (key: string) => void;
}

interface ScorePop {
  id: number;
  value: number;
  x: number;
}

export default function GameScreen({ levelId, puzzleIndex, coins, inventory, onAnswer, onNext, onFinish, onUseItem }: Props) {
  const level = LEVELS.find(l => l.id === levelId)!;
  const puzzle: Puzzle = level.puzzles[puzzleIndex];
  const isLast = puzzleIndex === level.puzzles.length - 1;

  const [timeLeft, setTimeLeft] = useState(puzzle.timeLimit);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [eliminated, setEliminated] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [doubleActive, setDoubleActive] = useState(false);
  const [pops, setPops] = useState<ScorePop[]>([]);
  const [shake, setShake] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const popIdRef = useRef(0);

  useEffect(() => {
    setTimeLeft(puzzle.timeLimit);
    setSelected(null);
    setShowResult(false);
    setEliminated([]);
    setShowHint(false);
  }, [puzzleIndex, puzzle.timeLimit]);

  useEffect(() => {
    if (showResult || frozen) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [showResult, frozen, puzzleIndex]);

  const handleTimeout = () => {
    setSelected(-1);
    setShowResult(true);
    onAnswer(false, puzzle.points, 0, false);
  };

  const addPop = (value: number) => {
    const id = popIdRef.current++;
    const x = 40 + Math.random() * 20;
    setPops(prev => [...prev, { id, value, x }]);
    setTimeout(() => setPops(prev => prev.filter(p => p.id !== id)), 900);
  };

  const handleSelect = (idx: number) => {
    if (showResult || selected !== null) return;
    if (eliminated.includes(idx)) return;
    setSelected(idx);
    setShowResult(true);
    const correct = idx === puzzle.answer;
    const timeBonus = correct ? Math.floor(timeLeft * 5) : 0;
    const earned = onAnswer(correct, puzzle.points, timeBonus, doubleActive);
    if (correct) {
      setTotalScore(s => s + earned);
      addPop(earned);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    if (doubleActive) setDoubleActive(false);
  };

  const handleFiftyFifty = () => {
    if (inventory['fifty_fifty'] <= 0) return;
    onUseItem('fifty_fifty');
    const wrong = puzzle.options
      .map((_, i) => i)
      .filter(i => i !== puzzle.answer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    setEliminated(wrong);
  };

  const handleExtraTime = () => {
    if (inventory['extra_time'] <= 0) return;
    onUseItem('extra_time');
    setTimeLeft(t => t + 10);
  };

  const handleHint = () => {
    if (inventory['hint'] <= 0) return;
    onUseItem('hint');
    setShowHint(true);
  };

  const handleFreeze = () => {
    if (inventory['freeze'] <= 0) return;
    onUseItem('freeze');
    setFrozen(true);
    setTimeout(() => setFrozen(false), 5000);
  };

  const handleDouble = () => {
    if (inventory['double_points'] <= 0) return;
    onUseItem('double_points');
    setDoubleActive(true);
  };

  const handleSkip = () => {
    if (inventory['skip'] <= 0) return;
    onUseItem('skip');
    setShowResult(true);
    setSelected(-2);
    onAnswer(false, 0, 0, false);
  };

  const handleContinue = () => {
    if (isLast) {
      onFinish(levelId, totalScore, level.reward);
    } else {
      onNext();
    }
  };

  const timerPct = (timeLeft / puzzle.timeLimit) * 100;
  const timerColor = timerPct > 50 ? 'bg-emerald-400' : timerPct > 25 ? 'bg-yellow-400' : 'bg-ruby';

  const powerUps = [
    { key: 'fifty_fifty', label: '50:50', icon: '⚡' },
    { key: 'extra_time', label: '+10с', icon: '⏱️' },
    { key: 'hint', label: 'Хинт', icon: '💬' },
    { key: 'freeze', label: 'Лёд', icon: '❄️' },
    { key: 'double_points', label: '×2', icon: '✨' },
    { key: 'skip', label: 'Скип', icon: '⏭️' },
  ];

  return (
    <div className="min-h-screen grid-bg flex flex-col px-4 py-6 relative overflow-hidden">
      {pops.map(pop => (
        <div
          key={pop.id}
          className="absolute z-50 animate-score-pop font-display font-bold text-gold text-xl pointer-events-none"
          style={{ left: `${pop.x}%`, top: '40%' }}
        >
          +{pop.value}
        </div>
      ))}

      <div className="max-w-md mx-auto w-full flex flex-col gap-5">
        <div className="flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-xl">{level.icon}</span>
            <div>
              <div className="font-display font-bold text-sm tracking-wider text-foreground">{level.title}</div>
              <div className="text-xs text-muted-foreground">{puzzleIndex + 1} / {level.puzzles.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
            <span>🪙</span>
            <span className="font-display font-bold text-gold">{coins.toLocaleString()}</span>
          </div>
        </div>

        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Время</span>
            <span className={`font-display font-bold text-sm ${timeLeft <= 10 ? 'text-ruby' : 'text-foreground'} ${frozen ? 'text-blue-400' : ''}`}>
              {frozen ? '❄️' : ''}{timeLeft}с
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
              style={{ width: `${timerPct}%` }}
            />
          </div>
        </div>

        {doubleActive && (
          <div className="glass border border-gold/40 rounded-xl px-3 py-2 flex items-center gap-2 text-sm text-gold animate-scale-in">
            <span>✨</span> Двойные очки активны!
          </div>
        )}

        <div className={`glass rounded-2xl p-5 animate-fade-in ${shake ? 'animate-shake' : ''}`}>
          <div className="text-xs text-gold/60 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Icon name="HelpCircle" size={12} />
            Задача №{puzzle.id}
            <span className="ml-auto text-muted-foreground">{puzzle.points} очков</span>
          </div>
          <p className="text-base font-medium leading-relaxed">{puzzle.question}</p>
          {showHint && (
            <div className="mt-3 p-3 bg-gold/5 border border-gold/20 rounded-xl text-sm text-gold/80 animate-scale-in">
              💬 {puzzle.explanation}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 animate-fade-in">
          {puzzle.options.map((opt, idx) => {
            const isEliminated = eliminated.includes(idx);
            const isSelected = selected === idx;
            const isCorrect = idx === puzzle.answer;

            let cls = 'glass rounded-xl p-4 text-left font-medium transition-all duration-200 active:scale-95 relative ';
            if (isEliminated) {
              cls += 'opacity-30 line-through cursor-not-allowed ';
            } else if (!showResult) {
              cls += 'hover:border-gold/40 hover:bg-gold/5 cursor-pointer ';
            } else if (isCorrect) {
              cls += 'border-emerald-400/60 bg-emerald-400/10 text-emerald-400 ';
            } else if (isSelected && !isCorrect) {
              cls += 'border-ruby/60 bg-ruby/10 text-ruby ';
            } else {
              cls += 'opacity-50 ';
            }

            return (
              <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={isEliminated || showResult}>
                <span className="text-xs text-muted-foreground mb-1 block font-display">
                  {['A', 'B', 'C', 'D'][idx]}
                </span>
                <span className="text-sm">{opt}</span>
                {showResult && isCorrect && (
                  <span className="absolute top-2 right-2 text-emerald-400">✓</span>
                )}
                {showResult && isSelected && !isCorrect && (
                  <span className="absolute top-2 right-2 text-ruby">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {!showResult && (
          <div className="animate-fade-in">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Помощь</div>
            <div className="grid grid-cols-3 gap-2">
              {powerUps.map(pu => (
                <button
                  key={pu.key}
                  onClick={() => {
                    if (pu.key === 'fifty_fifty') handleFiftyFifty();
                    if (pu.key === 'extra_time') handleExtraTime();
                    if (pu.key === 'hint') handleHint();
                    if (pu.key === 'freeze') handleFreeze();
                    if (pu.key === 'double_points') handleDouble();
                    if (pu.key === 'skip') handleSkip();
                  }}
                  disabled={(inventory[pu.key] || 0) <= 0}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs transition-all
                    ${(inventory[pu.key] || 0) > 0
                      ? 'glass border-border hover:border-gold/30 cursor-pointer active:scale-95'
                      : 'border-border/30 opacity-30 cursor-not-allowed bg-transparent'
                    }`}
                >
                  <span className="text-lg">{pu.icon}</span>
                  <span className="text-muted-foreground">{pu.label}</span>
                  <span className="font-display text-gold text-[10px]">×{inventory[pu.key] || 0}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showResult && (
          <div className="animate-scale-in flex flex-col gap-3">
            <div className={`rounded-xl p-4 border ${
              selected === puzzle.answer
                ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400'
                : 'bg-ruby/10 border-ruby/30 text-ruby'
            }`}>
              <div className="font-display font-bold text-base mb-1">
                {selected === puzzle.answer ? '✓ Правильно!' : selected === -2 ? '⏭️ Пропущено' : '✗ Неверно'}
              </div>
              <div className="text-sm opacity-80">{puzzle.explanation}</div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-4 rounded-xl font-display font-bold text-lg tracking-widest uppercase
                bg-gold text-background hover:bg-yellow-400 transition-all duration-200
                gold-glow active:scale-95"
            >
              {isLast ? 'Завершить уровень 🏆' : 'Следующий вопрос →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
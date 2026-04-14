import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { SHOP_ITEMS } from '@/data/puzzles';

interface Props {
  coins: number;
  inventory: Record<string, number>;
  onBuy: (key: string, price: number) => boolean;
  onBack: () => void;
}

export default function ShopScreen({ coins, inventory, onBuy, onBack }: Props) {
  const [bought, setBought] = useState<number | null>(null);
  const [failed, setFailed] = useState<number | null>(null);

  const handleBuy = (item: typeof SHOP_ITEMS[0]) => {
    const success = onBuy(item.key, item.price);
    if (success) {
      setBought(item.id);
      setTimeout(() => setBought(null), 1200);
    } else {
      setFailed(item.id);
      setTimeout(() => setFailed(null), 800);
    }
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col px-4 py-6">
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-6 animate-fade-in stagger-1">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
            <span className="text-sm">Назад</span>
          </button>
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
            <span>🪙</span>
            <span className="font-display font-bold text-gold">{coins.toLocaleString()}</span>
          </div>
        </div>

        <div className="animate-fade-in stagger-1 mb-6">
          <h2 className="font-display text-3xl font-bold text-foreground uppercase tracking-wider">Магазин</h2>
          <p className="text-muted-foreground text-sm mt-1">Купи подсказки и усиления для игры</p>
        </div>

        <div className="glass rounded-2xl p-4 mb-6 animate-fade-in stagger-2 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center text-2xl">🪙</div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Ваш баланс</div>
            <div className="font-display text-2xl font-bold text-gold">{coins.toLocaleString()} монет</div>
          </div>
          <div className="ml-auto text-xs text-muted-foreground text-right">
            <div>Монеты</div>
            <div>зарабатываются</div>
            <div>в игре</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SHOP_ITEMS.map((item, idx) => {
            const owned = inventory[item.key] || 0;
            const canAfford = coins >= item.price;
            const isBought = bought === item.id;
            const isFailed = failed === item.id;

            return (
              <div
                key={item.id}
                className={`glass rounded-2xl p-4 flex flex-col gap-3 animate-fade-in transition-all duration-300 ${
                  isBought ? 'border-emerald-400/60 bg-emerald-400/5' : ''
                } ${isFailed ? 'animate-shake border-ruby/60' : ''}`}
                style={{ animationDelay: `${0.05 + idx * 0.06}s`, opacity: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div className="text-3xl">{item.icon}</div>
                  {owned > 0 && (
                    <div className="text-xs font-display font-bold text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full">
                      ×{owned}
                    </div>
                  )}
                </div>

                <div>
                  <div className="font-display font-bold text-base tracking-wide">{item.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</div>
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  className={`w-full py-2.5 rounded-xl text-sm font-display font-bold tracking-wide transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
                    isBought
                      ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                      : canAfford
                      ? 'bg-gold text-background hover:bg-yellow-400'
                      : 'bg-secondary text-muted-foreground cursor-not-allowed'
                  }`}
                  disabled={!canAfford}
                >
                  {isBought ? (
                    <><span>✓</span> Куплено</>
                  ) : (
                    <><span>🪙</span> {item.price}</>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 glass rounded-xl p-4 animate-fade-in text-center">
          <div className="text-sm text-muted-foreground">
            Монеты зарабатываются за прохождение уровней.<br />
            Отвечай быстрее — получай больше!
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { SHOP_ITEMS } from '@/data/puzzles';

interface Props {
  coins: number;
  inventory: Record<string, number>;
  onBuy: (key: string, price: number) => boolean;
  onActivateDonald: () => void;
  onBack: () => void;
}

export default function ShopScreen({ coins, inventory, onBuy, onActivateDonald, onBack }: Props) {
  const [bought, setBought] = useState<number | null>(null);
  const [failed, setFailed] = useState<number | null>(null);
  const [donaldBought, setDonaldBought] = useState(false);
  const [daisyBought, setDaisyBought] = useState(false);

  const handleBuy = (item: typeof SHOP_ITEMS[0]) => {
    if (item.key === 'donald_rage') {
      const success = onBuy(item.key, item.price);
      if (success) {
        setDonaldBought(true);
        setTimeout(() => {
          onActivateDonald();
        }, 1500);
      } else {
        setFailed(item.id);
        setTimeout(() => setFailed(null), 800);
      }
      return;
    }
    const success = onBuy(item.key, item.price);
    if (success) {
      setBought(item.id);
      setTimeout(() => setBought(null), 1200);
    } else {
      setFailed(item.id);
      setTimeout(() => setFailed(null), 800);
    }
  };

  const regularItems = SHOP_ITEMS.filter(i => i.key !== 'donald_rage');
  const donaldItem = SHOP_ITEMS.find(i => i.key === 'donald_rage')!;

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

        <div className="grid grid-cols-2 gap-3 mb-4">
          {regularItems.map((item, idx) => {
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
                  {isBought ? <><span>✓</span> Куплено</> : <><span>🪙</span> {item.price.toLocaleString()}</>}
                </button>
              </div>
            );
          })}
        </div>

        {/* Дональд Дак — особый предмет */}
        <div
          className={`animate-fade-in relative rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
            donaldBought
              ? 'border-red-500 bg-red-500/10'
              : failed === donaldItem.id
              ? 'border-ruby/60 animate-shake'
              : 'border-red-800/40 bg-gradient-to-br from-red-950/40 to-orange-950/30'
          }`}
          style={{ animationDelay: '0.45s', opacity: 0 }}
        >
          {donaldBought && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60 animate-scale-in">
              <div className="text-center">
                <div className="text-5xl mb-2 animate-shake" style={{ display: 'inline-block' }}>🦆</div>
                <div className="font-display font-bold text-red-400 text-lg uppercase tracking-widest">
                  КВААААК! ЗАПУСКАЮ!
                </div>
              </div>
            </div>
          )}

          <div className="p-4 flex gap-4 items-center">
            <div className="flex-shrink-0">
              <img
                src="https://cdn.poehali.dev/projects/55519ddb-2563-46a6-93e0-f3902bfb09ff/files/24746f84-1be4-4127-8e76-5dfa77c94361.jpg"
                alt="Дональд Дак в ярости"
                className="w-20 h-20 object-contain drop-shadow-lg animate-float"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display font-bold text-lg text-red-400 tracking-wide">Дональд в ярости!</span>
                <span className="text-xs bg-red-500/20 border border-red-500/40 text-red-400 px-2 py-0.5 rounded-full">ЭКСКЛЮЗИВ</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Разъярённый Дональд Дак задаёт 17 адских вопросов. Только для смельчаков!
              </p>
              <button
                onClick={() => handleBuy(donaldItem)}
                disabled={coins < donaldItem.price || donaldBought}
                className={`w-full py-2.5 rounded-xl text-sm font-display font-bold tracking-wide transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
                  donaldBought
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : coins >= donaldItem.price
                    ? 'bg-red-600 text-white hover:bg-red-500'
                    : 'bg-secondary text-muted-foreground cursor-not-allowed'
                }`}
              >
                {donaldBought
                  ? <><span>🦆</span> КВААААК!</>
                  : <><span>🪙</span> {donaldItem.price.toLocaleString()}</>
                }
              </button>
            </div>
          </div>
        </div>

        {/* Дейзи Дак — успокоить Дональда, бесплатно */}
        <div
          className="mt-4 animate-fade-in relative rounded-2xl overflow-hidden border-2 border-pink-400/30 bg-gradient-to-br from-pink-950/30 to-purple-950/20 transition-all duration-500"
          style={{ animationDelay: '0.55s', opacity: 0 }}
        >
          <div className="p-4 flex gap-4 items-center">
            <div className="flex-shrink-0">
              <img
                src="https://cdn.poehali.dev/projects/55519ddb-2563-46a6-93e0-f3902bfb09ff/files/184a4fab-6a9a-4541-9e66-2376f5783226.jpg"
                alt="Дейзи Дак"
                className="w-20 h-20 object-contain drop-shadow-lg animate-float"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-display font-bold text-lg text-pink-300 tracking-wide">Дейзи Дак</span>
                <span className="text-xs bg-pink-500/20 border border-pink-400/40 text-pink-300 px-2 py-0.5 rounded-full">БЕСПЛАТНО</span>
                {(inventory['daisy_calm'] || 0) > 0 && (
                  <span className="text-xs font-display font-bold text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full">×{inventory['daisy_calm']}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Успокаивает Дональда — используй во время его режима, чтобы досрочно завершить испытание!
              </p>
              <button
                onClick={() => {
                  const success = onBuy('daisy_calm', 0);
                  if (success) {
                    setDaisyBought(true);
                    setTimeout(() => setDaisyBought(false), 1200);
                  }
                }}
                className={`w-full py-2.5 rounded-xl text-sm font-display font-bold tracking-wide transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
                  daisyBought
                    ? 'bg-pink-400/20 text-pink-300 border border-pink-400/30'
                    : 'bg-pink-600 text-white hover:bg-pink-500'
                }`}
              >
                {daisyBought ? <><span>🌸</span> Добавлено!</> : <><span>🌸</span> Получить бесплатно</>}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 glass rounded-xl p-4 animate-fade-in text-center">
          <div className="text-sm text-muted-foreground">
            Монеты зарабатываются за прохождение уровней.<br />
            Отвечай быстрее — получай больше!
          </div>
        </div>
      </div>
    </div>
  );
}
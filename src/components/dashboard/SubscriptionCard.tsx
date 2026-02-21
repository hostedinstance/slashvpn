'use client';

import { useState } from 'react';
import { Check, Globe, ArrowRight, Gift, Zap } from 'lucide-react';

const FD = 'var(--font-wix-madefor), sans-serif';
const FM = 'var(--font-inter-tight), sans-serif';

// ── Строго navy-синяя палитра — никакого фиолетового ──────────────────────────
const C = {
  card:    'linear-gradient(160deg, #010E38 0%, #00092B 100%)',
  raised:  'rgba(1,20,74,0.65)',
  border:  'rgba(100,140,255,0.10)',
  brdHov:  'rgba(100,160,255,0.28)',
  accent:  'rgba(0,80,200,1)',       // navy-blue accent
  text:    'rgba(230,238,255,0.96)',
  dim:     'rgba(180,205,255,0.48)',
  faint:   'rgba(140,175,255,0.28)',
};

const PRICES: Record<string, number> = { '1': 120, '3': 270, '6': 540, '12': 1080 };

const PERIODS = [
  { id: '1',  label: '1 мес.',  saving: null    },
  { id: '3',  label: '3 мес.',  saving: '-25%'  },
  { id: '6',  label: '6 мес.',  saving: '-25%'  },
  { id: '12', label: '1 год',   saving: '-25%'  },
] as const;

type PeriodId = '1' | '3' | '6' | '12';

const ALL_COUNTRIES = [
  { cc: 'nl', name: 'Нидерланды' }, { cc: 'de', name: 'Германия' },
  { cc: 'se', name: 'Швеция' },     { cc: 'fi', name: 'Финляндия' },
  { cc: 'us', name: 'США' },
];

function Flag({ cc }: { cc: string }) {
  return (
    <span className={`fi fi-${cc}`}
      style={{ width: 15, height: 11, borderRadius: 2, flexShrink: 0, display: 'inline-block',
        backgroundSize: 'cover', backgroundPosition: 'center' }} />
  );
}

// ─── Plan card ────────────────────────────────────────────────────────────────
function PlanCard({ selected, onClick, children }: {
  selected: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="relative text-left w-full rounded-2xl"
      style={{
        padding: '16px 18px',
        background: selected ? 'rgba(0,30,100,0.70)' : 'rgba(100,140,255,0.03)',
        boxShadow: selected
          ? '0 0 0 1.5px rgba(100,160,255,0.42), 0 0 24px rgba(0,60,180,0.18)'
          : '0 0 0 1px rgba(100,140,255,0.09)',
        transform: selected ? 'scale(1.006)' : 'scale(1)',
        transition: 'transform 180ms ease, box-shadow 180ms ease, background 180ms ease',
      }}
      onMouseEnter={(e) => {
        if (!selected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(100,140,255,0.07)';
      }}
      onMouseLeave={(e) => {
        if (!selected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(100,140,255,0.03)';
      }}
    >
      {children}
    </button>
  );
}

// ─── Feature check row ────────────────────────────────────────────────────────
function FRow({ text, green = false }: { text: string; green?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
        style={{ background: green ? 'rgba(52,211,153,0.15)' : 'rgba(100,160,255,0.16)' }}>
        <Check className="w-2.5 h-2.5"
          style={{ color: green ? '#34d399' : 'rgba(100,160,255,0.85)' }} />
      </div>
      <span style={{ fontFamily: FM, fontSize: 12, color: C.dim }}>{text}</span>
    </div>
  );
}

// ─── Кнопка Оплатить — стиль как AuthButton primary (прозрачный navy) ─────────
function PayButton({ isTrial }: { isTrial: boolean }) {
  return (
    <button
      className="relative overflow-hidden flex items-center gap-2 rounded-2xl font-bold text-white group"
      style={{
        fontFamily: FD, fontSize: 14, padding: '12px 26px',
        background: isTrial
          ? 'rgba(0,80,40,0.60)'
          : 'rgba(1,20,74,0.75)',
        border: `1px solid ${isTrial ? 'rgba(52,211,153,0.35)' : 'rgba(100,140,255,0.25)'}`,
        boxShadow: isTrial
          ? '0 2px 14px rgba(0,120,60,0.22), inset 0 1px 0 rgba(52,211,153,0.15)'
          : '0 2px 14px rgba(0,40,140,0.22), inset 0 1px 0 rgba(100,140,255,0.12)',
        transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms ease, background 200ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform  = 'scale(1.03) translateY(-1px)';
        el.style.background = isTrial ? 'rgba(0,100,50,0.78)' : 'rgba(0,30,100,0.88)';
        el.style.boxShadow  = isTrial
          ? '0 8px 26px rgba(0,160,80,0.30), inset 0 1px 0 rgba(52,211,153,0.18)'
          : '0 8px 26px rgba(0,60,200,0.32), inset 0 1px 0 rgba(100,160,255,0.18)';
        el.style.borderColor = isTrial ? 'rgba(52,211,153,0.55)' : 'rgba(100,160,255,0.45)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform  = 'scale(1) translateY(0)';
        el.style.background = isTrial ? 'rgba(0,80,40,0.60)' : 'rgba(1,20,74,0.75)';
        el.style.boxShadow  = isTrial
          ? '0 2px 14px rgba(0,120,60,0.22), inset 0 1px 0 rgba(52,211,153,0.15)'
          : '0 2px 14px rgba(0,40,140,0.22), inset 0 1px 0 rgba(100,140,255,0.12)';
        el.style.borderColor = isTrial ? 'rgba(52,211,153,0.35)' : 'rgba(100,140,255,0.25)';
      }}
      onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
      onMouseUp={(e)   => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.03) translateY(-1px)'; }}
    >
      {/* Shimmer */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(100,160,255,0.20), transparent)' }} />
      {isTrial ? 'Попробовать бесплатно' : 'Оплатить'}
      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function SubscriptionCard({ plan: _currentPlan = 'free' }: { plan?: string }) {
  const [selectedPlan, setSelectedPlan] = useState<'multi' | 'trial'>('multi');
  const [selectedPer,  setSelectedPer]  = useState<PeriodId>('1');

  const isTrial    = selectedPlan === 'trial';
  const totalPrice = isTrial ? 0 : PRICES[selectedPer];
  const perMonth   = isTrial ? 0 : Math.round(totalPrice / parseInt(selectedPer));

  return (
    <div className="relative rounded-3xl overflow-hidden"
      style={{
        background: C.card,
        boxShadow: '0 0 0 1px rgba(100,140,255,0.09), 0 40px 80px -20px rgba(0,0,0,0.55)',
      }}>

      {/* Ambient navy glow */}
      <div className="absolute pointer-events-none"
        style={{ top: -80, right: -80, width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,80,200,0.10) 0%, transparent 70%)' }} />

      <div className="relative" style={{ padding: '26px 26px 22px' }}>

        {/* ── ТАРИФ ──────────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <p style={{ fontFamily: FM, fontSize: 10, fontWeight: 700, letterSpacing: '0.13em',
            textTransform: 'uppercase', color: C.faint, marginBottom: 10 }}>
            Тариф
          </p>
          <div className="grid grid-cols-2 gap-3">

            {/* Мульти */}
            <PlanCard selected={selectedPlan === 'multi'} onClick={() => setSelectedPlan('multi')}>
              <span className="absolute"
                style={{ top: 11, right: 11, fontFamily: FM, fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.08em', padding: '2px 7px', borderRadius: 5,
                  background: 'rgba(0,80,200,0.18)', color: 'rgba(100,160,255,0.90)' }}>
                МУЛЬТИ
              </span>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(0,80,200,0.18)' }}>
                  <Globe className="w-4 h-4" style={{ color: 'rgba(100,160,255,0.85)' }} />
                </div>
                <div>
                  <p style={{ fontFamily: FD, fontSize: 15, fontWeight: 700, color: C.text }}>Мульти</p>
                  <p style={{ fontFamily: FM, fontSize: 10, color: C.faint }}>Все страны включены</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {ALL_COUNTRIES.map((c) => (
                  <div key={c.cc} className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                    style={{ background: 'rgba(100,140,255,0.06)', boxShadow: '0 0 0 1px rgba(100,140,255,0.10)' }}>
                    <Flag cc={c.cc} />
                    <span style={{ fontFamily: FM, fontSize: 10, color: C.dim }}>{c.name}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <FRow text="Безлимитный трафик" />
                <FRow text="Протокол VLESS" />
                <FRow text="Без логов" />
              </div>
            </PlanCard>

            {/* Пробный */}
            <PlanCard selected={selectedPlan === 'trial'} onClick={() => setSelectedPlan('trial')}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(52,211,153,0.12)' }}>
                  <Gift className="w-4 h-4" style={{ color: '#34d399' }} />
                </div>
                <div>
                  <p style={{ fontFamily: FD, fontSize: 15, fontWeight: 700, color: C.text }}>Пробный</p>
                  <p style={{ fontFamily: FM, fontSize: 10, color: C.faint }}>7 дней бесплатно</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3 rounded-xl px-3 py-2"
                style={{ background: 'rgba(52,211,153,0.07)', boxShadow: '0 0 0 1px rgba(52,211,153,0.14)' }}>
                <Flag cc="nl" />
                <span style={{ fontFamily: FM, fontSize: 11, fontWeight: 600,
                  color: 'rgba(52,211,153,0.85)' }}>Нидерланды</span>
              </div>

              <div className="space-y-1.5 mb-3">
                <FRow text="100 ГБ трафика"     green />
                <FRow text="Протокол VLESS"      green />
                <FRow text="Без кредитной карты" green />
              </div>

              <div className="rounded-xl px-3 py-2"
                style={{ background: 'rgba(52,211,153,0.07)', boxShadow: '0 0 0 1px rgba(52,211,153,0.12)' }}>
                <p style={{ fontFamily: FM, fontSize: 11, fontWeight: 700, color: '#34d399' }}>
                  Бесплатно на 7 дней
                </p>
              </div>
            </PlanCard>
          </div>
        </div>

        {/* ── ПЕРИОД ОПЛАТЫ — компактные таблетки ────────────────────────────── */}
        {!isTrial && (
          <div className="mb-6">
            <p style={{ fontFamily: FM, fontSize: 10, fontWeight: 700, letterSpacing: '0.13em',
              textTransform: 'uppercase', color: C.faint, marginBottom: 8 }}>
              Период оплаты
            </p>

            {/* Горизонтальная строка мини-кнопок */}
            <div className="flex gap-1.5">
              {PERIODS.map((per) => {
                const active = selectedPer === per.id;
                return (
                  <button
                    key={per.id}
                    onClick={() => setSelectedPer(per.id)}
                    className="flex-1 flex flex-col items-center rounded-xl relative"
                    style={{
                      padding: '6px 4px',          /* ← минимум внутри */
                      background: active
                        ? 'rgba(0,40,120,0.70)'
                        : 'rgba(100,140,255,0.04)',
                      boxShadow: active
                        ? '0 0 0 1.5px rgba(100,160,255,0.42)'
                        : '0 0 0 1px rgba(100,140,255,0.09)',
                      transition: 'background 160ms ease, box-shadow 160ms ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(100,140,255,0.09)';
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(100,140,255,0.04)';
                    }}
                  >
                    {/* Лейбл */}
                    <span style={{
                      fontFamily: FD, fontSize: 11, fontWeight: 600, lineHeight: 1,
                      color: active ? C.text : C.faint,
                    }}>
                      {per.label}
                    </span>

                    {/* Цена */}
                    <span style={{
                      fontFamily: FM, fontSize: 13, fontWeight: 800,
                      letterSpacing: '-0.03em', marginTop: 2, lineHeight: 1,
                      color: active ? 'rgba(100,180,255,0.95)' : C.dim,
                    }}>
                      {PRICES[per.id]}₽
                    </span>

                    {/* Скидка */}
                    {per.saving && (
                      <span style={{
                        fontFamily: FM, fontSize: 8, fontWeight: 700,
                        color: '#34d399',
                        background: 'rgba(52,211,153,0.10)',
                        padding: '1px 4px', borderRadius: 3, marginTop: 2, lineHeight: 1.4,
                      }}>
                        {per.saving}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Включено + CTA ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(100,140,255,0.04)', boxShadow: `0 0 0 1px ${C.border}` }}>

          {/* Included features */}
          <div style={{ padding: '14px 18px 12px' }}>
            <p style={{ fontFamily: FM, fontSize: 10, fontWeight: 700, letterSpacing: '0.11em',
              textTransform: 'uppercase', color: C.faint, marginBottom: 10 }}>
              Включено в тариф
            </p>
            <div className={`grid gap-x-3 gap-y-1.5 ${isTrial ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {(isTrial
                ? ['100 ГБ трафика', 'VLESS', '🇳🇱 Нидерланды', 'Без карты']
                : ['5 стран', 'Безлимит', 'VLESS', 'Без логов', 'Макс. скорость', `≈${perMonth}₽/мес`]
              ).map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 shrink-0"
                    style={{ color: isTrial ? '#34d399' : 'rgba(100,160,255,0.70)' }} />
                  <span style={{ fontFamily: FM, fontSize: 11, color: C.dim }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total row + CTA */}
          <div className="flex items-center justify-between"
            style={{ borderTop: `1px solid ${C.border}`, padding: '13px 18px' }}>

            <div>
              <p style={{ fontFamily: FM, fontSize: 10, fontWeight: 600,
                letterSpacing: '0.11em', textTransform: 'uppercase', color: C.faint }}>
                Итого
              </p>
              {isTrial ? (
                <p style={{ fontFamily: FM, fontSize: 28, fontWeight: 800,
                  letterSpacing: '-0.04em', lineHeight: 1, marginTop: 4, color: '#34d399' }}>
                  Бесплатно
                </p>
              ) : (
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span style={{ fontFamily: FM, fontSize: 28, fontWeight: 800,
                    letterSpacing: '-0.04em', lineHeight: 1, color: C.text }}>
                    {totalPrice}₽
                  </span>
                  {selectedPer !== '1' && (
                    <span style={{ fontFamily: FM, fontSize: 11, color: C.faint }}>
                      /{PERIODS.find((p) => p.id === selectedPer)?.label.toLowerCase()}
                    </span>
                  )}
                </div>
              )}
            </div>

            <PayButton isTrial={isTrial} />
          </div>
        </div>

        {/* Trust pills */}
        <div className="flex items-center justify-center gap-5 mt-5">
          {[
            { icon: <Zap className="w-3 h-3" />,   text: 'VLESS'          },
            { icon: <Globe className="w-3 h-3" />,  text: 'Без логов'     },
            { icon: <Gift className="w-3 h-3" />,   text: 'Возврат 7 дней' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-1.5"
              style={{ color: 'rgba(140,175,255,0.30)' }}>
              {icon}
              <span style={{ fontFamily: FM, fontSize: 11 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

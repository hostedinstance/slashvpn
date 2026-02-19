'use client';

import { useState } from 'react';
import { Check, Globe, ArrowRight, Gift, Zap } from 'lucide-react';

// ─── Font tokens ─────────────────────────────────────────────────────────────
const F_DISPLAY = 'var(--font-wix-madefor), sans-serif';
const F_MONO    = 'var(--font-inter-tight), sans-serif';

// ─── Data ─────────────────────────────────────────────────────────────────────

// Цены = полная сумма за период (₽)
const PRICES: Record<string, number> = {
  '1': 120, '3': 270, '6': 540, '12': 1080,
};

const PERIODS = [
  { id: '1',  label: '1 месяц',   saving: null },
  { id: '3',  label: '3 месяца',  saving: 'экономия 25%' },
  { id: '6',  label: '6 месяцев', saving: 'экономия 25%' },
  { id: '12', label: '1 год',     saving: 'экономия 25%' },
] as const;

type PeriodId = '1' | '3' | '6' | '12';

// Все 5 стран для Мульти — отображаем как included
const ALL_COUNTRIES = [
  { cc: 'nl', name: 'Нидерланды' },
  { cc: 'de', name: 'Германия'   },
  { cc: 'se', name: 'Швеция'     },
  { cc: 'fi', name: 'Финляндия'  },
  { cc: 'us', name: 'США'        },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{ fontFamily: F_MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 12 }}>
      {children}
    </p>
  );
}

function Flag({ cc, size = 18 }: { cc: string; size?: number }) {
  return (
    <span
      className={`fi fi-${cc}`}
      style={{ width: size, height: size * 0.75, borderRadius: 3, flexShrink: 0, display: 'inline-block', backgroundSize: 'cover', backgroundPosition: 'center' }}
    />
  );
}

function FeatureCheck({ text, green = false }: { text: string; green?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
        style={{ background: green ? 'rgba(52,211,153,0.15)' : 'rgba(139,92,246,0.2)' }}>
        <Check className="w-2.5 h-2.5" style={{ color: green ? '#34d399' : 'rgba(167,139,250,0.8)' }} />
      </div>
      <span style={{ fontFamily: F_MONO, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{text}</span>
    </div>
  );
}

// ─── Мульти plan card ─────────────────────────────────────────────────────────

function MultiCard({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative text-left w-full rounded-2xl transition-all duration-200"
      style={{
        padding: '20px 22px',
        background: selected
          ? 'linear-gradient(145deg, rgba(109,40,217,0.22) 0%, rgba(79,70,229,0.1) 100%)'
          : 'rgba(255,255,255,0.025)',
        boxShadow: selected
          ? '0 0 0 1.5px rgba(139,92,246,0.5), 0 0 32px rgba(109,40,217,0.18)'
          : '0 0 0 1px rgba(255,255,255,0.06)',
        transform: selected ? 'scale(1.005)' : 'scale(1)',
      }}
      onMouseEnter={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
      onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.025)'; }}
    >
      {/* Badge */}
      <span className="absolute" style={{ top: 14, right: 14, fontFamily: F_MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 6, background: 'rgba(139,92,246,0.22)', color: 'rgba(167,139,250,0.9)' }}>
        МУЛЬТИ
      </span>

      {/* Icon + Name */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(139,92,246,0.18)', boxShadow: '0 0 16px rgba(124,58,237,0.2)' }}>
          <Globe className="w-4 h-4" style={{ color: 'rgba(167,139,250,0.85)' }} />
        </div>
        <div>
          <p style={{ fontFamily: F_DISPLAY, fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.01em' }}>
            Мульти
          </p>
          <p style={{ fontFamily: F_MONO, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Все страны включены</p>
        </div>
      </div>

      {/* Included countries — displayed as tags, not selectable */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {ALL_COUNTRIES.map((c) => (
          <div key={c.cc} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
            style={{ background: 'rgba(255,255,255,0.06)', boxShadow: '0 0 0 1px rgba(255,255,255,0.07)' }}>
            <Flag cc={c.cc} size={16} />
            <span style={{ fontFamily: F_MONO, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{c.name}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="space-y-1.5 mb-4">
        <FeatureCheck text="Безлимитный трафик" />
        <FeatureCheck text="Протокол VLESS" />
        <FeatureCheck text="Без логов" />
        <FeatureCheck text="Неограниченная скорость" />
      </div>
    </button>
  );
}

// ─── Пробный plan card ────────────────────────────────────────────────────────

function TrialCard({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative text-left w-full rounded-2xl transition-all duration-200"
      style={{
        padding: '20px 22px',
        background: selected
          ? 'linear-gradient(145deg, rgba(52,211,153,0.12) 0%, rgba(16,185,129,0.05) 100%)'
          : 'rgba(255,255,255,0.025)',
        boxShadow: selected
          ? '0 0 0 1.5px rgba(52,211,153,0.4), 0 0 28px rgba(52,211,153,0.1)'
          : '0 0 0 1px rgba(255,255,255,0.06)',
        transform: selected ? 'scale(1.005)' : 'scale(1)',
      }}
      onMouseEnter={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
      onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.025)'; }}
    >
      {/* Icon + Name */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(52,211,153,0.12)' }}>
          <Gift className="w-4 h-4" style={{ color: '#34d399' }} />
        </div>
        <div>
          <p style={{ fontFamily: F_DISPLAY, fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.01em' }}>
            Пробный
          </p>
          <p style={{ fontFamily: F_MONO, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>7 дней бесплатно</p>
        </div>
      </div>

      {/* Fixed country — Netherlands only */}
      <div className="flex items-center gap-2 mb-3 rounded-xl px-3 py-2.5"
        style={{ background: 'rgba(52,211,153,0.07)', boxShadow: '0 0 0 1px rgba(52,211,153,0.15)' }}>
        <Flag cc="nl" size={18} />
        <span style={{ fontFamily: F_MONO, fontSize: 12, fontWeight: 600, color: 'rgba(52,211,153,0.85)' }}>
          Нидерланды — единственный сервер
        </span>
      </div>

      {/* Features */}
      <div className="space-y-1.5 mb-4">
        <FeatureCheck text="100 ГБ трафика" green />
        <FeatureCheck text="Протокол VLESS"  green />
        <FeatureCheck text="Без кредитной карты" green />
      </div>

      {/* Free badge */}
      <div className="rounded-xl px-3 py-2.5"
        style={{ background: 'rgba(52,211,153,0.08)', boxShadow: '0 0 0 1px rgba(52,211,153,0.12)' }}>
        <p style={{ fontFamily: F_MONO, fontSize: 11, fontWeight: 700, color: '#34d399' }}>Бесплатно на 7 дней</p>
        <p style={{ fontFamily: F_MONO, fontSize: 10, color: 'rgba(52,211,153,0.55)', marginTop: 2 }}>
          Затем автоматически предложим тариф Мульти
        </p>
      </div>
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
        background: 'linear-gradient(160deg, #0f0f22 0%, #09090f 100%)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px -20px rgba(0,0,0,0.6)',
      }}
    >
      {/* Ambient */}
      <div className="absolute pointer-events-none" style={{ top: -100, right: -100, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%)' }} />

      <div className="relative" style={{ padding: '32px 32px 28px' }}>

        {/* ── STEP 1: Тариф ──────────────────────────────────────────────── */}
        <div className="mb-8">
          <SectionLabel>Тариф</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <MultiCard selected={selectedPlan === 'multi'} onClick={() => setSelectedPlan('multi')} />
            <TrialCard selected={selectedPlan === 'trial'} onClick={() => setSelectedPlan('trial')} />
          </div>
        </div>

        {/* ── STEP 2: Период — только для Мульти ───────────────────────── */}
        {!isTrial && (
          <div className="mb-8">
            <SectionLabel>Период оплаты</SectionLabel>
            <div className="grid grid-cols-4 gap-2">
              {PERIODS.map((per) => {
                const active = selectedPer === per.id;
                return (
                  <button
                    key={per.id}
                    onClick={() => setSelectedPer(per.id)}
                    className="flex flex-col items-center rounded-xl transition-all duration-200 text-center"
                    style={{
                      padding: '12px 8px',
                      background: active ? 'rgba(139,92,246,0.16)' : 'rgba(255,255,255,0.03)',
                      boxShadow: active ? '0 0 0 1.5px rgba(139,92,246,0.4)' : '0 0 0 1px rgba(255,255,255,0.05)',
                    }}
                    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'; }}
                  >
                    <span style={{ fontFamily: F_DISPLAY, fontSize: 13, fontWeight: 600, color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}>
                      {per.label}
                    </span>
                    <span style={{ fontFamily: F_MONO, fontSize: 16, fontWeight: 800, color: active ? 'rgba(167,139,250,0.95)' : 'rgba(255,255,255,0.55)', letterSpacing: '-0.03em', marginTop: 4 }}>
                      {PRICES[per.id]} ₽
                    </span>
                    {per.saving && (
                      <span style={{ fontFamily: F_MONO, fontSize: 9, fontWeight: 700, color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '2px 6px', borderRadius: 4, marginTop: 5 }}>
                        {per.saving}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Summary + CTA ─────────────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.025)', boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }}
        >
          {/* What's included */}
          <div style={{ padding: '18px 22px 16px' }}>
            <p style={{ fontFamily: F_MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 12 }}>
              Включено в тариф
            </p>
            <div className={`grid gap-2 ${isTrial ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {(isTrial ? [
                '100 ГБ трафика',
                'Протокол VLESS',
                '1 сервер — Нидерланды',
                'Без кредитной карты',
              ] : [
                'Все 5 стран',
                'Безлимитный трафик',
                'Протокол VLESS',
                'Без логов',
                'Неогр. скорость',
                `≈ ${perMonth} ₽/мес`,
              ]).map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="w-3 h-3 shrink-0" style={{ color: isTrial ? '#34d399' : 'rgba(167,139,250,0.7)' }} />
                  <span style={{ fontFamily: F_MONO, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total row */}
          <div className="flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '16px 22px' }}>
            <div>
              <p style={{ fontFamily: F_MONO, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                Итого
              </p>
              {isTrial ? (
                <p style={{ fontFamily: F_MONO, fontSize: 30, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginTop: 4, color: '#34d399' }}>
                  Бесплатно
                </p>
              ) : (
                <div className="flex items-baseline gap-2 mt-1">
                  <span style={{ fontFamily: F_MONO, fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: 'rgba(255,255,255,0.92)' }}>
                    {totalPrice} ₽
                  </span>
                  {selectedPer !== '1' && (
                    <span style={{ fontFamily: F_MONO, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
                      за {PERIODS.find((p) => p.id === selectedPer)?.label.toLowerCase()}
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              className="flex items-center gap-2 rounded-2xl font-bold text-white transition-all duration-200 group"
              style={{
                fontFamily: F_DISPLAY, fontSize: 14, padding: '13px 28px',
                background: isTrial
                  ? 'linear-gradient(135deg, #059669, #34d399)'
                  : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                boxShadow: isTrial
                  ? '0 8px 28px -4px rgba(52,211,153,0.4), 0 1px 0 rgba(255,255,255,0.12) inset'
                  : '0 8px 28px -4px rgba(124,58,237,0.5), 0 1px 0 rgba(255,255,255,0.1) inset',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = 'translateY(0)';
              }}
            >
              {isTrial ? 'Попробовать бесплатно' : 'Оплатить'}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Trust pills */}
        <div className="flex items-center justify-center gap-5 mt-5">
          {[
            { icon: <Zap className="w-3 h-3" />,  text: 'VLESS' },
            { icon: <Globe className="w-3 h-3" />, text: 'Без логов' },
            { icon: <Gift className="w-3 h-3" />,  text: 'Возврат 7 дней' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.18)' }}>
              {icon}
              <span style={{ fontFamily: F_MONO, fontSize: 11 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

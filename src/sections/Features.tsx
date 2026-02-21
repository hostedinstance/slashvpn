'use client';

import { Globe, Zap, ShieldOff, Smartphone, type LucideIcon } from 'lucide-react';
import AnimatedContent from '@/components/AnimatedContent';

// ─── Данные ───────────────────────────────────────────────────────────────────

interface FeatureItem {
  id:          string;
  icon:        LucideIcon;
  label:       string;
  title:       string;
  description: string;
  stat?:       string;
  statLabel?:  string;
  isLarge?:    boolean;
  accentColor: string;
  glowColor:   string;
}

const FEATURES: FeatureItem[] = [
  {
    id:          'access',
    icon:        Globe,
    label:       'Доступ',
    title:       'Открывай любые сайты',
    description: 'Instagram, YouTube, Spotify, зарубежные сервисы — всё открывается одним нажатием. Никаких ограничений, никаких блокировок.',
    stat:        '190+',
    statLabel:   'стран',
    isLarge:     true,
    accentColor: 'rgba(100, 160, 255, 0.90)',
    glowColor:   'rgba(64, 128, 255, 0.18)',
  },
  {
    id:          'speed',
    icon:        Zap,
    label:       'Скорость',
    title:       'Скорость не падает',
    description: '4K-видео и онлайн-игры без лагов. Наши серверы оптимизированы для максимальной пропускной способности.',
    stat:        '1 Гбит/с',
    statLabel:   'канал',
    accentColor: 'rgba(250, 200, 80, 0.90)',
    glowColor:   'rgba(250, 180, 40, 0.14)',
  },
  {
    id:          'privacy',
    icon:        ShieldOff,
    label:       'Приватность',
    title:       'Никто не следит',
    description: 'Строгая политика no-logs. Мы физически не можем передать твои данные — мы их не храним.',
    stat:        '0 логов',
    statLabel:   'гарантировано',
    accentColor: 'rgba(80, 220, 160, 0.90)',
    glowColor:   'rgba(50, 200, 130, 0.14)',
  },
  {
    id:          'devices',
    icon:        Smartphone,
    label:       'Устройства',
    title:       'Работает везде',
    description: 'iPhone, Android, Windows, macOS — подключай до 5 устройств одновременно с одной подпиской. Один аккаунт для всей семьи.',
    stat:        '5',
    statLabel:   'устройств одновременно',
    accentColor: 'rgba(180, 120, 255, 0.90)',
    glowColor:   'rgba(150, 80, 255, 0.14)',
  },
];

// ─── Палитра ──────────────────────────────────────────────────────────────────

const CARD_BG    = 'rgba(1, 14, 56, 0.82)';
const CARD_HOV   = 'rgba(1, 20, 74, 0.95)';
const BORDER     = 'rgba(100, 140, 255, 0.09)';
const BORDER_HOV = 'rgba(140, 170, 255, 0.22)';

// ─── Card ─────────────────────────────────────────────────────────────────────

function FeatureCard({
  icon: Icon, label, title, description, stat, statLabel,
  isLarge, accentColor, glowColor,
}: FeatureItem) {
  return (
    <div
      className="group relative rounded-[28px] overflow-hidden flex flex-col h-full"
      style={{
        background:  CARD_BG,
        border:      `1px solid ${BORDER}`,
        transition:  'background 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background   = CARD_HOV;
        el.style.borderColor  = BORDER_HOV;
        el.style.boxShadow    = `0 0 40px -10px ${glowColor}`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background  = CARD_BG;
        el.style.borderColor = BORDER;
        el.style.boxShadow   = 'none';
      }}
    >
      {/* Ambient glow — top left corner */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width:        220,
          height:       220,
          borderRadius: '50%',
          background:   `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          transform:    'translate(-30%, -30%)',
          opacity:      0.9,
        }}
      />

      <div className={`relative flex flex-col flex-1 gap-6 ${isLarge ? 'p-9 md:p-11' : 'p-8'}`}>

        {/* Top row: label + icon */}
        <div className="flex items-start justify-between">
          {/* Label pill */}
          <span
            className="font-inter-tight text-[11px] font-semibold uppercase tracking-[0.14em] px-3 py-1 rounded-full"
            style={{
              background: `${glowColor}`,
              border:     `1px solid ${accentColor.replace('0.90', '0.20')}`,
              color:      accentColor,
            }}
          >
            {label}
          </span>

          {/* Icon box */}
          <div
            className="size-11 rounded-[14px] flex items-center justify-center shrink-0"
            style={{
              background: `rgba(1,14,56,0.95)`,
              border:     `1px solid ${accentColor.replace('0.90', '0.22')}`,
              boxShadow:  `0 0 16px -4px ${glowColor}`,
            }}
          >
            <Icon size={20} strokeWidth={1.5} style={{ color: accentColor }} />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2.5 flex-1">
          <h3 className={`font-wix-madefor font-bold tracking-tight text-white ${isLarge ? 'text-3xl md:text-[2rem]' : 'text-2xl'}`}>
            {title}
          </h3>
          <p
            className="font-inter-tight text-[0.9rem] leading-relaxed"
            style={{ color: 'rgba(180, 205, 255, 0.50)' }}
          >
            {description}
          </p>
        </div>

        {/* Stat — bottom */}
        {stat && (
          <div
            className="flex items-baseline gap-2 pt-4 mt-auto"
            style={{ borderTop: `1px solid rgba(100,140,255,0.07)` }}
          >
            <span
              className="font-wix-madefor font-bold tracking-tight"
              style={{ fontSize: isLarge ? '2.2rem' : '1.75rem', color: accentColor }}
            >
              {stat}
            </span>
            <span
              className="font-inter-tight text-sm"
              style={{ color: 'rgba(180,205,255,0.38)' }}
            >
              {statLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export const Features = () => {
  return (
    <section id="features" className="relative py-28 md:py-40" style={{ backgroundColor: '#000' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <AnimatedContent distance={50} duration={0.9} ease="power3.out" threshold={0.2}>
          <div className="flex flex-col items-center text-center gap-5 mb-16 md:mb-24">
            <h2 className="font-wix-madefor font-bold text-5xl md:text-6xl tracking-tight text-white">
              Всё что нужно —{' '}
              <span style={{
                background:           'linear-gradient(135deg,#ffffff 0%,rgba(100,160,255,0.95) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}>
                ничего лишнего
              </span>
            </h2>
            <p
              className="font-inter-tight text-lg max-w-lg leading-relaxed"
              style={{ color: 'rgba(180,205,255,0.50)' }}
            >
              SlashVPN создан с одной целью — дать тебе свободу в интернете без технических сложностей.
            </p>
          </div>
        </AnimatedContent>

        {/*
          Bento-сетка 2×2 на мобилках, на десктопе — 3 колонки:
          [  Card 1 — Large (col-span-2)  ] [ Card 2 ]
          [ Card 3 ]         [ Card 4 (col-span-2)   ]
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(280px,auto)]">

          {/* Card 1 — большая, слева */}
          <AnimatedContent
            distance={45} duration={0.78} ease="power3.out"
            delay={0} threshold={0.08}
            className="md:col-span-2"
          >
            <FeatureCard {...FEATURES[0]} />
          </AnimatedContent>

          {/* Card 2 */}
          <AnimatedContent
            distance={45} duration={0.78} ease="power3.out"
            delay={0.1} threshold={0.08}
          >
            <FeatureCard {...FEATURES[1]} />
          </AnimatedContent>

          {/* Card 3 */}
          <AnimatedContent
            distance={45} duration={0.78} ease="power3.out"
            delay={0.18} threshold={0.08}
          >
            <FeatureCard {...FEATURES[2]} />
          </AnimatedContent>

          {/* Card 4 — большая, справа */}
          <AnimatedContent
            distance={45} duration={0.78} ease="power3.out"
            delay={0.26} threshold={0.08}
            className="md:col-span-2"
          >
            <FeatureCard {...FEATURES[3]} />
          </AnimatedContent>

        </div>
      </div>
    </section>
  );
};

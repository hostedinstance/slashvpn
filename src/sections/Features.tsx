'use client';

import { Globe, Zap, ShieldOff, Smartphone, type LucideIcon } from 'lucide-react';
import AnimatedContent from '@/components/AnimatedContent';
import { featuresStyles, fonts, palette } from '@/config/theme.config';

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

// ─── Card ─────────────────────────────────────────────────────────────────────

function FeatureCard({
  icon: Icon, label, title, description, stat, statLabel,
  isLarge, accentColor, glowColor,
}: FeatureItem) {
  return (
    <div
      className="group relative rounded-[28px] overflow-hidden flex flex-col h-full"
      style={{
        background:  featuresStyles.cardBg,
        border:      `1px solid ${featuresStyles.cardBorder}`,
        transition:  featuresStyles.cardTransition,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background   = featuresStyles.cardBgHover;
        el.style.borderColor  = featuresStyles.cardBorderHover;
        el.style.boxShadow    = `0 0 40px -10px ${glowColor}`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background  = featuresStyles.cardBg;
        el.style.borderColor = featuresStyles.cardBorder;
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
            className={`${fonts.body} text-[11px] font-semibold uppercase tracking-[0.14em] px-3 py-1 rounded-full`}
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
              background: featuresStyles.iconBg,
              border:     `1px solid ${accentColor.replace('0.90', '0.22')}`,
              boxShadow:  `0 0 16px -4px ${glowColor}`,
            }}
          >
            <Icon size={20} strokeWidth={1.5} style={{ color: accentColor }} />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2.5 flex-1">
          <h3 className={`${fonts.heading} font-bold tracking-tight text-white ${isLarge ? 'text-3xl md:text-[2rem]' : 'text-2xl'}`}>
            {title}
          </h3>
          <p
            className={`${fonts.body} text-[0.9rem] leading-relaxed`}
            style={{ color: featuresStyles.descriptionColor }}
          >
            {description}
          </p>
        </div>

        {/* Stat — bottom */}
        {stat && (
          <div
            className="flex items-baseline gap-2 pt-4 mt-auto"
            style={{ borderTop: `1px solid ${featuresStyles.statDivider}` }}
          >
            <span
              className={`${fonts.heading} font-bold tracking-tight`}
              style={{ fontSize: isLarge ? '2.2rem' : '1.75rem', color: accentColor }}
            >
              {stat}
            </span>
            <span
              className={`${fonts.body} text-sm`}
              style={{ color: featuresStyles.statLabelColor }}
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
    <section id="features" className={`relative ${featuresStyles.sectionPadding}`} style={{ backgroundColor: palette.sectionBg }}>
      <div className={featuresStyles.container}>

        {/* Section header */}
        <AnimatedContent distance={50} duration={0.9} ease="power3.out" threshold={0.2}>
          <div className={`flex flex-col items-center text-center gap-5 ${featuresStyles.headerGap}`}>
            <h2 className={`${fonts.heading} font-bold text-5xl md:text-6xl tracking-tight text-white`}>
              {featuresStyles.headingText}{' '}
              <span style={{
                background:           featuresStyles.headingGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}>
                {featuresStyles.headingGradientText}
              </span>
            </h2>
            <p
              className={`${fonts.body} text-lg max-w-lg leading-relaxed`}
              style={{ color: featuresStyles.subtitleColor }}
            >
              {featuresStyles.subtitleText}
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

'use client';

import { useEffect, useRef } from 'react';
import { CountrySelector, type Country } from '@/components/CountrySelector';

// ── Accent — same across all sections ────────────────────────────────────────
const ACCENT = 'rgba(100, 160, 255, 0.90)';

// ── Reveal hook ───────────────────────────────────────────────────────────────
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, delay);
        io.disconnect();
      }
    }, { threshold: 0.08, rootMargin: '-30px' });
    io.observe(el); return () => io.disconnect();
  }, [delay]);
  return ref;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const ACTIVE_COUNTRIES: Country[] = [
  { name: 'США',        flag: 'us', code: 'US' },
  { name: 'Германия',   flag: 'de', code: 'DE' },
  { name: 'Нидерланды', flag: 'nl', code: 'NL' },
  { name: 'Финляндия',  flag: 'fi', code: 'FI' },
  { name: 'Швеция',     flag: 'se', code: 'SE' },
];

const UPCOMING_COUNTRIES: Country[] = [
  { name: 'Франция',   flag: 'fr', code: 'FR' },
  { name: 'Канада',    flag: 'ca', code: 'CA' },
  { name: 'Польша',    flag: 'pl', code: 'PL' },
  { name: 'Австралия', flag: 'au', code: 'AU' },
  { name: 'Испания',   flag: 'es', code: 'ES' },
];

// ── Section ────────────────────────────────────────────────────────────────────

export function Locations() {
  const sectionRef = useReveal();

  // Font class matching Features headings: font-wix-madefor font-bold text-5xl md:text-6xl tracking-tight
  const titleFont = 'font-wix-madefor font-bold tracking-tight';

  return (
    <div
      id="locations"
      ref={sectionRef}
      style={{
        backgroundColor: '#000',
        opacity: 0,
        transform: 'translateY(32px)',
        transition: 'opacity 0.70s cubic-bezier(0.22,1,0.36,1), transform 0.70s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <CountrySelector
        activeCountries={ACTIVE_COUNTRIES}
        upcomingCountries={UPCOMING_COUNTRIES}

        headerConfig={{
          title:            'Локации, которые не подводят',
          titleNode: (
            <>
              Локации, которые{' '}
              <span style={{
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(100,160,255,0.95) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>не подводят</span>
            </>
          ),
          subtitle:         'Подключайтесь к серверам по всему миру с максимальной скоростью.',
          titleSizeMobile:  '2.5rem',
          titleSizeDesktop: '3.5rem',
          subtitleSize:     '1rem',
          titleColor:       '#ffffff',
          subtitleColor:    'rgba(180,205,255,0.50)',
          subtitleMaxWidth: '48rem',
          marginBottom:     72,
          // Same font class as Features headings
          titleFont:        titleFont,
          subtitleFont:     'font-inter-tight',
        }}

        activeRowConfig={{
          duration:  25,
          direction: 'left-to-right',
          gap:       32,
          paddingY:  20,
        }}

        activeCardStyle={{
          background:       'linear-gradient(to bottom right, rgba(1,20,74,0.85), rgba(1,14,56,0.60))',
          borderColor:      'rgba(100,140,255,0.14)',
          borderColorHover: 'rgba(100,160,255,0.45)',
          boxShadow:        '0 0 0 transparent',
          borderRadius:     '1rem',
          minWidth:         220,
          padding:          '1.25rem 2.5rem',
          hoverScale:       1.04,
          flagSize:         '3.5rem',
          flagDropShadow:   'drop-shadow(0 0 10px rgba(100,160,255,0.20))',
          nameTextSize:     '1.1rem',
          statusTextSize:   '0.875rem',
          statusColor:      'rgb(52,211,153)',
          indicatorSize:    '0.4rem',
          nameFont:         'font-wix-madefor font-semibold tracking-tight',
          statusFont:       'font-inter-tight',
        }}

        upcomingRowConfig={{
          duration:  35,
          direction: 'right-to-left',
          gap:       28,
          paddingY:  20,
        }}

        upcomingCardStyle={{
          background:    'rgba(1,14,56,0.40)',
          borderColor:   'rgba(100,140,255,0.09)',
          borderStyle:   'dashed',
          borderWidth:   2,
          borderRadius:  '1rem',
          minWidth:      220,
          padding:       '1.25rem 2.5rem',
          opacity:       0.3,
          hoverOpacity:  0.65,
          grayscale:     true,
          flagSize:      '3.5rem',
          nameTextSize:  '1.1rem',
          statusTextSize:'0.875rem',
          statusColor:   'rgba(180,205,255,0.35)',
          nameFont:      'font-wix-madefor tracking-tight',
          statusFont:    'font-inter-tight',
        }}

        sectionConfig={{
          paddingYMobile:  90,
          paddingYDesktop: 140,
          maskGradient:    'linear-gradient(to right, transparent, #000 20%, #000 80%, transparent)',
        }}

        footerLinkConfig={{
          questionText: 'Не нашли подходящий сервер?',
          linkText:     'Предложить локацию',
          linkUrl:      'https://t.me/+Zmo74XmjyRdmMmJi',
          linkVariant:  'underline-grow',
          questionColor:'rgba(180,205,255,0.45)',
          linkColor:    ACCENT,
          questionSize: '1rem',
          linkSize:     '1rem',
          font:         'font-inter-tight',
          marginTop:    56,
        }}
      />
    </div>
  );
}

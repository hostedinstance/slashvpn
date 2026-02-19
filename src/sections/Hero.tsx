'use client';

import { useState, useEffect } from 'react';
import Prism from '@/components/Prism';
import TextType from '@/components/TextType';
import FadeContent from '@/components/FadeContent';
import { Button } from '@/components/Button';
import { Eye, Wifi, Globe } from 'lucide-react';

// ── Accent color — matches navy card color used across the site ───────────────
// Used for highlighted text instead of violet gradient
const ACCENT_TEXT = 'rgba(100, 160, 255, 0.90)';

const TRUST = [
  { icon: Eye,   text: 'Никто не следит за тобой' },
  { icon: Wifi,  text: 'Скорость без потерь'       },
  { icon: Globe, text: 'Доступ к любым сайтам'     },
];

function TrustItem({ icon: Icon, text }: { icon: typeof Eye; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="size-12 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(1,14,56,0.9)', border: '1px solid rgba(100,140,255,0.25)' }}
      >
        <Icon size={20} strokeWidth={1.5} style={{ color: ACCENT_TEXT }} />
      </div>
      <span className="font-inter-tight text-sm text-center" style={{ color: 'rgba(200,215,255,0.55)' }}>
        {text}
      </span>
    </div>
  );
}

export const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section className="min-h-screen flex items-center overflow-hidden relative" style={{ backgroundColor: '#000' }}>

      {/* Prism — shifted up to visual center */}
      <div className="absolute inset-x-0 z-0" style={{ top: '-15%', bottom: '-10%' }}>
        <Prism
          color="#4800ff" height={1.5} baseWidth={3} animationType="rotate"
          glow={1} noise={0} scale={isMobile ? 1 : 3.7}
          hoverStrength={0.5} bloom={1} timeScale={0.3} colorFrequency={0}
        />
      </div>

      {/* Top darkening veil */}
      <div className="absolute top-0 inset-x-0 h-48 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.80), transparent)' }} />

      {/* Soft radial edges */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 45%, transparent 25%, rgba(0,0,0,0.50) 100%)' }} />

      {/* BOTTOM fade — smooth transition to #000 background, NO border/line */}
      <div className="absolute bottom-0 inset-x-0 h-64 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.85) 40%, transparent 100%)' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-32 pb-40">
        <FadeContent blur duration={1200} ease="power3.out" initialOpacity={0}
          className="flex flex-col items-center justify-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-10"
            style={{ background: 'rgba(1,14,56,0.85)', border: '1px solid rgba(100,140,255,0.20)' }}>
            <span className="size-1.5 rounded-full animate-pulse" style={{ background: ACCENT_TEXT }} />
            <span className="font-inter-tight text-[11px] uppercase tracking-[0.12em]"
              style={{ color: 'rgba(200,215,255,0.60)' }}>
              SlashVPN — 2026
            </span>
          </div>

          {/* Heading — solid white, no gradient */}
          <h1 className="text-center text-6xl md:text-[7rem] leading-none font-grifter-bold mb-8 text-white">
            <TextType
              text={['SLASH VPN', '//slashvpn']}
              as="span"
              typingSpeed={60}
              showCursor
              cursorCharacter="|"
              cursorClassName="ml-1"
              deletingSpeed={40}
              pauseDuration={3000}
            />
          </h1>

          {/* Subtitle */}
          <p className="font-inter-tight text-base md:text-xl text-center max-w-xl mx-auto leading-relaxed mb-10"
            style={{ color: 'rgba(200,215,255,0.55)' }}>
            Твой надёжный доступ к любым сайтам — быстро, просто и надёжно.
          </p>

          {/* CTA */}
          <div className="flex justify-center mb-20">
            <Button href="https://t.me/buyslashvpn_bot">Купить от 120₽ в месяц</Button>
          </div>

          {/* Trust items */}
          <div className="w-full max-w-lg">
            <div className="h-px mb-12"
              style={{ background: 'linear-gradient(to right, transparent, rgba(100,140,255,0.20), transparent)' }} />
            <div className="grid grid-cols-3 gap-6">
              {TRUST.map(t => <TrustItem key={t.text} icon={t.icon} text={t.text} />)}
            </div>
          </div>

        </FadeContent>
      </div>
    </section>
  );
};

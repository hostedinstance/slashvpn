'use client';

import { useState, useEffect } from 'react';
import Prism from '@/components/Prism';
import TextType from '@/components/TextType';
import { Button } from '@/components/Button';
import { Eye, Wifi, Globe } from 'lucide-react';
import AnimatedContent from '@/components/AnimatedContent';
import { heroStyles, palette, fonts } from '@/config/theme.config';

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
        style={{ background: heroStyles.trustIconBg, border: `1px solid ${heroStyles.trustIconBorder}` }}
      >
        <Icon size={20} strokeWidth={1.5} style={{ color: heroStyles.trustIconColor }} />
      </div>
      <span className={`${fonts.body} text-sm text-center`} style={{ color: heroStyles.trustTextColor }}>
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
    <section className="min-h-screen flex items-center overflow-hidden relative" style={{ backgroundColor: palette.sectionBg }}>

      {/* Prism background
      <div className="absolute inset-x-0 z-0" style={{ top: '-15%', bottom: '-10%' }}>
        <Prism
          color={heroStyles.prismColor} height={1.5} baseWidth={3} animationType="rotate"
          glow={0.6} noise={0} scale={isMobile ? 1 : 3.7}
          hoverStrength={0.5} bloom={1} timeScale={0.3} colorFrequency={0.1}
        />
      </div>*/}

      {/* Vignettes */}
      <div className="absolute top-0 inset-x-0 h-48 z-[1] pointer-events-none"
           style={{ background: heroStyles.vignetteTop }} />
      <div className="absolute inset-0 z-[1] pointer-events-none"
           style={{ background: heroStyles.vignetteRadial }} />
      <div className="absolute bottom-0 inset-x-0 h-64 z-[1] pointer-events-none"
           style={{ background: heroStyles.vignetteBottom }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-32 pb-40">
        <div className="flex flex-col items-center justify-center">

          {/* Badge */}
          <AnimatedContent distance={30} duration={0.7} ease="power3.out" delay={0.1} threshold={0}>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-10"
                 style={{ background: heroStyles.badgeBg, border: `1px solid ${heroStyles.badgeBorder}` }}>
              <span className="size-1.5 rounded-full animate-pulse" style={{ background: heroStyles.badgeDot }} />
              <span className={`${fonts.body} text-[11px] uppercase tracking-[0.12em]`}
                    style={{ color: heroStyles.badgeTextColor }}>
                SlashVPN — 2026
              </span>
            </div>
          </AnimatedContent>

          {/* Heading */}
          <AnimatedContent distance={40} duration={0.85} ease="power3.out" delay={0.2} threshold={0}>
            <h1
              className={`text-center leading-none ${fonts.hero} mb-8 text-white whitespace-nowrap`}
              style={{ fontSize: 'clamp(2.4rem, 10.5vw, 7rem)' }}
            >
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
          </AnimatedContent>

          {/* Subtitle */}
          <AnimatedContent distance={35} duration={0.8} ease="power3.out" delay={0.3} threshold={0}>
            <p className={`${fonts.body} text-base md:text-xl text-center max-w-xl mx-auto leading-relaxed mb-10`}
               style={{ color: heroStyles.subtitleColor }}>
              Твой надёжный доступ к любым сайтам — быстро, просто и надёжно.
            </p>
          </AnimatedContent>

          {/* CTA */}
          <AnimatedContent distance={30} duration={0.75} ease="power3.out" delay={0.4} threshold={0}>
            <div className="flex justify-center mb-20">
              <Button href="https://t.me/buyslashvpn_bot">Купить от 120₽ в месяц</Button>
            </div>
          </AnimatedContent>

          {/* Trust items — staggered */}
          <div className="w-full max-w-lg">
            <div className="grid grid-cols-3 gap-6">
              {TRUST.map((t, i) => (
                <AnimatedContent
                  key={t.text}
                  distance={25}
                  duration={0.7}
                  ease="power3.out"
                  delay={0.5 + i * 0.1}
                  threshold={0}
                >
                  <TrustItem icon={t.icon} text={t.text} />
                </AnimatedContent>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
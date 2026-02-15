"use client";
import { Button } from "@/components/Button";
import Prism from "@/components/Prism";
import TextType from "@/components/TextType";
import FadeContent from '@/components/FadeContent';
import { useState, useEffect } from 'react';

export const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="min-h-screen md:h-[800px] flex items-center overflow-hidden relative py-20">
      {/* Prism Background */}
      <div className="absolute inset-0 z-0 ">
        <Prism
          color={"#4800ff"}
          height={2.5}
          baseWidth={4}
          animationType="rotate"
          glow={1}
          noise={0}
          scale={isMobile ? 1 : 3.7}
          hoverStrength={0.5}
          bloom={1.5}
          timeScale={0.3}
          colorFrequency={2}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 w-full">
        <FadeContent
          blur={true}
          duration={1500}
          ease="power2.out"
          initialOpacity={0}
          className="flex flex-col items-center justify-center"
        >
          <h1 className="text-center text-6xl md:text-9xl font-medium font-grifter-bold">
            <span className="block text-white">
              <TextType
                text={["SLASH VPN", "//slashvpn"]}
                as="span"
                typingSpeed={50}
                showCursor
                cursorCharacter="|"
                cursorClassName="opacity-100 animate-pulse ml-1"
                deletingSpeed={50}
                pauseDuration={3000}
              />
            </span>
          </h1>

          <p className="font-inter-tight text-base md:text-xl text-white/70 mt-5 text-center max-w-xl mx-auto px-4">
            Твой надежный доступ к любым сайтам — быстро, просто и надежно.
          </p>

          <div className="flex justify-center mt-5">
            <Button>Купить от 120₽ в месяц</Button>
          </div>
        </FadeContent>
      </div>
    </section>
  );
};
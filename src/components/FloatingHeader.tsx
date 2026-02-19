'use client';

import Image, { StaticImageData } from 'next/image';
import { Button } from '@/components/Button';
import { useNavigate } from '@/components/NavigationTransition';
import { header as headerConfig, site } from '@/config/site.config';

export interface NavLink {
  label: string;
  href: string;
}

export interface FloatingHeaderProps {
  logo?: StaticImageData | string;
  logoAlt?: string;
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  authMode?: boolean;
}

export function FloatingHeader({
  logo,
  logoAlt  = headerConfig.logoAlt,
  links,
  ctaLabel,
  ctaHref,
  authMode = false,
}: FloatingHeaderProps) {
  const { navigate } = useNavigate();

  const resolvedLinks    = authMode ? [] : (links ?? [...site.navLinks]);
  const resolvedCtaLabel = ctaLabel ?? (authMode ? 'Личный кабинет' : site.ctaLabel);
  const resolvedCtaHref  = ctaHref  ?? (authMode ? '/dashboard'     : site.ctaHref);

  const isExternal = resolvedCtaHref.startsWith('http://') || resolvedCtaHref.startsWith('https://');
  const isAnchor   = resolvedCtaHref.startsWith('#');

  return (
    // Оригинальный отступ сверху top-6 (24px) + горизонтальный px-4.
    // py-* здесь не используем — высота определяется h-16 на <nav> внутри.
    // Управление отступом сверху: headerConfig.stickyOffset в site.config.ts
    <header className={`sticky ${headerConfig.stickyOffset} z-50 mx-auto w-full max-w-4xl ${headerConfig.paddingX}`}>
      {/*
        h-16 — высота пилюли хедера (оригинальный размер с главной страницы).
        Меняй headerConfig.navHeight в site.config.ts.
      */}
      <nav className={`flex ${headerConfig.navHeight} items-center justify-between rounded-xl border border-white/25 bg-black/20 ${headerConfig.navPaddingX} backdrop-blur-md`}>

        {/* Логотип */}
        <button
          onClick={() => navigate('/')}
          className={`flex ${headerConfig.logoHeight} items-center py-2 cursor-pointer`}
        >
          {logo ? (
            <Image
              src={logo}
              alt={logoAlt}
              className="h-full w-auto object-contain"
              priority
            />
          ) : (
            <span className="font-mono text-base font-bold text-white">{logoAlt}</span>
          )}
        </button>

        {/* Навигация */}
        {resolvedLinks.length > 0 && (
          <ul className="hidden items-center gap-1 md:flex font-inter-tight">
            {resolvedLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-1.5 text-[16px] text-white/70 transition-all duration-200 hover:bg-white/15 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <Button
          href={isExternal || isAnchor ? resolvedCtaHref : '#'}
          onClick={
            !isExternal && !isAnchor
              ? (e: React.MouseEvent) => { e.preventDefault(); navigate(resolvedCtaHref); }
              : undefined
          }
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          classname="text-ml py-2 px-6"
        >
          {resolvedCtaLabel}
        </Button>

      </nav>
    </header>
  );
}

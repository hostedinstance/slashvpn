'use client';

import Image, { StaticImageData } from 'next/image';

export interface NavLink {
  label: string;
  href: string;
}

export interface FloatingHeaderProps {
  /** Импортированный логотип (import logo from '@/assets/logo.png') или URL-строка */
  logo?: StaticImageData | string;
  /** Alt текст логотипа */
  logoAlt?: string;
  /** Ссылки навигации */
  links?: NavLink[];
  /** Текст кнопки */
  ctaLabel?: string;
  /** Ссылка кнопки */
  ctaHref?: string;
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Возможности', href: '#features' },
  { label: 'Локации',     href: '#locations' },
  { label: 'FAQ',         href: '#faq'       },
];

export function FloatingHeader({
                                 logo,
                                 logoAlt  = 'Logo',
                                 links    = DEFAULT_LINKS,
                                 ctaLabel = 'Купить',
                                 ctaHref  = 'https://t.me/buyslashvpn_bot',
                               }: FloatingHeaderProps) {
  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-4xl px-4">
      <nav className="flex h-16 items-center justify-between rounded-xl border border-white/25 bg-black/20 px-3 backdrop-blur-md">

        {/* Логотип */}
        <a href="/" className="flex h-14 items-center py-2">
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
        </a>

        {/* Навигация */}
        <ul className="hidden items-center gap-1 md:flex font-inter-tight">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="
                  rounded-lg px-3 py-1.5
                  text-sm text-white/70
                  transition-all duration-200
                  hover:bg-white/15 hover:text-white
                "
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA → Telegram */}
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="
            rounded-lg bg-white px-6 py-2
            text-sm font-semibold text-black
            transition-all duration-200
            hover:bg-white/85 active:scale-95
            font-wix-madefor
            tracking-tight
          "
        >
          {ctaLabel}
        </a>

      </nav>
    </header>
  );
}
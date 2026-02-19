'use client';

import Image, { StaticImageData } from 'next/image';
import { Button } from '@/components/Button';
import { useNavigate } from '@/components/NavigationTransition';
import { header as headerConfig, site } from '@/config/site.config';
import { fonts } from '@/config/theme.config';

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
  /** CSS-класс nav-ссылок. По умолчанию из theme */
  navLinkClassName?: string;
}

export function FloatingHeader({
  logo,
  logoAlt  = headerConfig.logoAlt,
  links,
  ctaLabel,
  ctaHref,
  authMode = false,
  navLinkClassName = `rounded-lg px-3 py-1.5 text-[15px] text-white/55 ${fonts.body} transition-all duration-200 hover:bg-white/10 hover:text-white`,
}: FloatingHeaderProps) {
  const { navigate } = useNavigate();

  const resolvedLinks    = authMode ? [] : (links ?? [...site.navLinks]);
  const resolvedCtaLabel = ctaLabel ?? (authMode ? 'Личный кабинет' : site.ctaLabel);
  const resolvedCtaHref  = ctaHref  ?? (authMode ? '/dashboard'     : site.ctaHref);

  const isExternal = resolvedCtaHref.startsWith('http://') || resolvedCtaHref.startsWith('https://');
  const isAnchor   = resolvedCtaHref.startsWith('#');

  return (
    <header className={`sticky ${headerConfig.stickyOffset} z-50 mx-auto w-full max-w-4xl ${headerConfig.paddingX}`}>
      <nav className={`flex ${headerConfig.navHeight} items-center justify-between rounded-xl border border-white/[0.09] bg-black/25 ${headerConfig.navPaddingX} backdrop-blur-xl`}>

        {/* Логотип */}
        <button
          onClick={() => navigate('/')}
          className={`flex ${headerConfig.logoHeight} items-center py-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-200`}
        >
          {logo ? (
            <Image
              src={logo}
              alt={logoAlt}
              className="h-full w-auto object-contain"
              priority
            />
          ) : (
            <span className={`text-base font-bold text-white ${fonts.heading}`}>{logoAlt}</span>
          )}
        </button>

        {/* Навигация */}
        {resolvedLinks.length > 0 && (
          <ul className="hidden items-center gap-0.5 md:flex">
            {resolvedLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={navLinkClassName}>
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
          classname="text-[14px] py-2 px-5"
        >
          {resolvedCtaLabel}
        </Button>

      </nav>
    </header>
  );
}

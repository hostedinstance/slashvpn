'use client';

import { useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useNavigate } from '@/components/NavigationTransition';
import { header as headerConfig, site } from '@/config/site.config';
import { headerStyles, fonts } from '@/config/theme.config';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';

export interface NavLink {
  label: string;
  href:  string;
}

export interface FloatingHeaderProps {
  logo?:             StaticImageData | string;
  logoAlt?:          string;
  links?:            NavLink[];
  ctaLabel?:         string;
  ctaHref?:          string;
  authMode?:         boolean;
  navLinkClassName?: string;
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
  const navRef       = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const resolvedLinks    = authMode ? [] : (links ?? [...site.navLinks]);
  const resolvedCtaLabel = ctaLabel ?? (authMode ? 'Личный кабинет' : site.ctaLabel);
  const resolvedCtaHref  = ctaHref  ?? (authMode ? '/dashboard'     : site.ctaHref);

  const isExternal = resolvedCtaHref.startsWith('http://') || resolvedCtaHref.startsWith('https://');
  const isAnchor   = resolvedCtaHref.startsWith('#');

  const handleCtaClick = (e: React.MouseEvent) => {
    if (!isExternal && !isAnchor) {
      e.preventDefault();
      setMobileOpen(false);
      navigate(resolvedCtaHref);
    }
  };

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    setMobileOpen(false);
    if (href.startsWith('#')) return;
    e.preventDefault();
    navigate(href);
  };

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { y: -28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  return (
    <header
      className="sticky z-50 w-full flex justify-center"
      style={{ top: headerStyles.stickyTop, pointerEvents: 'none' }}
    >
      <nav
        ref={navRef}
        className="flex items-center gap-0.5"
        style={{
          opacity:              0,
          pointerEvents:        'all',
          height:               headerStyles.navHeight,
          padding:              headerStyles.navPadding,
          borderRadius:         headerStyles.navRadius,
          background:           headerStyles.navBg,
          backdropFilter:       headerStyles.navBackdrop,
          WebkitBackdropFilter: headerStyles.navBackdrop,
          boxShadow:            headerStyles.navShadow,
        }}
      >
        {/* ── Логотип ─────────────────────────────────────────────────── */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center opacity-80 hover:opacity-100 transition-opacity duration-200 shrink-0"
          style={{ height: 20, marginLeft: 6, marginRight: 8 }}
        >
          {logo ? (
            <Image
              src={logo}
              alt={logoAlt}
              className="h-full w-auto object-contain"
              priority
            />
          ) : (
            <span style={{ fontFamily: 'var(--font-inter-tight)', fontWeight: 700, color: '#fff', fontSize: 15 }}>
              {logoAlt}
            </span>
          )}
        </button>

        {/* ── Разделитель logo / links ─────────────────────────────────── */}
        {resolvedLinks.length > 0 && (
          <div
            className="shrink-0 hidden md:block"
            style={{ width: 1, height: 20, background: headerStyles.dividerBg, marginRight: 4 }}
          />
        )}

        {/* ── Навигационные ссылки (десктоп) ──────────────────────────── */}
        {resolvedLinks.length > 0 && (
          <ul className="hidden md:flex items-center gap-0 list-none m-0 p-0">
            {resolvedLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  style={{
                    fontFamily:     'var(--font-inter-tight), sans-serif',
                    fontSize:       13,
                    fontWeight:     500,
                    color:          headerStyles.linkColor,
                    padding:        '7px 13px',
                    borderRadius:   16,
                    letterSpacing:  '-0.01em',
                    transition:     'background 0.15s, color 0.15s',
                    textDecoration: 'none',
                    display:        'inline-block',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = headerStyles.linkHoverBg;
                    el.style.color = headerStyles.linkHoverColor;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = '';
                    el.style.color = headerStyles.linkColor;
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* ── Разделитель links / CTA ──────────────────────────────────── */}
        <div
          className="shrink-0 hidden md:block"
          style={{ width: 1, height: 20, background: headerStyles.dividerBg, marginLeft: 4 }}
        />

        {/* ── CTA кнопка ───────────────────────────────────────────────── */}
        <a
          href={isExternal || isAnchor ? resolvedCtaHref : '#'}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          onClick={handleCtaClick}
          className="shrink-0 flex items-center gap-1.5 rounded-2xl"
          style={{
            fontFamily:     'var(--font-inter-tight), sans-serif',
            fontSize:        13,
            fontWeight:      650,
            letterSpacing:   '-0.01em',
            padding:         '7px 14px 7px 12px',
            marginLeft:      6,
            marginRight:     2,
            color:           '#fff',
            background:      headerStyles.ctaBg,
            boxShadow:       headerStyles.ctaShadow,
            textDecoration:  'none',
            whiteSpace:      'nowrap',
            transition:      headerStyles.ctaTransition,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = headerStyles.ctaHoverBg;
            el.style.boxShadow  = headerStyles.ctaHoverShadow;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = headerStyles.ctaBg;
            el.style.boxShadow  = headerStyles.ctaShadow;
            el.style.transform  = '';
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(0.96)';
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = '';
          }}
        >
          {/* Иконка пользователя */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9, flexShrink: 0 }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          {resolvedCtaLabel}
        </a>

        {/* ── Гамбургер (мобильный) ─────────────────────────────────────── */}
        {resolvedLinks.length > 0 && (
          <button
            className="flex md:hidden items-center justify-center rounded-xl shrink-0 transition-all duration-200"
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              width:      36,
              height:     36,
              marginLeft: 4,
              marginRight: 2,
              color:      'rgba(255,255,255,0.55)',
              background: mobileOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
            }}
            aria-label="Меню"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        )}
      </nav>

      {/* ── Мобильное выпадающее меню ─────────────────────────────────── */}
      {mobileOpen && resolvedLinks.length > 0 && (
        <div
          className="absolute flex flex-col md:hidden"
          style={{
            top:                  60,
            left:                 '50%',
            transform:            'translateX(-50%)',
            minWidth:             220,
            padding:              '6px',
            borderRadius:         18,
            background:           headerStyles.mobileMenuBg,
            backdropFilter:       headerStyles.navBackdrop,
            WebkitBackdropFilter: headerStyles.navBackdrop,
            boxShadow:            headerStyles.mobileMenuShadow,
            pointerEvents: 'all',
          }}
        >
          {resolvedLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              style={{
                fontFamily:     'var(--font-inter-tight), sans-serif',
                fontSize:       14,
                fontWeight:     500,
                color:          headerStyles.mobileLinkColor,
                padding:        '10px 16px',
                borderRadius:   12,
                letterSpacing:  '-0.01em',
                transition:     'background 0.15s, color 0.15s',
                textDecoration: 'none',
                display:        'block',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = headerStyles.mobileLinkHoverBg;
                el.style.color = headerStyles.mobileLinkHoverColor;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = '';
                el.style.color = headerStyles.mobileLinkColor;
              }}
            >
              {link.label}
            </a>
          ))}

          <div style={{ height: 1, background: headerStyles.mobileDivider, margin: '4px 0' }} />

          <a
            href={isExternal || isAnchor ? resolvedCtaHref : '#'}
            onClick={handleCtaClick}
            style={{
              fontFamily:     'var(--font-inter-tight), sans-serif',
              fontSize:       14,
              fontWeight:     650,
              color:          '#fff',
              padding:        '10px 16px',
              borderRadius:   12,
              letterSpacing:  '-0.01em',
              transition:     'background 0.15s',
              textDecoration: 'none',
              display:        'flex',
              alignItems:     'center',
              gap:            6,
              background:     headerStyles.mobileCtaBg,
              boxShadow:      headerStyles.mobileCtaShadow,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = headerStyles.mobileCtaHoverBg;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = headerStyles.mobileCtaBg;
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9, flexShrink: 0 }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {resolvedCtaLabel}
          </a>
        </div>
      )}
    </header>
  );
}

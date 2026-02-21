'use client';

import { useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useNavigate } from '@/components/NavigationTransition';
import { header as headerConfig, site } from '@/config/site.config';
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
      style={{ top: 16, pointerEvents: 'none' }}
    >
      <nav
        ref={navRef}
        className="flex items-center gap-0.5"
        style={{
          opacity:              0,
          pointerEvents:        'all',
          height:               52,
          padding:              '0 6px',
          borderRadius:         26,
          background:           'rgba(0,0,0,0.62)',
          backdropFilter:       'blur(32px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
          boxShadow:
            '0 0 0 1.5px rgba(255,255,255,0.22),' +
            ' 0 8px 32px -8px rgba(0,0,0,0.70),' +
            ' 0 2px 8px -2px rgba(0,0,0,0.40)',
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
            style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.10)', marginRight: 4 }}
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
                    color:          'rgba(255,255,255,0.48)',
                    padding:        '7px 13px',
                    borderRadius:   16,
                    letterSpacing:  '-0.01em',
                    transition:     'background 0.15s, color 0.15s',
                    textDecoration: 'none',
                    display:        'inline-block',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = 'rgba(255,255,255,0.07)';
                    el.style.color = 'rgba(255,255,255,0.90)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = '';
                    el.style.color = 'rgba(255,255,255,0.48)';
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
          style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.10)', marginLeft: 4 }}
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
            background:      'linear-gradient(135deg, rgba(80,120,255,0.90) 0%, rgba(40,80,220,0.95) 100%)',
            boxShadow:
              '0 0 0 1px rgba(100,140,255,0.50),' +
              ' 0 4px 16px -2px rgba(40,80,220,0.55),' +
              ' inset 0 1px 0 rgba(255,255,255,0.18)',
            textDecoration:  'none',
            whiteSpace:      'nowrap',
            transition:      'background 0.18s, box-shadow 0.18s, transform 0.12s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = 'linear-gradient(135deg, rgba(100,145,255,0.95) 0%, rgba(60,105,240,1) 100%)';
            el.style.boxShadow  =
              '0 0 0 1px rgba(120,160,255,0.65),' +
              ' 0 6px 22px -2px rgba(40,80,220,0.70),' +
              ' inset 0 1px 0 rgba(255,255,255,0.22)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = 'linear-gradient(135deg, rgba(80,120,255,0.90) 0%, rgba(40,80,220,0.95) 100%)';
            el.style.boxShadow  =
              '0 0 0 1px rgba(100,140,255,0.50),' +
              ' 0 4px 16px -2px rgba(40,80,220,0.55),' +
              ' inset 0 1px 0 rgba(255,255,255,0.18)';
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
            background:           'rgba(0,0,0,0.80)',
            backdropFilter:       'blur(32px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.09),' +
              ' 0 16px 40px -8px rgba(0,0,0,0.80)',
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
                color:          'rgba(255,255,255,0.58)',
                padding:        '10px 16px',
                borderRadius:   12,
                letterSpacing:  '-0.01em',
                transition:     'background 0.15s, color 0.15s',
                textDecoration: 'none',
                display:        'block',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'rgba(255,255,255,0.07)';
                el.style.color = 'rgba(255,255,255,0.92)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = '';
                el.style.color = 'rgba(255,255,255,0.58)';
              }}
            >
              {link.label}
            </a>
          ))}

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />

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
              background:     'linear-gradient(135deg, rgba(80,120,255,0.90) 0%, rgba(40,80,220,0.95) 100%)',
              boxShadow:      '0 0 0 1px rgba(100,140,255,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(135deg, rgba(100,145,255,0.95) 0%, rgba(60,105,240,1) 100%)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(135deg, rgba(80,120,255,0.90) 0%, rgba(40,80,220,0.95) 100%)';
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

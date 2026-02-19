'use client';

import React from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { fonts } from '@/config/theme.config';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FooterLink {
  title: string;
  href: string;
}

export interface SocialLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export interface FooterSectionProps {
  logo?: StaticImageData | string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  links?: FooterLink[];
  socials?: SocialLink[];
  copyright?: string;
  /** CSS-класс ссылок */
  linkClassName?: string;
}

// ─── FooterSection ────────────────────────────────────────────────────────────

export function FooterSection({
  logo         = '/assets/logotextgrd.png',
  logoAlt      = 'Logo',
  logoWidth    = 283,
  logoHeight   = 51,
  links        = [],
  socials      = [],
  copyright    = `${new Date().getFullYear()} SLASH SOLUTIONS`,
  linkClassName = `${fonts.body} text-sm text-white/35 hover:text-white/80 transition-colors duration-200`,
}: FooterSectionProps) {
  return (
    <footer className="py-16 md:py-28 select-none bg-[#07070f]">
      <div className="mx-auto max-w-5xl px-6">

        {/* Divider */}
        <div className="w-full h-px bg-white/[0.06] mb-12" />

        {/* Логотип */}
        <Link href="#" aria-label="go home" className="mx-auto block size-fit">
          <Image
            src={logo}
            alt={logoAlt}
            width={logoWidth}
            height={logoHeight}
            className="h-9 w-auto opacity-50 hover:opacity-80 transition-opacity duration-300"
          />
        </Link>

        {/* Навигация */}
        {links.length > 0 && (
          <div className="my-8 flex flex-wrap justify-center gap-6">
            {links.map((link, index) => (
              <Link key={index} href={link.href} className={linkClassName}>
                {link.title}
              </Link>
            ))}
          </div>
        )}

        {/* Соцсети */}
        {socials.length > 0 && (
          <div className="my-8 flex flex-wrap justify-center gap-5">
            {socials.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="block opacity-35 hover:opacity-75 transition-opacity duration-200"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        )}

        {/* Политика */}
        <div className="my-4 flex flex-wrap justify-center gap-5">
          {[
            { href: '/privacy', label: 'Политика конфиденциальности' },
            { href: '/terms',   label: 'Условия использования' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className={linkClassName}>
              {label}
            </Link>
          ))}
        </div>

        {/* Копирайт */}
        <p className={`block text-center text-xs mt-6 text-white/25 ${fonts.body}`}>
          © {copyright}
        </p>
      </div>
    </footer>
  );
}

import Image from 'next/image';
import { FooterSection } from '@/components/footer';
import logo from '@/assets/logotextgrd.png';
import { footerConfig } from '@/config/theme.config';

const SOCIALS = [
  {
    href: 'https://t.me/vpnslash',
    label: 'Telegram',
    icon: (
      <svg className="size-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="#ffffff" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0m4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    href: 'https://t.me/buyslashvpn_bot',
    label: 'Telegram Bot',
    icon: (
      <Image
        src="https://img.icons8.com/tiny-bold/48/bot.png"
        alt="Telegram Bot"
        width={48}
        height={48}
        className="size-12"
        style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
      />
    ),
  },
];

export function Footer({ copyright = footerConfig.copyright }: { copyright?: string }) {
  return (
    <FooterSection
      logo={logo}
      logoAlt="SLASH VPN"
      logoWidth={283}
      logoHeight={51}
      socials={SOCIALS}
      copyright={copyright}
    />
  );
}

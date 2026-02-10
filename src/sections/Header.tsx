import { FloatingHeader } from '@/components/FloatingHeader';
import logo from '@/assets/logo.png';

const NAV_LINKS = [
  { label: 'Преимущества', href: '#features' },
  { label: 'Локации',     href: '#locations' },
  { label: 'FAQ',         href: '#faq'       },
];

export function Header() {
  return (
    <FloatingHeader
      logo={logo}
      logoAlt="SlashVPN"
      links={NAV_LINKS}
      ctaLabel="Купить"
      ctaHref="https://t.me/buyslashvpn_bot"
    />
  );
}
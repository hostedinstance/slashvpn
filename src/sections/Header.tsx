import { FloatingHeader } from '@/components/FloatingHeader';
import logo from '@/assets/logo.png';
import { site } from '@/config/site.config';

export function Header() {
  return (
    <FloatingHeader
      logo={logo}
      links={[...site.navLinks]}
      ctaLabel="Личный кабинет"
      ctaHref="/login"
    />
  );
}

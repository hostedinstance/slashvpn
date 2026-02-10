import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

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
  /** Логотип (импортированный файл или URL) */
  logo?: StaticImageData | string;
  /** Alt логотипа */
  logoAlt?: string;
  /** Ширина логотипа в px */
  logoWidth?: number;
  /** Высота логотипа в px */
  logoHeight?: number;
  /** Навигационные ссылки */
  links?: FooterLink[];
  /** Иконки соцсетей */
  socials?: SocialLink[];
  /** Текст копирайта (без ©) */
  copyright?: string;
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
                              }: FooterSectionProps) {
  return (
    <footer className="py-16 md:py-32 font-inter-tight select-none">
      <div className="mx-auto max-w-5xl px-6">

        {/* Логотип */}
        <Link href="#" aria-label="go home" className="mx-auto block size-fit">
          <Image
            src={logo}
            alt={logoAlt}
            width={logoWidth}
            height={logoHeight}
            className="h-10 w-auto"
          />
        </Link>

        {/* Навигация */}
        {links.length > 0 && (
          <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-white block duration-150"
              >
                <span>{link.title}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Соцсети */}
        {socials.length > 0 && (
          <div className="my-8 flex flex-wrap justify-center gap-6 text-sm select-none">
            {socials.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="block opacity-60 transition-opacity hover:opacity-100"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        )}

        {/* Политика и условия */}
        <div className="my-4 flex flex-wrap justify-center gap-4 text-sm">
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-white duration-150"
          >
            Политика конфиденциальности
          </Link>
          <Link
            href="/terms"
            className="text-muted-foreground hover:text-white duration-150"
          >
            Условия использования
          </Link>
        </div>

        {/* Копирайт */}
        <span className="text-muted-foreground block text-center text-sm font-zalando-sans">
          © {copyright}
        </span>

      </div>
    </footer>
  );
}
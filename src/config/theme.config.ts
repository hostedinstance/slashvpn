/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THEME CONFIG — единый источник стиля для ВСЕХ страниц и компонентов
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Принципы:
 *  - Шрифт заголовков:   Wix Madefor Display  → font-wix-madefor
 *  - Шрифт текста/UI:    Inter Tight          → font-inter-tight
 *  - Шрифт TextType Hero: Grifter Bold        → font-grifter-bold
 *  - Цвет фона:          #07070f (canvas)
 *  - Основной акцент:    violet #7c3aed / #8b5cf6
 *  - Отступы секций:     py-24 md:py-32  (desktop ~128px, mobile ~96px)
 *  - Max-width контента: max-w-5xl (960px) или max-w-[1200px]
 */

// ─── Шрифты ──────────────────────────────────────────────────────────────────

export const fonts = {
  /** Заголовки h1-h4 — Wix Madefor Display */
  heading: 'font-wix-madefor',
  /** Текст, параграфы, UI, навигация, формы — Inter Tight */
  body: 'font-inter-tight',
  /** Только TextType в Hero — Grifter Bold */
  hero: 'font-grifter-bold',
} as const;

// ─── Типографика ─────────────────────────────────────────────────────────────

export const type = {
  /** Большой заголовок секции (h2) */
  sectionTitle:
    `text-5xl md:text-6xl tracking-tighter font-medium leading-[1.05] ${fonts.heading}`,
  /** Подзаголовок секции */
  sectionSubtitle:
    `text-base md:text-lg leading-relaxed text-white/55 ${fonts.body}`,
  /** Заголовок карточки/блока */
  cardTitle:
    `text-xl md:text-2xl font-semibold tracking-tight ${fonts.heading}`,
  /** Мелкий текст карточки */
  cardBody:
    `text-sm md:text-base leading-relaxed text-white/60 ${fonts.body}`,
  /** Лейблы форм, хинты */
  label:
    `text-sm font-medium text-white/65 ${fonts.body}`,
  /** Ошибки / капшн */
  caption:
    `text-xs text-white/40 ${fonts.body}`,
  /** Навигация */
  nav:
    `text-[15px] font-medium ${fonts.body}`,
} as const;

// ─── Отступы ─────────────────────────────────────────────────────────────────

export const spacing = {
  /** Вертикальные отступы секций */
  section: 'py-24 md:py-32',
  /** Отступ между заголовком и контентом секции */
  sectionGap: 'mb-12 md:mb-16',
  /** Горизонтальный контейнер страницы */
  container: 'mx-auto max-w-5xl px-6',
  /** Широкий контейнер для Locations, Features */
  containerWide: 'container',
} as const;

// ─── Цвета ───────────────────────────────────────────────────────────────────

export const colors = {
  canvas: '#07070f',
  canvasAlt: '#0a0a14',
  /** Основной акцент — violet */
  accent: '#7c3aed',
  accentLight: '#8b5cf6',
  accentGlow: 'rgba(124,58,237,0.35)',
  /** Рамки */
  border: 'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.18)',
  /** Текст */
  textPrimary: 'rgba(255,255,255,1)',
  textSecondary: 'rgba(255,255,255,0.55)',
  textMuted: 'rgba(255,255,255,0.30)',
} as const;

// ─── Карточки ────────────────────────────────────────────────────────────────

export const card = {
  /** Базовый класс карточки */
  base: 'rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-sm',
  /** С hover-эффектом */
  interactive: 'transition-all duration-300 hover:border-white/15 hover:shadow-depth-m',
} as const;

// ─── Auth-карточка ───────────────────────────────────────────────────────────

export const authCard = {
  className:
    'rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-8 py-8 shadow-depth-l',
} as const;

// ─── Заголовок секции (переиспользуемый блок) ─────────────────────────────────

export interface SectionHeaderConfig {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

// ─── Секция Hero ─────────────────────────────────────────────────────────────

export const heroConfig = {
  titleClassName: `text-center text-6xl md:text-9xl ${fonts.hero} font-medium`,
  subtitleClassName: `${fonts.body} text-base md:text-xl text-white/60 mt-5 text-center max-w-xl mx-auto px-4`,
  ctaLabel: 'Купить от 120₽ в месяц',
  /** TextType строки */
  textTypeWords: ['SLASH VPN', '//slashvpn'] as string[],
} as const;

// ─── Секция Features ─────────────────────────────────────────────────────────

export const featuresConfig = {
  sectionTitle: 'Почему стоит выбрать SlashVPN?',
  sectionSubtitle: 'Мы создали сервис, который не нужно «настраивать» — им нужно просто пользоваться.',
  titleClassName: type.sectionTitle,
  subtitleClassName: type.sectionSubtitle,
} as const;

// ─── Секция FAQ ───────────────────────────────────────────────────────────────

export const faqConfig = {
  sectionTitle: 'Часто задаваемые вопросы',
  sectionSubtitle: 'Ответы на популярные вопросы о нашем сервисе.',
  titleClassName: type.sectionTitle,
  subtitleClassName: type.sectionSubtitle,
} as const;

// ─── Секция Footer ───────────────────────────────────────────────────────────

export const footerConfig = {
  copyright: `${new Date().getFullYear()} SLASH SOLUTIONS`,
  linkClassName: `${fonts.body} text-sm text-white/35 hover:text-white/80 transition-colors duration-200`,
} as const;

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const dashboardTheme = {
  canvas: '#07070f',
  navBackground: 'rgba(12,12,22,0.88)',
  navBorder: 'rgba(255,255,255,0.07)',
  accentActive: 'rgba(139,92,246,0.18)',
  accentActiveText: 'rgba(167,139,250,0.95)',
  accentActiveBorder: 'rgba(139,92,246,0.22)',
} as const;

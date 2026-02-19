/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SITE CONFIG — единое место для всех визуальных настроек
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Общие ───────────────────────────────────────────────────────────────────

export const site = {
  name: 'SlashVPN',
  ctaLabel: 'Войти',
  ctaHref: '/login',
  navLinks: [
    { label: 'Преимущества', href: '#features'  },
    { label: 'Локации',      href: '#locations' },
    { label: 'FAQ',          href: '#faq'       },
  ],
} as const;

// ─── Aurora ──────────────────────────────────────────────────────────────────

export const aurora = {
  home: {
    colorStops:   ['#4800ff', '#000', '#4800ff'] as [string, string, string],
    amplitude:    0.6,
    blend:        0.3,
    speed:        2,
    flipVertical: true,
  },
  login: {
    colorStops: ['#0c4a6e', '#6366f1', '#0e7490'] as [string, string, string],
    amplitude:  1.5,
    blend:      0.7,
    speed:      0.5,
  },
  register: {
    colorStops: ['#1e1b4b', '#7c3aed', '#0ea5e9'] as [string, string, string],
    amplitude:  1.5,
    blend:      0.7,
    speed:      0.5,
  },
  verifyEmail: {
    colorStops: ['#064e3b', '#8b5cf6', '#1e3a5f'] as [string, string, string],
    amplitude:  1.5,
    blend:      0.7,
    speed:      0.4,
  },
} as const;

// ─── Auth card ────────────────────────────────────────────────────────────────
// Styling теперь в AuthPageLayout.tsx через inline style (glassmorphism)
// authCard.className используется только как passthrough для cardClassName prop

export const authCard = {
  padding: 'px-8 py-8',
  /** className передаётся как cardClassName в AuthPageLayout */
  className: '',
} as const;

// ─── AuthPageLayout ───────────────────────────────────────────────────────────

export const authLayout = {
  login: {
    backLabel:  'На главную',
    backHref:   '/',
    footerNote: 'Защищено современным шифрованием.',
  },
  register: {
    backLabel:  'На главную',
    backHref:   '/',
    footerNote: 'Нажимая «Зарегистрироваться», вы соглашаетесь с условиями.',
  },
  verifyEmail: {
    backLabel:  'Изменить email',
    backHref:   '/register',
    footerNote: 'Если письмо не пришло — проверьте папку «Спам».',
  },
} as const;

// ─── Формы ───────────────────────────────────────────────────────────────────

export const forms = {
  login: {
    title:        'Войти',
    subtitle:     'Войдите в свой аккаунт',
    submitLabel:  'Войти',
    loadingLabel: 'Вход...',
    redirectTo:   '/dashboard',
    registerHref: '/register',
  },
  register: {
    title:        'Регистрация',
    subtitle:     'Создайте аккаунт для доступа к сервису',
    submitLabel:  'Зарегистрироваться',
    loadingLabel: 'Регистрация...',
    redirectTo:   '/verify-email',
    loginHref:    '/login',
  },
  verifyEmail: {
    title:        'Проверьте почту',
    subtitle:     'Мы отправили код верификации на',
    submitLabel:  'Подтвердить',
    loadingLabel: 'Проверка...',
    redirectTo:   '/dashboard',
  },
} as const;

// ─── FloatingHeader ───────────────────────────────────────────────────────────

export const header = {
  logoAlt:      'SlashVPN',
  stickyOffset: 'top-5',
  paddingX:     'px-4',
  navHeight:    'h-14',
  navPaddingX:  'px-3',
  logoHeight:   'h-12',
} as const;

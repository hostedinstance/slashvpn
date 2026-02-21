/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THEME CONFIG — единый источник стиля и контента для ВСЕХ компонентов
 * Правило: любое изменение дизайна, текста, цвета — только здесь.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Шрифты ──────────────────────────────────────────────────────────────────

export const fonts = {
  heading: 'font-wix-madefor',
  body:    'font-inter-tight',
  hero:    'font-grifter-bold',
} as const;

// ─── Типографика ─────────────────────────────────────────────────────────────

export const type = {
  sectionTitle:
    `text-5xl md:text-6xl tracking-tighter font-medium leading-[1.05] ${fonts.heading}`,
  sectionSubtitle:
    `text-base md:text-lg leading-relaxed text-white/55 ${fonts.body}`,
  cardTitle:
    `text-xl md:text-2xl font-semibold tracking-tight ${fonts.heading}`,
  cardBody:
    `text-sm md:text-base leading-relaxed text-white/60 ${fonts.body}`,
  label:
    `text-sm font-medium text-white/65 ${fonts.body}`,
  caption:
    `text-xs text-white/40 ${fonts.body}`,
  nav:
    `text-[15px] font-medium ${fonts.body}`,
} as const;

// ─── Отступы ─────────────────────────────────────────────────────────────────

export const spacing = {
  section:       'py-24 md:py-32',
  sectionGap:    'mb-12 md:mb-16',
  container:     'mx-auto max-w-5xl px-6',
  containerWide: 'container',
} as const;

// ─── Цветовая палитра ─────────────────────────────────────────────────────────

export const palette = {
  sectionBg:           '#000',
  dashboardBg:         '#00092B',
  authBg:              'rgba(0,9,43,0.52)',

  accent:              'rgba(100,160,255,0.90)',
  accentGlow:          'rgba(64,128,255,0.18)',

  cardBg:              'rgba(1,14,56,0.82)',
  cardBgHover:         'rgba(1,20,74,0.95)',
  cardBgOpen:          'rgba(1,20,74,0.9)',
  cardRaised:          'rgba(1,14,56,0.95)',

  borderCard:          'rgba(100,140,255,0.09)',
  borderCardHover:     'rgba(140,170,255,0.22)',
  borderCardOpen:      'rgba(100,140,255,0.14)',
  borderDivider:       'rgba(100,140,255,0.07)',
  borderNav:           'rgba(255,255,255,0.10)',

  textPrimary:         'rgba(230,238,255,0.96)',
  textSecondary:       'rgba(180,205,255,0.50)',
  textSubtle:          'rgba(200,215,255,0.55)',
  textMuted:           'rgba(140,175,255,0.28)',
  textAccordionClosed: 'rgba(180,205,255,0.65)',

  gradientText:        'linear-gradient(135deg,#ffffff 0%,rgba(100,160,255,0.95) 100%)',
  linkColor:           'rgba(100,160,255,0.90)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

export const heroConfig = {
  // Заголовок с анимацией набора текста
  titleWords:        ['SLASH VPN', '//slashvpn'] as string[],
  titleClassName:    `text-center leading-none ${fonts.hero} mb-8 text-white whitespace-nowrap`,
  titleFontSize:     'clamp(2.4rem, 10.5vw, 7rem)',

  // Бейдж над заголовком
  badgeText:         'SlashVPN — 2026',

  // Подзаголовок
  subtitleText:      'Твой надёжный доступ к любым сайтам — быстро, просто и надёжно.',
  subtitleClassName: `${fonts.body} text-base md:text-xl text-center max-w-xl mx-auto leading-relaxed mb-10`,

  // CTA кнопка
  ctaLabel:          'Купить от 120₽ в месяц',
  ctaHref:           'https://t.me/buyslashvpn_bot',

  // Блоки доверия под кнопкой (icon — ключ для маппинга в компоненте)
  trustItems: [
    { icon: 'Eye',   text: 'Никто не следит за тобой' },
    { icon: 'Wifi',  text: 'Скорость без потерь'       },
    { icon: 'Globe', text: 'Доступ к любым сайтам'     },
  ] as Array<{ icon: string; text: string }>,

  // Prism (WebGL фон)
  prism: {
    height:        1.5,
    baseWidth:     3,
    animationType: 'rotate' as const,
    glow:          0.6,
    noise:         0,
    scaleMobile:   1,
    scaleDesktop:  3.7,
    hoverStrength: 0.5,
    bloom:         1,
    timeScale:     0.3,
    colorFrequency:0.1,
  },
} as const;

export const heroStyles = {
  prismColor:      '#4800ff',

  vignetteTop:     'linear-gradient(to bottom, rgba(0,0,0,0.80), transparent)',
  vignetteRadial:  'radial-gradient(ellipse 90% 70% at 50% 45%, transparent 25%, rgba(0,0,0,0.50) 100%)',
  vignetteBottom:  'linear-gradient(to top, #000 0%, rgba(0,0,0,0.85) 40%, transparent 100%)',

  badgeBg:         'rgba(1,14,56,0.85)',
  badgeBorder:     'rgba(100,140,255,0.20)',
  badgeTextColor:  'rgba(200,215,255,0.60)',
  badgeDot:        'rgba(100,160,255,0.90)',

  subtitleColor:   'rgba(200,215,255,0.55)',

  trustIconBg:     'rgba(1,14,56,0.9)',
  trustIconBorder: 'rgba(100,140,255,0.25)',
  trustIconColor:  'rgba(100,160,255,0.90)',
  trustTextColor:  'rgba(200,215,255,0.55)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────────────────────────────────────────

export const featuresConfig = {
  // Заголовок секции
  headingText:         'Всё что нужно —',
  headingGradientText: 'ничего лишнего',
  subtitleText:        'SlashVPN создан с одной целью — дать тебе свободу в интернете без технических сложностей.',

  // Карточки фич — вся редактируемая информация здесь
  items: [
    {
      id:          'access',
      icon:        'Globe',
      label:       'Доступ',
      title:       'Открывай любые сайты',
      description: 'Instagram, YouTube, Spotify, зарубежные сервисы — всё открывается одним нажатием. Никаких ограничений, никаких блокировок.',
      stat:        '190+',
      statLabel:   'стран',
      isLarge:     true,
      accentColor: 'rgba(100, 160, 255, 0.90)',
      glowColor:   'rgba(64, 128, 255, 0.18)',
    },
    {
      id:          'speed',
      icon:        'Zap',
      label:       'Скорость',
      title:       'Скорость не падает',
      description: '4K-видео и онлайн-игры без лагов. Наши серверы оптимизированы для максимальной пропускной способности.',
      stat:        '1 Гбит/с',
      statLabel:   'канал',
      isLarge:     false,
      accentColor: 'rgba(250, 200, 80, 0.90)',
      glowColor:   'rgba(250, 180, 40, 0.14)',
    },
    {
      id:          'privacy',
      icon:        'ShieldOff',
      label:       'Приватность',
      title:       'Никто не следит',
      description: 'Строгая политика no-logs. Мы физически не можем передать твои данные — мы их не храним.',
      stat:        '0 логов',
      statLabel:   'гарантировано',
      isLarge:     false,
      accentColor: 'rgba(80, 220, 160, 0.90)',
      glowColor:   'rgba(50, 200, 130, 0.14)',
    },
    {
      id:          'devices',
      icon:        'Smartphone',
      label:       'Устройства',
      title:       'Работает везде',
      description: 'iPhone, Android, Windows, macOS — подключай до 5 устройств одновременно с одной подпиской. Один аккаунт для всей семьи.',
      stat:        '5',
      statLabel:   'устройств одновременно',
      isLarge:     true,
      accentColor: 'rgba(180, 120, 255, 0.90)',
      glowColor:   'rgba(150, 80, 255, 0.14)',
    },
  ] as Array<{
    id: string; icon: string; label: string; title: string; description: string;
    stat?: string; statLabel?: string; isLarge: boolean;
    accentColor: string; glowColor: string;
  }>,
} as const;

export const featuresStyles = {
  sectionPadding:      'py-28 md:py-40',
  container:           'max-w-6xl mx-auto px-6 md:px-12',
  headerGap:           'mb-16 md:mb-24',

  cardBg:              'rgba(1,14,56,0.82)',
  cardBgHover:         'rgba(1,20,74,0.95)',
  cardBorder:          'rgba(100,140,255,0.09)',
  cardBorderHover:     'rgba(140,170,255,0.22)',
  iconBg:              'rgba(1,14,56,0.95)',
  cardTransition:      'background 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease',

  descriptionColor:    'rgba(180,205,255,0.50)',
  statLabelColor:      'rgba(180,205,255,0.38)',
  statDivider:         'rgba(100,140,255,0.07)',

  headingGradient:     'linear-gradient(135deg,#ffffff 0%,rgba(100,160,255,0.95) 100%)',
  subtitleColor:       'rgba(180,205,255,0.50)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────

export const faqConfig = {
  // Левая колонка — заголовок
  headingText:         'Часто задаваемые',
  headingGradientWord: 'вопросы',
  subtitlePrefix:      'Не нашёл ответа?',
  subtitleLinkText:    'Напиши нам в Telegram',
  supportHref:         'https://t.me/vpnslash',
  subtitleSuffix:      '— ответим за пару минут.',

  // Вопросы и ответы
  items: [
    {
      id:      'faq-1',
      title:   'Как SlashVPN влияет на скорость?',
      content: 'В большинстве случаев ты даже не заметишь разницы. Мы используем быстрые протоколы, так что 4K-видео и онлайн-игры работают без лагов. Чем ближе к тебе сервер — тем выше скорость.',
    },
    {
      id:      'faq-2',
      title:   'Вы следите за тем, что я делаю?',
      content: 'Нет. Мы вообще не знаем что ты делаешь в интернете — и знать не хотим. Никаких логов, никакой истории соединений. Всё что ты делаешь онлайн — только твоё дело.',
    },
    {
      id:      'faq-3',
      title:   'Что делать если VPN не подключается?',
      content: 'Попробуй сменить сервер (страну) прямо в приложении. Если не помогло — напиши нам в Telegram, поддержка работает 24/7 и отвечает быстро.',
    },
    {
      id:      'faq-4',
      title:   'Можно вернуть деньги если не понравится?',
      content: 'Да, в течение 3 дней с момента покупки — без вопросов. Мы уверены в качестве, поэтому рисков нет.',
    },
  ] as Array<{ id: string; title: string; content: string }>,
} as const;

export const faqStyles = {
  sectionPadding:      'py-28 md:py-40',
  container:           'max-w-6xl mx-auto px-6 md:px-12',

  cardBg:              'rgba(1,14,56,0.85)',
  cardBgOpen:          'rgba(1,20,74,0.9)',
  cardBorder:          'rgba(100,140,255,0.08)',
  cardBorderOpen:      'rgba(100,140,255,0.14)',
  cardTransition:      'background 0.2s ease, border-color 0.2s ease',

  titleColorOpen:      'rgba(230,238,255,0.96)',
  titleColorClosed:    'rgba(180,205,255,0.65)',

  plusBgOpen:          'rgba(1,20,74,0.95)',
  plusBgClosed:        'rgba(100,140,255,0.10)',
  plusColorOpen:       '#fff',
  plusColorClosed:     'rgba(140,175,255,0.5)',

  divider:             'rgba(100,140,255,0.08)',
  bodyTextColor:       'rgba(180,205,255,0.50)',

  sectionHeadingColor: 'rgba(230,238,255,0.96)',
  headingGradient:     'linear-gradient(135deg,#ffffff 0%,rgba(100,160,255,0.95) 100%)',
  subtitleColor:       'rgba(180,205,255,0.50)',
  linkColor:           'rgba(100,160,255,0.90)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING HEADER
// ─────────────────────────────────────────────────────────────────────────────

export const headerStyles = {
  stickyTop:           16,
  navHeight:           52,
  navPadding:          '0 10px',
  navRadius:           26,
  navBg:               'rgba(0,0,0,0.62)',
  navBackdrop:         'blur(20px)',
  navShadow:
    '0 0 0 1.5px rgba(255,255,255,0.22),' +
    ' 0 8px 32px -8px rgba(0,0,0,0.70),' +
    ' 0 2px 8px -2px rgba(0,0,0,0.40)',

  linkColor:           'rgba(255,255,255,0.48)',
  linkHoverBg:         'rgba(255,255,255,0.07)',
  linkHoverColor:      'rgba(255,255,255,0.90)',

  dividerBg:           'rgba(255,255,255,0.10)',

  ctaBg:
    'linear-gradient(135deg, rgba(80,120,255,0.90) 0%, rgba(40,80,220,0.95) 100%)',
  ctaShadow:
    '0 0 0 1px rgba(100,140,255,0.50),' +
    ' 0 4px 16px -2px rgba(40,80,220,0.55),' +
    ' inset 0 1px 0 rgba(255,255,255,0.18)',
  ctaHoverBg:
    'linear-gradient(135deg, rgba(100,145,255,0.95) 0%, rgba(60,105,240,1) 100%)',
  ctaHoverShadow:
    '0 0 0 1px rgba(120,160,255,0.65),' +
    ' 0 6px 22px -2px rgba(40,80,220,0.70),' +
    ' inset 0 1px 0 rgba(255,255,255,0.22)',
  ctaTransition:       'background 0.18s, box-shadow 0.18s, transform 0.12s',

  mobileMenuBg:        'rgba(0,0,0,0.80)',
  mobileMenuShadow:
    '0 0 0 1px rgba(255,255,255,0.09),' +
    ' 0 16px 40px -8px rgba(0,0,0,0.80)',
  mobileLinkColor:     'rgba(255,255,255,0.58)',
  mobileLinkHoverBg:   'rgba(255,255,255,0.07)',
  mobileLinkHoverColor:'rgba(255,255,255,0.92)',
  mobileDivider:       'rgba(255,255,255,0.07)',
  mobileCtaBg:
    'linear-gradient(135deg, rgba(80,120,255,0.90) 0%, rgba(40,80,220,0.95) 100%)',
  mobileCtaShadow:     '0 0 0 1px rgba(100,140,255,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
  mobileCtaHoverBg:
    'linear-gradient(135deg, rgba(100,145,255,0.95) 0%, rgba(60,105,240,1) 100%)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────

export const authStyles = {
  navBg:               'rgba(0,9,43,0.78)',
  navBackdrop:         'blur(20px)',
  navShadow:           '0 0 0 1px rgba(100,140,255,0.13), 0 8px 32px -8px rgba(0,0,0,0.50)',
  navDivider:          'rgba(100,140,255,0.15)',

  backBtnColor:        'rgba(180,205,255,0.55)',
  backBtnHoverBg:      'rgba(100,140,255,0.10)',
  backBtnHoverColor:   'rgba(210,228,255,0.90)',

  cardRadius:          22,
  cardBorder:          'rgba(100,140,255,0.13)',
  cardBg:              'rgba(0,9,43,0.52)',
  cardBackdrop:        'blur(24px)',
  cardShadow:
    '0 24px 64px -12px rgba(0,0,0,0.65),' +
    ' inset 0 1px 0 rgba(100,140,255,0.10)',
  cardPadding:         '2.25rem 2rem',
  cardMaxWidth:        448,

  footerNoteColor:     'rgba(140,175,255,0.28)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

export const dashboardStyles = {
  pageBg:              '#00092B',
  navWrapperPadding:   '16px 24px 0',
  navHeight:           52,
  navPadding:          '0 8px',
  navRadius:           26,
  navBg:               'rgba(0,9,43,0.92)',
  navBackdrop:         'blur(16px)',
  navShadow:
    '0 0 0 1px rgba(255,255,255,0.07),' +
    ' 0 8px 32px -8px rgba(0,0,0,0.6),' +
    ' 0 2px 8px -2px rgba(0,0,0,0.4)',
  divider:             'rgba(255,255,255,0.08)',

  tabActiveBg:         'rgba(1,20,74,0.95)',
  tabActiveColor:      'rgba(100,160,255,0.95)',
  tabActiveShadow:     '0 0 0 1px rgba(100,140,255,0.30)',
  tabColor:            'rgba(255,255,255,0.38)',
  tabHoverBg:          'rgba(255,255,255,0.06)',
  tabHoverColor:       'rgba(255,255,255,0.65)',

  proBadgeBg:          'rgba(251,191,36,0.12)',
  proBadgeColor:       '#fbbf24',
  freeBadgeBg:         'rgba(249,115,22,0.18)',
  freeBadgeColor:      '#fb923c',
  freeBadgeShadow:     '0 0 10px rgba(249,115,22,0.2)',

  avatarBg:            'linear-gradient(145deg, rgba(1,20,74,0.98), rgba(20,60,160,0.90))',
  avatarShadow:        '0 0 10px rgba(100,140,255,0.22)',

  logoutColor:         'rgba(255,255,255,0.25)',
  logoutHoverBg:       'rgba(255,255,255,0.06)',
  logoutHoverColor:    'rgba(255,255,255,0.55)',

  contentMaxWidth:     960,
  contentPadding:      '40px 24px 80px',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// LOCATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const locationsStyles = {
  headingText:         'Локации, которые',
  headingGradientText: 'не подводят',
  subtitle:            'Подключайтесь к серверам по всему миру с максимальной скоростью.',
  headingGradient:     'linear-gradient(135deg,#ffffff 0%,rgba(100,160,255,0.95) 100%)',

  headerConfig: {
    title:             'Локации, которые не подводят',
    titleSizeMobile:   '2.5rem',
    titleSizeDesktop:  '3.5rem',
    subtitleSize:      '1rem',
    titleColor:        '#ffffff',
    subtitleColor:     'rgba(180,205,255,0.50)',
    subtitleMaxWidth:  '48rem',
    marginBottom:      72,
    titleFont:         'font-wix-madefor font-bold tracking-tight',
    subtitleFont:      'font-inter-tight',
  },

  activeRowConfig:    { duration: 25, direction: 'left-to-right' as const, gap: 32, paddingY: 20 },

  activeCardStyle: {
    background:        'linear-gradient(to bottom right,rgba(1,20,74,0.85),rgba(1,14,56,0.60))',
    borderColor:       'rgba(100,140,255,0.14)',
    borderColorHover:  'rgba(100,160,255,0.45)',
    boxShadow:         '0 0 0 transparent',
    borderRadius:      '1rem',
    minWidth:          220,
    padding:           '1.25rem 2.5rem',
    hoverScale:        1.04,
    flagSize:          '3.5rem',
    flagDropShadow:    'drop-shadow(0 0 10px rgba(100,160,255,0.20))',
    nameTextSize:      '1.1rem',
    statusTextSize:    '0.875rem',
    statusColor:       'rgb(52,211,153)',
    indicatorSize:     '0.4rem',
    nameFont:          'font-wix-madefor font-semibold tracking-tight',
    statusFont:        'font-inter-tight',
  },

  upcomingRowConfig:  { duration: 35, direction: 'right-to-left' as const, gap: 28, paddingY: 20 },

  upcomingCardStyle: {
    background:        'rgba(1,14,56,0.40)',
    borderColor:       'rgba(100,140,255,0.09)',
    borderStyle:       'dashed' as const,
    borderWidth:       2,
    borderRadius:      '1rem',
    minWidth:          220,
    padding:           '1.25rem 2.5rem',
    opacity:           0.3,
    hoverOpacity:      0.65,
    grayscale:         true,
    flagSize:          '3.5rem',
    nameTextSize:      '1.1rem',
    statusTextSize:    '0.875rem',
    statusColor:       'rgba(180,205,255,0.35)',
    nameFont:          'font-wix-madefor tracking-tight',
    statusFont:        'font-inter-tight',
  },

  sectionConfig: {
    paddingYMobile:    90,
    paddingYDesktop:   140,
    maskGradient:      'linear-gradient(to right,transparent,#000 20%,#000 80%,transparent)',
  },

  footerLinkConfig: {
    questionText:      'Не нашли подходящий сервер?',
    linkText:          'Предложить локацию',
    linkUrl:           'https://t.me/+Zmo74XmjyRdmMmJi',
    linkVariant:       'underline-grow' as const,
    questionColor:     'rgba(180,205,255,0.45)',
    linkColor:         'rgba(100,160,255,0.90)',
    questionSize:      '1rem',
    linkSize:          '1rem',
    font:              'font-inter-tight',
    marginTop:         56,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// AURORA FOOTER
// ─────────────────────────────────────────────────────────────────────────────

export const auroraFooterConfig = {
  // WebGL Aurora параметры
  aurora: {
    colorStops:  ['#0f2ecc', '#000', '#0f2ecc'] as [string, string, string],
    amplitude:   0.8,
    blend:       0.30,
    speed:       1.8,
  },

  // Логотип
  logoOpacity:      0.50,
  logoHoverOpacity: 0.85,
  logoWidth:        220,
  logoHeight:       40,

  // Социальные сети
  socials: [
    { href: 'https://t.me/vpnslash',        label: 'Telegram канал', icon: 'telegram'  },
    { href: 'https://t.me/buyslashvpn_bot', label: 'Telegram бот',  icon: 'bot'       },
  ] as Array<{ href: string; label: string; icon: string }>,

  // Юридические ссылки
  legalLinks: [
    { href: '/privacy', label: 'Политика конфиденциальности' },
    { href: '/terms',   label: 'Условия использования'       },
  ] as Array<{ href: string; label: string }>,

  // Цвета
  socialColor:      'rgba(255,255,255,0.30)',
  socialHoverColor: 'rgba(255,255,255,0.80)',
  legalColor:       'rgba(180,205,255,0.28)',
  legalHoverColor:  'rgba(200,215,255,0.70)',
  copyrightColor:   'rgba(140,175,255,0.20)',
  copyrightText:    'SLASH SOLUTIONS',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER (простой, не Aurora)
// ─────────────────────────────────────────────────────────────────────────────

export const footerConfig = {
  copyright:    `${new Date().getFullYear()} SLASH SOLUTIONS`,
  linkClassName:`${fonts.body} text-sm text-white/35 hover:text-white/80 transition-colors duration-200`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Устаревшие алиасы — оставлены для обратной совместимости с dashboard картами
// ─────────────────────────────────────────────────────────────────────────────

export const colors = {
  canvas:       '#07070f',
  canvasAlt:    '#0a0a14',
  accent:       '#7c3aed',
  accentLight:  '#8b5cf6',
  accentGlow:   'rgba(124,58,237,0.35)',
  border:       'rgba(255,255,255,0.08)',
  borderHover:  'rgba(255,255,255,0.18)',
  textPrimary:  'rgba(255,255,255,1)',
  textSecondary:'rgba(255,255,255,0.55)',
  textMuted:    'rgba(255,255,255,0.30)',
} as const;

export const card = {
  base:        'rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-sm',
  interactive: 'transition-all duration-300 hover:border-white/15 hover:shadow-depth-m',
} as const;

export const dashboardTheme = {
  canvas:             '#07070f',
  navBackground:      'rgba(12,12,22,0.88)',
  navBorder:          'rgba(255,255,255,0.07)',
  accentActive:       'rgba(139,92,246,0.18)',
  accentActiveText:   'rgba(167,139,250,0.95)',
  accentActiveBorder: 'rgba(139,92,246,0.22)',
} as const;

export const authCard = {
  className:
    'rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-8 py-8 shadow-depth-l',
} as const;

export interface SectionHeaderConfig {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

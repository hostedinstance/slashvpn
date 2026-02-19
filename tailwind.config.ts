import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // ── TYPOGRAPHY ────────────────────────────────────────────────────────
      fontFamily: {
        'wix-madefor': ['Wix Madefor Display', 'sans-serif'],
        'inter-tight':  ['Inter Tight', 'sans-serif'],
        'grifter-bold': ['Grifter Bold', 'sans-serif'],
      },

      // ── NAVY PALETTE from #00092B ─────────────────────────────────────────
      colors: {
        navy: {
          base:    '#00092B',   // page bg
          card:    '#010E38',   // card bg
          raised:  '#01144A',   // elevated card
          overlay: '#021660',   // modal/high elevation
          border:  'rgba(100,140,255,0.08)',
          hover:   'rgba(140,170,255,0.14)',
        },
        accent: {
          DEFAULT:  '#6B2EFF',
          dim:      '#4A1FBE',
          glow:     'rgba(107,46,255,0.30)',
          subtle:   'rgba(107,46,255,0.10)',
        },
        ink: {
          primary:   'rgba(230,238,255,0.96)',
          secondary: 'rgba(180,205,255,0.55)',
          tertiary:  'rgba(140,175,255,0.28)',
        },
      },

      // ── SPACING ───────────────────────────────────────────────────────────
      spacing: {
        '18':  '4.5rem',
        '22':  '5.5rem',
        '26':  '6.5rem',
        '30':  '7.5rem',
        '34':  '8.5rem',
        '38':  '9.5rem',
        '42':  '10.5rem',
        '46':  '11.5rem',
        '50':  '12.5rem',
        '54':  '13.5rem',
        '58':  '14.5rem',
        '62':  '15.5rem',
        '68':  '17rem',
        '72':  '18rem',
        '80':  '20rem',
        '88':  '22rem',
        '96':  '24rem',
        '104': '26rem',
        '112': '28rem',
        '120': '30rem',
        '128': '32rem',
      },

      // ── BORDER RADIUS ─────────────────────────────────────────────────────
      borderRadius: {
        'squircle': '32px',
        'squircle-sm': '20px',
        'squircle-xs': '14px',
      },

      // ── SHADOWS ───────────────────────────────────────────────────────────
      boxShadow: {
        'soft':      '0 2px 40px rgba(0,0,0,0.5)',
        'glow-sm':   '0 0 24px rgba(107,46,255,0.2)',
        'glow':      '0 0 60px rgba(107,46,255,0.3)',
        'glow-lg':   '0 0 120px rgba(107,46,255,0.35)',
        'inner-top': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },

      // ── TYPOGRAPHY SCALE ──────────────────────────────────────────────────
      fontSize: {
        'display-xl': ['clamp(3.5rem, 8vw, 8rem)',   { lineHeight: '1.0', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(3rem, 6vw, 6rem)',      { lineHeight: '1.05', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(2rem, 4vw, 3.5rem)',    { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'body-lg':    ['1.125rem', { lineHeight: '1.7' }],
        'body-md':    ['1rem',     { lineHeight: '1.7' }],
        'body-sm':    ['0.875rem', { lineHeight: '1.6' }],
        'label':      ['0.75rem',  { lineHeight: '1', letterSpacing: '0.1em' }],
      },

      // ── ANIMATION ─────────────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'orbit': {
          '0%':   { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.4' },
          '50%':      { transform: 'scale(1.15)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':    'fade-in 0.6s ease-out forwards',
        'shimmer':    'shimmer 4s linear infinite',
        'orbit':      'orbit 8s linear infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        'float':      'float 6s ease-in-out infinite',
      },

      // ── BACKDROP ──────────────────────────────────────────────────────────
      backdropBlur: {
        'xs': '4px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
};

export default config;

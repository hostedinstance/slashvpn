# SlashVPN — Radical Redesign 2026
## Architecture Map

```
src/
├── app/
│   ├── layout.tsx            # Root layout (fonts, metadata, body)
│   └── page.tsx              # Main page — Server Component, assembles sections
│
├── sections/                 # Page sections (one per visual block)
│   ├── Header.tsx            # 'use client' — sticky nav, mobile menu, scroll detection
│   ├── Hero.tsx              # 'use client' — typewriter, parallax scroll, ambient orbs
│   ├── Features.tsx          # 'use client' — bento grid, scroll-triggered reveals
│   ├── Locations.tsx         # 'use client' — server cards, globe decor
│   ├── FAQ.tsx               # 'use client' — animated accordion, sticky header
│   └── Footer.tsx            # Server Component — links, social, CTA card
│
├── components/
│   └── ui/                   # Atomic design primitives
│       ├── Button.tsx        # 'use client' — 4 variants, 4 sizes, motion press
│       └── Card.tsx          # 'use client' — 4 variants, optional hover lift
│
└── styles/
    └── globals.css           # Font imports, CSS variables, base reset
```

---

## Design System

### Color Palette — Monochrome + 1 Accent

| Token              | Value                      | Usage                        |
|--------------------|----------------------------|------------------------------|
| `surface.void`     | `#030305`                  | Deepest background, Hero     |
| `surface.deep`     | `#07070f`                  | Primary page background      |
| `surface.raised`   | `#0d0d1a`                  | Cards, panels                |
| `surface.overlay`  | `#12121f`                  | Elevated cards, nav bg       |
| `surface.border`   | `rgba(255,255,255,0.06)`   | Dividers, hairlines          |
| `accent`           | `#6B2EFF`                  | CTAs, highlights, icons      |
| `accent.glow`      | `rgba(107,46,255,0.35)`    | Box shadows, orbs            |
| `accent.subtle`    | `rgba(107,46,255,0.12)`    | Tinted backgrounds           |
| `ink.primary`      | `rgba(255,255,255,0.95)`   | Headings, body text          |
| `ink.secondary`    | `rgba(255,255,255,0.55)`   | Descriptions, nav links      |
| `ink.tertiary`     | `rgba(255,255,255,0.28)`   | Labels, captions             |

### Typography

| Role    | Font                 | Sizes                              |
|---------|----------------------|------------------------------------|
| Display | Wix Madefor Display  | `display-xl` → `display-sm`       |
| UI/Body | Inter Tight          | `body-lg`, `body-md`, `body-sm`   |
| Label   | Inter Tight          | `label` (0.75rem, tracking-widest) |

### Spacing Philosophy
- **Extreme negative space**: sections use `py-32 md:py-44` (128–176px)
- **Card breathing room**: `p-8` to `p-14`
- **Gap rhythm**: `gap-3` → `gap-6` → `gap-16` → `gap-24`

### Radius System
- `rounded-full` — buttons, pills, tags
- `rounded-squircle` (32px) — major cards
- `rounded-squircle-sm` (20px) — inner cards, items
- `rounded-squircle-xs` (14px) — icons, small badges

---

## UX Rationale

### Why these components convert better

**Hero**
- Typewriter effect focuses attention on the core value props sequentially, preventing cognitive overload
- Stat pills below CTA reduce purchase anxiety with social proof numbers
- Trust badges (AES-256, WireGuard) address the "is this legit?" objection before it forms
- Single primary CTA with ghost secondary eliminates decision paralysis

**Features (Bento Grid)**
- The large first card (Speed) anchors the layout — it's the #1 VPN concern
- Asymmetric grid creates visual hierarchy naturally, the eye flows left→right, large→small
- Hover glows make the grid feel alive and explorable without animations that fatigue

**Locations**
- Two-column layout: left = actionable list (with live ping), right = spatial context (globe)
- Ping values (32ms, 38ms) are specific and credible — far more persuasive than generic "fast"
- Upcoming countries with dimmed opacity create FOMO and signal a growing product

**FAQ (Sticky Header)**
- Sticky left column keeps the section label visible — users always know where they are
- First item pre-opened reduces interaction cost; answer is already visible
- The "write us" link redirects friction: if FAQ doesn't help, conversion path is one tap away

**Button Variants**
- `primary` — accent + glow, for main CTAs
- `secondary` — raised surface, for secondary actions
- `ghost` — transparent, for nav/alternative actions
- `outline` — ringed, for forms and subtle contexts
- All variants: `whileTap scale(0.98)` gives physical click feedback

**Zero Border Policy**
- Separation achieved through background tone steps (`void` → `deep` → `raised`)
- Top hairlines via `bg-gradient-to-r from-transparent via-white/8 to-transparent`
- Borders feel heavy and dated; tonal steps feel premium and modern (cf. Apple.com 2025)

---

## Performance Notes

- `page.tsx` is a **Server Component** — no JS shipped for the shell
- `Header`, `Hero`, `Features`, `Locations`, `FAQ` use `'use client'` only where interactivity is required
- `Footer` is a **Server Component** — static links, zero JS
- Framer Motion tree-shaken by Next.js bundler — only used features shipped
- Fonts loaded via Google Fonts with `display=swap` — no FOIT
- `useInView` with `once: true` — animations fire once, no continuous scroll listeners
- `layoutId` reserved for future page transitions (pricing modal, etc.)

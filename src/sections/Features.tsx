'use client';

import { useEffect, useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import { Globe, Zap, ShieldOff, type LucideIcon } from 'lucide-react';
import myPhoto from '@/assets/Background.png';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FeatureItem {
  id:          string;
  icon:        LucideIcon;
  title:       string;
  description: string;
  isLarge?:    boolean;
  // ── ФОТО: передай сюда импортированный файл или URL ──────────────────────
  image?:      string | StaticImageData;
  imageAlt?:   string;
}

// ── ВОТ ГДЕ МЕНЯТЬ КОНТЕНТ И ВСТАВЛЯТЬ ФОТО ──────────────────────────────────
//
//  ШАГ 1: Импортируй картинку сверху файла (после строки import { Globe, Zap... }):
//    import myPhoto from '@/assets/product-image.png';
//
//  ШАГ 2: Раскомментируй строки image/imageAlt в нужной карточке ниже.
//  Фото растянется на ВЕСЬ блок карточки, текст будет поверх снизу.
//
//  Можно и URL: image: 'https://example.com/photo.jpg'
//
// ─────────────────────────────────────────────────────────────────────────────

const FEATURES: FeatureItem[] = [
  {
    id: 'access',
    icon: Globe,
    title: 'Открывай любые сайты',
    description: 'Instagram, YouTube, любые зарубежные ресурсы — открывай всё что хочешь. Одно нажатие — и ты свободен.',
    isLarge: true,
    // ↓↓↓ РАСКОММЕНТИРУЙ ЧТО БЫ ВСТАВИТЬ ФОТО В ЭТОТ БЛОК ↓↓↓
    image: myPhoto,
    imageAlt: 'Описание картинки',
  },
  {
    id: 'speed',
    icon: Zap,
    title: 'Скорость не падает',
    description: 'Смотри 4K-видео и играй онлайн — ты не заметишь разницы. VPN не тормозит.',
    image: myPhoto,
    imageAlt: 'Описание',
  },
  {
    id: 'privacy',
    icon: ShieldOff,
    title: 'Никто не следит',
    description: 'Мы не знаем что ты делаешь в интернете — и знать не хотим. Никаких логов.',
    image: myPhoto,
    imageAlt: 'Описание',
  },
];

// ── ВОТ ГДЕ МЕНЯТЬ ЦВЕТ ФОНА КАРТОЧЕК ───────────────────────────────────────
const CARD_BG  = 'rgba(1, 14, 56, 0.9)';   // ← обычный фон карточки
const CARD_HOV = 'rgba(1, 20, 74, 1)';  // ← фон при наведении мыши
const BORDER   = 'rgba(100, 140, 255, 0.09)';
const BORDER_H = 'rgba(140, 170, 255, 0.20)';

// ── Accent color — same as used in blocks (no violet gradient) ────────────────
const ACCENT = 'rgba(100, 160, 255, 0.90)';

// ── Reveal animation ──────────────────────────────────────────────────────────

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, delay);
        io.disconnect();
      }
    }, { threshold: 0.08, rootMargin: '-20px' });
    io.observe(el); return () => io.disconnect();
  }, [delay]);
  return ref;
}

const REVEAL: React.CSSProperties = {
  opacity: 0, transform: 'translateY(28px)',
  transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)',
};

// ── Card ──────────────────────────────────────────────────────────────────────

function FeatureCard({ icon: Icon, title, description, isLarge, image, imageAlt, index }: FeatureItem & { index: number }) {
  const ref = useReveal(index * 80);

  return (
    <div
      ref={ref}
      className={`group relative rounded-[28px] overflow-hidden flex flex-col ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}`}
      style={{
        ...REVEAL,
        // If image provided, card has no explicit bg (image fills it)
        background: image ? 'transparent' : CARD_BG,
        border: `1px solid ${BORDER}`,
        transition: [REVEAL.transition, 'background 0.25s ease', 'border-color 0.25s ease'].join(', '),
      }}
      onMouseEnter={e => {
        if (!image) (e.currentTarget as HTMLElement).style.background = CARD_HOV;
        (e.currentTarget as HTMLElement).style.borderColor = BORDER_H;
      }}
      onMouseLeave={e => {
        if (!image) (e.currentTarget as HTMLElement).style.background = CARD_BG;
        (e.currentTarget as HTMLElement).style.borderColor = BORDER;
      }}
    >
      {image ? (
        // ── FULL-BLEED IMAGE MODE: photo covers entire card, text overlaid ──
        <>
          {/* Photo fills 100% of card */}
          <div className="absolute inset-0 z-0">
            <Image
              src={image} alt={imageAlt ?? title} fill
              className="object-cover object-center opacity-70 group-hover:opacity-85 group-hover:scale-[1.03]"
              style={{ transition: 'opacity 0.4s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)' }}
            />
          </div>

          {/* Dark gradient so text is always readable */}
          <div className="absolute inset-0 z-[1]"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.15) 100%)' }} />

          {/* Text on top of image */}
          <div className={`relative z-[2] flex flex-col flex-1 ${isLarge ? 'p-9 md:p-12' : 'p-8'}`}>
            <div className="size-10 rounded-[12px] flex items-center justify-center mb-auto"
              style={{ background: 'rgba(1,14,56,0.70)', border: '1px solid rgba(100,140,255,0.30)' }}>
              <Icon size={18} strokeWidth={1.5} style={{ color: ACCENT }} />
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <h3 className={`font-wix-madefor font-bold tracking-tight text-white ${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
                {title}
              </h3>
              <p className="font-inter-tight text-base leading-relaxed max-w-sm" style={{ color: 'rgba(220,230,255,0.65)' }}>
                {description}
              </p>
            </div>
          </div>
        </>
      ) : (
        // ── NO IMAGE MODE: card background, icon + text ──
        <div className={`relative flex flex-col flex-1 ${isLarge ? 'p-9 md:p-12 gap-6' : 'p-8 gap-5'}`}>
          <div className="size-11 rounded-[14px] flex items-center justify-center"
            style={{ background: 'rgba(1,14,56,0.95)', border: '1px solid rgba(100,140,255,0.22)' }}>
            <Icon size={20} strokeWidth={1.5} style={{ color: ACCENT }} />
          </div>
          <div className="flex flex-col gap-2.5 mt-auto">
            <h3 className={`font-wix-madefor font-bold tracking-tight text-white ${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
              {title}
            </h3>
            <p className="font-inter-tight text-base leading-relaxed max-w-sm" style={{ color: 'rgba(180,205,255,0.50)' }}>
              {description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export const Features = () => {
  const titleRef = useReveal();
  return (
    <section id="features" className="relative py-28 md:py-40" style={{ backgroundColor: '#000' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div ref={titleRef} className="flex flex-col items-center text-center gap-5 mb-16 md:mb-24" style={REVEAL}>
          <h2 className="font-wix-madefor font-bold text-5xl md:text-6xl tracking-tight text-white">
            Всё что нужно —{' '}
            <span style={{ background: 'linear-gradient(135deg, #ffffff 0%, rgba(100,160,255,0.95) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ничего лишнего</span>
          </h2>
          <p className="font-inter-tight text-lg max-w-lg leading-relaxed" style={{ color: 'rgba(180,205,255,0.50)' }}>
            SlashVPN создан с одной целью — дать тебе свободу в интернете без технических сложностей.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(260px,auto)]">
          {FEATURES.map((f, i) => <FeatureCard key={f.id} {...f} index={i} />)}
        </div>
      </div>
    </section>
  );
};

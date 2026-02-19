'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────

interface FAQItem { id: string; title: string; content: string; }

const ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    title: 'Как SlashVPN влияет на скорость?',
    content: 'В большинстве случаев ты даже не заметишь разницы. Мы используем быстрые протоколы, так что 4K-видео и онлайн-игры работают без лагов. Чем ближе к тебе сервер — тем выше скорость.',
  },
  {
    id: 'faq-2',
    title: 'Вы следите за тем, что я делаю?',
    content: 'Нет. Мы вообще не знаем что ты делаешь в интернете — и знать не хотим. Никаких логов, никакой истории соединений. Всё что ты делаешь онлайн — только твоё дело.',
  },
  {
    id: 'faq-3',
    title: 'Что делать если VPN не подключается?',
    content: 'Попробуй сменить сервер (страну) прямо в приложении. Если не помогло — напиши нам в Telegram, поддержка работает 24/7 и отвечает быстро.',
  },
  {
    id: 'faq-4',
    title: 'Можно вернуть деньги если не понравится?',
    content: 'Да, в течение 3 дней с момента покупки — без вопросов. Мы уверены в качестве, поэтому рисков нет.',
  },
];

// ── Palette ───────────────────────────────────────────────────────────────────

const BG = '#000';
const CARD_BG   = 'rgba(1,14,56,0.85)';
const CARD_OPEN = 'rgba(1,20,74,0.9)';
const BORDER    = 'rgba(100,140,255,0.08)';
const BORDER_O  = 'rgba(100,140,255,0.14)';

const ACCENT = 'rgba(100, 160, 255, 0.90)';

const REVEAL: React.CSSProperties = {
  opacity: 0, transform: 'translateY(20px)',
  transition: 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)',
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => { el.style.opacity='1'; el.style.transform='translateY(0)'; }, delay);
        io.disconnect();
      }
    }, { threshold: 0.07, rootMargin: '-10px' });
    io.observe(el); return () => io.disconnect();
  }, [delay]);
  return ref;
}

// ── Accordion Item ────────────────────────────────────────────────────────────

function AccordionItem({ id, title, content, isOpen, onToggle, index }: FAQItem & {
  isOpen: boolean; onToggle: () => void; index: number;
}) {
  const ref   = useReveal(index * 60);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current; if (!el) return;
    if (isOpen) { el.style.maxHeight = el.scrollHeight + 'px'; el.style.opacity = '1'; }
    else         { el.style.maxHeight = '0';                   el.style.opacity = '0'; }
  }, [isOpen]);

  return (
    <div
      ref={ref}
      className="relative rounded-[20px] overflow-hidden"
      style={{
        ...REVEAL,
        background: isOpen ? CARD_OPEN : CARD_BG,
        border: `1px solid ${isOpen ? BORDER_O : BORDER}`,
        transition: [REVEAL.transition, 'background 0.2s ease', 'border-color 0.2s ease'].join(', '),
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 px-7 py-5 md:px-8 md:py-6 text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-wix-madefor font-semibold text-lg md:text-xl tracking-tight"
          style={{ color: isOpen ? 'rgba(230,238,255,0.96)' : 'rgba(180,205,255,0.65)',
            transition: 'color 0.2s ease' }}>
          {title}
        </span>
        <div
          className="shrink-0 size-7 rounded-full flex items-center justify-center"
          style={{
            background: isOpen ? 'rgba(1,20,74,0.95)' : 'rgba(100,140,255,0.10)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1), background 0.2s ease',
          }}
        >
          <Plus size={15} strokeWidth={2} style={{ color: isOpen ? '#fff' : 'rgba(140,175,255,0.5)' }} />
        </div>
      </button>

      <div ref={bodyRef}
        style={{ maxHeight: 0, opacity: 0, overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease' }}>
        <div className="px-7 md:px-8 pb-7">
          <div className="h-px mb-5" style={{ background: 'rgba(100,140,255,0.08)' }} />
          <p className="font-inter-tight text-base leading-relaxed max-w-2xl"
            style={{ color: 'rgba(180,205,255,0.50)' }}>{content}</p>
        </div>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function FAQ() {
  const [openId, setOpenId] = useState<string>('faq-1');
  const titleRef = useReveal();

  return (
    <section id="faq" className="relative py-28 md:py-40" style={{ backgroundColor: '#000' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        {/* Two-column: title left, accordion right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-14 lg:gap-20 items-start">

          {/* Left — title block */}
          <div ref={titleRef} className="flex flex-col gap-5" style={REVEAL}>
            <h2 className="font-wix-madefor font-bold text-4xl md:text-5xl tracking-tight"
              style={{ color: 'rgba(230,238,255,0.96)' }}>
              Часто задаваемые{' '}
              <span style={{ background: 'linear-gradient(135deg, #ffffff 0%, rgba(100,160,255,0.95) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>вопросы</span>
            </h2>
            <p className="font-inter-tight text-base leading-relaxed"
              style={{ color: 'rgba(180,205,255,0.50)' }}>
              Не нашёл ответа?{' '}
              <a href="https://t.me/vpnslash" target="_blank" rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-white"
                style={{ color: 'rgba(100, 160, 255, 0.90)' }}>
                Напиши нам в Telegram
              </a>{' '}— ответим за пару минут.
            </p>
          </div>

          {/* Right — accordion */}
          <div className="flex flex-col gap-2.5">
            {ITEMS.map((item, i) => (
              <AccordionItem
                key={item.id} {...item} index={i}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(prev => prev === item.id ? '' : item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

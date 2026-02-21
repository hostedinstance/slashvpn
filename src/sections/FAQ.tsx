'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import AnimatedContent from '@/components/AnimatedContent';
import { faqStyles, fonts, palette } from '@/config/theme.config';

export interface FAQItem {
  id:      string;
  title:   string;
  content: string;
}

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

function AccordionItem({ id, title, content, isOpen, onToggle }: FAQItem & {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (isOpen) { el.style.maxHeight = `${el.scrollHeight}px`; el.style.opacity = '1'; }
    else        { el.style.maxHeight = '0'; el.style.opacity = '0'; }
  }, [isOpen]);

  return (
    <div
      className="relative rounded-[20px] overflow-hidden"
      style={{
        background: isOpen ? faqStyles.cardBgOpen : faqStyles.cardBg,
        border: `1px solid ${isOpen ? faqStyles.cardBorderOpen : faqStyles.cardBorder}`,
        transition: faqStyles.cardTransition,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 px-7 py-5 md:px-8 md:py-6 text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span
          className={`${fonts.heading} font-semibold text-lg md:text-xl tracking-tight`}
          style={{
            color: isOpen ? faqStyles.titleColorOpen : faqStyles.titleColorClosed,
            transition: 'color 0.2s ease',
          }}
        >
          {title}
        </span>
        <div
          className="shrink-0 size-7 rounded-full flex items-center justify-center"
          style={{
            background: isOpen ? faqStyles.plusBgOpen : faqStyles.plusBgClosed,
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1), background 0.2s ease',
          }}
        >
          <Plus size={15} strokeWidth={2} style={{ color: isOpen ? faqStyles.plusColorOpen : faqStyles.plusColorClosed }} />
        </div>
      </button>

      <div
        ref={bodyRef}
        style={{
          maxHeight: 0, opacity: 0, overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
        }}
      >
        <div className="px-7 md:px-8 pb-7">
          <div className="h-px mb-5" style={{ background: faqStyles.divider }} />
          <p className={`${fonts.body} text-base leading-relaxed max-w-2xl`} style={{ color: faqStyles.bodyTextColor }}>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openId, setOpenId] = useState<string>('faq-1');

  return (
    <section id="faq" className={`relative ${faqStyles.sectionPadding}`} style={{ backgroundColor: palette.sectionBg }}>
      <div className={faqStyles.container}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-14 lg:gap-20 items-start">

          {/* Left — title, slides from left */}
          <AnimatedContent
            distance={50}
            direction="horizontal"
            reverse
            duration={0.85}
            ease="power3.out"
            threshold={0.2}
          >
            <div className="flex flex-col gap-5">
              <h2 className={`${fonts.heading} font-bold text-4xl md:text-5xl tracking-tight`} style={{ color: faqStyles.sectionHeadingColor }}>
                Часто задаваемые{' '}
                <span style={{ background: faqStyles.headingGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {faqStyles.headingGradientWord}
                </span>
              </h2>
              <p className={`${fonts.body} text-base leading-relaxed`} style={{ color: faqStyles.subtitleColor }}>
                Не нашёл ответа?{' '}
                <a
                  href="https://t.me/vpnslash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-white"
                  style={{ color: faqStyles.linkColor }}
                >
                  Напиши нам в Telegram
                </a>
                {' '}— ответим за пару минут.
              </p>
            </div>
          </AnimatedContent>

          {/* Right — accordion items, each staggered from right */}
          <div className="flex flex-col gap-2.5">
            {ITEMS.map((item, i) => (
              <AnimatedContent
                key={item.id}
                distance={40}
                direction="horizontal"
                duration={0.7}
                ease="power3.out"
                delay={i * 0.1}
                threshold={0.1}
              >
                <AccordionItem
                  {...item}
                  isOpen={openId === item.id}
                  onToggle={() => setOpenId(prev => prev === item.id ? '' : item.id)}
                />
              </AnimatedContent>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

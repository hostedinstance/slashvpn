"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Country {
  name: string;
  /** Emoji флага или код страны (например, 'ru', 'us') для circle-flags */
  flag: string;
  code: string;
  /** Использовать circle-flags вместо emoji (по умолчанию: auto-detect) */
  useCircleFlags?: boolean;
}

export interface RowConfig {
  /** Скорость анимации в секундах */
  duration: number;
  /** Направление движения */
  direction: "left-to-right" | "right-to-left";
  /** Gap между карточками в px */
  gap: number;
  /** Вертикальные отступы строки */
  paddingY: number;
}

export interface ActiveCardStyle {
  /** Фоновый градиент */
  background: string;
  /** Цвет границы */
  borderColor: string;
  /** Цвет границы при hover */
  borderColorHover: string;
  /** Box shadow */
  boxShadow: string;
  /** Скругление углов */
  borderRadius: string;
  /** Минимальная ширина карточки */
  minWidth: number;
  /** Padding карточки */
  padding: string;
  /** Scale при hover */
  hoverScale: number;
  /** Размер флага в rem */
  flagSize: string;
  /** Drop shadow флага */
  flagDropShadow: string;
  /** Размер текста названия */
  nameTextSize: string;
  /** Размер текста статуса */
  statusTextSize: string;
  /** Цвет текста статуса */
  statusColor: string;
  /** Размер индикатора активности */
  indicatorSize: string;
  /** Шрифт названия страны */
  nameFont: string;
  /** Шрифт статуса */
  statusFont: string;
}

export interface UpcomingCardStyle {
  /** Фоновый цвет */
  background: string;
  /** Цвет границы */
  borderColor: string;
  /** Стиль границы */
  borderStyle: "solid" | "dashed" | "dotted";
  /** Толщина границы */
  borderWidth: number;
  /** Скругление углов */
  borderRadius: string;
  /** Минимальная ширина карточки */
  minWidth: number;
  /** Padding карточки */
  padding: string;
  /** Opacity по умолчанию */
  opacity: number;
  /** Opacity при hover */
  hoverOpacity: number;
  /** Применить grayscale */
  grayscale: boolean;
  /** Размер флага в rem */
  flagSize: string;
  /** Размер текста названия */
  nameTextSize: string;
  /** Размер текста статуса */
  statusTextSize: string;
  /** Цвет текста статуса */
  statusColor: string;
  /** Шрифт названия страны */
  nameFont: string;
  /** Шрифт статуса */
  statusFont: string;
}

export interface HeaderConfig {
  /** Заголовок секции (JSX или строка) */
  titleNode?: React.ReactNode;
  /** Заголовок секции */
  title: string;
  /** Подзаголовок секции */
  subtitle: string;
  /** Размер заголовка (mobile) */
  titleSizeMobile: string;
  /** Размер заголовка (desktop) */
  titleSizeDesktop: string;
  /** Размер подзаголовка */
  subtitleSize: string;
  /** Цвет заголовка */
  titleColor: string;
  /** Цвет подзаголовка */
  subtitleColor: string;
  /** Максимальная ширина подзаголовка */
  subtitleMaxWidth: string;
  /** Отступ снизу от заголовков */
  marginBottom: number;
  /** Шрифт заголовка */
  titleFont: string;
  /** Шрифт подзаголовка */
  subtitleFont: string;
}

export interface SectionConfig {
  /** Вертикальные отступы секции (mobile) */
  paddingYMobile: number;
  /** Вертикальные отступы секции (desktop) */
  paddingYDesktop: number;
  /** Градиент маски для fade эффекта */
  maskGradient: string;
}

export type CSSLinkVariant =
  | "underline-slide"
  | "underline-grow"
  | "underline-bounce"
  | "background-slide"
  | "background-grow"
  | "fade"
  | "scale"
  | "shimmer";

export interface FooterLinkConfig {
  /** Текст вопроса */
  questionText: string;
  /** Текст ссылки */
  linkText: string;
  /** URL ссылки */
  linkUrl: string;
  /** Вариант анимации ссылки */
  linkVariant?: CSSLinkVariant;
  /** Цвет текста вопроса */
  questionColor: string;
  /** Цвет ссылки */
  linkColor: string;
  /** Размер текста вопроса */
  questionSize: string;
  /** Размер текста ссылки */
  linkSize: string;
  /** Шрифт текста */
  font: string;
  /** Отступ сверху */
  marginTop: number;
}

export interface CountrySelectorProps {
  /** Список активных стран */
  activeCountries: Country[];
  /** Список планируемых стран */
  upcomingCountries: Country[];
  /** Конфигурация строки активных стран */
  activeRowConfig?: Partial<RowConfig>;
  /** Конфигурация строки планируемых стран */
  upcomingRowConfig?: Partial<RowConfig>;
  /** Стили карточек активных стран */
  activeCardStyle?: Partial<ActiveCardStyle>;
  /** Стили карточек планируемых стран */
  upcomingCardStyle?: Partial<UpcomingCardStyle>;
  /** Конфигурация заголовка */
  headerConfig?: Partial<HeaderConfig>;
  /** Конфигурация секции */
  sectionConfig?: Partial<SectionConfig>;
  /** Конфигурация футера с ссылкой */
  footerLinkConfig?: Partial<FooterLinkConfig>;
}

// ─── Default Configs ──────────────────────────────────────────────────────────

const DEFAULT_ACTIVE_ROW: RowConfig = {
  duration: 30,
  direction: "left-to-right",
  gap: 24,
  paddingY: 16,
};

const DEFAULT_UPCOMING_ROW: RowConfig = {
  duration: 40,
  direction: "right-to-left",
  gap: 24,
  paddingY: 16,
};

const DEFAULT_ACTIVE_CARD: ActiveCardStyle = {
  background: "linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1))",
  borderColor: "rgba(255, 255, 255, 0.1)",
  borderColorHover: "rgba(168, 85, 247, 0.5)",
  boxShadow: "0 0 20px rgba(111, 0, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)",
  borderRadius: "1rem",
  minWidth: 200,
  padding: "1rem 2rem",
  hoverScale: 1.1,
  flagSize: "3rem",
  flagDropShadow: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))",
  nameTextSize: "1.125rem",
  statusTextSize: "0.875rem",
  statusColor: "rgb(74, 222, 128)",
  indicatorSize: "0.5rem",
  nameFont: "font-inter-tight",
  statusFont: "font-inter-tight",
};

const DEFAULT_UPCOMING_CARD: UpcomingCardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  borderColor: "rgba(255, 255, 255, 0.2)",
  borderStyle: "dashed",
  borderWidth: 2,
  borderRadius: "1rem",
  minWidth: 200,
  padding: "1rem 2rem",
  opacity: 0.4,
  hoverOpacity: 0.6,
  grayscale: true,
  flagSize: "3rem",
  nameTextSize: "1.125rem",
  statusTextSize: "0.875rem",
  statusColor: "rgba(255, 255, 255, 0.6)",
  nameFont: "font-inter-tight",
  statusFont: "font-inter-tight",
};

const DEFAULT_HEADER: HeaderConfig = {
  title: "Global Network",
  subtitle: "Connect to servers around the world with blazing-fast speeds",
  titleSizeMobile: "2.25rem",
  titleSizeDesktop: "3.75rem",
  subtitleSize: "1.125rem",
  titleColor: "rgb(255, 255, 255)",
  subtitleColor: "rgba(255, 255, 255, 0.6)",
  subtitleMaxWidth: "42rem",
  marginBottom: 64,
  titleFont: "font-wix-madefor",
  subtitleFont: "font-inter-tight",
};

const DEFAULT_SECTION: SectionConfig = {
  paddingYMobile: 80,
  paddingYDesktop: 128,
  maskGradient: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
};

const DEFAULT_FOOTER_LINK: FooterLinkConfig = {
  questionText: "Не нашли подходящий сервер?",
  linkText: "Предложить локацию",
  linkUrl: "#suggest-location",
  linkVariant: "underline-slide",
  questionColor: "rgba(255, 255, 255, 0.7)",
  linkColor: "rgb(168, 85, 247)",
  questionSize: "1rem",
  linkSize: "1rem",
  font: "font-inter-tight",
  marginTop: 48,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Определяет, является ли строка emoji или кодом страны
 */
function isEmoji(str: string): boolean {
  if (str.length > 3) {
    return true;
  }
  return !/^[a-zA-Z]{2,3}$/.test(str);
}

/**
 * Получает URL для circle-flags
 */
function getCircleFlagUrl(countryCode: string): string {
  return `https://hatscripts.github.io/circle-flags/flags/${countryCode.toLowerCase()}.svg`;
}

/**
 * Компонент для отображения флага
 */
const FlagDisplay = React.memo(({ country, size, dropShadow }: {
  country: Country;
  size: string;
  dropShadow?: string;
}) => {
  const shouldUseCircleFlags = country.useCircleFlags ?? !isEmoji(country.flag);

  if (shouldUseCircleFlags) {
    return (
      <div
        className="flag-container"
        style={{
          width: size,
          height: size,
          position: "relative",
          filter: dropShadow,
        }}
      >
        <Image
          src={getCircleFlagUrl(country.flag)}
          alt={`${country.name} flag`}
          fill
          style={{ objectFit: "contain" }}
          unoptimized
        />
      </div>
    );
  }

  return (
    <span
      className="flag-emoji"
      style={{
        fontSize: size,
        filter: dropShadow,
      }}
    >
      {country.flag}
    </span>
  );
});

FlagDisplay.displayName = "FlagDisplay";

/**
 * CSS Link компонент с анимациями
 */
const CSSLink = React.memo(({
                              variant = "underline-slide",
                              className,
                              children,
                              href,
                              style,
                              ...props
                            }: {
  variant?: CSSLinkVariant;
  className?: string;
  children: React.ReactNode;
  href?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <a
      className={cn(
        "css-link",
        `css-link-${variant}`,
        "group relative inline-flex items-center cursor-pointer",
        className
      )}
      href={href}
      style={style}
      {...props}
    >
      {children}
      <svg
        className="css-link-arrow ml-[0.3em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
});

CSSLink.displayName = "CSSLink";

/**
 * Активная карточка страны
 */
const ActiveCountryCard = React.memo(({
                                        country,
                                        activeCard,
                                        index
                                      }: {
  country: Country;
  activeCard: ActiveCardStyle;
  index: number;
}) => {
  const cardStyle = useMemo(() => ({
    background: activeCard.background,
    border: `1px solid ${activeCard.borderColor}`,
    borderRadius: activeCard.borderRadius,
    minWidth: `${activeCard.minWidth}px`,
    padding: activeCard.padding,
    boxShadow: activeCard.boxShadow,
  }), [activeCard]);

  const indicatorStyle = useMemo(() => ({
    width: activeCard.indicatorSize,
    height: activeCard.indicatorSize,
    backgroundColor: activeCard.statusColor,
  }), [activeCard.indicatorSize, activeCard.statusColor]);

  return (
    <div
      key={`active-${index}`}
      className="flex items-center gap-4 backdrop-blur-sm"
      style={cardStyle}
    >
      <FlagDisplay
        country={country}
        size={activeCard.flagSize}
        dropShadow={activeCard.flagDropShadow}
      />
      <div>
        <p
          className={`tracking-tight text-white ${activeCard.nameFont}`}
          style={{ fontSize: activeCard.nameTextSize }}
        >
          {country.name}
        </p>
        <p
          className={`flex items-center gap-1 leading-relaxed ${activeCard.statusFont}`}
          style={{
            color: activeCard.statusColor,
            fontSize: activeCard.statusTextSize,
          }}
        >
          <span
            className="rounded-full animate-pulse"
            style={indicatorStyle}
          />
          Активна
        </p>
      </div>
    </div>
  );
});

ActiveCountryCard.displayName = "ActiveCountryCard";

/**
 * Планируемая карточка страны
 */
const UpcomingCountryCard = React.memo(({
                                          country,
                                          upcomingCard,
                                          index
                                        }: {
  country: Country;
  upcomingCard: UpcomingCardStyle;
  index: number;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyle = useMemo(() => ({
    background: upcomingCard.background,
    border: `${upcomingCard.borderWidth}px ${upcomingCard.borderStyle} ${upcomingCard.borderColor}`,
    borderRadius: upcomingCard.borderRadius,
    minWidth: `${upcomingCard.minWidth}px`,
    padding: upcomingCard.padding,
    opacity: isHovered ? upcomingCard.hoverOpacity : upcomingCard.opacity,
    filter: isHovered ? "grayscale(0)" : upcomingCard.grayscale ? "grayscale(1)" : "none",
  }), [upcomingCard, isHovered]);

  return (
    <div
      key={`upcoming-${index}`}
      className="flex items-center gap-4 backdrop-blur-sm transition-all duration-300"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FlagDisplay
        country={country}
        size={upcomingCard.flagSize}
      />
      <div>
        <p
          className={`font-semibold tracking-tight text-white ${upcomingCard.nameFont}`}
          style={{ fontSize: upcomingCard.nameTextSize }}
        >
          {country.name}
        </p>
        <p
          className={`leading-relaxed ${upcomingCard.statusFont}`}
          style={{
            color: upcomingCard.statusColor,
            fontSize: upcomingCard.statusTextSize,
          }}
        >
          Скоро...
        </p>
      </div>
    </div>
  );
});

UpcomingCountryCard.displayName = "UpcomingCountryCard";

// ─── Component ────────────────────────────────────────────────────────────────

export function CountrySelector({
                                  activeCountries,
                                  upcomingCountries,
                                  activeRowConfig,
                                  upcomingRowConfig,
                                  activeCardStyle,
                                  upcomingCardStyle,
                                  headerConfig,
                                  sectionConfig,
                                  footerLinkConfig,
                                }: CountrySelectorProps) {
  // Merge configs with defaults
  const activeRow = useMemo(() => ({ ...DEFAULT_ACTIVE_ROW, ...activeRowConfig }), [activeRowConfig]);
  const upcomingRow = useMemo(() => ({ ...DEFAULT_UPCOMING_ROW, ...upcomingRowConfig }), [upcomingRowConfig]);
  const activeCard = useMemo(() => ({ ...DEFAULT_ACTIVE_CARD, ...activeCardStyle }), [activeCardStyle]);
  const upcomingCard = useMemo(() => ({ ...DEFAULT_UPCOMING_CARD, ...upcomingCardStyle }), [upcomingCardStyle]);
  const header = useMemo(() => ({ ...DEFAULT_HEADER, ...headerConfig }), [headerConfig]);
  const section = useMemo(() => ({ ...DEFAULT_SECTION, ...sectionConfig }), [sectionConfig]);
  const footerLink = useMemo(() => ({ ...DEFAULT_FOOTER_LINK, ...footerLinkConfig }), [footerLinkConfig]);

  // Duplicate arrays for seamless loop
  const activeCountriesDuplicated = useMemo(() => [
    ...activeCountries,
    ...activeCountries,
    ...activeCountries,
  ], [activeCountries]);

  const upcomingCountriesDuplicated = useMemo(() => [
    ...upcomingCountries,
    ...upcomingCountries,
    ...upcomingCountries,
  ], [upcomingCountries]);

  // Animation configs
  const activeAnimation = useMemo(() => ({
    x: activeRow.direction === "left-to-right" ? [0, "-33.33%"] : ["-33.33%", 0],
  }), [activeRow.direction]);

  const upcomingAnimation = useMemo(() => ({
    x: upcomingRow.direction === "left-to-right" ? [0, "-33.33%"] : ["-33.33%", 0],
  }), [upcomingRow.direction]);

  const sectionStyle = useMemo(() => ({
    paddingTop: `${section.paddingYMobile}px`,
    paddingBottom: `${section.paddingYMobile}px`,
  }), [section.paddingYMobile]);

  const headerContainerStyle = useMemo(() => ({
    marginBottom: `${header.marginBottom}px`
  }), [header.marginBottom]);

  const headerTitleStyle = useMemo(() => ({
    fontSize: header.titleSizeMobile,
    color: header.titleColor,
  }), [header.titleSizeMobile, header.titleColor]);

  const headerSubtitleStyle = useMemo(() => ({
    color: header.subtitleColor,
    fontSize: header.subtitleSize,
    maxWidth: header.subtitleMaxWidth,
  }), [header.subtitleColor, header.subtitleSize, header.subtitleMaxWidth]);

  const rowMaskStyle = useMemo(() => ({
    maskImage: section.maskGradient,
    WebkitMaskImage: section.maskGradient,
  }), [section.maskGradient]);

  const activeRowStyle = useMemo(() => ({
    ...rowMaskStyle,
    paddingTop: `${activeRow.paddingY}px`,
    paddingBottom: `${activeRow.paddingY}px`,
  }), [rowMaskStyle, activeRow.paddingY]);

  const upcomingRowStyle = useMemo(() => ({
    ...rowMaskStyle,
    paddingTop: `${upcomingRow.paddingY}px`,
    paddingBottom: `${upcomingRow.paddingY}px`,
  }), [rowMaskStyle, upcomingRow.paddingY]);

  const footerStyle = useMemo(() => ({
    marginTop: `${footerLink.marginTop}px`
  }), [footerLink.marginTop]);

  return (
    <section
      className="relative overflow-hidden"
      style={sectionStyle}
    >
      {/* Header */}
      <div
        className="container mx-auto px-6"
        style={headerContainerStyle}
      >
        <h2
          className={`text-center mb-4 ${header.titleFont}`}
          style={headerTitleStyle}
        >
          {(header as any).titleNode ?? header.title}
        </h2>
        <p
          className={`text-center mx-auto leading-relaxed ${header.subtitleFont}`}
          style={headerSubtitleStyle}
        >
          {header.subtitle}
        </p>
      </div>

      {/* Active Countries Row */}
      <div
        className="relative mb-8"
        style={activeRowStyle}
      >
        <motion.div
          className="flex w-fit"
          style={{
            gap: `${activeRow.gap}px`,
            willChange: 'transform'
          }}
          animate={activeAnimation}
          transition={{
            duration: activeRow.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {activeCountriesDuplicated.map((country, index) => (
            <ActiveCountryCard
              key={`active-${index}`}
              country={country}
              activeCard={activeCard}
              index={index}
            />
          ))}
        </motion.div>
      </div>

      {/* Upcoming Countries Row */}
      <div
        className="relative"
        style={upcomingRowStyle}
      >
        <motion.div
          className="flex w-fit"
          style={{
            gap: `${upcomingRow.gap}px`,
            willChange: 'transform'
          }}
          animate={upcomingAnimation}
          transition={{
            duration: upcomingRow.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {upcomingCountriesDuplicated.map((country, index) => (
            <UpcomingCountryCard
              key={`upcoming-${index}`}
              country={country}
              upcomingCard={upcomingCard}
              index={index}
            />
          ))}
        </motion.div>
      </div>

      {/* Footer Link */}
      {footerLinkConfig && (
        <div
          className="container mx-auto px-6 text-center"
          style={footerStyle}
        >
          <p className={`${footerLink.font}`}>
            <span
              style={{
                color: footerLink.questionColor,
                fontSize: footerLink.questionSize,
              }}
            >
              {footerLink.questionText}{" "}
            </span>
            <CSSLink
              href={footerLink.linkUrl}
              variant={footerLink.linkVariant}
              style={{
                color: footerLink.linkColor,
                fontSize: footerLink.linkSize,
              }}
            >
              {footerLink.linkText}
            </CSSLink>
          </p>
        </div>
      )}

      {/* Responsive title size for desktop */}
      <style jsx global>{`
          @media (min-width: 768px) {
              h2 {
                  font-size: ${header.titleSizeDesktop} !important;
              }
              section {
                  padding-top: ${section.paddingYDesktop}px !important;
                  padding-bottom: ${section.paddingYDesktop}px !important;
              }
          }

          /* stylelint-disable selector-class-pattern */
          .css-link {
              position: relative;
              text-decoration: none;
          }

          /* Underline Slide - справа налево */
          .css-link-underline-slide::before {
              content: '';
              pointer-events: none;
              position: absolute;
              left: 0;
              top: 1.5em;
              height: 0.05em;
              width: 100%;
              background-color: currentColor;
              transform-origin: right;
              scale: 0 1;
              transition: scale 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .css-link-underline-slide:hover::before {
              transform-origin: left;
              scale: 1 1;
          }

          /* Underline Grow - от центра */
          .css-link-underline-grow::before {
              overflow: visible;
              content: '';
              pointer-events: none;
              position: absolute;
              left: 0;
              top: 1.5em;
              height: 0.05em;
              width: 100%;
              background-color: currentColor;
              transform-origin: center;
              scale: 0 1;
              transition: scale 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .css-link-underline-grow:hover::before {
              scale: 1 1;
          }

          /* Underline Bounce - слева направо с bounce */
          .css-link-underline-bounce::before {
              content: '';
              pointer-events: none;
              position: absolute;
              left: 0;
              top: 1.5em;
              height: 0.05em;
              width: 100%;
              background-color: currentColor;
              transform-origin: left;
              scale: 0 1;
              transition: scale 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }

          .css-link-underline-bounce:hover::before {
              transform-origin: right;
              scale: 1 1;
          }

          /* Background Slide - фон снизу вверх с mix-blend-difference */
          .css-link-background-slide {
              padding: 0 0.5rem;
              position: relative;
              z-index: 0;
          }

          .css-link-background-slide::before {
              content: '';
              pointer-events: none;
              position: absolute;
              left: 0;
              bottom: 0;
              width: 100%;
              height: 0;
              background-color: white;
              transform-origin: center;
              scale: 1 0;
              mix-blend-mode: difference;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              z-index: -1;
          }

          .css-link-background-slide:hover::before {
              height: 1.4em;
              scale: 1 1;
          }

          .css-link-background-slide .css-link-arrow {
              z-index: 0;
              margin-left: 0.6em;
          }

          .css-link-background-slide:hover .css-link-arrow {
              transform: translateY(0) rotate(45deg);
          }

          /* Background Grow - фон слева направо с mix-blend-difference */
          .css-link-background-grow {
              padding: 0 0.5rem;
              position: relative;
              z-index: 0;
          }

          .css-link-background-grow::before {
              content: '';
              pointer-events: none;
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(255, 255, 255, 0.5);
              transform-origin: left;
              scale: 0 1;
              mix-blend-mode: difference;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              z-index: -1;
          }

          .css-link-background-grow:hover::before {
              scale: 1 1;
          }

          .css-link-background-grow .css-link-arrow {
              z-index: 0;
              margin-left: 0.6em;
              opacity: 0;
              transform: translateX(-0.25rem) rotate(45deg);
          }

          .css-link-background-grow:hover .css-link-arrow {
              opacity: 1;
              transform: translateX(0) rotate(45deg);
          }

          /* Fade */
          .css-link-fade {
              transition: opacity 0.3s ease;
          }

          .css-link-fade:hover {
              opacity: 0.7;
          }

          /* Scale */
          .css-link-scale {
              transition: transform 0.3s ease;
          }

          .css-link-scale:hover {
              transform: scale(1.05);
          }

          /* Shimmer */
          .css-link-shimmer {
              background: linear-gradient(
                      90deg,
                      currentColor 0%,
                      currentColor 40%,
                      rgba(255, 255, 255, 0.8) 50%,
                      currentColor 60%,
                      currentColor 100%
              );
              background-size: 200% 100%;
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              transition: background-position 0.5s ease;
          }

          .css-link-shimmer:hover {
              background-position: -100% 0;
          }
          /* stylelint-enable selector-class-pattern */
      `}</style>
    </section>
  );
}
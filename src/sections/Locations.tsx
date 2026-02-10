"use client";
import { CountrySelector, Country } from "@/components/CountrySelector";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ACTIVE_COUNTRIES: Country[] = [
  { name: "США", flag: "us", code: "US" },
  { name: "Германия", flag: "de", code: "DE" },
  { name: "Нидерланды", flag: "nl", code: "NL" },
  { name: "Финляндия", flag: "fi", code: "FI" },
  { name: "Швеция", flag: "se", code: "SE" },
];

const UPCOMING_COUNTRIES: Country[] = [
  { name: "Франция", flag: "fr", code: "FR" },
  { name: "Канада", flag: "ca", code: "CA" },
  { name: "Польша", flag: "pl", code: "PL" },
  { name: "Австралия", flag: "au", code: "AU" },
  { name: "Испания", flag: "es", code: "ES" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function Locations() {
  return (
    <div id="locations">
    <CountrySelector
      activeCountries={ACTIVE_COUNTRIES}
      upcomingCountries={UPCOMING_COUNTRIES}
      headerConfig={{
        title: "Локации, которые не подводят",
        subtitle: "Подключайтесь к серверам по всему миру с максимальной скоростью.",
        titleSizeMobile: "2.5rem",
        titleSizeDesktop: "3rem",
        subtitleSize: "1.25rem",
        titleColor: "rgb(255, 255, 255)",
        subtitleColor: "rgba(255, 255, 255, 0.7)",
        subtitleMaxWidth: "48rem",
        marginBottom: 80,
        titleFont: "font-medium font-wix-madefor tracking-tighter ",          // Шрифт заголовка
        subtitleFont: "font-inter-tight",        // Шрифт подзаголовка
      }}

      // Active Row Configuration
      activeRowConfig={{
        duration: 25,
        direction: "left-to-right",
        gap: 32,
        paddingY: 20,
      }}

      // Active Card Styling
      activeCardStyle={{
        background: "linear-gradient(to bottom right, rgba(255,255,255, 0.1), rgba(0,0,0, 0.0))",
        borderColor: "rgba(255,255,255,0.2)",
        borderColorHover: "rgba(255,255,255,0.6)",
        boxShadow: "0 0 30px rgba(255,255,255, 0), inset 0 0 30px rgba(255, 255, 255, 0.0)",
        borderRadius: "1rem",
        minWidth: 220,
        padding: "1.25rem 2.5rem",
        hoverScale: 1.05,
        flagSize: "3.5rem",
        flagDropShadow: "drop-shadow(0 0 12px rgba(255, 255, 255, 0.0))",
        nameTextSize: "1.25rem",
        statusTextSize: "1rem",
        statusColor: "rgb(34, 197, 94)",
        indicatorSize: "0.4rem",
        nameFont: "font-wix-madefor font-semibold tracking-tight",           // Шрифт названия страны
        statusFont: "font-inter-tight",          // Шрифт статуса
      }}

      // Upcoming Row Configuration
      upcomingRowConfig={{
        duration: 35,
        direction: "right-to-left",
        gap: 28,
        paddingY: 20,
      }}

      // Upcoming Card Styling
      upcomingCardStyle={{
        background: "rgba(255, 255, 255, 0.03)",
        borderColor: "rgba(255, 255, 255, 0.15)",
        borderStyle: "dashed",
        borderWidth: 2,
        borderRadius: "1.25rem",
        minWidth: 220,
        padding: "1.25rem 2.5rem",
        opacity: 0.35,
        hoverOpacity: 0.7,
        grayscale: true,
        flagSize: "3.5rem",
        nameTextSize: "1.25rem",
        statusTextSize: "1rem",
        statusColor: "rgba(255, 255, 255, 0.5)",
        nameFont: "font-wix-madefor tracking-tight",           // Шрифт названия страны
        statusFont: "font-inter-tight",          // Шрифт статуса
      }}

      // Section Configuration
      sectionConfig={{
        paddingYMobile: 100,
        paddingYDesktop: 160,
        maskGradient: "linear-gradient(to right, transparent, black 50%, black 50%, transparent)",
      }}

      // Footer Link Configuration
      footerLinkConfig={{
        questionText: "Не нашли подходящий сервер?",
        linkText: "Предложить локацию",
        linkUrl: "https://t.me/+Zmo74XmjyRdmMmJi",
        linkVariant: "underline-grow", // Варианты: "underline-slide", "underline-grow", "underline-bounce", "background-slide", "background-grow", "fade", "scale", "shimmer"
        questionColor: "rgba(255, 255, 255, 0.7)",
        linkColor: "rgb(85,107,247)",
        questionSize: "1.125rem",
        linkSize: "1.125rem",
        font: "font-inter-tight",
        marginTop: 64,
      }}
    />
    </div>
  );
}
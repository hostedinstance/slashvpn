import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/config/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "20px", lg: "80px" },
      screens: { sm: "375px", md: "768px", lg: "1200px" },
    },
    screens: { sm: "375px", md: "768px", lg: "1200px" },
    extend: {
      maxWidth: { component: "1200px" },

      // ── Colors ─────────────────────────────────────────────────
      colors: {
        canvas: {
          DEFAULT: "#05050c",
          alt:     "#08081a",
          raise:   "#0c0c1e",
        },
        // shadcn compat
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:   "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:   "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:   "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:   "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:   "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:   "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:   "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      // ── Font families ──────────────────────────────────────────
      fontFamily: {
        "grifter-bold":  "var(--font-grifter-bold)",
        "inter-tight":   "var(--font-inter-tight)",
        "wix-madefor":   "var(--font-wix-madefor)",
      },

      // ── Border radii (new names, no override of tailwind defaults) ──
      borderRadius: {
        // Keep tailwind defaults — only add semantic names
        "card":  "20px",
        "card-lg": "28px",
        "pill":  "999px",
        "ui":    "14px",
        lg:      "var(--radius)",
      },

      // ── Shadows ──────────────────────────────────────────────────
      boxShadow: {
        "ring-0":  "0 0 0 1px rgba(255,255,255,0.045)",
        "ring-1":  "0 0 0 1px rgba(255,255,255,0.085)",
        "ring-2":  "0 0 0 1px rgba(255,255,255,0.155)",
        "ring-v":  "0 0 0 1.5px rgba(109,40,217,0.5)",
        "depth-s": "0 4px 16px -4px rgba(0,0,0,0.55)",
        "depth-m": "0 12px 40px -8px rgba(0,0,0,0.65)",
        "depth-l": "0 32px 80px -16px rgba(0,0,0,0.75)",
        "glow-v":  "0 8px 32px -4px rgba(109,40,217,0.4)",
        "glow-e":  "0 8px 24px -4px rgba(16,185,129,0.35)",
      },

      // ── Animations ────────────────────────────────────────────────
      animation: {
        "accordion-down":  "accordion-down 0.28s cubic-bezier(0.22,1,0.36,1)",
        "accordion-up":    "accordion-up 0.22s cubic-bezier(0.22,1,0.36,1)",
        "fade-in":         "fadeIn 0.34s cubic-bezier(0.22,1,0.36,1) both",
        "fade-up":         "fadeUp 0.34s cubic-bezier(0.22,1,0.36,1) both",
        "spin-slow":       "spin 3s linear infinite",
        "pulse-emerald":   "pulse-emerald 2.5s ease-in-out infinite",
        "gradient":        "gradient 8s linear infinite",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to:   { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to:   { height: "0", opacity: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        gradient: {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "pulse-emerald": {
          "0%, 100%": { boxShadow: "0 0 6px rgba(16,185,129,0.4)" },
          "50%":      { boxShadow: "0 0 14px rgba(16,185,129,0.7)" },
        },
      },

      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

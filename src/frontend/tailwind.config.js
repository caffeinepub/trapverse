import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["'Bricolage Grotesque'", "sans-serif"],
        body: ["'Figtree'", "sans-serif"],
      },
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        candy: {
          pink: "oklch(0.72 0.25 340)",
          mint: "oklch(0.76 0.18 180)",
          gold: "oklch(0.84 0.22 75)",
          lavender: "oklch(0.70 0.18 290)",
          blue: "oklch(0.75 0.20 220)",
        },
        jungle: {
          green: "oklch(0.42 0.18 148)",
          light: "oklch(0.62 0.18 145)",
          gold: "oklch(0.78 0.18 85)",
          dark: "oklch(0.22 0.12 152)",
        },
        crystal: {
          blue: "oklch(0.60 0.22 215)",
          light: "oklch(0.75 0.18 210)",
          gold: "oklch(0.82 0.16 195)",
          dark: "oklch(0.20 0.10 220)",
        },
        inferno: {
          red: "oklch(0.58 0.26 22)",
          orange: "oklch(0.72 0.24 35)",
          gold: "oklch(0.84 0.20 50)",
          dark: "oklch(0.20 0.12 20)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        candy: "0 0 20px oklch(0.72 0.25 340 / 0.4)",
        mint: "0 0 20px oklch(0.76 0.18 180 / 0.4)",
        gold: "0 0 20px oklch(0.84 0.22 75 / 0.5)",
        jungle: "0 0 20px oklch(0.42 0.18 148 / 0.5)",
        crystal: "0 0 20px oklch(0.60 0.22 215 / 0.5)",
        inferno: "0 0 20px oklch(0.58 0.26 22 / 0.5)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0) rotate(-10deg)", opacity: "0" },
          "70%": { transform: "scale(1.15) rotate(2deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "shimmer": "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};

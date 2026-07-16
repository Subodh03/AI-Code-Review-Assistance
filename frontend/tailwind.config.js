/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-alt": "rgb(var(--color-surface-alt) / <alpha-value>)",
        "surface-hover": "rgb(var(--color-surface-hover) / <alpha-value>)",
        border: {
          DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
          light: "rgb(var(--color-border-light) / <alpha-value>)",
        },
        ink: {
          primary: "rgb(var(--color-ink-primary) / <alpha-value>)",
          muted: "rgb(var(--color-ink-muted) / <alpha-value>)",
          faint: "rgb(var(--color-ink-faint) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          hover: "rgb(var(--color-accent-hover) / <alpha-value>)",
        },
        severity: {
          critical: "rgb(var(--color-critical) / <alpha-value>)",
          "critical-soft": "rgb(var(--color-critical-soft) / <alpha-value>)",
          warning: "rgb(var(--color-warning) / <alpha-value>)",
          "warning-soft": "rgb(var(--color-warning-soft) / <alpha-value>)",
          info: "rgb(var(--color-info) / <alpha-value>)",
          "info-soft": "rgb(var(--color-info-soft) / <alpha-value>)",
          success: "rgb(var(--color-success) / <alpha-value>)",
          "success-soft": "rgb(var(--color-success-soft) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["Source Serif 4", "Georgia", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
      borderRadius: {
        xl2: "0.75rem",
      },
    },
  },
  plugins: [],
};

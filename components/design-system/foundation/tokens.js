/**
 * Design tokens as JS references (mirror of CSS --ds-* variables)
 */

export const dsColors = {
  light: {
    bg: "#ffffff",
    bgSubtle: "#fafafa",
    bgMuted: "#f4f4f5",
    text: "#09090b",
    textSecondary: "#52525b",
    textMuted: "#71717a",
    accent: "#6366f1",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    data: "#06b6d4",
    pipeline: "#8b5cf6",
  },
  dark: {
    bg: "#09090b",
    bgSubtle: "#0c0c0e",
    bgMuted: "#18181b",
    text: "#fafafa",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",
    accent: "#818cf8",
    success: "#34d399",
    warning: "#fbbf24",
    error: "#f87171",
    data: "#22d3ee",
    pipeline: "#a78bfa",
  },
};

export const dsSpacing = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 32];

export const dsRadii = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  full: "9999px",
};

export const dsTypography = {
  fontSans: 'var(--ds-font-sans)',
  fontMono: 'var(--ds-font-mono)',
  sizes: ["xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"],
  weights: ["normal", "medium", "semibold", "bold"],
};

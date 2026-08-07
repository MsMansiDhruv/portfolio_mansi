/**
 * Design System v2 — Foundation Layer
 * 
 * Core tokens defining the design system:
 * - Color palette (light & dark)
 * - Typography scales
 * - Spacing scale
 * - Radii, shadows, borders
 * - Z-index scale
 */

/* ============================================================================
   SEMANTIC COLOR PALETTE
   Define intent-based colors that work across light and dark modes
   ============================================================================ */

export const colors = {
  // Neutral palette (grays, blacks, whites)
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1A6',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
  },

  // Primary accent (inspired by Vercel & Linear's teal)
  primary: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },

  // Secondary (complementary, used for subtle actions)
  secondary: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1F2937',
    900: '#0F172A',
  },

  // Success (green)
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#145231',
  },

  // Warning (amber)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Error / Danger (red)
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Info (blue)
  info: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },
};

/* ============================================================================
   THEME-AWARE COLOR TOKENS
   Light and dark mode semantic colors
   ============================================================================ */

export const themeTokens = {
  light: {
    // Background layers
    bg: colors.neutral[50],
    bgSubtle: colors.neutral[100],
    bgMuted: colors.neutral[200],
    surface: colors.neutral[0] || '#FFFFFF',
    surfaceHover: colors.neutral[100],
    surfaceActive: colors.neutral[200],

    // Text
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
    textMuted: colors.neutral[500],
    textInverted: colors.neutral[50],

    // Borders
    border: colors.neutral[200],
    borderSubtle: colors.neutral[100],

    // Interactive
    primary: colors.primary[600],
    primaryHover: colors.primary[700],
    primaryActive: colors.primary[800],
    primaryMuted: colors.primary[100],

    secondary: colors.secondary[600],
    secondaryHover: colors.secondary[700],
    secondaryMuted: colors.secondary[100],

    // Semantic
    success: colors.success[600],
    warning: colors.warning[600],
    error: colors.error[600],
    info: colors.info[600],
  },

  dark: {
    // Background layers
    bg: colors.neutral[950] || '#0A0A0A',
    bgSubtle: colors.neutral[900],
    bgMuted: colors.neutral[800],
    surface: colors.neutral[900],
    surfaceHover: colors.neutral[800],
    surfaceActive: colors.neutral[700],

    // Text
    text: colors.neutral[50],
    textSecondary: colors.neutral[400],
    textMuted: colors.neutral[500],
    textInverted: colors.neutral[900],

    // Borders
    border: colors.neutral[800],
    borderSubtle: colors.neutral[900],

    // Interactive
    primary: colors.primary[400],
    primaryHover: colors.primary[300],
    primaryActive: colors.primary[200],
    primaryMuted: colors.primary[900],

    secondary: colors.secondary[400],
    secondaryHover: colors.secondary[300],
    secondaryMuted: colors.secondary[900],

    // Semantic
    success: colors.success[400],
    warning: colors.warning[400],
    error: colors.error[400],
    info: colors.info[400],
  },
};

/* ============================================================================
   TYPOGRAPHY SCALE
   Inspired by Stripe & Linear's measured approach
   ============================================================================ */

export const typography = {
  // Font families
  fonts: {
    body: 'system-ui, -apple-system, sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },

  // Font weights
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Sizes and line heights (in rem)
  scales: {
    xs: { size: '0.75rem', lineHeight: 1.5, letterSpacing: 0.5 },      // 12px
    sm: { size: '0.875rem', lineHeight: 1.5, letterSpacing: 0.3 },     // 14px
    base: { size: '1rem', lineHeight: 1.6, letterSpacing: 0 },          // 16px
    lg: { size: '1.125rem', lineHeight: 1.6, letterSpacing: -0.2 },    // 18px
    xl: { size: '1.25rem', lineHeight: 1.6, letterSpacing: -0.3 },     // 20px
    '2xl': { size: '1.5rem', lineHeight: 1.5, letterSpacing: -0.4 },   // 24px
    '3xl': { size: '1.875rem', lineHeight: 1.4, letterSpacing: -0.5 }, // 30px
    '4xl': { size: '2.25rem', lineHeight: 1.3, letterSpacing: -0.6 },  // 36px
    '5xl': { size: '3rem', lineHeight: 1.2, letterSpacing: -0.8 },     // 48px
  },
};

/* ============================================================================
   SPACING SCALE
   Consistent 4px base unit (inspired by Tailwind & Stripe)
   ============================================================================ */

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
};

/* ============================================================================
   BORDER RADIUS SCALE
   Ranges for subtle to prominent curves
   ============================================================================ */

export const radii = {
  none: '0',
  xs: '0.25rem',   // 4px
  sm: '0.375rem',  // 6px
  base: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.25rem',   // 20px
  '2xl': '1.5rem', // 24px
  full: '9999px',  // fully rounded
};

/* ============================================================================
   SHADOWS
   Layered shadows for depth (inspired by Vercel)
   ============================================================================ */

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

/* ============================================================================
   BORDER WIDTHS
   ============================================================================ */

export const borders = {
  none: '0',
  xs: '1px',
  sm: '1px',
  base: '2px',
  md: '3px',
  lg: '4px',
};

/* ============================================================================
   Z-INDEX SCALE
   Consistent layering hierarchy
   ============================================================================ */

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  overlay: 1050,
  popover: 1060,
  tooltip: 1070,
};

/* ============================================================================
   BREAKPOINTS
   Mobile-first responsive design
   ============================================================================ */

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/* ============================================================================
   TRANSITIONS
   Timing functions and durations
   ============================================================================ */

export const transitions = {
  durations: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timings: {
    linear: 'linear',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

/* ============================================================================
   EXPORT ALL TOKENS AS A UNIFIED OBJECT
   ============================================================================ */

export const designTokens = {
  colors,
  themeTokens,
  typography,
  spacing,
  radii,
  shadows,
  borders,
  zIndex,
  breakpoints,
  transitions,
};

export default designTokens;

/**
 * Motion guidelines — Linear / Vercel style
 *
 * Principles:
 * - Prefer opacity + translate (max 8–12px) over scale on large surfaces
 * - Stagger lists at 40–60ms; pages at 80–120ms
 * - Spring only for micro-interactions (buttons, toggles); ease-out for overlays
 * - Honor prefers-reduced-motion via CSS token zeroing + check in components
 */

export const dsDuration = {
  instant: 0,
  fast: 120,
  normal: 200,
  slow: 320,
  slower: 480,
};

export const dsEase = {
  default: [0.4, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
  out: [0, 0, 0.2, 1],
  spring: [0.34, 1.56, 0.64, 1],
  smooth: [0.25, 0.1, 0.25, 1],
};

/** Framer Motion transition presets */
export const dsTransition = {
  fast: { duration: dsDuration.fast / 1000, ease: dsEase.out },
  normal: { duration: dsDuration.normal / 1000, ease: dsEase.default },
  slow: { duration: dsDuration.slow / 1000, ease: dsEase.smooth },
  spring: { type: "spring", stiffness: 420, damping: 32 },
  springSoft: { type: "spring", stiffness: 280, damping: 28 },
};

export const dsStagger = {
  fast: 0.04,
  normal: 0.06,
  slow: 0.08,
};

export const dsVariants = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: dsTransition.normal },
    exit: { opacity: 0, transition: dsTransition.fast },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: dsTransition.normal },
    exit: { opacity: 0, y: 4, transition: dsTransition.fast },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -8 },
    show: { opacity: 1, y: 0, transition: dsTransition.normal },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.96 },
    show: { opacity: 1, scale: 1, transition: dsTransition.springSoft },
    exit: { opacity: 0, scale: 0.98, transition: dsTransition.fast },
  },
  slideRight: {
    hidden: { opacity: 0, x: 12 },
    show: { opacity: 1, x: 0, transition: dsTransition.normal },
  },
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: dsStagger.normal, delayChildren: 0.04 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: dsTransition.normal },
  },
};

export const motionGuidelines = {
  pageEnter: "Use fadeUp on main sections; staggerChildren 0.06",
  modal: "Overlay fade 200ms; panel scaleIn from 0.96 + fade",
  hoverLift: "translateY(-1px) max; cards only, not full-width sections",
  reducedMotion: "Set duration tokens to 0; skip stagger; use opacity-only",
};

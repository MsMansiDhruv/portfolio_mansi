/**
 * Motion & Animation Guidelines
 * Inspired by Linear, Vercel, and Stripe's refined motion design
 */

export const motionConfig = {
  // Durations (milliseconds)
  durations: {
    instant: 0,
    fast: 150,
    base: 200,
    slow: 300,
    slower: 500,
  },

  // Easing functions
  eases: {
    linear: 'linear',
    ease: [0.4, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    // Smooth, natural easing (cubic-bezier approximations)
    smooth: [0.25, 0.46, 0.45, 0.94],
    spring: [0.34, 1.56, 0.64, 1],
  },
};

/* ============================================================================
   FRAMER-MOTION PRESET VARIANTS
   Reusable animation patterns across components
   ============================================================================ */

export const motionVariants = {
  // Fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },

  // Fade in with slight vertical movement
  fadeInUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },

  // Scale and fade
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },

  // Slide in from right
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },

  // Slide in from left
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },

  // Staggered container
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },

  // Staggered item
  staggerItem: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
};

/* ============================================================================
   HOVER & INTERACTION VARIANTS (Framer Motion)
   ============================================================================ */

export const hoverVariants = {
  // Subtle lift effect
  lift: {
    whileHover: { y: -2 },
    whileTap: { y: 0 },
    transition: { duration: 0.2 },
  },

  // Scale up slightly
  scale: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  },

  // Glow effect (uses box-shadow via CSS)
  glow: {
    whileHover: {
      boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)',
    },
    transition: { duration: 0.2 },
  },

  // Combined lift + scale
  interactive: {
    whileHover: { y: -2, scale: 1.01 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  },
};

/* ============================================================================
   CSS KEYFRAME ANIMATIONS
   Defined as strings for direct @keyframes injection
   ============================================================================ */

export const keyframeAnimations = `
  @keyframes ds-fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes ds-fadeInUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes ds-scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes ds-slideInRight {
    from {
      opacity: 0;
      transform: translateX(12px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes ds-slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-12px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes ds-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes ds-shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes ds-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes ds-bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }

  @keyframes ds-ping {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

/* ============================================================================
   UTILITY CLASS ANIMATIONS
   For use with Tailwind or direct class binding
   ============================================================================ */

export const animationUtilities = `
  .ds-animate-fadeIn {
    animation: ds-fadeIn 0.2s ease-out;
  }

  .ds-animate-fadeInUp {
    animation: ds-fadeInUp 0.3s ease-out;
  }

  .ds-animate-scaleIn {
    animation: ds-scaleIn 0.2s ease-out;
  }

  .ds-animate-slideInRight {
    animation: ds-slideInRight 0.3s ease-out;
  }

  .ds-animate-slideInLeft {
    animation: ds-slideInLeft 0.3s ease-out;
  }

  .ds-animate-pulse {
    animation: ds-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .ds-animate-spin {
    animation: ds-spin 1s linear infinite;
  }

  .ds-animate-bounce {
    animation: ds-bounce 1s infinite;
  }

  .ds-animate-ping {
    animation: ds-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;

/* ============================================================================
   PRESET TRANSITIONS
   For use in inline styles or CSS
   ============================================================================ */

export const transitions = {
  smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 0.15s ease-out',
  base: 'all 0.2s ease-out',
  slow: 'all 0.5s ease-out',
  colors: 'color 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out',
  transform: 'transform 0.2s ease-out',
};

export default motionConfig;

"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import "lenis/dist/lenis.css";

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

const OPTIONS = {
  autoRaf: true,
  anchors: true,
  allowNestedScroll: true,
  stopInertiaOnNavigate: true,
  lerp: 0.075,
  duration: 1.35,
  easing: easeOutCubic,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.4,
  syncTouch: true,
  syncTouchLerp: 0.12,
};

function ReducedMotionGate({ children }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (media.matches) lenis.stop();
      else lenis.start();
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [lenis]);

  return children;
}

export default function LenisProvider({ children }) {
  return (
    <ReactLenis root options={OPTIONS}>
      <ReducedMotionGate>{children}</ReducedMotionGate>
    </ReactLenis>
  );
}

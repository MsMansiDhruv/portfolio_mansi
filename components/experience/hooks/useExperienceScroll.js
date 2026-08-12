"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { useScrollProgress } from "@/components/cinema/scroll/useScrollProgress";

export function useExperienceScroll(trackRef, reducedMotion, lenisRef) {
  const nativeProgress = useScrollProgress(trackRef);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    if (lenisRef) lenisRef.current = lenis;

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const scrollable = track.offsetHeight - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const rect = track.getBoundingClientRect();
      const scrolled = Math.min(scrollable, Math.max(0, -rect.top));
      setProgress(scrolled / scrollable);
    };

    lenis.on("scroll", measure);
    measure();

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      if (lenisRef) lenisRef.current = null;
    };
  }, [trackRef, reducedMotion, lenisRef]);

  return reducedMotion ? nativeProgress : progress;
}

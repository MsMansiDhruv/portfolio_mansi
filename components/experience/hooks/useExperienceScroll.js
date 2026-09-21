"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { useScrollProgress } from "@/components/cinema/scroll/useScrollProgress";

export function useExperienceScroll(trackRef, reducedMotion, lenisRef) {
  const lenis = useLenis();
  const nativeProgress = useScrollProgress(trackRef);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion || !lenis) return undefined;
    if (lenisRef) lenisRef.current = lenis;

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
      lenis.off("scroll", measure);
      if (lenisRef) lenisRef.current = null;
    };
  }, [trackRef, reducedMotion, lenisRef, lenis]);

  return reducedMotion || !lenis ? nativeProgress : progress;
}

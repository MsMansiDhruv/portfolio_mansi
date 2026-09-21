"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function ease(t) {
  return t * t * (3 - 2 * t);
}

export function useGsapRise(rootRef) {
  const lenis = useLenis();

  useEffect(() => {
    const root = rootRef?.current;
    if (!root) return undefined;

    const nodes = [...root.querySelectorAll("[data-rise-text]")];
    if (!nodes.length) return undefined;

    const show = () => {
      nodes.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      show();
      return undefined;
    }

    nodes.forEach((el) => {
      el.style.willChange = "transform, opacity";
      el.style.opacity = "0";
      el.style.transform = "translate3d(0, 18px, 0)";
    });

    const tick = () => {
      const vh = window.innerHeight || 1;
      const start = vh * 0.94;
      const end = vh * 0.68;
      const span = Math.max(1, start - end);

      nodes.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        const t = ease(clamp((start - top) / span, 0, 1));
        el.style.opacity = String(t);
        el.style.transform = `translate3d(0, ${(1 - t) * 18}px, 0)`;
      });
    };

    tick();
    const onScroll = () => tick();
    const offLenis = lenis ? lenis.on("scroll", onScroll) : null;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", tick);

    return () => {
      if (typeof offLenis === "function") offLenis();
      else lenis?.off?.("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", tick);
      show();
    };
  }, [rootRef, lenis]);
}

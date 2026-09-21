"use client";

import { useEffect } from "react";

export function useGsapPress(rootRef) {
  useEffect(() => {
    const root = rootRef?.current || document;
    const nodes = [...root.querySelectorAll("[data-gsap-btn]")];
    if (!nodes.length) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    let ctx;
    let killed = false;

    import("gsap").then((mod) => {
      if (killed) return;
      const gsap = mod.gsap;
      ctx = gsap.context(() => {
        nodes.forEach((el) => {
          const enter = () =>
            gsap.to(el, { scale: 1.08, y: -2, duration: 0.28, ease: "power2.out", overwrite: "auto" });
          const leave = () =>
            gsap.to(el, { scale: 1, y: 0, duration: 0.35, ease: "power3.out", overwrite: "auto" });
          const down = () =>
            gsap.to(el, { scale: 0.9, duration: 0.1, ease: "power2.in", overwrite: "auto" });
          const up = () =>
            gsap.to(el, { scale: 1.08, y: -2, duration: 0.32, ease: "back.out(2.2)", overwrite: "auto" });

          el.addEventListener("pointerenter", enter);
          el.addEventListener("pointerleave", leave);
          el.addEventListener("pointerdown", down);
          el.addEventListener("pointerup", up);
          el._gsapPress = { enter, leave, down, up };
        });
      });
    });

    return () => {
      killed = true;
      nodes.forEach((el) => {
        const handlers = el._gsapPress;
        if (!handlers) return;
        el.removeEventListener("pointerenter", handlers.enter);
        el.removeEventListener("pointerleave", handlers.leave);
        el.removeEventListener("pointerdown", handlers.down);
        el.removeEventListener("pointerup", handlers.up);
        delete el._gsapPress;
      });
      ctx?.revert();
    };
  }, [rootRef]);
}

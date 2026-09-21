"use client";

import { useEffect } from "react";

export function useStudioMotion(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    let ctx;
    let killed = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapMod, stMod]) => {
      if (killed) return;
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const path = root.querySelector(".wd-studio-draw path");
        if (path && path.getTotalLength) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: path, start: "top 92%", end: "top 48%", scrub: 0.9 },
          });
        }
      }, root);
      ScrollTrigger.refresh();
    });
    return () => {
      killed = true;
      ctx?.revert();
    };
  }, [ref]);
}

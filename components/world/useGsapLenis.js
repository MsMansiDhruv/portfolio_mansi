"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/**
 * Lenis as the scroll source, GSAP ScrollTrigger as the animation engine.
 * autoRaf stays on Lenis; we only sync ScrollTrigger and disable ticker lag.
 */
export function useGsapLenis(rootRef, setup) {
  const lenis = useLenis();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let ctx;
    let killed = false;
    let offScroll;
    let offTicker;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapMod, stMod]) => {
      if (killed) return;
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

      ctx = gsap.context(() => {
        if (lenis) {
          ScrollTrigger.scrollerProxy(document.documentElement, {
            scrollTop(value) {
              if (arguments.length) lenis.scrollTo(value, { immediate: true });
              return lenis.scroll;
            },
            getBoundingClientRect() {
              return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
            pinType: document.documentElement.style.transform ? "transform" : "fixed",
          });
          const onScroll = () => ScrollTrigger.update();
          lenis.on("scroll", onScroll);
          offScroll = () => lenis.off("scroll", onScroll);
        }
        setup?.(gsap, ScrollTrigger, root, lenis);
        ScrollTrigger.refresh();
      }, root);
    });

    return () => {
      killed = true;
      offScroll?.();
      offTicker?.();
      ctx?.revert();
    };
  }, [lenis, rootRef, setup]);
}

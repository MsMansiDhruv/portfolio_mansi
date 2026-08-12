"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import "@/styles/mansi-precision.css";
import { PRECISION_ASSETS } from "@/lib/data/precision";
import PrecisionNav from "./PrecisionNav";
import PrecisionLoader from "./PrecisionLoader";
import PrecisionWorldCanvas from "./PrecisionWorldCanvas";
import PrecisionOverlay from "./PrecisionOverlay";

const THEME_KEY = "mansi-precision-theme";

function preload(urls) {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        })
    )
  );
}

export default function PrecisionPrototype() {
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState("night");
  const [ready, setReady] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "day" || saved === "night") setTheme(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await preload([
        PRECISION_ASSETS.visual,
        PRECISION_ASSETS.characterMaster,
        PRECISION_ASSETS.nightFocus,
        PRECISION_ASSETS.dayClarity,
      ]);
      if (!cancelled) setReady(true);
      preload([
        PRECISION_ASSETS.hero,
        PRECISION_ASSETS.exhibition,
        PRECISION_ASSETS.transformation,
      ]);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("mp-precision-active");
    document.body.style.overflowX = "hidden";

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.05,
    });
    window.__mpLenis = lenis;

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      const max = Math.max(
        1,
        lenis.limit || document.documentElement.scrollHeight - window.innerHeight
      );
      const next = Math.min(1, Math.max(0, (lenis.scroll || 0) / max));
      progressRef.current = next;
      setProgress((prev) => (Math.abs(prev - next) > 0.0008 ? next : prev));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => lenis.resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      delete window.__mpLenis;
      lenis.destroy();
      document.documentElement.classList.remove("mp-precision-active");
      document.body.style.overflowX = "";
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "night" ? "day" : "night";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <div className="mp-root" data-theme={theme}>
      <PrecisionLoader ready={ready} />
      <PrecisionNav theme={theme} onToggleTheme={toggleTheme} />

      <div className="mp-progress" aria-hidden>
        <div className="mp-progress__track">
          <div
            className="mp-progress__fill"
            style={{ transform: `scaleY(${progress})` }}
          />
        </div>
        <span className="mp-progress__meta">
          {String(Math.round(progress * 100)).padStart(2, "0")}
        </span>
      </div>

      <PrecisionWorldCanvas progressRef={progressRef} theme={theme} />
      <PrecisionOverlay progress={progress} theme={theme} />
      <div className="mp-scroll-space" aria-hidden="true" />
    </div>
  );
}

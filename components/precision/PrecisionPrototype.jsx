"use client";

import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import "@/styles/mansi-precision.css";
import {
  PRECISION_ASSETS,
} from "@/lib/data/precision";
import PrecisionNav from "./PrecisionNav";
import PrecisionLoader from "./PrecisionLoader";
import CinematicStage from "./CinematicStage";

const THEME_KEY = "mansi-precision-theme";

function preloadImages(urls) {
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "day" || saved === "night") setTheme(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const primary = [
      PRECISION_ASSETS.hero,
      PRECISION_ASSETS.observing,
      PRECISION_ASSETS.nightFocus,
      PRECISION_ASSETS.dayClarity,
      PRECISION_ASSETS.signature,
    ];
    const secondary = [
      PRECISION_ASSETS.visual,
      PRECISION_ASSETS.clarifying,
      PRECISION_ASSETS.exhibition,
      PRECISION_ASSETS.transformation,
      PRECISION_ASSETS.lookingBack,
    ];

    let cancelled = false;

    (async () => {
      await preloadImages(primary);
      if (!cancelled) setReady(true);
      preloadImages(secondary);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("mp-precision-active");
    document.body.style.overflowX = "hidden";

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

    // Allow cinematic scrubbing from console / QA without fighting Lenis.
    window.__mpLenis = lenis;

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      const max = Math.max(
        1,
        lenis.limit || document.documentElement.scrollHeight - window.innerHeight
      );
      const scroll = lenis.scroll || 0;
      const next = Math.min(1, Math.max(0, scroll / max));
      setProgress((prev) => (Math.abs(prev - next) > 0.0005 ? next : prev));
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

      <CinematicStage progress={progress} theme={theme} />
      <div className="mp-scroll-space" aria-hidden="true" />
    </div>
  );
}

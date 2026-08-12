"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import "@/styles/mansi-precision.css";
import { PRECISION_ASSETS } from "@/lib/data/precision";
import PrecisionNav from "./PrecisionNav";
import PrecisionLoader from "./PrecisionLoader";
import PrecisionWorldCanvas from "./PrecisionWorldCanvas";
import PrecisionOverlay from "./PrecisionOverlay";
import ExhibitionPanel, { nearestExhibitFromProgress } from "./ExhibitionPanel";
import JourneyDock from "./JourneyDock";
import { EXHIBITION_EXHIBITS } from "@/lib/data/exhibition-exhibits";

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
  const [activeExhibit, setActiveExhibit] = useState(null);
  const [phase, setPhase] = useState("immerse");
  const progressRef = useRef(0);
  const exhibitRef = useRef({ active: false, cam: null, look: null, fov: 36 });
  const lenisRef = useRef(null);
  const savedScrollRef = useRef(0);

  const nearExhibit = useMemo(
    () => (activeExhibit ? null : nearestExhibitFromProgress(progress)),
    [progress, activeExhibit]
  );

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
        PRECISION_ASSETS.nightFocus,
        PRECISION_ASSETS.dayClarity,
        PRECISION_ASSETS.exhibition,
      ]);
      if (!cancelled) setReady(true);
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
    lenisRef.current = lenis;

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      if (!exhibitRef.current.active) {
        const max = Math.max(
          1,
          lenis.limit || document.documentElement.scrollHeight - window.innerHeight
        );
        const next = Math.min(1, Math.max(0, (lenis.scroll || 0) / max));
        progressRef.current = next;
        setProgress((prev) => (Math.abs(prev - next) > 0.0008 ? next : prev));
      }
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
      lenisRef.current = null;
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

  const onEnter = useCallback((exhibit) => {
    if (!exhibit || activeExhibit?.slug === exhibit.slug) return;
    savedScrollRef.current = lenisRef.current?.scroll || 0;
    lenisRef.current?.stop();
    exhibitRef.current = {
      active: true,
      token: Date.now(),
      cam: exhibit.roomCam,
      look: exhibit.roomLook,
      fov: 34,
      mid: {
        position: [
          exhibit.roomCam[0] * 0.45,
          1.75,
          exhibit.roomCam[2] + 1.4,
        ],
        lookAt: exhibit.roomLook,
      },
    };
    setActiveExhibit(exhibit);
    setPhase("immerse");
  }, [activeExhibit]);

  const onRead = useCallback(() => {
    setPhase("read");
  }, []);

  const onReturn = useCallback(() => {
    exhibitRef.current = { active: false, cam: null, look: null, fov: 36, mid: null };
    setActiveExhibit(null);
    setPhase("immerse");
    document.body.style.cursor = "auto";
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.start();
      lenis.scrollTo(savedScrollRef.current, { immediate: false });
    }
  }, []);

  const currentIndex = useMemo(() => {
    const cur = activeExhibit || nearExhibit || EXHIBITION_EXHIBITS[0];
    const i = EXHIBITION_EXHIBITS.findIndex((e) => e.slug === cur?.slug);
    return i < 0 ? 0 : i;
  }, [activeExhibit, nearExhibit]);

  const scrollToExhibit = useCallback((exhibit) => {
    const lenis = lenisRef.current;
    if (!lenis || !exhibit) return;
    const max = Math.max(
      1,
      lenis.limit || document.documentElement.scrollHeight - window.innerHeight
    );
    const target = Math.min(0.96, (exhibit.appearAt ?? 0.1) + 0.05) * max;
    lenis.start();
    lenis.scrollTo(target, { duration: 1.55, easing: (t) => 1 - Math.pow(1 - t, 3) });
  }, []);

  const goToIndex = useCallback(
    (index) => {
      const next = EXHIBITION_EXHIBITS[index];
      if (!next) return;

      if (activeExhibit) {
        // Smooth camera hop between rooms while inside
        exhibitRef.current = {
          active: true,
          token: Date.now(),
          cam: next.roomCam,
          look: next.roomLook,
          fov: 34,
          mid: {
            position: [
              (exhibitRef.current.cam?.[0] ?? 0) * 0.5 + next.roomCam[0] * 0.5,
              1.8,
              ((exhibitRef.current.cam?.[2] ?? next.roomCam[2]) + next.roomCam[2]) * 0.5,
            ],
            lookAt: next.roomLook,
          },
        };
        setActiveExhibit(next);
        setPhase("immerse");
        savedScrollRef.current =
          Math.min(0.96, (next.appearAt ?? 0.1) + 0.05) *
          Math.max(1, lenisRef.current?.limit || 1);
        return;
      }

      scrollToExhibit(next);
    },
    [activeExhibit, scrollToExhibit]
  );

  const onPrev = useCallback(() => {
    goToIndex(Math.max(0, currentIndex - 1));
  }, [currentIndex, goToIndex]);

  const onNext = useCallback(() => {
    goToIndex(Math.min(EXHIBITION_EXHIBITS.length - 1, currentIndex + 1));
  }, [currentIndex, goToIndex]);

  // Longer scroll — instruments appear along approach
  useEffect(() => {
    document.documentElement.style.setProperty("--mp-scroll-h", "720vh");
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

      <PrecisionWorldCanvas
        progressRef={progressRef}
        theme={theme}
        exhibitRef={exhibitRef}
        activeSlug={activeExhibit?.slug || null}
        nearSlug={nearExhibit?.slug || null}
        onSelectExhibit={onEnter}
      />
      <PrecisionOverlay progress={progress} theme={theme} exhibitActive={!!activeExhibit} />
      <ExhibitionPanel
        theme={theme}
        progress={progress}
        nearExhibit={nearExhibit}
        activeExhibit={activeExhibit}
        phase={phase}
        onEnter={onEnter}
        onRead={onRead}
        onReturn={onReturn}
      />
      <JourneyDock
        theme={theme}
        activeExhibit={activeExhibit}
        nearExhibit={nearExhibit}
        onPrev={onPrev}
        onNext={onNext}
        onEnter={onEnter}
        onReturn={onReturn}
        onRead={onRead}
        phase={phase}
      />
      <div className="mp-scroll-space" aria-hidden="true" />
    </div>
  );
}

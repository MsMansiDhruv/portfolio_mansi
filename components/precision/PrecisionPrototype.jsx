"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState("night");
  const [ready, setReady] = useState(false);
  const [activeExhibit, setActiveExhibit] = useState(null);
  const [phase, setPhase] = useState("immerse");
  const progressRef = useRef(0);
  const exhibitRef = useRef({ active: false, cam: null, look: null, fov: 36 });
  const lenisRef = useRef(null);
  const savedScrollRef = useRef(0);
  const pendingRouteRef = useRef(null);

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
      await preload([PRECISION_ASSETS.lookingBack, PRECISION_ASSETS.hero]);
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("mp-precision-active");
    document.body.classList.add("mp-cinematic-cursor");
    document.body.style.overflowX = "hidden";

    const onMove = (e) => {
      const el = document.querySelector(".mp-cursor");
      if (el) el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    window.addEventListener("pointermove", onMove);

    const lenis = new Lenis({
      duration: 1.45,
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

        if (pendingRouteRef.current && Math.abs(next - pendingRouteRef.current.at) < 0.025) {
          const href = pendingRouteRef.current.href;
          pendingRouteRef.current = null;
          router.push(href);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => lenis.resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      delete window.__mpLenis;
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("mp-precision-active");
      document.body.classList.remove("mp-cinematic-cursor");
      document.body.style.overflowX = "";
    };
  }, [router]);

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

  const travelToProgress = useCallback((t, opts = {}) => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (activeExhibit) {
      exhibitRef.current = { active: false, cam: null, look: null, fov: 36, mid: null };
      setActiveExhibit(null);
      setPhase("immerse");
    }
    const max = Math.max(
      1,
      lenis.limit || document.documentElement.scrollHeight - window.innerHeight
    );
    lenis.start();
    if (opts.href) {
      pendingRouteRef.current = { href: opts.href, at: t };
    } else {
      pendingRouteRef.current = null;
    }
    lenis.scrollTo(Math.min(0.99, Math.max(0, t)) * max, {
      duration: opts.duration ?? 1.8,
      easing: (x) => 1 - Math.pow(1 - x, 3),
    });
  }, [activeExhibit]);

  const onTravel = useCallback(
    (link) => {
      if (!link) return;
      travelToProgress(link.progress ?? 0, {
        href: link.href || null,
        duration: link.href ? 1.5 : 1.85,
      });
    },
    [travelToProgress]
  );

  const onEnter = useCallback((exhibit) => {
    if (!exhibit || activeExhibit?.slug === exhibit.slug) return;
    savedScrollRef.current = lenisRef.current?.scroll || 0;
    lenisRef.current?.stop();
    // Particle-path mid: approach along data stream into the room
    exhibitRef.current = {
      active: true,
      token: Date.now(),
      cam: exhibit.roomCam,
      look: exhibit.roomLook,
      fov: 32,
      mid: {
        position: [
          exhibit.position[0] * 0.35,
          1.7,
          exhibit.position[2] + 3.2,
        ],
        lookAt: [
          exhibit.position[0],
          1.45,
          exhibit.position[2] + 0.5,
        ],
      },
    };
    setActiveExhibit(exhibit);
    setPhase("immerse");
  }, [activeExhibit]);

  const onRead = useCallback(() => setPhase("read"), []);

  const onReturn = useCallback(() => {
    exhibitRef.current = { active: false, cam: null, look: null, fov: 36, mid: null };
    setActiveExhibit(null);
    setPhase("immerse");
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
    if (!exhibit) return;
    travelToProgress((exhibit.appearAt ?? 0.74) + 0.03, { duration: 1.6 });
  }, [travelToProgress]);

  const goToIndex = useCallback(
    (index) => {
      const next = EXHIBITION_EXHIBITS[index];
      if (!next) return;
      if (activeExhibit) {
        exhibitRef.current = {
          active: true,
          token: Date.now(),
          cam: next.roomCam,
          look: next.roomLook,
          fov: 32,
          mid: {
            position: [
              ((exhibitRef.current.cam?.[0] ?? next.roomCam[0]) + next.roomCam[0]) * 0.5,
              1.75,
              ((exhibitRef.current.cam?.[2] ?? next.roomCam[2]) + next.roomCam[2]) * 0.5,
            ],
            lookAt: next.roomLook,
          },
        };
        setActiveExhibit(next);
        setPhase("immerse");
        return;
      }
      scrollToExhibit(next);
    },
    [activeExhibit, scrollToExhibit]
  );

  useEffect(() => {
    document.documentElement.style.setProperty("--mp-scroll-h", "820vh");
  }, []);

  return (
    <div className="mp-root" data-theme={theme}>
      <PrecisionLoader ready={ready} />
      <PrecisionNav theme={theme} onToggleTheme={toggleTheme} onTravel={onTravel} />

      <div className="mp-progress" aria-hidden>
        <div className="mp-progress__track">
          <div className="mp-progress__fill" style={{ transform: `scaleY(${progress})` }} />
        </div>
        <span className="mp-progress__meta">
          {String(Math.round(progress * 100)).padStart(2, "0")}
        </span>
      </div>

      <div className="mp-cursor" aria-hidden />

      <PrecisionWorldCanvas
        progressRef={progressRef}
        theme={theme}
        exhibitRef={exhibitRef}
        activeSlug={activeExhibit?.slug || null}
        nearSlug={nearExhibit?.slug || null}
        onSelectExhibit={onEnter}
        activeExhibit={activeExhibit}
      />
      <PrecisionOverlay progress={progress} theme={theme} exhibitActive={!!activeExhibit} />
      <ExhibitionPanel
        theme={theme}
        progress={progress}
        nearExhibit={nearExhibit}
        activeExhibit={activeExhibit}
        phase={phase}
        onRead={onRead}
        onReturn={onReturn}
      />
      <JourneyDock
        theme={theme}
        activeExhibit={activeExhibit}
        nearExhibit={nearExhibit}
        onPrev={() => goToIndex(Math.max(0, currentIndex - 1))}
        onNext={() => goToIndex(Math.min(EXHIBITION_EXHIBITS.length - 1, currentIndex + 1))}
        onEnter={onEnter}
        onReturn={onReturn}
        onRead={onRead}
        phase={phase}
      />
      <div className="mp-scroll-space" aria-hidden="true" />
    </div>
  );
}

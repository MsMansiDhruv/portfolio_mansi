"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/design-system-v2";
import WorldLoader from "./WorldLoader";
import ExperienceNav from "./ExperienceNav";
import ExperienceGlobe from "./ExperienceGlobe";
import ExperienceOverlay from "./ExperienceOverlay";
import ExperienceFallback from "./ExperienceFallback";
import QuickViewPanel from "@/components/universe/QuickViewPanel";
import { useExperienceScroll } from "./hooks/useExperienceScroll";
import { EXPERIENCE_SCROLL_VH, chapterFromProgress } from "@/lib/data/mansi-experience";
import "@/styles/mansi-experience.css";
import "@/styles/mansi-world.css";

export default function MansiExperience() {
  const reduced = useReducedMotion();
  const { isDark } = useTheme();
  const trackRef = useRef(null);
  const lenisRef = useRef(null);
  const cursorRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);

  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (mobile || reduced) return;
    const el = cursorRef.current;
    if (!el) return;
    const move = (e) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    const down = () => setCursorActive(true);
    const up = () => setCursorActive(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [mobile, reduced]);

  const progress = useExperienceScroll(trackRef, Boolean(reduced || mobile), lenisRef);
  const chapter = chapterFromProgress(progress);

  if (reduced || mobile) {
    return <ExperienceFallback />;
  }

  return (
    <div className="mx-root" data-theme={isDark ? "dark" : "light"} data-chapter={chapter}>
      {!ready ? <WorldLoader onReady={handleReady} /> : null}

      <div ref={cursorRef} className={`mx-cursor ${cursorActive ? "is-active" : ""}`} aria-hidden>
        <span className="mx-cursor-dot" />
      </div>

      <ExperienceNav onQuickView={() => setQuickOpen(true)} />
      <QuickViewPanel open={quickOpen} onClose={() => setQuickOpen(false)} />

      <div className="mx-progress" aria-hidden>
        <div className="mx-progress-fill" style={{ height: `${progress * 100}%` }} />
      </div>

      <div ref={trackRef} className="mx-track" style={{ height: `${EXPERIENCE_SCROLL_VH}vh` }}>
        <div className="mx-fixed">
          <ExperienceGlobe progress={progress} visible={ready} />
        </div>
      </div>

      {ready ? <ExperienceOverlay progress={progress} /> : null}
    </div>
  );
}

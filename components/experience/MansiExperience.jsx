"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/design-system-v2";
import WorldLoader from "./WorldLoader";
import ExperienceNav from "./ExperienceNav";
import ExperienceGlobe from "./ExperienceGlobe";
import ExperienceOverlay from "./ExperienceOverlay";
import ExperienceFallback from "./ExperienceFallback";
import CinematicBackdrop from "./CinematicBackdrop";
import QuickViewPanel from "@/components/universe/QuickViewPanel";
import StoryCursor from "@/components/world/StoryCursor";
import { useExperienceScroll } from "./hooks/useExperienceScroll";
import { EXPERIENCE_SCROLL_VH, EXPERIENCE_TERRITORIES } from "@/lib/data/mansi-experience";
import "@/styles/mansi-experience.css";
import "@/styles/mansi-world.css";

export default function MansiExperience() {
  const reduced = useReducedMotion();
  const { isDark } = useTheme();
  const trackRef = useRef(null);
  const lenisRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [territory, setTerritory] = useState(null);

  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const progress = useExperienceScroll(trackRef, Boolean(reduced || mobile), lenisRef);

  const handleTerritoryHover = useCallback((idx) => {
    setTerritory(idx >= 0 ? EXPERIENCE_TERRITORIES[idx] ?? null : null);
  }, []);

  const handleTerritoryClick = useCallback((idx) => {
    const dest = EXPERIENCE_TERRITORIES[idx];
    if (!dest || !trackRef.current) return;
    const top = dest.scrollTo * (trackRef.current.offsetHeight - window.innerHeight);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(top, {
        duration: 2.6,
        easing: (x) => 1 - Math.pow(1 - x, 3),
      });
    } else {
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  if (reduced || mobile) {
    return <ExperienceFallback />;
  }

  return (
    <div className="mx-root" data-theme={isDark ? "dark" : "light"}>
      {!ready ? <WorldLoader onReady={handleReady} /> : null}

      <StoryCursor />
      <ExperienceNav onQuickView={() => setQuickOpen(true)} />
      <QuickViewPanel open={quickOpen} onClose={() => setQuickOpen(false)} />

      <div className="mx-progress" aria-hidden>
        <div className="mx-progress-fill" style={{ height: `${progress * 100}%` }} />
      </div>

      <div ref={trackRef} className="mx-track" style={{ height: `${EXPERIENCE_SCROLL_VH}vh` }}>
        <div className="mx-fixed">
          {ready ? <CinematicBackdrop progress={progress} /> : null}
          <ExperienceGlobe
            progress={progress}
            visible={ready}
            onTerritoryHover={handleTerritoryHover}
            onTerritoryClick={handleTerritoryClick}
          />
          <div className="mx-vignette pointer-events-none" aria-hidden />
        </div>
      </div>

      <div className="mx-grain" aria-hidden />

      <div className={`mx-territory ${territory ? "is-visible" : ""}`} aria-live="polite">
        {territory ? (
          <>
            <p className="mx-mono mx-territory-label">{territory.label}</p>
            <p className="mx-mono mx-territory-sub">{territory.sub.join(" · ")}</p>
            <p className="mx-mono mx-territory-hint">Click to travel</p>
          </>
        ) : null}
      </div>

      {ready ? <ExperienceOverlay progress={progress} /> : null}
    </div>
  );
}

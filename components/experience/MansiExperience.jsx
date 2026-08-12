"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/design-system-v2";
import WorldLoader from "./WorldLoader";
import ExperienceNav from "./ExperienceNav";
import ExperienceGlobe from "./ExperienceGlobe";
import ExperienceVisual from "./ExperienceVisual";
import ExperienceOverlay from "./ExperienceOverlay";
import ExperienceFallback from "./ExperienceFallback";
import QuickViewPanel from "@/components/universe/QuickViewPanel";
import StoryCursor from "@/components/world/StoryCursor";
import { useExperienceScroll } from "./hooks/useExperienceScroll";
import { EXPERIENCE_SCROLL_VH } from "@/lib/data/mansi-experience";
import "@/styles/mansi-experience.css";
import "@/styles/mansi-world.css";

export default function MansiExperience() {
  const reduced = useReducedMotion();
  const { isDark } = useTheme();
  const trackRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const progress = useExperienceScroll(trackRef, Boolean(reduced || mobile));

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
          <ExperienceGlobe progress={progress} visible={ready} />
          {ready ? <ExperienceVisual progress={progress} /> : null}
        </div>
      </div>

      <div className="mx-grain" aria-hidden />

      {ready ? <ExperienceOverlay progress={progress} /> : null}
    </div>
  );
}

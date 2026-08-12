"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/design-system-v2";
import WorldLoader from "./WorldLoader";
import ExperienceNav from "./ExperienceNav";
import ExperienceGlobe from "./ExperienceGlobe";
import ExperienceOverlay from "./ExperienceOverlay";
import ExperienceFallback from "./ExperienceFallback";
import QuickViewPanel from "@/components/universe/QuickViewPanel";
import { useExperienceScroll } from "./hooks/useExperienceScroll";
import { EXPERIENCE_SCROLL_VH, EXPERIENCE_TERRITORIES } from "@/lib/data/mansi-experience";
import "@/styles/mansi-experience.css";
import "@/styles/mansi-world.css";

function hexCss(n) {
  return `#${n.toString(16).padStart(6, "0")}`;
}

export default function MansiExperience() {
  const reduced = useReducedMotion();
  const { isDark } = useTheme();
  const router = useRouter();
  const trackRef = useRef(null);
  const lenisRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [territory, setTerritory] = useState(null);
  const [hotIdx, setHotIdx] = useState(-1);

  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const progress = useExperienceScroll(trackRef, Boolean(reduced || mobile), lenisRef);
  const showSystemsHud = ready && progress >= 0.05 && progress <= 0.45;

  const travelOrNavigate = useCallback(
    (idx) => {
      const dest = EXPERIENCE_TERRITORIES[idx];
      if (!dest) return;
      if (dest.href) {
        router.push(dest.href);
        return;
      }
      if (!trackRef.current) return;
      const top = dest.scrollTo * (trackRef.current.offsetHeight - window.innerHeight);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(top, {
          duration: 1.8,
          easing: (x) => 1 - Math.pow(1 - x, 3),
        });
      } else {
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    [router]
  );

  const handleTerritoryHover = useCallback((idx) => {
    setHotIdx(idx);
    setTerritory(idx >= 0 ? EXPERIENCE_TERRITORIES[idx] ?? null : null);
  }, []);

  if (reduced || mobile) {
    return <ExperienceFallback />;
  }

  return (
    <div className="mx-root" data-theme={isDark ? "dark" : "light"}>
      {!ready ? <WorldLoader onReady={handleReady} /> : null}

      <ExperienceNav onQuickView={() => setQuickOpen(true)} />
      <QuickViewPanel open={quickOpen} onClose={() => setQuickOpen(false)} />

      <div className="mx-progress" aria-hidden>
        <div className="mx-progress-fill" style={{ height: `${progress * 100}%` }} />
      </div>

      <div ref={trackRef} className="mx-track" style={{ height: `${EXPERIENCE_SCROLL_VH}vh` }}>
        <div className="mx-fixed">
          <ExperienceGlobe
            progress={progress}
            visible={ready}
            onTerritoryHover={handleTerritoryHover}
            onTerritoryClick={travelOrNavigate}
          />
        </div>
      </div>

      <div className={`mx-systems-hud ${showSystemsHud ? "is-visible" : ""}`} aria-label="Systems map">
        {EXPERIENCE_TERRITORIES.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`mx-systems-chip ${item.id === "lab" ? "mx-systems-chip--lab" : ""} ${hotIdx === idx ? "is-hot" : ""}`}
            style={{ "--chip-color": hexCss(item.color) }}
            onClick={() => travelOrNavigate(idx)}
            onMouseEnter={() => handleTerritoryHover(idx)}
            onMouseLeave={() => handleTerritoryHover(-1)}
          >
            <span className="mx-systems-chip-dot" aria-hidden />
            {item.label}
            {item.href ? " →" : ""}
          </button>
        ))}
      </div>

      <div className={`mx-territory ${territory ? "is-visible" : ""}`} aria-live="polite">
        {territory ? (
          <>
            <p className="mx-mono mx-territory-label" style={{ color: hexCss(territory.color) }}>
              {territory.label}
            </p>
            <p className="mx-mono mx-territory-sub">{territory.sub.join(" · ")}</p>
            <p className="mx-mono mx-territory-hint">{territory.hint || "Click to travel"}</p>
          </>
        ) : null}
      </div>

      {ready ? <ExperienceOverlay progress={progress} /> : null}
    </div>
  );
}

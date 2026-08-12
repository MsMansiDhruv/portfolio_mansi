"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/design-system-v2";
import SilhouetteCharacter from "@/components/anime-cinema/SilhouetteCharacter";
import UniverseCanvas from "./UniverseCanvas";
import UniverseNav from "./UniverseNav";
import QuickViewPanel from "./QuickViewPanel";
import UniverseFallback from "./UniverseFallback";
import {
  UNIVERSE_OPENING,
  UNIVERSE_NODES,
  UNIVERSE_FINAL,
} from "@/lib/data/universe-nodes";
import {
  markNodeExplored,
  getExplorationRatio,
  isUniverseAwakened,
} from "@/lib/universe/exploration";
import "@/styles/universe.css";

export default function UniverseHome() {
  const reduced = useReducedMotion();
  const { isDark } = useTheme();
  const worldRef = useRef(null);
  const [mobile, setMobile] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [vignette, setVignette] = useState(null);
  const [introVisible, setIntroVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(null);
  const [showFinal, setShowFinal] = useState(false);
  const [exploredRatio, setExploredRatio] = useState(0);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    const t = setTimeout(() => setIntroVisible(true), 800);

    const ratio = getExplorationRatio(UNIVERSE_NODES.length);
    setExploredRatio(ratio);
    if (isUniverseAwakened(UNIVERSE_NODES.length)) {
      setShowFinal(true);
    }

    return () => {
      window.removeEventListener("resize", check);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    worldRef.current?.setConnectedLevel(exploredRatio);
  }, [exploredRatio]);

  function handleNodeEngage(node) {
    if (!node?.id) return;
    markNodeExplored(node.id);
    const ratio = getExplorationRatio(UNIVERSE_NODES.length);
    setExploredRatio(ratio);
    if (isUniverseAwakened(UNIVERSE_NODES.length)) {
      setShowFinal(true);
    }
  }

  if (reduced || mobile) {
    return <UniverseFallback />;
  }

  return (
    <div className="universe-root universe-enter-flash" data-theme={isDark ? "dark" : "light"}>
      <UniverseNav onQuickView={() => setQuickOpen(true)} />
      <QuickViewPanel open={quickOpen} onClose={() => setQuickOpen(false)} />

      <UniverseCanvas
        worldRef={worldRef}
        onHover={(node) => {
          if (node?.click) {
            handleNodeEngage(node);
            setVignette(node);
          } else {
            setHovered(node);
          }
        }}
        onTransitionStart={(node) => {
          handleNodeEngage(node);
          setTransitioning(node);
        }}
      />

      <div className="universe-grain" aria-hidden />

      <div className={`universe-transition-veil ${transitioning ? "is-active" : ""}`} aria-hidden />

      <div className="universe-silhouette">
        <SilhouetteCharacter pose="back" facing="right" rim={isDark ? "warm" : "cyan"} />
      </div>

      <div className="universe-hud">
        <div
          className={`universe-node-preview ${hovered ? "is-visible" : ""}`}
          role="status"
          aria-live="polite"
        >
          {hovered ? (
            <>
              <p className="universe-node-label">{hovered.label}</p>
              <p className="universe-node-hint">{hovered.hint}</p>
              {hovered.href ? (
                <p className="story-mono mt-2 text-[10px] text-[var(--u-muted)]">Click to enter →</p>
              ) : null}
            </>
          ) : null}
        </div>

        <div
          className={`universe-opening ${showFinal ? "is-dimmed" : ""}`}
          style={{ opacity: introVisible ? 1 : 0 }}
        >
          <h1 className="universe-name">{UNIVERSE_OPENING.name}</h1>
          <p className="universe-tagline">{UNIVERSE_OPENING.tagline}</p>
          <p className="universe-whisper">{UNIVERSE_OPENING.whisper}</p>
          <p className="story-mono mt-6 text-[10px] text-[var(--u-muted)] opacity-60">
            Drag the world · Hover nodes · Click to explore
          </p>
        </div>

        {showFinal ? (
          <div className="universe-final-scene">
            <p className="universe-final-line">{UNIVERSE_FINAL.line1}</p>
            <p className="universe-final-line">{UNIVERSE_FINAL.line2}</p>
            <p className="universe-name mt-6 text-2xl">{UNIVERSE_OPENING.name}</p>
            <Link href="/contact" className="universe-final-cta">
              {UNIVERSE_FINAL.cta}
            </Link>
          </div>
        ) : null}
      </div>

      {vignette ? (
        <div className="universe-vignette-panel" role="dialog" aria-modal="true">
          <div className="universe-vignette-inner">
            <p className="universe-node-label">{vignette.label}</p>
            <p className="universe-node-hint mt-4">{vignette.vignette}</p>
            <button
              type="button"
              className="story-mono mt-8 text-[var(--u-muted)] hover:text-[var(--u-ivory)]"
              onClick={() => setVignette(null)}
            >
              Return to universe
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

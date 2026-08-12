"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/design-system-v2";
import SilhouetteCharacter from "@/components/anime-cinema/SilhouetteCharacter";
import UniverseNav from "./UniverseNav";
import QuickViewPanel from "./QuickViewPanel";
import { UNIVERSE_NODES, UNIVERSE_OPENING } from "@/lib/data/universe-nodes";
import "@/styles/universe.css";

/** Touch-friendly constellation — same story, no WebGL */
export default function UniverseFallback() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [quickOpen, setQuickOpen] = useState(false);
  const [vignette, setVignette] = useState(null);

  function openNode(node) {
    if (node.href) router.push(node.href);
    else if (node.vignette) setVignette(node);
  }

  return (
    <div className="universe-root min-h-screen" data-theme={isDark ? "dark" : "light"}>
      <UniverseNav onQuickView={() => setQuickOpen(true)} />
      <QuickViewPanel open={quickOpen} onClose={() => setQuickOpen(false)} />
      <div className="universe-grain" aria-hidden />

      <div className="px-5 pt-28 text-center">
        <div className="mx-auto mb-8 h-36 w-20 opacity-50">
          <SilhouetteCharacter pose="back" facing="right" rim="warm" />
        </div>
        <h1 className="universe-name">{UNIVERSE_OPENING.name}</h1>
        <p className="universe-tagline">{UNIVERSE_OPENING.tagline}</p>
        <p className="universe-whisper">{UNIVERSE_OPENING.whisper}</p>
      </div>

      <div className="universe-mobile-nodes">
        {UNIVERSE_NODES.map((node) => (
          <button key={node.id} type="button" className="universe-mobile-node" onClick={() => openNode(node)}>
            <p className="universe-node-label">{node.label}</p>
            <p className="mt-1 text-sm text-[var(--u-muted)]">{node.hint}</p>
          </button>
        ))}
      </div>

      {vignette ? (
        <div className="universe-vignette-panel">
          <div className="universe-vignette-inner">
            <p className="universe-node-label">{vignette.label}</p>
            <p className="mt-4 text-sm italic">{vignette.vignette}</p>
            <button type="button" className="story-mono mt-6 text-[var(--u-muted)]" onClick={() => setVignette(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

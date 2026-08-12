"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/design-system-v2";
import { UNIVERSE_FLAT_NAV } from "@/lib/data/universe-nodes";
import { SilhouetteEmblem } from "@/components/anime-cinema/SilhouetteCharacter";

export default function UniverseNav({ onQuickView }) {
  const { isDark, setTheme } = useTheme();

  return (
    <header className="universe-nav">
      <Link href="/" className="flex items-center gap-2">
        <SilhouetteEmblem className="h-5 w-5 text-[var(--u-vermilion)] opacity-80" />
        <span className="story-mono text-[10px] tracking-[0.2em] text-[var(--u-muted)]">UNIVERSE</span>
      </Link>

      <nav className="universe-flat-nav" aria-label="Secondary navigation">
        {UNIVERSE_FLAT_NAV.map((item) => (
          <Link key={item.id} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button type="button" className="universe-quick-btn" onClick={onQuickView}>
          Quick view
        </button>
        <button
          type="button"
          className="universe-theme-btn"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
        >
          {isDark ? "Day" : "Night"}
        </button>
      </div>
    </header>
  );
}

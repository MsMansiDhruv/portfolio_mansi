"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/design-system-v2";
import SilhouetteCharacter from "@/components/anime-cinema/SilhouetteCharacter";
import ExperienceNav from "./ExperienceNav";
import QuickViewPanel from "@/components/universe/QuickViewPanel";
import { EXPERIENCE_OPENING, EXPERIENCE_NAV } from "@/lib/data/mansi-experience";

/** Cinematic 2.5D mobile interpretation */
export default function ExperienceFallback() {
  const { isDark } = useTheme();
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <div className="mx-root min-h-screen" data-theme={isDark ? "dark" : "light"}>
      <ExperienceNav onQuickView={() => setQuickOpen(true)} />
      <QuickViewPanel open={quickOpen} onClose={() => setQuickOpen(false)} />

      <div className="mx-grain" aria-hidden />

      <div className="px-5 pt-28 text-center">
        <div className="mx-auto mb-8 h-36 w-20 opacity-60">
          <SilhouetteCharacter pose="back" facing="right" rim="warm" />
        </div>
        <h1 className="mx-statement mx-statement--hero text-3xl">{EXPERIENCE_OPENING.name}</h1>
        <p className="mx-statement--whisper mt-4 text-xl">{EXPERIENCE_OPENING.world}</p>
        <p className="mx-mono mt-4 text-[var(--mx-vermilion)]">{EXPERIENCE_OPENING.tagline}</p>
      </div>

      <div className="mx-fallback-grid max-w-lg mx-auto pb-16">
        {EXPERIENCE_NAV.filter((n) => n.href !== "/").map((item) => (
          <Link key={item.id} href={item.href} className="mx-fallback-card block">
            <p className="mx-mono text-[var(--mx-vermilion)]">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

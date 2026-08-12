"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/design-system-v2";
import ExperienceNav from "./ExperienceNav";
import QuickViewPanel from "@/components/universe/QuickViewPanel";
import {
  EXPERIENCE_OPENING,
  EXPERIENCE_NAV,
  EXPERIENCE_INSTALLATIONS,
  EXPERIENCE_CHAMBERS,
  EXPERIENCE_COPY,
} from "@/lib/data/mansi-experience";

/** Mobile / reduced-motion — same Living System story without WebGL */
export default function ExperienceFallback() {
  const { isDark } = useTheme();
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <div className="mx-root min-h-screen" data-theme={isDark ? "dark" : "light"}>
      <ExperienceNav onQuickView={() => setQuickOpen(true)} />
      <QuickViewPanel open={quickOpen} onClose={() => setQuickOpen(false)} />

      <div className="px-5 pt-28 text-center">
        <p className="mx-coord">01 · UNKNOWN</p>
        <h1 className="mx-statement mx-statement--hero text-5xl sm:text-6xl">{EXPERIENCE_OPENING.name}</h1>
        <p className="mx-enter">{EXPERIENCE_OPENING.enter}</p>
        <p className="mx-whisper mx-auto mt-10">{EXPERIENCE_COPY.person.line3}</p>
      </div>

      <div className="mx-fallback-grid mx-auto max-w-lg">
        <p className="mx-coord px-1">05 · EXHIBITION</p>
        {EXPERIENCE_INSTALLATIONS.map((p, i) => (
          <Link key={p.slug} href={p.href} className="mx-fallback-card block">
            <p className="mx-mono text-[var(--mx-amber)]">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-lg">{p.title}</p>
            <p className="mt-2 text-sm opacity-70">{p.problem}</p>
          </Link>
        ))}

        <p className="mx-coord mt-6 px-1">06 · REASONING</p>
        {EXPERIENCE_CHAMBERS.map((c) => (
          <Link key={c.id} href={c.href} className="mx-fallback-card block">
            <p className="mx-mono text-[var(--mx-signal)]">{c.label}</p>
            <p className="mt-2 text-sm opacity-70">{c.hint}</p>
          </Link>
        ))}

        {EXPERIENCE_NAV.filter((n) => n.href !== "/").map((item) => (
          <Link key={item.id} href={item.href} className="mx-fallback-card block">
            <p className="mx-mono text-[var(--mx-amber)]">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

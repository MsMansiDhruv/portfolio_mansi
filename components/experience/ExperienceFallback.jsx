"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/design-system-v2";
import ExperienceNav from "./ExperienceNav";
import QuickViewPanel from "@/components/universe/QuickViewPanel";
import { EXPERIENCE_OPENING, EXPERIENCE_NAV, EXPERIENCE_COPY } from "@/lib/data/mansi-experience";

/** Technical mobile fallback — same story, no WebGL */
export default function ExperienceFallback() {
  const { isDark } = useTheme();
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <div className="mx-root min-h-screen" data-theme={isDark ? "dark" : "light"}>
      <ExperienceNav onQuickView={() => setQuickOpen(true)} />
      <QuickViewPanel open={quickOpen} onClose={() => setQuickOpen(false)} />

      <div className="px-5 pt-28 text-center">
        <p className="mx-mono text-[var(--mx-vermilion)]">{EXPERIENCE_OPENING.role}</p>
        <h1 className="mx-statement mx-statement--hero mt-4 text-3xl">{EXPERIENCE_OPENING.name}</h1>
        <p className="mx-statement--whisper mt-4 text-xl">{EXPERIENCE_OPENING.line}</p>
      </div>

      <div className="mx-fallback-grid mx-auto max-w-lg pb-16">
        <Link href="/projects" className="mx-fallback-card block">
          <p className="mx-mono text-[var(--mx-vermilion)]">{EXPERIENCE_COPY.projects.headline}</p>
          <p className="mt-2 text-sm opacity-70">{EXPERIENCE_COPY.projects.sub}</p>
        </Link>
        <Link href="/tools/ai-lab" className="mx-fallback-card block">
          <p className="mx-mono text-[var(--mx-vermilion)]">{EXPERIENCE_COPY.lab.headline}</p>
          <p className="mt-2 text-sm opacity-70">{EXPERIENCE_COPY.lab.sub}</p>
        </Link>
        {EXPERIENCE_NAV.filter((n) => n.href !== "/" && n.id !== "systems").map((item) => (
          <Link key={item.id} href={item.href} className="mx-fallback-card block">
            <p className="mx-mono text-[var(--mx-vermilion)]">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

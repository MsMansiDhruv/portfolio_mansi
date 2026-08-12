"use client";

import Link from "next/link";
import { useTheme } from "@/components/design-system-v2";
import { SilhouetteEmblem } from "@/components/anime-cinema/SilhouetteCharacter";
import { EXPERIENCE_NAV } from "@/lib/data/mansi-experience";

export default function ExperienceNav({ onQuickView }) {
  const { isDark, setTheme } = useTheme();

  return (
    <header className="mx-nav">
      <Link href="/" className="flex items-center gap-2" aria-label="Home">
        <SilhouetteEmblem className="h-5 w-5 text-[var(--mx-vermilion)] opacity-90" />
      </Link>

      <nav className="mx-nav-links" aria-label="Primary">
        {EXPERIENCE_NAV.map((item) => (
          <Link key={item.id} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mx-nav-actions">
        <button type="button" className="mx-quick-btn" onClick={onQuickView}>
          Quick view
        </button>
        <button
          type="button"
          className="mx-theme-btn"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to day" : "Switch to night"}
        >
          {isDark ? "Day" : "Night"}
        </button>
      </div>
    </header>
  );
}

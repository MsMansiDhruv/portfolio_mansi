"use client";

import Link from "next/link";
import { useTheme } from "@/components/design-system-v2";
import { EXPERIENCE_NAV } from "@/lib/data/mansi-experience";

/** Aperture mark — Living System emblem */
function ApertureMark({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1" />
      <path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export default function ExperienceNav({ onQuickView }) {
  const { isDark, setTheme } = useTheme();

  return (
    <header className="mx-nav">
      <Link href="/" className="flex items-center gap-2" aria-label="Home — Living System">
        <ApertureMark className="mx-aperture" />
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
          Index
        </button>
        <button
          type="button"
          className="mx-theme-btn"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to day — clarity" : "Switch to night — focus"}
        >
          {isDark ? "Day" : "Night"}
        </button>
      </div>
    </header>
  );
}

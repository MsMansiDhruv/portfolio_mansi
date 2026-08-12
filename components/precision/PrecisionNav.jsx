"use client";

import ConvergenceMark from "./ConvergenceMark";
import { NAV_LINKS } from "@/lib/data/precision";

/**
 * Persistent nav — WORLD destinations travel in-world; external pages
 * journey to an aperture progress then route.
 */
export default function PrecisionNav({ theme, onToggleTheme, onTravel }) {
  return (
    <nav className="mp-nav" aria-label="Mansi Precision">
      <button
        type="button"
        className="mp-brand mp-brand--btn"
        onClick={() => onTravel?.({ id: "world", progress: 0, href: null })}
      >
        <ConvergenceMark size={18} />
        <span>Mansi</span>
      </button>

      <div className="mp-nav-links">
        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            type="button"
            className="mp-nav-link-btn"
            onClick={() => onTravel?.(link)}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="mp-nav-controls">
        <button
          type="button"
          className="mp-theme-switch"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "night" ? "day" : "night"} lighting`}
        >
          <span className="mp-theme-switch__pip" />
          <ConvergenceMark size={14} />
          <span suppressHydrationWarning>{theme === "night" ? "Night" : "Day"}</span>
        </button>
      </div>
    </nav>
  );
}

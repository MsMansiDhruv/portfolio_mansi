"use client";

import ConvergenceMark from "./ConvergenceMark";
import { NAV_LINKS } from "@/lib/data/precision";

/**
 * Persistent nav — destinations travel in-world; never teleports.
 */
export default function PrecisionNav({ theme, onToggleTheme, onTravel, onHome }) {
  return (
    <nav className="mp-nav" aria-label="Mansi Precision">
      <button
        type="button"
        className="mp-brand mp-brand--btn"
        onClick={() => onHome?.()}
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

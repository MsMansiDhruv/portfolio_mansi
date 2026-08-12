"use client";

import Link from "next/link";
import ConvergenceMark from "./ConvergenceMark";
import { NAV_LINKS } from "@/lib/data/precision";

export default function PrecisionNav({ theme, onToggleTheme }) {
  return (
    <nav className="mp-nav" aria-label="Mansi Precision">
      <Link href="/" className="mp-brand">
        <ConvergenceMark size={18} />
        <span>Mansi</span>
      </Link>

      <div className="mp-nav-links">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
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
          <span>{theme === "night" ? "Night" : "Day"}</span>
        </button>
      </div>
    </nav>
  );
}

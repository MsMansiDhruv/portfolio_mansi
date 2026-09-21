"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ theme, onClick }) {
  const night = theme === "night";
  return (
    <button
      type="button"
      className="wd-theme"
      onClick={onClick}
      aria-label={`Switch to ${night ? "day" : "night"} mode`}
      suppressHydrationWarning
    >
      <span className="wd-theme__icon" aria-hidden>
        {night ? <Sun size={17} strokeWidth={1.85} /> : <Moon size={17} strokeWidth={1.85} />}
      </span>
      <span className="wd-theme__pip" />
      <span className="wd-theme__label" suppressHydrationWarning>
        {night ? "Night" : "Day"}
      </span>
    </button>
  );
}

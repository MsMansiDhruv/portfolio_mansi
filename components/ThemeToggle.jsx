"use client";

import { useEffect, useState } from "react";

const PRIMARY = "#0ea5a4";
const MUTED_DARK = "#cbd5e1";     // light stroke for sun (in dark)
const MUTED_LIGHT = "#0f172a";    // dark fill for moon (in light)

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial = saved || (prefersDark ? "dark" : "light");

    applyTheme(initial, false);
    setTheme(initial);
  }, []);

  function applyTheme(next, persist = true) {
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    if (persist) localStorage.setItem("theme", next);
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  if (theme === null) return null;

  return (
    <button
      onClick={toggleTheme}
      className="
        p-1 
        transition-transform duration-300 
        hover:scale-110 
        active:scale-95 
      "
      aria-label="Toggle theme"
    >
      {/* DARK MODE → show sun */}
      {theme === "dark" ? (
        <svg
          key="sun"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="transition-transform duration-300 rotate-0"
        >
          <circle cx="12" cy="12" r="4.2" fill={MUTED_DARK} />
          <g stroke={PRIMARY} strokeWidth="1.3" strokeLinecap="round">
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4 12H2" />
            <path d="M22 12h-2" />
            <path d="M5 5l1.4 1.4" />
            <path d="M19 19l-1.4-1.4" />
            <path d="M19 5l-1.4 1.4" />
            <path d="M5 19l1.4-1.4" />
          </g>
        </svg>
      ) : (
        /* LIGHT MODE → show moon */
        <svg
          key="moon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="transition-transform duration-300 rotate-0"
          fill="none"
        >
          <path
            d="M21 12.5A8.5 8.5 0 0111.5 3 7 7 0 0021 12.5z"
            fill={MUTED_LIGHT}
            opacity="0.96"
          />
          <path
            d="M21 12.5A8.5 8.5 0 0111.5 3"
            stroke={PRIMARY}
            strokeWidth="1.2"
            opacity="0.85"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}

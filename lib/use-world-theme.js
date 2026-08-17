"use client";

import { useLayoutEffect, useState } from "react";
import { readWorldTheme, WORLD_THEME_DEFAULT } from "@/lib/world-theme";

/**
 * Keep SSR markup stable, then sync from the html attribute before paint
 * so day-mode navigations do not flash the night background.
 */
export function useWorldTheme() {
  const [theme, setTheme] = useState(WORLD_THEME_DEFAULT);

  useLayoutEffect(() => {
    setTheme(readWorldTheme());
    const onTheme = (event) => {
      const next = event.detail;
      if (next === "day" || next === "night") setTheme(next);
    };
    window.addEventListener("world-theme-change", onTheme);
    return () => window.removeEventListener("world-theme-change", onTheme);
  }, []);

  return [theme, setTheme];
}

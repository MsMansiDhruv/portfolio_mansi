"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const DsThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  resolved: "light",
});

/**
 * Design-system theme provider.
 * Syncs `data-ds-theme` and optionally mirrors site `dark` class on documentElement.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  syncDocumentDarkClass = true,
  className = "",
}) {
  const [theme, setThemeState] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);

  const resolved = useMemo(() => {
    if (theme === "light" || theme === "dark") return theme;
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, [theme, mounted]);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("ds-theme");
      if (stored === "light" || stored === "dark" || stored === "system") {
        setThemeState(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute("data-ds-theme", resolved);
    if (syncDocumentDarkClass) {
      if (resolved === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    }
  }, [resolved, mounted, syncDocumentDarkClass]);

  useEffect(() => {
    if (theme !== "system" || !mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setThemeState("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme, mounted]);

  const setTheme = (next) => {
    setThemeState(next);
    try {
      localStorage.setItem("ds-theme", next);
    } catch {
      /* ignore */
    }
  };

  return (
    <DsThemeContext.Provider value={{ theme, setTheme, resolved }}>
      <div className={`ds-root ${className}`.trim()} data-ds-theme={resolved}>
        {children}
      </div>
    </DsThemeContext.Provider>
  );
}

export function useDsTheme() {
  return useContext(DsThemeContext);
}

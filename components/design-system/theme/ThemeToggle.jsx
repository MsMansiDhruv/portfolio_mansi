"use client";

import { useDsTheme } from "./ThemeProvider";

export function ThemeToggle({ className }) {
  const { theme, setTheme, resolved } = useDsTheme();

  const cycle = () => {
    if (theme === "system") setTheme(resolved === "dark" ? "light" : "dark");
    else if (theme === "dark") setTheme("light");
    else setTheme("dark");
  };

  return (
    <button
      type="button"
      onClick={cycle}
      className={className}
      aria-label={`Theme: ${resolved}. Click to toggle.`}
      style={{
        padding: "var(--ds-space-2)",
        borderRadius: "var(--ds-radius-md)",
        border: "1px solid var(--ds-border)",
        background: "var(--ds-surface)",
        color: "var(--ds-text-secondary)",
        fontSize: "var(--ds-text-xs)",
        fontWeight: "var(--ds-weight-medium)",
      }}
    >
      {resolved === "dark" ? "Dark" : "Light"}
    </button>
  );
}

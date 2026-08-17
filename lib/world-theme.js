export const WORLD_THEME_KEY = "mansi-world-theme";

/** Stable SSR default — client syncs in useEffect to avoid hydration drift. */
export const WORLD_THEME_DEFAULT = "night";

export function readWorldTheme() {
  if (typeof window === "undefined") return WORLD_THEME_DEFAULT;
  try {
    const fromHtml = document.documentElement.getAttribute("data-world-theme");
    if (fromHtml === "day" || fromHtml === "night") return fromHtml;
    const stored = localStorage.getItem(WORLD_THEME_KEY);
    if (stored === "day" || stored === "night") return stored;
  } catch {
    /* ignore */
  }
  return WORLD_THEME_DEFAULT;
}

export function writeWorldTheme(theme) {
  try {
    localStorage.setItem(WORLD_THEME_KEY, theme);
  } catch {
    /* ignore */
  }
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-world-theme", theme);
    document.querySelectorAll(".wd-root").forEach((el) => {
      el.setAttribute("data-theme", theme);
    });
    window.dispatchEvent(new CustomEvent("world-theme-change", { detail: theme }));
  }
}

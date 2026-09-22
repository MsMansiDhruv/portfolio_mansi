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
  const next = theme === "day" ? "day" : "night";
  try {
    localStorage.setItem(WORLD_THEME_KEY, next);
  } catch {
    /* ignore */
  }
  if (typeof document === "undefined") return;

  const apply = () => {
    const root = document.documentElement;
    root.setAttribute("data-world-theme", next);
    root.style.colorScheme = next === "day" ? "light" : "dark";
    document.querySelectorAll(".wd-root, .wd-studio-shell").forEach((el) => {
      el.setAttribute("data-theme", next);
      el.classList.add("is-theme-shift");
    });
    window.dispatchEvent(new CustomEvent("world-theme-change", { detail: next }));
  };

  const root = document.documentElement;
  root.classList.add("is-theme-shift");
  window.clearTimeout(writeWorldTheme._shiftTimer);
  writeWorldTheme._shiftTimer = window.setTimeout(() => {
    root.classList.remove("is-theme-shift");
    document.querySelectorAll(".wd-root, .wd-studio-shell").forEach((el) => {
      el.classList.remove("is-theme-shift");
    });
  }, 1000);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && typeof document.startViewTransition === "function") {
    document.startViewTransition(apply);
    return;
  }
  apply();
}

export function toggleWorldTheme() {
  const next = readWorldTheme() === "day" ? "night" : "day";
  writeWorldTheme(next);
  return next;
}

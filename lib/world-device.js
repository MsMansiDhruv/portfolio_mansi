export function isWorldCompact() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
}

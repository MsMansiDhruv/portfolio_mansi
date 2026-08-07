import clsx from "clsx";

/**
 * Merge class names. Lightweight utility (clsx only).
 * Add tailwind-merge later if conflicting utilities become an issue.
 */
export function cn(...inputs) {
  return clsx(inputs);
}

"use client";

import { cn } from "@/lib/cn";

/** Recurring monogram + data-flow motif — Mansi's visual signature */
export default function MansiMark({ className, size = "md" }) {
  const dim = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-7 w-7" : "h-10 w-10";
  const stroke = size === "lg" ? 1.5 : 1.25;

  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("shrink-0 text-teal-800 dark:text-teal-400", dim, className)}
      aria-hidden
    >
      <rect x="1" y="1" width="38" height="38" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth={stroke} />
      <path
        d="M10 28V12l6 10 6-10v16"
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke * 1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 20h8M26 24h6"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}

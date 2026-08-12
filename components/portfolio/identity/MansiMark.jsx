"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { MARK_WHISPERS } from "@/lib/data/identity";

/** Recurring monogram — click to discover (never labeled as Easter egg) */
export default function MansiMark({ className, size = "md", interactive = false }) {
  const [whisperIndex, setWhisperIndex] = useState(-1);
  const dim = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-7 w-7" : "h-10 w-10";
  const stroke = size === "lg" ? 1.5 : 1.25;

  function handleActivate() {
    if (!interactive) return;
    setWhisperIndex((i) => (i + 1) % MARK_WHISPERS.length);
  }

  return (
    <span className={cn("relative inline-flex", interactive && "cursor-pointer select-none")}>
      <svg
        viewBox="0 0 40 40"
        className={cn(
          "shrink-0 text-teal-800 transition dark:text-teal-400",
          dim,
          interactive && "hover:scale-105 active:scale-95",
          className
        )}
        aria-hidden={!interactive}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={handleActivate}
        onKeyDown={(e) => {
          if (interactive && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleActivate();
          }
        }}
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
      {interactive && whisperIndex >= 0 ? (
        <span className="pointer-events-none absolute -bottom-6 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[10px] italic text-slate-400 dark:text-slate-500">
          {MARK_WHISPERS[whisperIndex]}
        </span>
      ) : null}
    </span>
  );
}

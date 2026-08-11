"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { PORTRAIT } from "@/lib/data/identity";
import MansiMark from "./MansiMark";

const ANNOTATIONS = [
  { label: "Data platforms", position: "right-3 top-4" },
  { label: "Architecture", position: "left-3 bottom-16" },
  { label: "Operability", position: "right-4 bottom-8" },
];

export default function PortraitPanel({ className, showAnnotations = true, size = "default" }) {
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPlaceholder = photoFailed || !photoLoaded;

  const frameClass =
    size === "large"
      ? "aspect-[3/4] max-w-sm"
      : size === "compact"
        ? "aspect-[4/5] max-w-[11rem]"
        : "aspect-[4/5] max-w-xs";

  return (
    <div className={cn("relative min-w-0", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-100 via-white to-teal-50/30 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-teal-950/20",
          frameClass,
          "w-full"
        )}
      >
        {!photoFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={PORTRAIT.src}
            alt={PORTRAIT.alt}
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-[center_15%] transition-opacity duration-500",
              photoLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setPhotoLoaded(true)}
            onError={() => setPhotoFailed(true)}
          />
        ) : null}

        {showPlaceholder ? (
          <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-slate-200/80 via-slate-50 to-white p-6 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_40%,rgba(15,118,110,0.06)_40%,rgba(15,118,110,0.06)_60%,transparent_60%)] dark:bg-[linear-gradient(135deg,transparent_40%,rgba(20,184,166,0.08)_40%,rgba(20,184,166,0.08)_60%,transparent_60%)]" aria-hidden />
            <MansiMark size="lg" className="mb-auto mt-8 opacity-80" />
            <p className="font-serif text-xl tracking-tight text-slate-500 dark:text-slate-400">{PORTRAIT.alt}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Editorial portrait
            </p>
          </div>
        ) : null}

        {showAnnotations
          ? ANNOTATIONS.map((item) => (
              <span
                key={item.label}
                className={cn(
                  "pointer-events-none absolute rounded-full border border-slate-200/90 bg-white/90 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-400",
                  item.position
                )}
              >
                {item.label}
              </span>
            ))
          : null}
      </div>

      <div className="absolute -bottom-2 -right-2 rounded-lg border border-slate-200/90 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <MansiMark size="sm" />
      </div>
    </div>
  );
}

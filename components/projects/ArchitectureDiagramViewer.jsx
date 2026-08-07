"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { Modal } from "@/components/design-system-v2";
import { cn } from "@/lib/cn";

const CANDIDATE_PATHS = (base) => [base, base.replace(/\.png$/i, ".webp"), base.replace(/\.png$/i, ".jpg")];

const diagramImageClass =
  "object-contain p-2 sm:p-4 dark:brightness-[0.96] dark:contrast-[1.08] dark:invert dark:hue-rotate-180";

export function ArchitectureDiagramViewer({ src, alt, caption, className }) {
  const [open, setOpen] = useState(false);
  const [activeSrc, setActiveSrc] = useState(src);
  const [failed, setFailed] = useState(false);
  const candidates = CANDIDATE_PATHS(src);
  const [candidateIndex, setCandidateIndex] = useState(0);

  const tryNext = () => {
    const next = candidateIndex + 1;
    if (next < candidates.length) {
      setCandidateIndex(next);
      setActiveSrc(candidates[next]);
      return;
    }
    setFailed(true);
  };

  return (
    <figure className={cn("min-w-0", className)}>
      {failed ? (
        <div
          className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/50 sm:min-h-[320px]"
          role="img"
          aria-label={alt}
        >
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Architecture diagram</p>
          <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
            Add your diagram at{" "}
            <code className="rounded bg-white px-1.5 py-0.5 text-xs dark:bg-slate-950">public/projects/amc/architecture.png</code>
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-left shadow-sm transition hover:border-teal-600/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-none dark:hover:border-teal-500/40 dark:focus-visible:ring-offset-slate-950"
          aria-label="Open architecture diagram full size"
        >
          <div className="relative aspect-[16/10] w-full max-h-[min(72vh,720px)] min-h-[220px] bg-slate-100 dark:bg-slate-950">
            <Image
              src={activeSrc}
              alt={alt}
              fill
              className={diagramImageClass}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1100px"
              onError={tryNext}
              priority
            />
          </div>
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200">
            <Maximize2 className="h-3.5 w-3.5" aria-hidden />
            Enlarge
          </span>
        </button>
      )}

      {caption ? (
        <figcaption className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">{caption}</figcaption>
      ) : null}

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Platform architecture" size="2xl" className="max-w-6xl">
        <div className="relative mx-auto min-h-[50vh] w-full max-w-full overflow-x-auto rounded-xl bg-slate-100 dark:bg-slate-950">
          {!failed ? (
            <div className="relative mx-auto h-[min(70vh,800px)] w-full min-w-[min(100%,640px)]">
              <Image src={activeSrc} alt={alt} fill className={diagramImageClass} sizes="100vw" onError={tryNext} />
            </div>
          ) : null}
        </div>
      </Modal>
    </figure>
  );
}

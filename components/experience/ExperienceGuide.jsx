"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getGuideBeat } from "@/lib/data/guide-beats";

/**
 * Interactive portrait guide — high-res photo companion that narrates
 * the scroll journey and offers contextual next actions.
 */
export default function ExperienceGuide({ progress, lenisRef, trackRef }) {
  const router = useRouter();
  const beat = getGuideBeat(progress);
  const [open, setOpen] = useState(true);
  const [imgReady, setImgReady] = useState(false);

  useEffect(() => {
    setImgReady(false);
  }, [beat.image]);

  const runAction = () => {
    const action = beat.action;
    if (!action) return;
    if (action.href) {
      router.push(action.href);
      return;
    }
    if (typeof action.scrollTo === "number" && trackRef?.current) {
      const top = action.scrollTo * (trackRef.current.offsetHeight - window.innerHeight);
      if (lenisRef?.current) {
        lenisRef.current.scrollTo(top, {
          duration: 1.6,
          easing: (x) => 1 - Math.pow(1 - x, 3),
        });
      } else {
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <div className={`mx-guide ${open ? "is-open" : "is-collapsed"}`} aria-live="polite">
      <button
        type="button"
        className="mx-guide-avatar"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Collapse guide" : "Expand guide — Mansi"}
      >
        <Image
          key={beat.image}
          src={beat.image}
          alt="Mansi Dhruv"
          width={160}
          height={160}
          quality={95}
          priority
          className={`mx-guide-photo ${imgReady ? "is-ready" : ""}`}
          onLoad={() => setImgReady(true)}
        />
        <span className="mx-guide-pulse" aria-hidden />
      </button>

      {open ? (
        <div className="mx-guide-card">
          <p className="mx-mono mx-guide-title">{beat.title}</p>
          <p className="mx-guide-line">{beat.line}</p>
          {beat.action ? (
            <button type="button" className="mx-guide-action" onClick={runAction}>
              {beat.action.label} →
            </button>
          ) : null}
          <button type="button" className="mx-guide-dismiss mx-mono" onClick={() => setOpen(false)}>
            Hide
          </button>
        </div>
      ) : (
        <button type="button" className="mx-guide-hint mx-mono" onClick={() => setOpen(true)}>
          Guide
        </button>
      )}
    </div>
  );
}

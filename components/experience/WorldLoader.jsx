"use client";

import { useEffect, useState } from "react";

export default function WorldLoader({ onReady }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 2200;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(t);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setDone(true);
        window.setTimeout(onReady, 400);
      }
    };
    requestAnimationFrame(tick);
  }, [onReady]);

  return (
    <div className={`mx-loader ${done ? "is-done" : ""}`} aria-live="polite" aria-busy={!done}>
      <div className="flex">
        <span className="mx-loader-dot" />
        <span className="mx-loader-dot" />
        <span className="mx-loader-dot" />
      </div>
      <p className="mx-mono mt-8">Booting systems</p>
      <div
        className="mx-mono mt-4 h-px w-24 bg-[var(--mx-vermilion)] transition-all duration-300"
        style={{ transform: `scaleX(${0.15 + progress * 0.85})`, transformOrigin: "left" }}
        aria-hidden
      />
    </div>
  );
}

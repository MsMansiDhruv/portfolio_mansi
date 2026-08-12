"use client";

import { useEffect, useState } from "react";

export default function WorldLoader({ onReady }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 2400;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(t);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setDone(true);
        window.setTimeout(onReady, 450);
      }
    };
    requestAnimationFrame(tick);
  }, [onReady]);

  return (
    <div className={`mx-loader ${done ? "is-done" : ""}`} aria-live="polite" aria-busy={!done}>
      <div className="mx-loader-iris" aria-hidden />
      <p className="mx-loader-label">Initializing system</p>
      <div className="mx-loader-bar" aria-hidden>
        <span style={{ transform: `scaleX(${0.12 + progress * 0.88})` }} />
      </div>
    </div>
  );
}

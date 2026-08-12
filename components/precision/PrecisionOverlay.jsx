"use client";

import { useEffect, useState } from "react";
import { getConvergenceState } from "@/lib/data/precision";

/**
 * Sparse spatial chrome — no scroll cue, no presentation typography stack.
 */
export default function PrecisionOverlay({ theme, exhibitActive, energyRef }) {
  const [energy, setEnergy] = useState(0.25);

  useEffect(() => {
    let raf;
    const loop = () => {
      setEnergy(energyRef?.current?.energy ?? 0.25);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [energyRef]);

  const state = getConvergenceState(energy);

  if (exhibitActive) {
    return (
      <div className="mp-overlay mp-overlay--spatial" aria-hidden>
        <div className="mp-meta mp-meta--tl">MP-WORLD · EXHIBIT</div>
        <div className="mp-meta mp-meta--br">
          {theme === "day" ? "DAY · CLARITY" : "NIGHT · FOCUS"}
        </div>
      </div>
    );
  }

  return (
    <div className="mp-overlay mp-overlay--spatial">
      <div className="mp-meta mp-meta--tl">MP-WORLD · DATA</div>
      <div className="mp-meta mp-meta--tr">{state.label}</div>
      <div className="mp-meta mp-meta--br">
        {theme === "day" ? "DAY · CLARITY" : "NIGHT · FOCUS"}
      </div>
    </div>
  );
}

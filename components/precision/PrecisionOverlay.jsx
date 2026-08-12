"use client";

import { useEffect, useState } from "react";
import { getConvergenceState } from "@/lib/data/precision";

/**
 * Spatial Overlay Chrome — minimal typography & system telemetry.
 * Energy is sampled on an interval — not every animation frame.
 */
export default function PrecisionOverlay({
  theme,
  exhibitActive,
  energyRef,
  viewId = "home",
}) {
  const [energy, setEnergy] = useState(0.25);
  const [reveal, setReveal] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      const ix = energyRef?.current;
      setEnergy(ix?.energy ?? 0.25);
      setReveal(ix?.reveal ?? 0);
    }, 80);
    return () => window.clearInterval(id);
  }, [energyRef]);

  const state = getConvergenceState(energy);
  const showReveal = reveal > 0.55 && viewId === "home";

  if (exhibitActive) {
    return (
      <div className="mp-overlay mp-overlay--spatial" aria-hidden>
        <div className="mp-meta mp-meta--tl">MANSI · EXHIBIT SYSTEM</div>
        <div className="mp-meta mp-meta--br">
          {theme === "day" ? "DAY · CLARITY" : "NIGHT · FOCUS"}
        </div>
      </div>
    );
  }

  return (
    <div className="mp-overlay mp-overlay--spatial">
      <div className="mp-meta mp-meta--tl">MANSI · DATA SYSTEM</div>
      <div className="mp-meta mp-meta--tr">
        {showReveal ? "ROUTE REVEALED" : state.label}
      </div>
      <div className="mp-meta mp-meta--br">
        {theme === "day" ? "DAY · CLARITY" : "NIGHT · FOCUS"}
      </div>

      {viewId === "home" && (
        <div className="mp-copy mp-copy--acti">
          <h1 className="mp-title">MANSI</h1>
          <p className="mp-role">DATA ENGINEER</p>
          <p className="mp-statement">TURNING COMPLEXITY INTO LIVING SYSTEMS.</p>
        </div>
      )}
    </div>
  );
}

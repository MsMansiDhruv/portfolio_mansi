"use client";

import {
  PRECISION_BEATS,
  remap,
  smoothstep,
  getConvergenceState,
} from "@/lib/data/precision";

/**
 * Sparse journey typography + Clarification signature hold.
 */
export default function PrecisionOverlay({ progress, theme, exhibitActive }) {
  const p = progress;

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

  const titleOp = smoothstep(0.02, 0.1, p) * (1 - smoothstep(0.18, 0.28, p));
  const roleOp = smoothstep(0.05, 0.12, p) * (1 - smoothstep(0.2, 0.3, p));
  const clarityOp = smoothstep(0.5, 0.56, p) * (1 - smoothstep(0.62, 0.7, p));
  const streamHint = smoothstep(0.14, 0.22, p) * (1 - smoothstep(0.32, 0.4, p));

  const convLocal = remap(p, PRECISION_BEATS.convergence.start, PRECISION_BEATS.clarity.end);
  const state = getConvergenceState(convLocal);

  return (
    <div className="mp-overlay mp-overlay--spatial">
      <div className="mp-meta mp-meta--tl">MP-WORLD · DATA</div>
      <div className="mp-meta mp-meta--tr">{state.label}</div>
      <div className="mp-meta mp-meta--br">
        {theme === "day" ? "DAY · CLARITY" : "NIGHT · FOCUS"}
      </div>

      <div
        className="mp-copy mp-copy--enter"
        style={{ opacity: titleOp, pointerEvents: titleOp > 0.05 ? "auto" : "none" }}
      >
        <h1 className="mp-title" style={{ opacity: titleOp }}>
          Mansi
        </h1>
        <p className="mp-role" style={{ opacity: roleOp }}>
          Data Engineer · Builder · Explorer
        </p>
      </div>

      <div className="mp-copy mp-copy--hint" style={{ opacity: streamHint }}>
        <p className="mp-hint">Data begins to move.</p>
      </div>

      <div
        className="mp-copy mp-copy--clarity"
        style={{ opacity: clarityOp, pointerEvents: "none" }}
      >
        <p className="mp-clarity-stack">
          <span>CLARITY</span>
          <span>IS AN</span>
          <span>ENGINEERING</span>
          <span>DECISION.</span>
        </p>
      </div>

      <div className="mp-scroll-cue" style={{ opacity: titleOp * 0.7 }}>
        <span>SCROLL TO TRAVEL</span>
      </div>
    </div>
  );
}

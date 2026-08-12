"use client";

import {
  PRECISION_BEATS,
  remap,
  smoothstep,
  getConvergenceState,
} from "@/lib/data/precision";

/**
 * Editorial typography layered over the persistent world.
 * Appears as composition — not as a webpage hero pasted on top.
 */
export default function PrecisionOverlay({ progress, theme }) {
  const p = progress;
  const approach = remap(p, PRECISION_BEATS.approach.start, PRECISION_BEATS.approach.end);
  const convLocal = remap(p, PRECISION_BEATS.convergence.start, PRECISION_BEATS.clarity.end);
  const state = getConvergenceState(convLocal);

  const titleOp =
    smoothstep(0.02, 0.1, p) * (1 - smoothstep(0.22, 0.34, p));
  const roleOp =
    smoothstep(0.06, 0.14, p) * (1 - smoothstep(0.24, 0.36, p));
  const clarityOp =
    smoothstep(0.58, 0.66, p) * (1 - smoothstep(0.72, 0.8, p));
  const workHintOp = smoothstep(0.86, 0.94, p);

  return (
    <div className="mp-overlay mp-overlay--spatial" aria-hidden={false}>
      <div className="mp-meta mp-meta--tl">MP-WORLD · CONTINUOUS</div>
      <div className="mp-meta mp-meta--bl">
        {p < 0.34 ? "01 ENTER" : p < 0.7 ? state.label : p < 0.84 ? "05 OUTPUT" : "06 WORK"}
      </div>
      <div className="mp-meta mp-meta--br">
        {theme === "day" ? "DAY · CLARITY" : "NIGHT · FOCUS"}
      </div>

      <div
        className="mp-copy mp-copy--acti"
        style={{
          opacity: Math.max(titleOp, roleOp),
          transform: `translateY(${(1 - titleOp) * 16}px)`,
        }}
      >
        <h1 className="mp-title" style={{ opacity: titleOp }}>
          Mansi
        </h1>
        <p className="mp-role" style={{ opacity: roleOp }}>
          Data Engineer · Builder · Explorer
        </p>
      </div>

      <div
        className="mp-copy mp-copy--clarity"
        style={{
          opacity: clarityOp,
          transform: `translate(-50%, calc(-50% + ${(1 - clarityOp) * 12}px))`,
        }}
      >
        <p className="mp-clarity">Clarity is an engineering decision.</p>
        <div className="mp-clarity-rule" />
      </div>

      <div
        className="mp-copy mp-copy--world"
        style={{
          opacity: workHintOp,
          transform: `translateY(${(1 - workHintOp) * 18}px)`,
        }}
      >
        <p className="mp-world-kicker">Same system · Deeper hall</p>
        <h2 className="mp-world-title">Follow the output.</h2>
        <p className="mp-world-sub">
          Work begins as architecture beyond the mechanism — not as the next page.
        </p>
      </div>

      <div
        className="mp-scroll-hint"
        style={{ opacity: 1 - smoothstep(0.02, 0.1, p) }}
      >
        <span>Scroll to travel</span>
        <div className="mp-scroll-hint__line" />
      </div>

      {/* Quiet depth cue during approach */}
      <div
        className="mp-depth-cue"
        style={{ opacity: approach * (1 - smoothstep(0.4, 0.5, p)) * 0.5 }}
      />
    </div>
  );
}

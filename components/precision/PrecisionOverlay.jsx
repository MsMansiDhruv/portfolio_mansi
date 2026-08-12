"use client";

import {
  PRECISION_BEATS,
  remap,
  smoothstep,
  getConvergenceState,
} from "@/lib/data/precision";

/**
 * Journey typography — sparse, on controlled surfaces where needed.
 * Exhibition copy lives in ExhibitionPanel (readable info plane).
 */
export default function PrecisionOverlay({ progress, theme, exhibitActive }) {
  const p = progress;
  const approach = remap(p, PRECISION_BEATS.approach.start, PRECISION_BEATS.approach.end);
  const convLocal = remap(p, PRECISION_BEATS.convergence.start, PRECISION_BEATS.clarity.end);
  const state = getConvergenceState(convLocal);

  const titleOp =
    smoothstep(0.02, 0.1, p) * (1 - smoothstep(0.2, 0.32, p));
  const roleOp =
    smoothstep(0.05, 0.12, p) * (1 - smoothstep(0.22, 0.34, p));
  const clarityOp =
    smoothstep(0.48, 0.55, p) * (1 - smoothstep(0.6, 0.68, p));

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
      <div className="mp-meta mp-meta--tl">MP-WORLD · CONTINUOUS</div>
      <div className="mp-meta mp-meta--bl">
        {p < 0.3
          ? "01 ENTER"
          : p < 0.58
            ? state.label
            : p < 0.68
              ? "05 OUTPUT"
              : "06 EXHIBITION"}
      </div>
      <div className="mp-meta mp-meta--br">
        {theme === "day" ? "DAY · CLARITY" : "NIGHT · FOCUS"}
      </div>

      <div
        className="mp-copy mp-copy--acti mp-copy--plane"
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
        className="mp-copy mp-copy--clarity mp-copy--plane"
        style={{
          opacity: clarityOp,
          transform: `translate(-50%, calc(-50% + ${(1 - clarityOp) * 12}px))`,
        }}
      >
        <p className="mp-clarity">Clarity is an engineering decision.</p>
        <div className="mp-clarity-rule" />
      </div>

      <div
        className="mp-scroll-hint"
        style={{ opacity: 1 - smoothstep(0.02, 0.1, p) }}
      >
        <span>Scroll to travel</span>
        <div className="mp-scroll-hint__line" />
      </div>

      <div
        className="mp-depth-cue"
        style={{ opacity: approach * (1 - smoothstep(0.35, 0.45, p)) * 0.45 }}
      />
    </div>
  );
}

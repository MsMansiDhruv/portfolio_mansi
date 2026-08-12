"use client";

import { EXHIBITION_EXHIBITS } from "@/lib/data/exhibition-exhibits";
import { smoothstep } from "@/lib/data/precision";

/**
 * Detail plane only — journey hopping lives in JourneyDock.
 */
export default function ExhibitionPanel({
  theme,
  progress,
  nearExhibit,
  activeExhibit,
  phase,
  onRead,
  onReturn,
}) {
  // Keep hall intro quiet; dock owns navigation
  if (!activeExhibit && progress < 0.04) return null;

  if (!activeExhibit) {
    if (!nearExhibit || progress < 0.68) return null;
    return (
      <div className="mp-exhibition-ui" data-theme={theme}>
        <div className="mp-info-plane mp-info-plane--hall mp-info-plane--compact">
          <p className="mp-info-mono">PROJECT {nearExhibit.number}</p>
          <p className="mp-info-near-title">{nearExhibit.title}</p>
          <p className="mp-info-caption">{nearExhibit.tagline}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mp-exhibition-ui" data-theme={theme}>
      <div className={`mp-info-plane mp-info-plane--room is-${phase}`}>
        <div className="mp-info-plane__inner">
          <p className="mp-info-mono">PROJECT {activeExhibit.number}</p>
          <h2 className="mp-info-title">{activeExhibit.title}</h2>
          <p className="mp-info-caption">{activeExhibit.tagline}</p>

          {phase === "immerse" && (
            <p className="mp-info-body">
              Use Next / Prev to move between installations. Open details when ready.
            </p>
          )}

          {phase === "read" && (
            <div className="mp-info-sections">
              <section>
                <h3>The problem</h3>
                <p>{activeExhibit.problem}</p>
              </section>
              <section>
                <h3>The system</h3>
                <p>{activeExhibit.system}</p>
              </section>
              <section>
                <h3>Key decisions</h3>
                <p>{activeExhibit.decisions}</p>
              </section>
              <section>
                <h3>Technology</h3>
                <p className="mp-info-tech">{activeExhibit.technology}</p>
              </section>
              <section>
                <h3>Outcome</h3>
                <p>{activeExhibit.outcome}</p>
              </section>
            </div>
          )}

          <div className="mp-info-actions">
            {phase === "immerse" && (
              <button type="button" className="mp-info-btn" onClick={onRead}>
                Read details
              </button>
            )}
            <button type="button" className="mp-info-btn mp-info-btn--ghost" onClick={onReturn}>
              Return to plaza
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function nearestExhibitFromProgress(progress) {
  if (progress < 0.68) return null;
  let best = null;
  let bestDist = Infinity;
  for (const ex of EXHIBITION_EXHIBITS) {
    const at = ex.appearAt ?? 0.75;
    const dist = Math.abs(progress - (at + 0.04));
    if (progress >= at - 0.06 && dist < bestDist) {
      bestDist = dist;
      best = ex;
    }
  }
  return best;
}

export function hallPresence(progress) {
  return smoothstep(0.08, 0.18, progress);
}

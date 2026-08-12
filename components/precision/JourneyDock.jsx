"use client";

import { EXHIBITION_EXHIBITS } from "@/lib/data/exhibition-exhibits";

/**
 * Persistent journey controls — smooth hops around exhibits without endless scroll guesswork.
 */
export default function JourneyDock({
  theme,
  activeExhibit,
  nearExhibit,
  onPrev,
  onNext,
  onEnter,
  onReturn,
  onRead,
  phase,
}) {
  const current = activeExhibit || nearExhibit || EXHIBITION_EXHIBITS[0];
  const idx = Math.max(
    0,
    EXHIBITION_EXHIBITS.findIndex((e) => e.slug === current?.slug)
  );
  const total = EXHIBITION_EXHIBITS.length;
  const atFirst = idx <= 0;
  const atLast = idx >= total - 1;

  return (
    <div className="mp-journey-dock" data-theme={theme} role="navigation" aria-label="Exhibit navigation">
      <div className="mp-journey-dock__meta">
        <span className="mp-journey-dock__label">
          {activeExhibit ? "INSIDE" : "NEAR"}
        </span>
        <span className="mp-journey-dock__title">
          {current ? `${current.number} · ${current.title}` : "Plaza"}
        </span>
        <span className="mp-journey-dock__count">
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="mp-journey-dock__controls">
        <button
          type="button"
          className="mp-journey-btn"
          onClick={onPrev}
          disabled={atFirst}
          aria-label="Previous exhibit"
        >
          ← Prev
        </button>

        {!activeExhibit ? (
          <button
            type="button"
            className="mp-journey-btn mp-journey-btn--primary"
            onClick={() => current && onEnter(current)}
          >
            Enter
          </button>
        ) : (
          <>
            {phase === "immerse" && (
              <button type="button" className="mp-journey-btn mp-journey-btn--primary" onClick={onRead}>
                Details
              </button>
            )}
            <button type="button" className="mp-journey-btn" onClick={onReturn}>
              Plaza
            </button>
          </>
        )}

        <button
          type="button"
          className="mp-journey-btn"
          onClick={onNext}
          disabled={atLast}
          aria-label="Next exhibit"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

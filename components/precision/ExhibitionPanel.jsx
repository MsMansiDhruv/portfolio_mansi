"use client";

/**
 * Editorial plane — only after the visitor has entered an exhibit.
 * High-contrast graphite/ivory surface. Never over busy particles.
 */
export default function ExhibitionPanel({
  theme,
  activeExhibit,
  phase,
  onRead,
  onReturn,
}) {
  if (!activeExhibit) return null;

  return (
    <div className="mp-exhibition-ui" data-theme={theme}>
      <div className={`mp-info-plane mp-info-plane--room is-${phase}`}>
        <div className="mp-info-plane__inner">
          <p className="mp-info-mono">PROJECT {activeExhibit.number}</p>
          <h2 className="mp-info-title">{activeExhibit.title}</h2>
          <p className="mp-info-caption">{activeExhibit.tagline}</p>

          {phase === "immerse" && (
            <p className="mp-info-body">
              Follow the data through the system.
            </p>
          )}

          {phase === "read" && (
            <div className="mp-info-sections">
              <section>
                <h3>Problem</h3>
                <p>{activeExhibit.problem}</p>
              </section>
              <section>
                <h3>Approach</h3>
                <p>{activeExhibit.system}</p>
              </section>
              <section>
                <h3>Architecture</h3>
                <p>{activeExhibit.decisions}</p>
              </section>
              <section>
                <h3>Technology</h3>
                <p className="mp-info-tech">{activeExhibit.technology}</p>
              </section>
              <section>
                <h3>Result</h3>
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
              Return to exhibition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

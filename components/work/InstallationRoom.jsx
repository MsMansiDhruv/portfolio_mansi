"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/design-system-v2";
import ExperienceNav from "@/components/experience/ExperienceNav";
import QuickViewPanel from "@/components/universe/QuickViewPanel";
import InstallationGlyph from "./InstallationGlyph";
import { getInstallation, getInstallationNav } from "@/lib/data/work-exhibition";
import "@/styles/mansi-experience.css";
import "@/styles/mansi-work.css";

function DecisionCard({ d }) {
  const decision = d.decision || d.title;
  const why = d.why || d.reasoning;
  const tradeoff = d.tradeoff;
  const alternative = d.alternative;
  if (!decision && !why) return null;
  return (
    <article className="wk-decision">
      <p className="mx-mono text-[var(--mx-amber)]">DECISION</p>
      <h3 className="wk-decision-title">{decision}</h3>
      {why ? (
        <>
          <p className="mx-mono mt-4 opacity-70">WHY</p>
          <p className="wk-decision-body">{why}</p>
        </>
      ) : null}
      {alternative ? (
        <>
          <p className="mx-mono mt-4 opacity-70">ALTERNATIVE</p>
          <p className="wk-decision-body">{alternative}</p>
        </>
      ) : null}
      {tradeoff ? (
        <>
          <p className="mx-mono mt-4 opacity-70">TRADE-OFF</p>
          <p className="wk-decision-body">{tradeoff}</p>
        </>
      ) : null}
      {d.problem ? (
        <>
          <p className="mx-mono mt-4 opacity-70">CONTEXT</p>
          <p className="wk-decision-body">{d.problem}</p>
        </>
      ) : null}
    </article>
  );
}

/**
 * Cinematic installation room for a documented project.
 * Layers: impression → interaction → engineering → evidence.
 */
export default function InstallationRoom({ slug }) {
  const { isDark } = useTheme();
  const [quickOpen, setQuickOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const install = getInstallation(slug);
  const nav = getInstallationNav(slug);

  if (!install) return null;

  const decisions = (install.caseDecisions?.length ? install.caseDecisions : install.decisions) || [];
  const layers = install.architectureLayers || [];
  const stack = install.stackRationale?.length
    ? install.stackRationale
    : (install.tech || []).map((name) => ({ name, why: null }));

  return (
    <div className="mx-root wk-root wk-room" data-theme={isDark ? "dark" : "light"} data-metaphor={install.metaphor}>
      <ExperienceNav onQuickView={() => setQuickOpen(true)} />
      <QuickViewPanel open={quickOpen} onClose={() => setQuickOpen(false)} />

      {/* LAYER 01 — Impression */}
      <header className="wk-room-hero">
        <div className={`wk-room-stage wk-stage--${install.metaphor}`} aria-hidden>
          <div className="wk-stage-glow" />
          {install.metaphor === "strata" ? (
            <div className="wk-strata">
              <span />
              <span />
              <span />
            </div>
          ) : null}
          {install.metaphor === "spine" ? <div className="wk-spine" /> : null}
          {install.metaphor === "harvest" ? <div className="wk-harvest" /> : null}
          {install.metaphor === "split" ? (
            <div className="wk-split">
              <span />
              <span />
            </div>
          ) : null}
        </div>

        <div className="wk-room-hero-copy">
          <p className="mx-coord">
            <InstallationGlyph type={install.glyph} className="wk-glyph inline" /> PROJECT {install.number}
          </p>
          <h1 className="wk-room-title">{install.title}</h1>
          <p className="mx-whisper wk-room-tagline">{install.tagline || install.subtitle}</p>
          <p className="mx-mono mt-6 opacity-80">{install.category}</p>
        </div>
      </header>

      <div className="wk-room-body">
        {/* 01 Problem */}
        <section className="wk-section">
          <p className="mx-coord">01 — THE PROBLEM</p>
          <p className="wk-section-lead">{install.problem}</p>
        </section>

        {/* LAYER 02 — Architecture interaction */}
        {layers.length ? (
          <section className="wk-section">
            <p className="mx-coord">02 — THE SYSTEM</p>
            <p className="mx-whisper mb-8">Hover a layer — discover its role.</p>
            <div className="wk-arch">
              {layers.map((layer, i) => {
                const label = typeof layer === "string" ? layer : layer;
                const note = install.architectureNotes?.[i] || null;
                const flow = install.flow?.[i] || null;
                return (
                  <button
                    key={label}
                    type="button"
                    className={`wk-arch-node ${activeLayer === i ? "is-active" : ""}`}
                    onMouseEnter={() => setActiveLayer(i)}
                    onFocus={() => setActiveLayer(i)}
                    onClick={() => setActiveLayer(i)}
                  >
                    <span className="mx-mono">{String(i + 1).padStart(2, "0")}</span>
                    <span className="wk-arch-label">{label}</span>
                    {activeLayer === i ? (
                      <span className="wk-arch-detail">
                        {flow?.body || note || "Documented architecture layer."}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {install.flow?.length ? (
              <div className="wk-flow mt-10">
                <p className="mx-mono mb-4">DATA FLOW</p>
                <ol className="wk-flow-list">
                  {install.flow.map((f) => (
                    <li key={f.n + f.title}>
                      <span className="mx-mono text-[var(--mx-amber)]">{f.n}</span>
                      <span className="wk-flow-title">{f.title}</span>
                      {f.body ? <span className="wk-flow-body">{f.body}</span> : null}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </section>
        ) : null}

        {/* 03 Decisions */}
        {decisions.length ? (
          <section className="wk-section">
            <p className="mx-coord">03 — THE DECISION</p>
            <div className="wk-decision-grid">
              {decisions.map((d, i) => (
                <DecisionCard key={d.n || d.decision || i} d={d} />
              ))}
            </div>
          </section>
        ) : null}

        {/* 04 Trade-offs */}
        {install.tradeoffs ? (
          <section className="wk-section">
            <p className="mx-coord">04 — THE TRADE-OFF</p>
            <div className="wk-tradeoffs">
              {install.tradeoffs.optimizedFor?.length ? (
                <div>
                  <p className="mx-mono text-[var(--mx-signal)]">OPTIMIZED FOR</p>
                  <ul>
                    {install.tradeoffs.optimizedFor.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {install.tradeoffs.sacrificed?.length ? (
                <div>
                  <p className="mx-mono text-[var(--mx-amber)]">SACRIFICED</p>
                  <ul>
                    {install.tradeoffs.sacrificed.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* Tech as components */}
        {stack.length ? (
          <section className="wk-section">
            <p className="mx-coord">TECHNOLOGY — WHY IT WAS USED</p>
            <div className="wk-stack">
              {stack.map((t) => (
                <div key={t.name} className="wk-stack-item">
                  <p className="wk-stack-name">{t.name}</p>
                  {t.why ? <p className="wk-stack-why">{t.why}</p> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* LAYER 04 — Evidence */}
        <section className="wk-section">
          <p className="mx-coord">05 — EVIDENCE / LEARNING</p>
          {install.evidence?.src ? (
            <figure className="wk-evidence">
              <Image
                src={install.evidence.src}
                alt={install.evidence.caption || install.title}
                width={1200}
                height={720}
                className="wk-evidence-img"
              />
              {install.evidence.caption ? <figcaption className="mx-whisper">{install.evidence.caption}</figcaption> : null}
            </figure>
          ) : null}

          {install.outcomes?.length ? (
            <ul className="wk-outcomes">
              {install.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          ) : (
            <p className="mx-whisper">Documented outcomes are listed where available — no invented metrics.</p>
          )}

          {install.learnings?.length ? (
            <div className="mt-10">
              <p className="mx-mono mb-3">WHAT I WOULD DO NEXT</p>
              <ul className="wk-outcomes">
                {install.learnings.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        {/* Engineering notes */}
        {install.engineeringNotes?.length ? (
          <section className="wk-section">
            <button type="button" className="wk-notes-toggle" onClick={() => setNotesOpen((v) => !v)}>
              <span className="mx-coord">ENGINEERING NOTES</span>
              <span className="mx-mono">{notesOpen ? "CLOSE" : "OPEN"}</span>
            </button>
            {notesOpen ? (
              <ul className="wk-notes">
                {install.engineeringNotes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        <section className="wk-section wk-end">
          <p className="mx-coord">WHAT THIS TAUGHT ME</p>
          <p className="wk-section-lead">
            {install.engineeringNotes?.[0] || install.learnings?.[0] || install.tagline}
          </p>
        </section>

        <nav className="wk-room-nav" aria-label="Exhibition navigation">
          {nav.prev ? (
            <Link href={`/projects/${nav.prev.slug}`} className="wk-room-nav-link">
              <span className="mx-mono">PREVIOUS SYSTEM</span>
              <span className="wk-room-nav-title">{nav.prev.cardTitle}</span>
            </Link>
          ) : (
            <Link href="/projects" className="wk-room-nav-link">
              <span className="mx-mono">EXHIBITION</span>
              <span className="wk-room-nav-title">Back to Work</span>
            </Link>
          )}
          {nav.next ? (
            <Link href={`/projects/${nav.next.slug}`} className="wk-room-nav-link wk-room-nav-link--next">
              <span className="mx-mono">NEXT SYSTEM →</span>
              <span className="wk-room-nav-title">{nav.next.cardTitle}</span>
            </Link>
          ) : (
            <Link href="/projects" className="wk-room-nav-link wk-room-nav-link--next">
              <span className="mx-mono">BUILDING SYSTEMS.</span>
              <span className="wk-room-nav-title">Return to exhibition</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}

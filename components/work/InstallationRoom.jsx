"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import WorldPageNav from "@/components/world/WorldPageNav";
import ProjectPipelineCanvas from "@/components/world/ProjectPipelineCanvas";
import InstallationGlyph from "./InstallationGlyph";
import { getInstallation, getInstallationNav } from "@/lib/data/work-exhibition";
import { useWorldTheme } from "@/lib/use-world-theme";
import "@/styles/mansi-world-of-data.css";
import "@/styles/mansi-work.css";

function ProjectSchematic({ schematic }) {
  if (!schematic) return null;
  const stages = schematic.stages || [];

  if (schematic.type === "split") {
    return (
      <figure className="wk-schematic wk-schematic--split">
        <div className="wk-schematic-split">
          <div>
            <p className="mx-mono">{schematic.left?.title}</p>
            <ul>
              {(schematic.left?.items || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <span className="wk-schematic-fork" aria-hidden>
            →
          </span>
          <div>
            <p className="mx-mono">{schematic.right?.title}</p>
            <ul>
              {(schematic.right?.items || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        {schematic.caption ? <figcaption className="mx-whisper">{schematic.caption}</figcaption> : null}
      </figure>
    );
  }

  if (!stages.length) return null;

  return (
    <figure className="wk-schematic">
      <ol className={schematic.type === "pipeline" ? "wk-schematic-rail" : "wk-schematic-layers"}>
        {stages.map((stage, i) => {
          const title = typeof stage === "string" ? stage : stage.title;
          const detail = typeof stage === "string" ? null : stage.detail;
          return (
            <li key={`${title}-${i}`}>
              <span className="mx-mono">{String(i + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              {detail ? <em>{detail}</em> : null}
            </li>
          );
        })}
      </ol>
      {schematic.caption ? <figcaption className="mx-whisper">{schematic.caption}</figcaption> : null}
    </figure>
  );
}

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
  const [theme] = useWorldTheme();
  const [activeLayer, setActiveLayer] = useState(null);
  const install = getInstallation(slug);
  const nav = getInstallationNav(slug);

  if (!install) return null;

  const decisions = (install.caseDecisions?.length ? install.caseDecisions : install.decisions) || [];
  const layers = (install.flow?.length
    ? install.flow.map((item) => item.title)
    : install.architectureLayers) || [];
  const stack = install.stackRationale?.length
    ? install.stackRationale
    : (install.tech || []).map((name) => ({ name, why: null }));
  const detailedFlow = (install.flow || []).filter((step) => step.body);
  const thesis = install.engineeringNotes?.[0] || install.tagline;
  const takeawayPoints = (install.engineeringNotes || []).slice(1);
  const hasEvidence = Boolean(
    install.evidence?.src ||
      install.schematic?.type === "split" ||
      install.schematic?.stages?.length
  );

  return (
    <div className="wd-root wd-page wk-root wk-room is-ready" data-theme={theme} data-metaphor={install.metaphor} suppressHydrationWarning>
      <WorldPageNav active="work" />

      <header className="wk-system">
        <ProjectPipelineCanvas slug={install.slug} themeId={theme} stages={layers} />
        <div className="wk-system__copy">
          <p className="wk-crumbs">
            <Link href="/">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/projects">Work</Link>
          </p>
          <p className="wd-float__kicker">
            <InstallationGlyph type={install.glyph} className="wk-glyph inline" /> Project {install.number}
          </p>
          <h1 className="wk-room-title">{install.title}</h1>
          <p className="wd-float__stack">{install.category}</p>
          <p className="wd-float__body">{install.tagline || install.subtitle || install.purpose}</p>
        </div>
        {layers.length ? (
          <ol className="wd-pipeline-labels" aria-label="System stages">
            {layers.map((stage, index) => (
              <li key={`${stage}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stage}</strong>
              </li>
            ))}
          </ol>
        ) : null}
      </header>

      <div className="wk-room-body">
        <section className="wk-section">
          <p className="mx-coord">01 — THE PROBLEM</p>
          <p className="wk-section-lead">{install.problem}</p>
        </section>

        {layers.length ? (
          <section className="wk-section">
            <p className="mx-coord">02 — THE SYSTEM</p>
            <p className="mx-whisper mb-8">Select a layer to see its role.</p>
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
                        {flow?.body || note || "Part of the documented architecture."}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {detailedFlow.length ? (
          <section className="wk-section wk-section--span">
            <p className="mx-coord">DATA FLOW</p>
            <ol className="wk-flow-list">
              {detailedFlow.map((f) => (
                <li key={f.n + f.title}>
                  <span className="mx-mono text-[var(--mx-amber)]">{f.n}</span>
                  <span className="wk-flow-title">{f.title}</span>
                  <span className="wk-flow-body">{f.body}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {decisions.length ? (
          <section className="wk-section wk-section--span">
            <p className="mx-coord">03 — THE DECISION</p>
            <div className="wk-decision-grid">
              {decisions.map((d, i) => (
                <DecisionCard key={d.n || d.decision || i} d={d} />
              ))}
            </div>
          </section>
        ) : null}

        {install.tradeoffs ? (
          <section className="wk-section wk-section--span">
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

        {stack.length ? (
          <section className="wk-section wk-section--span">
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

        {hasEvidence ? (
          <section className="wk-section wk-section--span">
            <p className="mx-coord">05 — EVIDENCE</p>
            {install.evidence?.src ? (
              <figure className="wk-evidence">
                <Image
                  src={install.evidence.src}
                  alt={install.evidence.caption || install.title}
                  width={1200}
                  height={720}
                  className="wk-evidence-img"
                />
                {install.evidence.caption ? (
                  <figcaption className="mx-whisper">{install.evidence.caption}</figcaption>
                ) : null}
              </figure>
            ) : (
              <ProjectSchematic schematic={install.schematic} />
            )}
          </section>
        ) : null}

        <section className="wk-takeaway wk-section--span">
          <article className="wk-takeaway-card">
            <p className="mx-coord">TAKEAWAY</p>
            <p className="wk-takeaway-thesis">{thesis}</p>
            {takeawayPoints.length ? (
              <ul className="wk-takeaway-points">
                {takeawayPoints.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : null}
            {install.outcomes?.length ? (
              <div className="wk-takeaway-block">
                <p className="mx-mono">WHAT LANDED</p>
                <ul>
                  {install.outcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {install.learnings?.length ? (
              <div className="wk-takeaway-block">
                <p className="mx-mono">WHAT I WOULD DO NEXT</p>
                <ul>
                  {install.learnings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        </section>

        <nav className="wk-room-nav wk-section--span" aria-label="Project navigation">
          <Link href="/" className="wk-room-nav-link">
            <span className="mx-mono">Home</span>
            <span className="wk-room-nav-title">Back to homepage</span>
          </Link>
          <Link href="/projects" className="wk-room-nav-link">
            <span className="mx-mono">Work</span>
            <span className="wk-room-nav-title">All projects</span>
          </Link>
          {nav.next ? (
            <Link href={`/projects/${nav.next.slug}`} className="wk-room-nav-link wk-room-nav-link--next">
              <span className="mx-mono">NEXT SYSTEM →</span>
              <span className="wk-room-nav-title">{nav.next.cardTitle || nav.next.title}</span>
            </Link>
          ) : nav.prev ? (
            <Link href={`/projects/${nav.prev.slug}`} className="wk-room-nav-link wk-room-nav-link--next">
              <span className="mx-mono">PREVIOUS SYSTEM</span>
              <span className="wk-room-nav-title">{nav.prev.cardTitle || nav.prev.title}</span>
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  );
}

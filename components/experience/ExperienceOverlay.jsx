"use client";

import Link from "next/link";
import {
  EXPERIENCE_OPENING,
  EXPERIENCE_COPY,
  EXPERIENCE_WINDOWS,
  EXPERIENCE_PROJECTS,
  EXPERIENCE_CONTACT,
  EXPERIENCE_PIPELINE,
} from "@/lib/data/mansi-experience";

/** Exclusive chapter — only one panel visible so text never stacks. */
function activeKey(progress) {
  const entries = Object.entries(EXPERIENCE_WINDOWS).filter(([k]) => k !== "void");
  for (const [key, win] of entries) {
    if (progress >= win.start && progress < win.end) return key;
  }
  return "final";
}

function Panel({ children, id, align = "left" }) {
  return (
    <div id={id} className={`mx-panel mx-panel--${align} mx-panel--active`} aria-live="polite">
      <div className="mx-panel-inner">{children}</div>
    </div>
  );
}

export default function ExperienceOverlay({ progress }) {
  const key = activeKey(progress);

  return (
    <div className="mx-overlay">
      {key === "hero" ? (
        <Panel align="center">
          <h1 className="mx-statement mx-statement--hero">{EXPERIENCE_OPENING.name}</h1>
          <p className="mx-mono mt-10 text-[var(--mx-vermilion)]">{EXPERIENCE_OPENING.enter}</p>
        </Panel>
      ) : null}

      {key === "systems" ? (
        <Panel align="center" id="systems">
          <p className="mx-mono text-[var(--mx-teal)]">{EXPERIENCE_COPY.systems.headline}</p>
          <p className="mx-statement mt-6 text-3xl sm:text-4xl">Pipeline stages as icons</p>
          <p className="mx-mono mt-6 opacity-80">{EXPERIENCE_COPY.systems.sub}</p>
          <Link
            href="/tools/ai-lab"
            className="mx-mono mt-8 inline-block border border-[var(--mx-vermilion)]/50 px-5 py-2.5 text-[var(--mx-vermilion)] hover:bg-[var(--mx-vermilion)]/10"
          >
            Open AI Lab →
          </Link>
        </Panel>
      ) : null}

      {key === "pipeline" ? (
        <Panel align="left">
          <p className="mx-mono text-[var(--mx-teal)]">{EXPERIENCE_COPY.pipeline.headline}</p>
          <p className="mx-statement mt-6 text-3xl sm:text-4xl">{EXPERIENCE_COPY.pipeline.sub}</p>
          <div className="mx-pipeline mt-8">
            {EXPERIENCE_PIPELINE.map((n) => (
              <span key={n.stage} className="mx-pipeline-step">
                {n.stage}
              </span>
            ))}
          </div>
        </Panel>
      ) : null}

      {key === "streams" ? (
        <Panel align="right">
          <p className="mx-mono text-[var(--mx-teal)]">Runtime behaviour</p>
          <p className="mx-body mt-6 max-w-md text-xl sm:text-2xl">{EXPERIENCE_COPY.streams.headline}</p>
          <p className="mx-mono mt-4 opacity-80">{EXPERIENCE_COPY.streams.sub}</p>
        </Panel>
      ) : null}

      {key === "city" ? (
        <Panel align="left">
          <p className="mx-mono text-[var(--mx-teal)]">Platform</p>
          <p className="mx-statement mt-6 text-3xl sm:text-4xl">{EXPERIENCE_COPY.city.headline}</p>
          <p className="mx-mono mt-4 opacity-80">{EXPERIENCE_COPY.city.sub}</p>
        </Panel>
      ) : null}

      {key === "projects" ? (
        <Panel align="left">
          <p className="mx-mono">{EXPERIENCE_COPY.projects.headline}</p>
          <p className="mx-mono mt-2 opacity-80">{EXPERIENCE_COPY.projects.sub}</p>
          <div className="mt-8 space-y-0">
            {EXPERIENCE_PROJECTS.map((p, i) => (
              <article key={p.slug} className="mx-project-row">
                <p className="mx-mono opacity-70">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-lg font-medium">{p.title}</h3>
                <p className="mx-body mt-2 max-w-md text-sm">{p.problem}</p>
                <Link href={`/projects/${p.slug}`} className="mx-mono mt-3 inline-block opacity-80 hover:opacity-100">
                  Case study →
                </Link>
              </article>
            ))}
          </div>
          <Link href="/projects" className="mx-mono mt-8 inline-block opacity-80 hover:opacity-100">
            All projects →
          </Link>
        </Panel>
      ) : null}

      {key === "lab" ? (
        <Panel align="right">
          <p className="mx-statement text-3xl sm:text-4xl">{EXPERIENCE_COPY.lab.headline}</p>
          <p className="mx-mono mt-4 opacity-80">{EXPERIENCE_COPY.lab.sub}</p>
          <Link
            href="/tools/ai-lab"
            className="mx-mono mt-8 inline-block border border-[var(--mx-vermilion)]/40 px-5 py-2.5 text-[var(--mx-vermilion)] hover:bg-[var(--mx-vermilion)]/10"
          >
            Open AI Lab →
          </Link>
        </Panel>
      ) : null}

      {key === "beyond" ? (
        <Panel align="center">
          <p className="mx-mono">{EXPERIENCE_COPY.beyond.headline}</p>
          <p className="mx-mono mt-4 opacity-80">{EXPERIENCE_COPY.beyond.sub}</p>
          <Link href="/credentials" className="mx-mono mt-8 inline-block opacity-80 hover:opacity-100">
            Experience & credentials →
          </Link>
        </Panel>
      ) : null}

      {key === "final" ? (
        <Panel align="center">
          <p className="mx-statement mx-statement--hero">{EXPERIENCE_COPY.final.name}</p>
          <p className="mx-mono mt-8 text-[var(--mx-vermilion)]">{EXPERIENCE_COPY.final.line1}</p>
          <p className="mx-mono mt-3">{EXPERIENCE_COPY.final.line2}</p>
          <p className="mx-body mt-10 max-w-xl text-xl">{EXPERIENCE_COPY.final.line3}</p>
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm">
            <a href={`mailto:${EXPERIENCE_CONTACT.email}`} className="mx-mono opacity-80 hover:opacity-100">
              Email
            </a>
            <a href={EXPERIENCE_CONTACT.linkedIn} target="_blank" rel="noopener noreferrer" className="mx-mono opacity-80 hover:opacity-100">
              LinkedIn
            </a>
            <Link href="/contact" className="mx-mono text-[var(--mx-vermilion)]">
              Contact →
            </Link>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}

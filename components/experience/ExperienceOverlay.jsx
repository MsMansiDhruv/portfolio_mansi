"use client";

import Link from "next/link";
import { windowOpacity } from "@/components/cinema/scroll/useScrollProgress";
import {
  EXPERIENCE_OPENING,
  EXPERIENCE_COPY,
  EXPERIENCE_WINDOWS,
  EXPERIENCE_PROJECTS,
  EXPERIENCE_CONTACT,
  EXPERIENCE_PIPELINE,
} from "@/lib/data/mansi-experience";

function Panel({ progress, win, align = "left", children, id }) {
  const opacity = windowOpacity(progress, win.start, win.end, 0.04);
  if (opacity <= 0.01) return null;

  return (
    <div id={id} className={`mx-panel mx-panel--${align}`} style={{ opacity }} aria-hidden={opacity < 0.15}>
      <div className="mx-panel-inner">{children}</div>
    </div>
  );
}

export default function ExperienceOverlay({ progress }) {
  return (
    <div className="mx-overlay">
      <Panel progress={progress} win={EXPERIENCE_WINDOWS.hero} align="center">
        <p className="mx-mono text-[var(--mx-vermilion)]">{EXPERIENCE_OPENING.role}</p>
        <h1 className="mx-statement mx-statement--hero mt-6">{EXPERIENCE_OPENING.name}</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed sm:text-xl" style={{ color: "var(--mx-ivory)", opacity: 0.92 }}>
          {EXPERIENCE_OPENING.line}
        </p>
        <p className="mx-mono mt-10 opacity-70">{EXPERIENCE_OPENING.cta}</p>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.systems} align="center" id="systems">
        <p className="mx-mono text-[var(--mx-teal)]">{EXPERIENCE_COPY.systems.headline}</p>
        <p className="mx-statement mt-6 text-3xl sm:text-4xl">Pipeline stages as icons</p>
        <p className="mx-mono mt-6 opacity-70">{EXPERIENCE_COPY.systems.sub}</p>
        <Link
          href="/tools/ai-lab"
          className="mx-mono mt-8 inline-block border border-[var(--mx-vermilion)]/50 px-5 py-2.5 text-[var(--mx-vermilion)] hover:bg-[var(--mx-vermilion)]/10"
        >
          Open AI Lab →
        </Link>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.pipeline} align="left">
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

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.streams} align="right">
        <p className="mx-mono text-[var(--mx-teal)]">Runtime behaviour</p>
        <p className="mx-statement--whisper mt-6 max-w-md text-2xl sm:text-3xl">{EXPERIENCE_COPY.streams.headline}</p>
        <p className="mx-mono mt-4 opacity-70">{EXPERIENCE_COPY.streams.sub}</p>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.city} align="left">
        <p className="mx-mono text-[var(--mx-teal)]">Platform</p>
        <p className="mx-statement mt-6 text-3xl sm:text-4xl">{EXPERIENCE_COPY.city.headline}</p>
        <p className="mx-mono mt-4">{EXPERIENCE_COPY.city.sub}</p>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.projects} align="left">
        <p className="mx-mono">{EXPERIENCE_COPY.projects.headline}</p>
        <p className="mx-mono mt-2 opacity-70">{EXPERIENCE_COPY.projects.sub}</p>
        <div className="mt-8 space-y-0">
          {EXPERIENCE_PROJECTS.map((p, i) => (
            <article key={p.slug} className="mx-project-row">
              <p className="mx-mono opacity-60">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-lg font-medium">{p.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed opacity-70">{p.problem}</p>
              <Link href={`/projects/${p.slug}`} className="mx-mono mt-3 inline-block opacity-60 hover:opacity-100">
                Case study →
              </Link>
            </article>
          ))}
        </div>
        <Link href="/projects" className="mx-mono mt-8 inline-block opacity-60 hover:opacity-100">
          All projects →
        </Link>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.lab} align="right">
        <p className="mx-statement text-3xl sm:text-4xl">{EXPERIENCE_COPY.lab.headline}</p>
        <p className="mx-mono mt-4">{EXPERIENCE_COPY.lab.sub}</p>
        <Link
          href="/tools/ai-lab"
          className="mx-mono mt-8 inline-block border border-[var(--mx-vermilion)]/40 px-5 py-2.5 text-[var(--mx-vermilion)] hover:bg-[var(--mx-vermilion)]/10"
        >
          Open AI Lab →
        </Link>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.beyond} align="center">
        <p className="mx-mono">{EXPERIENCE_COPY.beyond.headline}</p>
        <p className="mx-mono mt-4 opacity-70">{EXPERIENCE_COPY.beyond.sub}</p>
        <Link href="/credentials" className="mx-mono mt-8 inline-block opacity-60 hover:opacity-100">
          Experience & credentials →
        </Link>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.final} align="center">
        <p className="mx-statement mx-statement--hero">{EXPERIENCE_COPY.final.name}</p>
        <p className="mx-mono mt-8 text-[var(--mx-vermilion)]">{EXPERIENCE_COPY.final.line1}</p>
        <p className="mx-mono mt-3">{EXPERIENCE_COPY.final.line2}</p>
        <p className="mx-statement--whisper mt-10 max-w-xl text-xl sm:text-2xl">{EXPERIENCE_COPY.final.line3}</p>
        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm">
          <a href={`mailto:${EXPERIENCE_CONTACT.email}`} className="mx-mono opacity-70 hover:opacity-100">
            Email
          </a>
          <a href={EXPERIENCE_CONTACT.linkedIn} target="_blank" rel="noopener noreferrer" className="mx-mono opacity-70 hover:opacity-100">
            LinkedIn
          </a>
          <Link href="/contact" className="mx-mono text-[var(--mx-vermilion)]">
            Contact →
          </Link>
        </div>
      </Panel>
    </div>
  );
}

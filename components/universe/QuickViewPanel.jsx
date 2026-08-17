"use client";

import Link from "next/link";
import { HOME_CASE_STUDIES } from "@/lib/data/home-content";
import { TECHNICAL_PROFILE, PROFILE } from "@/lib/data/credentials-content";
import { getExperienceYearsText } from "@/lib/career/experience";
import { STORY_FINAL } from "@/lib/data/anime-story";

export default function QuickViewPanel({ open, onClose }) {
  if (!open) return null;

  const projects = HOME_CASE_STUDIES.filter((p) => p.kind !== "experiment").slice(0, 4);
  const experiments = HOME_CASE_STUDIES.filter((p) => p.kind === "experiment").slice(0, 5);
  const skills = Object.entries(TECHNICAL_PROFILE).slice(0, 5);

  return (
    <>
      <button type="button" className="mx-quick-scrim" aria-label="Close quick view" onClick={onClose} />
      <aside className="mx-quick-panel" aria-label="Quick view" role="dialog">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mx-mono text-[var(--mx-vermilion)]">Quick view</p>
            <p className="mt-2 text-sm" style={{ color: "var(--mx-ivory)", opacity: 0.75 }}>
              {PROFILE.name} · {getExperienceYearsText()}
            </p>
          </div>
          <button type="button" className="mx-mono opacity-60 hover:opacity-100" onClick={onClose}>
            Close
          </button>
        </div>

        <section className="mt-8">
          <p className="mx-mono mb-3 opacity-60">Projects</p>
          <ul className="space-y-2 text-sm">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}`} className="hover:text-[var(--mx-vermilion)]" onClick={onClose}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
          {experiments.length ? (
            <>
              <p className="mx-mono mb-3 mt-5 opacity-60">Experiments &amp; side builds</p>
              <ul className="space-y-2 text-sm">
                {experiments.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className="hover:text-[var(--mx-vermilion)]" onClick={onClose}>
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <Link href="/projects" className="mx-mono mt-3 inline-block opacity-60 hover:opacity-100" onClick={onClose}>
            All work →
          </Link>
        </section>

        <section className="mt-8">
          <p className="mx-mono mb-3 opacity-60">Capabilities</p>
          <ul className="space-y-2 text-xs" style={{ color: "var(--mx-muted)" }}>
            {skills.map(([cat, tools]) => (
              <li key={cat}>
                <span style={{ color: "var(--mx-ivory)" }}>{cat}</span> — {Array.isArray(tools) ? tools.join(", ") : tools}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/tools/ai-lab" onClick={onClose} className="mx-mono text-[var(--mx-vermilion)]">
            AI Lab →
          </Link>
          <Link href="/credentials" onClick={onClose} className="mx-mono opacity-70 hover:opacity-100">
            Experience
          </Link>
          <a href={STORY_FINAL.resume} className="mx-mono opacity-70 hover:opacity-100" onClick={onClose}>
            Resume
          </a>
          <Link href="/contact" onClick={onClose} className="mx-mono opacity-70 hover:opacity-100">
            Contact
          </Link>
        </section>
      </aside>
    </>
  );
}

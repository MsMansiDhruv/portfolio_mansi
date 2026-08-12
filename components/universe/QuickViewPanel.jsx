"use client";

import Link from "next/link";
import { HOME_CASE_STUDIES } from "@/lib/data/home-content";
import { TECHNICAL_PROFILE } from "@/lib/data/credentials-content";
import { getExperienceYearsText } from "@/lib/career/experience";
import { STORY_FINAL } from "@/lib/data/anime-story";

export default function QuickViewPanel({ open, onClose }) {
  if (!open) return null;

  const projects = HOME_CASE_STUDIES.filter((p) => p.kind !== "experiment").slice(0, 5);
  const skills = Object.entries(TECHNICAL_PROFILE).slice(0, 5);

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/40"
        aria-label="Close quick view"
        onClick={onClose}
      />
      <aside className={`universe-quick-panel is-open`} aria-label="Quick view">
        <p className="story-mono text-[var(--u-vermilion)]">Quick view</p>
        <p className="mt-2 text-sm text-[var(--u-muted)]">{getExperienceYearsText()} · experience</p>

        <section className="mt-8">
          <p className="story-mono mb-3 text-[10px] text-[var(--u-muted)]">PROJECTS</p>
          <ul className="space-y-2 text-sm">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}`} className="hover:text-[var(--u-vermilion)]" onClick={onClose}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/projects" className="story-mono mt-3 inline-block text-[10px] text-[var(--u-muted)]" onClick={onClose}>
            All work →
          </Link>
        </section>

        <section className="mt-8">
          <p className="story-mono mb-3 text-[10px] text-[var(--u-muted)]">CAPABILITIES</p>
          <ul className="space-y-2 text-xs text-[var(--u-muted)]">
            {skills.map(([cat, tools]) => (
              <li key={cat}>
                <span className="text-[var(--u-ivory)]">{cat}</span> — {tools.join(", ")}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/credentials" onClick={onClose} className="story-mono text-[var(--u-muted)] hover:text-[var(--u-ivory)]">
            Credentials
          </Link>
          <a href={STORY_FINAL.resume} className="story-mono text-[var(--u-muted)] hover:text-[var(--u-ivory)]">
            Resume
          </a>
          <Link href="/contact" onClick={onClose} className="story-mono text-[var(--u-vermilion)]">
            Contact
          </Link>
        </section>
      </aside>
    </>
  );
}

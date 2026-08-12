"use client";

import Link from "next/link";
import {
  WORLD_OPENING,
  WORLD_RAW,
  WORLD_ENGINEERING,
  WORLD_PROJECTS,
  WORLD_STACK,
  WORLD_SIGNATURE,
  WORLD_ABOUT,
  WORLD_CONTACT,
  WORLD_GROWTH,
  PIPELINE_STAGES,
} from "@/lib/data/data-world";
import WorldNav from "./WorldNav";

/** Editorial scroll fallback — same narrative, no WebGL */
export default function WorldFallback() {
  return (
    <div className="data-world min-h-screen">
      <WorldNav progress={1} />
      <div className="relative z-10 px-5 pb-24 pt-28 sm:px-10 lg:px-14">
        <section className="min-h-[70vh] flex flex-col justify-center border-b border-white/5 py-16">
          <p className="dw-mono text-[var(--dw-accent)]">Enter the system</p>
          <h1 className="dw-serif mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">{WORLD_OPENING.line1}</h1>
          <p className="dw-serif mt-6 text-2xl italic text-[var(--dw-champagne)]">{WORLD_OPENING.line2}</p>
        </section>

        <section className="min-h-[50vh] py-16">
          {WORLD_RAW.words.map((w) => (
            <p key={w} className="dw-serif text-3xl font-semibold">
              {w}
            </p>
          ))}
          <p className="mt-6 text-[var(--dw-muted)]">{WORLD_RAW.close}</p>
        </section>

        <section className="py-16">
          <p className="dw-mono text-[var(--dw-accent)]">Pipeline</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {PIPELINE_STAGES.map((s) => (
              <span key={s.id} className="dw-mono text-xs text-[var(--dw-muted)]">
                {s.label}
              </span>
            ))}
          </div>
        </section>

        <section className="py-16">
          <p className="dw-serif text-3xl">{WORLD_ENGINEERING.break}</p>
          <p className="mt-4 text-[var(--dw-muted)]">{WORLD_ENGINEERING.insight2}</p>
        </section>

        <section className="py-16">
          <p className="dw-mono text-[var(--dw-accent)]">Work</p>
          <div className="mt-8 space-y-8">
            {WORLD_PROJECTS.map((p) => (
              <article key={p.slug} className="border-l border-[var(--dw-accent)] pl-4">
                <h2 className="dw-serif text-xl">{p.title}</h2>
                <p className="mt-2 text-sm text-[var(--dw-muted)]">{p.problem}</p>
                <Link href={`/projects/${p.slug}`} className="dw-link mt-2 inline-block text-sm">
                  Case study →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16">
          <p className="dw-serif text-2xl">{WORLD_STACK.line1}</p>
          <p className="dw-serif mt-2 italic text-[var(--dw-champagne)]">{WORLD_STACK.line2}</p>
        </section>

        <section className="py-16">
          <p className="dw-mono text-[var(--dw-accent)]">Growth</p>
          <p className="mt-4 text-[var(--dw-muted)]">{WORLD_GROWTH.arc.join(" → ")}</p>
        </section>

        <section className="py-16">
          <p className="dw-serif text-2xl">{WORLD_SIGNATURE.line1}</p>
          <p className="dw-serif mt-2 italic">{WORLD_SIGNATURE.line2}</p>
        </section>

        <section id="about" className="py-16">
          <p className="dw-mono text-[var(--dw-accent)]">{WORLD_ABOUT.title}</p>
          <p className="dw-serif mt-4 text-xl italic">{WORLD_ABOUT.intro}</p>
          {WORLD_ABOUT.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="mt-4 text-sm text-[var(--dw-muted)]">
              {p}
            </p>
          ))}
        </section>

        <section id="contact" className="py-16">
          <p className="dw-serif text-2xl">{WORLD_CONTACT.title}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <a href={`mailto:${WORLD_CONTACT.email}`} className="dw-link">
              Email
            </a>
            <a href={WORLD_CONTACT.linkedIn} className="dw-link">
              LinkedIn
            </a>
            <a href={WORLD_CONTACT.github} className="dw-link">
              GitHub
            </a>
            <Link href="/contact" className="dw-link">
              Contact form →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

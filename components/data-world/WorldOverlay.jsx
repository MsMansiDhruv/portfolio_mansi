"use client";

import { useState } from "react";
import Link from "next/link";
import {
  WORLD_OPENING,
  WORLD_RAW,
  PIPELINE_STAGES,
  WORLD_ENGINEERING,
  WORLD_PROJECTS,
  WORLD_STACK,
  WORLD_GROWTH,
  WORLD_SIGNATURE,
  WORLD_ABOUT,
  WORLD_CONTACT,
  WORLD_SECTIONS,
} from "@/lib/data/data-world";

function inWindow(progress, start, end) {
  return progress >= start && progress < end;
}

function panelOpacity(progress, start, end, fade = 0.04) {
  if (progress < start - fade || progress > end + fade) return 0;
  if (progress < start) return (progress - (start - fade)) / fade;
  if (progress > end) return 1 - (progress - end) / fade;
  return 1;
}

function Panel({ progress, sectionId, children, wide, align = "center" }) {
  const section = WORLD_SECTIONS.find((s) => s.id === sectionId);
  if (!section) return null;
  const opacity = panelOpacity(progress, section.start, section.end);
  const alignClass =
    align === "right" ? "justify-end" : align === "left" ? "justify-start" : "justify-center";

  return (
    <div
      className={`dw-panel ${opacity > 0.15 ? "is-active" : ""}`}
      style={{ opacity, pointerEvents: opacity > 0.5 ? "auto" : "none" }}
      aria-hidden={opacity < 0.2}
    >
      <div className={`dw-panel-inner ${wide ? "dw-panel-wide" : ""} ${align === "right" ? "ml-auto text-right" : ""}`}>
        {children}
      </div>
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, msg }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "min-h-[44px] w-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-[var(--dw-ivory)] outline-none focus:border-[var(--dw-accent)]";

  if (done) {
    return <p className="mt-6 text-sm text-[var(--dw-muted)]">Thanks — your message was sent.</p>;
  }

  return (
    <form onSubmit={submit} className="mt-6 grid max-w-md gap-3">
      <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Name" className={inputClass} />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Email"
        className={inputClass}
      />
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        required
        rows={4}
        placeholder="Message"
        className={`${inputClass} resize-y`}
      />
      {error ? <p className="text-sm text-red-400/80">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="dw-mono mt-1 border border-[var(--dw-accent)] px-4 py-2 text-[var(--dw-accent)] transition hover:bg-[var(--dw-accent)]/10 disabled:opacity-50"
      >
        {submitting ? "Sending…" : "Send"}
      </button>
    </form>
  );
}

export default function WorldOverlay({ progress }) {
  const activePipeline = Math.min(
    PIPELINE_STAGES.length - 1,
    Math.floor(((progress - 0.2) / 0.2) * PIPELINE_STAGES.length)
  );

  return (
    <div className="dw-overlay">
      <Panel progress={progress} sectionId="enter">
        <p className="dw-mono text-[var(--dw-accent)]">Enter the system</p>
        <h1 className="dw-serif mt-6 text-4xl font-normal leading-tight sm:text-5xl lg:text-6xl">
          {WORLD_OPENING.line1}
        </h1>
        <p className="dw-serif mt-6 text-2xl italic text-[var(--dw-champagne)] sm:text-3xl">{WORLD_OPENING.line2}</p>
      </Panel>

      <Panel progress={progress} sectionId="raw" align="left">
        <div className="space-y-2">
          {WORLD_RAW.words.map((w) => (
            <p key={w} className="dw-serif text-3xl font-semibold sm:text-4xl">
              {w}
            </p>
          ))}
        </div>
        <p className="mt-8 text-lg text-[var(--dw-muted)]">{WORLD_RAW.close}</p>
      </Panel>

      <Panel progress={progress} sectionId="pipeline" wide>
        <p className="dw-mono text-[var(--dw-accent)]">The pipeline</p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {PIPELINE_STAGES.map((stage, i) => (
            <span
              key={stage.id}
              className={`dw-mono text-xs ${i === activePipeline ? "text-[var(--dw-accent)]" : "text-[var(--dw-muted)]"}`}
            >
              {String(i + 1).padStart(2, "0")} {stage.label.toUpperCase()}
            </span>
          ))}
        </div>
        <p className="dw-serif mt-10 text-2xl sm:text-3xl">
          Malformed records drop away. Structures emerge. Streams merge.
        </p>
      </Panel>

      <Panel progress={progress} sectionId="systems" align="right">
        <p className="dw-serif text-4xl font-semibold sm:text-5xl">{WORLD_ENGINEERING.break}</p>
        <p className="mt-8 text-lg text-[var(--dw-muted)]">{WORLD_ENGINEERING.insight1}</p>
        <p className="dw-serif mt-4 text-2xl italic text-[var(--dw-champagne)]">{WORLD_ENGINEERING.insight2}</p>
      </Panel>

      <Panel progress={progress} sectionId="work" align="left" wide>
        <p className="dw-mono text-[var(--dw-accent)]">My work</p>
        <div className="mt-8 space-y-10">
          {WORLD_PROJECTS.map((project, i) => {
            const show = inWindow(progress, 0.5 + i * 0.04, 0.68);
            if (!show && progress < 0.5) return null;
            return (
              <article
                key={project.slug}
                className="dw-project-card transition-opacity duration-500"
                style={{ opacity: show ? 1 : 0.35 }}
              >
                <p className="dw-mono text-[var(--dw-muted)]">
                  Project {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="dw-serif mt-2 text-2xl">{project.title}</h2>
                <p className="mt-2 text-sm text-[var(--dw-muted)]">{project.problem}</p>
                {project.visual?.nodes ? (
                  <p className="dw-mono mt-4 text-[10px] text-[var(--dw-accent)]">
                    {project.visual.nodes.join(" → ")}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-[var(--dw-champagne)]">{project.techLabel}</p>
                <Link href={`/projects/${project.slug}`} className="dw-link mt-3 inline-block text-sm">
                  Read case study →
                </Link>
              </article>
            );
          })}
        </div>
      </Panel>

      <Panel progress={progress} sectionId="stack" align="right">
        <p className="dw-serif text-3xl sm:text-4xl">{WORLD_STACK.line1}</p>
        <p className="dw-serif mt-4 text-2xl italic text-[var(--dw-champagne)]">{WORLD_STACK.line2}</p>
        <ul className="mt-8 space-y-3 text-right text-sm text-[var(--dw-muted)]">
          {WORLD_STACK.groups.slice(0, 5).map((g) => (
            <li key={g.category}>
              <span className="text-[var(--dw-ivory)]">{g.category}</span> — {g.tools.join(", ")}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel progress={progress} sectionId="growth">
        <p className="dw-mono text-[var(--dw-accent)]">Growth</p>
        <div className="mt-8 flex flex-col gap-3">
          {WORLD_GROWTH.arc.map((step, i) => (
            <p
              key={step}
              className="dw-serif text-xl sm:text-2xl"
              style={{ opacity: 0.4 + (i / WORLD_GROWTH.arc.length) * 0.6 }}
            >
              {step}
            </p>
          ))}
        </div>
      </Panel>

      <Panel progress={progress} sectionId="signature" align="left">
        <p className="dw-serif text-3xl sm:text-4xl">{WORLD_SIGNATURE.line1}</p>
        <p className="dw-serif mt-4 text-2xl italic text-[var(--dw-champagne)]">{WORLD_SIGNATURE.line2}</p>
        <p className="dw-mono mt-6 text-[var(--dw-muted)]">{WORLD_SIGNATURE.motif}</p>
      </Panel>

      <Panel progress={progress} sectionId="about" align="left" wide>
        <div id="about">
          <p className="dw-mono text-[var(--dw-accent)]">{WORLD_ABOUT.title}</p>
          <p className="dw-serif mt-6 text-2xl italic">{WORLD_ABOUT.intro}</p>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--dw-muted)]">
            {WORLD_ABOUT.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <p className="mt-6 text-xs text-[var(--dw-champagne)]">{WORLD_ABOUT.domains}</p>
        </div>
      </Panel>

      <Panel progress={progress} sectionId="contact" align="left" wide>
        <div id="contact">
          <p className="dw-serif text-3xl sm:text-4xl">{WORLD_CONTACT.title}</p>
          <p className="dw-serif mt-4 text-xl italic text-[var(--dw-champagne)]">{WORLD_CONTACT.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <a href={`mailto:${WORLD_CONTACT.email}`} className="dw-link">
              Email
            </a>
            <a href={WORLD_CONTACT.linkedIn} target="_blank" rel="noopener noreferrer" className="dw-link">
              LinkedIn
            </a>
            <a href={WORLD_CONTACT.github} target="_blank" rel="noopener noreferrer" className="dw-link">
              GitHub
            </a>
            <a href={WORLD_CONTACT.resume} className="dw-link">
              Resume
            </a>
          </div>
          <ContactForm />
        </div>
      </Panel>
    </div>
  );
}

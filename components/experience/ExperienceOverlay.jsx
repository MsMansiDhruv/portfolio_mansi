"use client";

import Link from "next/link";
import { windowOpacity } from "@/components/cinema/scroll/useScrollProgress";
import {
  EXPERIENCE_OPENING,
  EXPERIENCE_COPY,
  EXPERIENCE_WINDOWS,
  EXPERIENCE_PROJECTS,
  EXPERIENCE_CONTACT,
} from "@/lib/data/mansi-experience";
import { STORY_IDENTITY, STORY_TRAVEL, STORY_LEADERSHIP } from "@/lib/data/anime-story";

function Panel({ progress, win, align = "left", children, id }) {
  const opacity = windowOpacity(progress, win.start, win.end, 0.045);
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
        <h1 className="mx-statement mx-statement--hero">{EXPERIENCE_OPENING.name}</h1>
        <p className="mx-mono mt-8 opacity-50">Scroll · the world responds</p>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.worldLine} align="center">
        <p className="mx-statement mx-statement--whisper">{EXPERIENCE_OPENING.world}</p>
        <p className="mx-mono mt-8 text-[var(--mx-vermilion)]">{EXPERIENCE_OPENING.tagline}</p>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.globe} align="center" id="world">
        <p className="mx-mono">Personal world</p>
        <p className="mx-statement--whisper mt-6 max-w-md text-2xl sm:text-3xl">
          A constellation of everything I&apos;ve built, learned, and discovered.
        </p>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.play} align="left">
        <p className="mx-statement">{EXPERIENCE_COPY.play.headline}</p>
        <p className="mx-mono mt-6">{EXPERIENCE_COPY.play.sub}</p>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.stories} align="right">
        <p className="mx-statement">{EXPERIENCE_COPY.stories.headline}</p>
        <p className="mx-mono mt-6">{EXPERIENCE_COPY.stories.sub}</p>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.badminton} align="center">
        <p className="mx-mono">Movement</p>
        <p className="mx-statement--whisper mt-6 text-2xl">Court lines. Rhythm. Reading the next move.</p>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.travel} align="left">
        <p className="mx-mono">Explore</p>
        {STORY_TRAVEL.lines.map((line) => (
          <p key={line} className="mx-statement--whisper mt-4 text-2xl first:mt-6">
            {line}
          </p>
        ))}
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.community} align="center">
        <p className="mx-statement max-w-2xl">{EXPERIENCE_COPY.community.headline}</p>
        <p className="mx-mono mt-6">{EXPERIENCE_COPY.community.sub}</p>
        <Link href="/credentials#recommendations" className="mx-mono mt-8 inline-block opacity-70 hover:opacity-100">
          Voices →
        </Link>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.leadership} align="right">
        <p className="mx-mono">Leadership</p>
        <p className="mx-statement--whisper mt-6 max-w-sm text-2xl">{STORY_LEADERSHIP.line}</p>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.engineering} align="left">
        <p className="mx-mono text-[var(--mx-teal)]">Engineering</p>
        <p className="mx-statement mt-6 text-3xl sm:text-4xl">{EXPERIENCE_COPY.engineering.headline}</p>
        <p className="mx-mono mt-4">{EXPERIENCE_COPY.engineering.sub}</p>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.streams} align="right">
        <p className="mx-mono text-[var(--mx-teal)]">Data in motion</p>
        <p className="mx-statement--whisper mt-6 max-w-md text-2xl sm:text-3xl">
          {EXPERIENCE_COPY.streams.headline}
        </p>
        <p className="mx-mono mt-4 opacity-70">{EXPERIENCE_COPY.streams.sub}</p>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.city} align="left">
        <p className="mx-mono text-[var(--mx-teal)]">Architecture</p>
        <p className="mx-statement mt-6 text-3xl sm:text-4xl">{EXPERIENCE_COPY.city.headline}</p>
        <p className="mx-mono mt-4">{EXPERIENCE_COPY.city.sub}</p>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.projects} align="left">
        <p className="mx-mono">{EXPERIENCE_COPY.projects.headline}</p>
        <p className="mx-mono mt-2 opacity-70">{EXPERIENCE_COPY.projects.sub}</p>
        <div className="mt-8 space-y-0">
          {EXPERIENCE_PROJECTS.map((p, i) => (
            <article key={p.slug} className="mx-project-row">
              <p className="mx-mono opacity-60">Installation {String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-medium text-lg">{p.title}</h3>
              <p className="mt-2 text-sm opacity-70 leading-relaxed max-w-md">{p.problem}</p>
              <Link href={`/projects/${p.slug}`} className="mx-mono mt-3 inline-block opacity-60 hover:opacity-100">
                Enter →
              </Link>
            </article>
          ))}
        </div>
        <Link href="/projects" className="mx-mono mt-8 inline-block opacity-60 hover:opacity-100">
          Full gallery →
        </Link>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.lab} align="right">
        <p className="mx-statement text-3xl sm:text-4xl">{EXPERIENCE_COPY.lab.headline}</p>
        <p className="mx-mono mt-4">{EXPERIENCE_COPY.lab.sub}</p>
        <Link
          href="/tools/ai-lab"
          className="mx-mono mt-8 inline-block border border-[var(--mx-vermilion)]/40 px-5 py-2.5 text-[var(--mx-vermilion)] hover:bg-[var(--mx-vermilion)]/10"
        >
          Enter the lab →
        </Link>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.about} align="left" id="about">
        <p className="mx-mono text-[var(--mx-teal)]">About</p>
        <p className="mx-statement mt-6 text-3xl">{STORY_IDENTITY.name}</p>
        <div className="mt-8 space-y-4 max-w-lg">
          {STORY_IDENTITY.fragments.slice(0, 4).map((f) => (
            <div key={f.id}>
              <p className="font-medium">{f.label}</p>
              <p className="mt-1 text-sm opacity-70 leading-relaxed">{f.detail}</p>
            </div>
          ))}
        </div>
        <Link href="/credentials" className="mx-mono mt-8 inline-block opacity-60 hover:opacity-100">
          Full archive →
        </Link>
      </Panel>

      <Panel progress={progress} win={EXPERIENCE_WINDOWS.final} align="center">
        <p className="mx-statement mx-statement--hero">{EXPERIENCE_COPY.final.name}</p>
        <p className="mx-statement mt-10 text-3xl sm:text-4xl">{EXPERIENCE_COPY.final.line1}</p>
        <p className="mx-statement mt-6 text-3xl sm:text-4xl text-[var(--mx-vermilion)]">{EXPERIENCE_COPY.final.line2}</p>
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

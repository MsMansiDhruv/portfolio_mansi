"use client";

import Link from "next/link";
import {
  EXPERIENCE_OPENING,
  EXPERIENCE_COPY,
  EXPERIENCE_WINDOWS,
  EXPERIENCE_INSTALLATIONS,
  EXPERIENCE_CHAMBERS,
  EXPERIENCE_CONTACT,
} from "@/lib/data/mansi-experience";

function activeKey(progress) {
  const entries = Object.entries(EXPERIENCE_WINDOWS).filter(([k]) => k !== "void");
  for (const [key, win] of entries) {
    if (progress >= win.start && progress < win.end) return key;
  }
  return "person";
}

/** Progressive reveal within exhibition based on local progress */
function installationIndex(progress) {
  const win = EXPERIENCE_WINDOWS.exhibition;
  const local = (progress - win.start) / Math.max(1e-6, win.end - win.start);
  const n = EXPERIENCE_INSTALLATIONS.length;
  return Math.min(n - 1, Math.max(0, Math.floor(local * n)));
}

function stepIndex(progress, installIdx) {
  const win = EXPERIENCE_WINDOWS.exhibition;
  const span = (win.end - win.start) / EXPERIENCE_INSTALLATIONS.length;
  const start = win.start + installIdx * span;
  const local = (progress - start) / Math.max(1e-6, span);
  // title first, then steps
  if (local < 0.18) return -1;
  const steps = EXPERIENCE_INSTALLATIONS[installIdx]?.steps?.length || 6;
  return Math.min(steps - 1, Math.floor(((local - 0.18) / 0.82) * steps));
}

function Panel({ children, id, align = "left", tone = "default" }) {
  return (
    <div
      id={id}
      className={`mx-panel mx-panel--${align} mx-panel--active mx-panel--${tone}`}
      aria-live="polite"
    >
      <div className="mx-panel-inner">{children}</div>
    </div>
  );
}

export default function ExperienceOverlay({ progress }) {
  const key = activeKey(progress);
  const installIdx = installationIndex(progress);
  const install = EXPERIENCE_INSTALLATIONS[installIdx];
  const step = install ? stepIndex(progress, installIdx) : -1;
  const clarifyHold = progress >= 0.46 && progress < 0.52;

  return (
    <div className="mx-overlay">
      {key === "unknown" ? (
        <Panel align="center" tone="cinema">
          <p className="mx-coord">01 · UNKNOWN</p>
          <h1 className="mx-statement mx-statement--hero">{EXPERIENCE_OPENING.name}</h1>
          <p className="mx-enter">{EXPERIENCE_OPENING.enter}</p>
        </Panel>
      ) : null}

      {key === "flow" ? (
        <Panel align="left" tone="cinema">
          <p className="mx-coord">{EXPERIENCE_COPY.flow.mark} · SYSTEM</p>
          <p className="mx-statement mx-statement--word">{EXPERIENCE_COPY.flow.word}</p>
          <p className="mx-whisper">{EXPERIENCE_COPY.flow.line}</p>
        </Panel>
      ) : null}

      {key === "structure" ? (
        <Panel align="right" tone="cinema">
          <p className="mx-coord">{EXPERIENCE_COPY.structure.mark} · SYSTEM</p>
          <p className="mx-statement mx-statement--word">{EXPERIENCE_COPY.structure.word}</p>
          <p className="mx-whisper">{EXPERIENCE_COPY.structure.line}</p>
        </Panel>
      ) : null}

      {key === "clarification" ? (
        <Panel align="center" tone="hold">
          <p className="mx-coord">{EXPERIENCE_COPY.clarification.mark} · SIGNATURE</p>
          <p className="mx-statement mx-statement--word">{EXPERIENCE_COPY.clarification.word}</p>
          {clarifyHold ? (
            <p className="mx-hold">{EXPERIENCE_COPY.clarification.hold}</p>
          ) : null}
        </Panel>
      ) : null}

      {key === "exhibition" && install ? (
        <Panel align="left" tone="exhibit" id="work">
          <p className="mx-coord">
            {EXPERIENCE_COPY.exhibition.mark} · INSTRUMENT {String(installIdx + 1).padStart(2, "0")}
          </p>
          <h2 className="mx-install-title">{install.title}</h2>
          {step >= 0 ? (
            <div className="mx-reveal">
              <p className="mx-reveal-key">{install.steps[step].key}</p>
              <p className="mx-reveal-text">{install.steps[step].text}</p>
            </div>
          ) : (
            <p className="mx-whisper">Approach the installation.</p>
          )}
          <Link href={install.href} className="mx-link-quiet">
            Case study →
          </Link>
        </Panel>
      ) : null}

      {key === "mind" ? (
        <Panel align="right" tone="mind" id="lab">
          <p className="mx-coord">{EXPERIENCE_COPY.mind.mark} · REASONING</p>
          <p className="mx-statement mx-statement--word">{EXPERIENCE_COPY.mind.word}</p>
          <p className="mx-whisper">{EXPERIENCE_COPY.mind.line}</p>
          <div className="mx-chambers">
            {EXPERIENCE_CHAMBERS.map((c) => (
              <Link key={c.id} href={c.href} className="mx-chamber">
                <span className="mx-chamber-label">{c.label}</span>
                <span className="mx-chamber-hint">{c.hint}</span>
              </Link>
            ))}
          </div>
        </Panel>
      ) : null}

      {key === "person" ? (
        <Panel align="center" tone="dawn">
          <p className="mx-coord">{EXPERIENCE_COPY.person.mark} · AUTHOR</p>
          <p className="mx-statement mx-statement--hero">{EXPERIENCE_COPY.person.word}</p>
          <p className="mx-enter mt-8">{EXPERIENCE_COPY.person.line1}</p>
          <p className="mx-whisper mt-3">{EXPERIENCE_COPY.person.line2}</p>
          <p className="mx-body-soft mt-10">{EXPERIENCE_COPY.person.line3}</p>
          <div className="mx-person-links">
            <Link href="/credentials">About & credentials</Link>
            <a href={`mailto:${EXPERIENCE_CONTACT.email}`}>Email</a>
            <a href={EXPERIENCE_CONTACT.linkedIn} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <Link href="/contact" className="mx-link-accent">
              Contact →
            </Link>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}

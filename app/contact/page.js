"use client";

import { useState } from "react";
import StoryChapterShell from "@/components/world/StoryChapterShell";
import { STORY_FINAL, STORY_PAGE_META } from "@/lib/data/anime-story";

const inputClass =
  "min-h-[44px] w-full border border-white/[0.12] bg-transparent px-3 py-2.5 text-base text-[var(--story-ivory)] outline-none transition focus:border-[var(--mw-vermilion)]";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [mailtoFallback, setMailtoFallback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const meta = STORY_PAGE_META.next;

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setMailtoFallback(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, msg }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong while sending your message.");
        if (data.mailto) setMailtoFallback(data.mailto);
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong while sending your message.");
      setMailtoFallback(
        `mailto:${STORY_FINAL.email}?subject=${encodeURIComponent(`Website contact from ${name}`)}&body=${encodeURIComponent(`${msg}\n\n— ${name}\n${email}`)}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <StoryChapterShell chapter={meta.chapter} title={STORY_FINAL.lines[0]} subtitle={STORY_FINAL.lines[1]}>
      <div className="mx-auto max-w-lg px-5 pb-24 sm:px-10 lg:px-14">
        <p className="text-sm text-[var(--story-grey)]">
          Prefer email directly?{" "}
          <a href={`mailto:${STORY_FINAL.email}`} className="text-[var(--mw-vermilion)] hover:underline">
            {STORY_FINAL.email}
          </a>
        </p>

        {done ? (
          <p className="mt-10 text-sm leading-relaxed">Thanks — your message was sent. I will reply when I can.</p>
        ) : (
          <form onSubmit={submit} className="mt-10 grid gap-4">
            <label className="grid gap-1.5 text-sm">
              <span className="story-mono text-[var(--story-grey)]">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className={inputClass} />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="story-mono text-[var(--story-grey)]">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={inputClass} />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="story-mono text-[var(--story-grey)]">Message</span>
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} required rows={5} className={`${inputClass} resize-y`} />
            </label>
            {error ? (
              <div className="border border-[var(--story-red)]/40 p-3" role="alert">
                <p className="text-sm text-[var(--story-red)]">{error}</p>
                {mailtoFallback ? (
                  <a href={mailtoFallback} className="story-mono mt-2 inline-block text-[var(--story-cyan)]">
                    Open email with your message →
                  </a>
                ) : null}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="story-mono inline-flex min-h-[44px] items-center justify-center border border-[var(--story-ivory)]/30 px-6 py-2.5 text-sm transition hover:border-[var(--mw-vermilion)] hover:text-[var(--mw-vermilion)] disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send message"}
            </button>
          </form>
        )}

        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <a href={STORY_FINAL.linkedIn} target="_blank" rel="noopener noreferrer" className="story-mono text-[var(--story-grey)] hover:text-[var(--story-ivory)]">
            LinkedIn
          </a>
          <a href={STORY_FINAL.github} target="_blank" rel="noopener noreferrer" className="story-mono text-[var(--story-grey)] hover:text-[var(--story-ivory)]">
            GitHub
          </a>
          <a href={STORY_FINAL.resume} className="story-mono text-[var(--story-grey)] hover:text-[var(--story-ivory)]">
            Resume
          </a>
        </div>
      </div>
    </StoryChapterShell>
  );
}

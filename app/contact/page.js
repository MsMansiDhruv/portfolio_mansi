"use client";

import Link from "next/link";
import { useState } from "react";
import WorldFieldBackdrop from "@/components/world/WorldFieldBackdrop";
import WorldPageNav from "@/components/world/WorldPageNav";
import { IDENTITY_HERO } from "@/lib/data/identity";
import { SOCIAL_LINKS } from "@/lib/data/social-links";
import { useWorldTheme } from "@/lib/use-world-theme";
import "@/styles/mansi-world-of-data.css";

export default function Contact() {
  const [theme] = useWorldTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [mailtoFallback, setMailtoFallback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
        `mailto:${SOCIAL_LINKS.email}?subject=${encodeURIComponent(`Website contact from ${name}`)}&body=${encodeURIComponent(`${msg}\n\n— ${name}\n${email}`)}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="wd-root wd-page wd-page--field wd-page--contact wd-page--copy is-ready" data-theme={theme} suppressHydrationWarning>
      <WorldFieldBackdrop themeId={theme} layer="contact" className="wd-field-backdrop--copy" />
      <WorldPageNav active="contact" />
      <main className="wd-page-main">
        <header className="wd-page-hero">
          <p className="wd-scroll-kicker">Contact</p>
          <h1 className="wd-page-title">Get in touch.</h1>
          <p className="wd-page-lead">{IDENTITY_HERO.headline}</p>
          <p className="wd-page-body">
            For roles, collaboration, or a technical conversation. I usually reply within a few business days.
          </p>
          <p className="wd-page-body">
            Prefer email?{" "}
            <a className="wd-inline-link" href={`mailto:${SOCIAL_LINKS.email}`}>
              {SOCIAL_LINKS.email}
            </a>
          </p>
        </header>

        <section className="wd-page-section wd-contact-main">
          {done ? (
            <p className="wd-page-body">Thanks — your message was sent. I will reply when I can.</p>
          ) : (
            <form onSubmit={submit} className="wd-contact-form">
              <label>
                <span>Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </label>
              <label>
                <span>Message</span>
                <textarea value={msg} onChange={(e) => setMsg(e.target.value)} required rows={6} />
              </label>
              {error ? (
                <div className="wd-contact-error" role="alert">
                  <p>{error}</p>
                  {mailtoFallback ? <a href={mailtoFallback}>Open email with your message →</a> : null}
                </div>
              ) : null}
              <button type="submit" disabled={submitting} className="wd-contact-submit">
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </section>

        <div className="wd-scroll-links">
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="/resume.pdf" target="_blank" rel="noreferrer">
            Resume
          </a>
          <Link href="/credentials">About</Link>
        </div>
      </main>
    </div>
  );
}

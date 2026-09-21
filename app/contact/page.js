"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Send } from "lucide-react";
import WorldPageNav from "@/components/world/WorldPageNav";
import SiteFooter from "@/components/world/SiteFooter";
import FieldSpirals from "@/components/world/FieldSpirals";
import { useStudioMotion } from "@/components/world/useStudioMotion";
import { SOCIAL_LINKS } from "@/lib/data/social-links";
import { useWorldTheme } from "@/lib/use-world-theme";
import "@/styles/mansi-world-of-data.css";
import "@/styles/mansi-studio.css";

export default function Contact() {
  const [theme] = useWorldTheme();
  const rootRef = useRef(null);
  useStudioMotion(rootRef);
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
    <div ref={rootRef} className="wd-root wd-page wd-page--contact wd-studio-shell" data-theme={theme} suppressHydrationWarning>
      <WorldPageNav active="contact" />
      <FieldSpirals />
      <main className="wd-studio-main">
        <header className="wd-studio-hero wd-studio-hero--plain">
          <div data-rise>
            <p className="wd-studio-kicker">Contact</p>
            <h1>If the work holds, write.</h1>
            <p>
              Hiring, a collaboration, or a design review. Send the constraint. I will answer like an engineer.
            </p>
          </div>
        </header>

        <div className="wd-contact-split">
          <div data-rise>
            <p className="wd-studio-kicker">Direct</p>
            <a className="wd-route__mail" href={`mailto:${SOCIAL_LINKS.email}`}>
              {SOCIAL_LINKS.email}
            </a>
            <nav className="wd-studio-links" aria-label="Elsewhere">
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} /> LinkedIn
              </a>
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer">
                <Github size={16} /> GitHub
              </a>
              <a href="/resume.pdf" target="_blank" rel="noreferrer">
                Resume <ArrowUpRight size={14} />
              </a>
              <Link href="/credentials">About</Link>
            </nav>
          </div>

          {done ? (
            <p className="wd-page-body" data-rise>
              Thanks — your message was sent. I will reply when I can.
            </p>
          ) : (
            <form onSubmit={submit} className="wd-contact-form" data-rise>
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
                <Send size={16} /> {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

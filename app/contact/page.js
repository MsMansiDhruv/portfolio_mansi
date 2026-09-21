"use client";

import { useRef, useState } from "react";
import { FileText, Github, Linkedin, Mail, Send } from "lucide-react";
import WorldPageNav from "@/components/world/WorldPageNav";
import SiteFooter from "@/components/world/SiteFooter";
import FieldSpirals from "@/components/world/FieldSpirals";
import { useStudioMotion } from "@/components/world/useStudioMotion";
import { IDENTITY } from "@/lib/data/identity";
import { SOCIAL_LINKS } from "@/lib/data/social-links";
import { useWorldTheme } from "@/lib/use-world-theme";
import "@/styles/mansi-world-of-data.css";
import "@/styles/mansi-studio.css";

const ICONS = [
  { label: "Email", href: `mailto:${SOCIAL_LINKS.email}`, icon: Mail, external: false },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, icon: Linkedin, external: true },
  { label: "GitHub", href: SOCIAL_LINKS.github, icon: Github, external: true },
  { label: "Resume", href: "/resume.pdf", icon: FileText, external: true },
];

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
        setError(data.error || "The message did not send. Try again, or use email.");
        if (data.mailto) setMailtoFallback(data.mailto);
        return;
      }
      setDone(true);
    } catch {
      setError("The message did not send. Try again, or use email.");
      setMailtoFallback(
        `mailto:${SOCIAL_LINKS.email}?subject=${encodeURIComponent(`Website contact from ${name}`)}&body=${encodeURIComponent(`${msg}\n\n— ${name}\n${email}`)}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      ref={rootRef}
      className="wd-root wd-page wd-page--contact wd-studio-shell"
      data-theme={theme}
      suppressHydrationWarning
    >
      <WorldPageNav active="contact" />
      <FieldSpirals />
      <main className="wd-contact">
        <div className="wd-contact__board">
          <header className="wd-contact__intro" data-rise>
            <p className="wd-studio-kicker">Contact</p>
            <h1>Start with the constraint.</h1>
            <p className="wd-contact__role">{IDENTITY.headline}</p>
            <p className="wd-contact__lead">
              Hiring, a collaboration, or a design review. Tell me the system, the pressure, and what has to hold. I
              will answer like an engineer.
            </p>
            <nav className="wd-contact__icons" aria-label="Direct">
              {ICONS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                  </a>
                );
              })}
            </nav>
          </header>

          {done ? (
            <div className="wd-contact__done" data-rise role="status">
              <p className="wd-studio-kicker">Sent</p>
              <h2>The note is in.</h2>
              <p>I will reply when I can. If it is time-sensitive, email is faster.</p>
              <a className="wd-contact__mail-link" href={`mailto:${SOCIAL_LINKS.email}`}>
                {SOCIAL_LINKS.email}
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="wd-contact-form" data-rise>
              <header className="wd-contact-form__head">
                <p className="wd-studio-kicker">Message</p>
                <h2>Send a note</h2>
                <p>Name, email, and the actual problem. No need to dress it up.</p>
              </header>
              <div className="wd-contact-form__row">
                <label htmlFor="contact-name">
                  <span>Name</span>
                  <input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Your name"
                  />
                </label>
                <label htmlFor="contact-email">
                  <span>Email</span>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                  />
                </label>
              </div>
              <label htmlFor="contact-msg">
                <span>The constraint</span>
                <textarea
                  id="contact-msg"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  required
                  rows={7}
                  placeholder="What is breaking, what you need, and by when."
                />
              </label>
              {error ? (
                <div className="wd-contact-error" role="alert">
                  <p>{error}</p>
                  {mailtoFallback ? (
                    <a href={mailtoFallback}>Open email with your message</a>
                  ) : null}
                </div>
              ) : null}
              <div className="wd-contact-form__foot">
                <p>I read every note. Reply is not instant.</p>
                <button type="submit" disabled={submitting} className="wd-contact-submit">
                  <Send size={16} aria-hidden />
                  {submitting ? "Sending…" : "Send"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

"use client";

import { useState } from "react";
import { PageHeader } from "@/components/portfolio/primitives";
import { Reveal } from "@/components/portfolio/motion";

const CONTACT_EMAIL = "mansi.p.dhruv@gmail.com";

export default function Contact() {
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
        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Website contact from ${name}`)}&body=${encodeURIComponent(`${msg}\n\n— ${name}\n${email}`)}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-w-0 max-w-lg">
      <Reveal>
        <PageHeader
          eyebrow="Contact"
          title="Get in touch"
          description="Questions about work, speaking, or collaboration — I aim to reply within a few business days."
        />
      </Reveal>

      <Reveal delay={0.05}>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Prefer email directly?{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
          >
            {CONTACT_EMAIL}
          </a>
        </p>

        {done ? (
          <p className="mt-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            Thanks — your message was sent. I will reply when I can.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 grid gap-4">
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-slate-800 dark:text-slate-200">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none ring-teal-600/0 transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-slate-800 dark:text-slate-200">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-slate-800 dark:text-slate-200">Message</span>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                required
                rows={5}
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base leading-relaxed text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </label>
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30" role="alert">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                {mailtoFallback ? (
                  <a
                    href={mailtoFallback}
                    className="mt-2 inline-flex min-h-[36px] items-center rounded-full bg-teal-700 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500"
                  >
                    Open email with your message →
                  </a>
                ) : (
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="mt-2 inline-block text-sm font-medium text-teal-700 hover:underline dark:text-teal-400"
                  >
                    Email {CONTACT_EMAIL} directly
                  </a>
                )}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-teal-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              {submitting ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </Reveal>
    </div>
  );
}

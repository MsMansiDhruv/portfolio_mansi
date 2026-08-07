"use client";

import { useState } from "react";
import { PageHeader } from "@/components/portfolio/primitives";
import { Reveal } from "@/components/portfolio/motion";

export default function Contact() {
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
      if (!res.ok) throw new Error("Request failed");
      setDone(true);
    } catch {
      setError("Something went wrong while sending your message. Please try again or email directly.");
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
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
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

"use client";

import { Award } from "lucide-react";
import { CERTIFICATIONS, groupCertificationsByCategory } from "@/lib/data/career";
import { Reveal } from "@/components/portfolio/motion";

function CertGroup({ title, certs, index }) {
  return (
    <Reveal delay={0.03 + index * 0.03} viewportAmount={0.08}>
      <div className="min-w-0">
        <h4 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          {title}
        </h4>
        <ul className="mt-2 space-y-2">
          {certs.map((cert) => (
            <li key={cert.id} className="min-w-0 text-xs leading-snug">
              {cert.link ? (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-slate-800 underline-offset-2 hover:underline dark:text-slate-200"
                >
                  {cert.title}
                </a>
              ) : (
                <span className="font-medium text-slate-800 dark:text-slate-200">{cert.title}</span>
              )}
              <span className="mt-0.5 block text-slate-400 dark:text-slate-500">
                {cert.org} · {cert.issued}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function PrimaryCertBadge({ cert }) {
  if (!cert) return null;

  return (
    <Reveal viewportAmount={0.1}>
      <div className="rounded-xl border border-teal-700/15 bg-gradient-to-br from-teal-50/50 to-white p-4 dark:border-teal-500/20 dark:from-teal-950/25 dark:to-slate-950/40">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-teal-700/15 bg-white text-teal-800 dark:border-teal-500/25 dark:bg-slate-900 dark:text-teal-400">
            <Award className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0">
            {cert.link ? (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-slate-950 underline-offset-2 hover:underline dark:text-white"
              >
                {cert.title}
              </a>
            ) : (
              <p className="text-sm font-semibold text-slate-950 dark:text-white">{cert.title}</p>
            )}
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {cert.org} · {cert.issued}
              {cert.verified ? " · Verified" : ""}
            </p>
            {cert.link ? (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-[11px] font-medium text-teal-800 dark:text-teal-400"
              >
                Verify credential →
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function CredentialsBlock() {
  const primary = CERTIFICATIONS.find((c) => c.tier === "primary");
  const groups = groupCertificationsByCategory();
  const learningGroups = [...groups.entries()].map(([title, certs]) => ({
    title,
    certs: certs.filter((c) => c.id !== primary?.id),
  })).filter((g) => g.certs.length > 0);

  return (
    <div className="mt-4 space-y-6">
      <PrimaryCertBadge cert={primary} />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          Continuing education
        </p>
        <div className="mt-3 grid gap-5 sm:grid-cols-2">
          {learningGroups.map(({ title, certs }, index) => (
            <CertGroup key={title} title={title} certs={certs} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

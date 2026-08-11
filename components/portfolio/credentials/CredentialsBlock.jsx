"use client";

import { groupCertificationsByCategory } from "@/lib/data/career";
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
                {cert.verified ? " · Verified" : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export default function CredentialsBlock() {
  const groups = groupCertificationsByCategory();

  return (
    <div className="mt-4 grid gap-5 sm:grid-cols-2">
      {[...groups.entries()].map(([title, certs], index) => (
        <CertGroup key={title} title={title} certs={certs} index={index} />
      ))}
    </div>
  );
}

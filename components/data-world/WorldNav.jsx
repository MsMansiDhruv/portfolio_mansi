"use client";

import Link from "next/link";
import { PROFILE } from "@/lib/data/credentials-content";
import { PROGRESS_RAIL } from "@/lib/data/data-world";

function railIndex(progress) {
  if (progress < 0.2) return 0;
  if (progress < 0.38) return 1;
  if (progress < 0.52) return 2;
  if (progress < 0.68) return 3;
  if (progress < 0.86) return 4;
  return 5;
}

export default function WorldNav({ progress = 0 }) {
  const active = railIndex(progress);

  return (
    <>
      <header className="dw-nav">
        <div>
          <p className="dw-mono text-[var(--dw-muted)]">{PROFILE.name}</p>
          <p className="mt-0.5 text-sm text-[var(--dw-ivory)]">Data Engineer</p>
        </div>
        <nav className="flex gap-6 text-sm">
          <Link href="/projects" className="text-[var(--dw-muted)] transition hover:text-[var(--dw-ivory)]">
            Work
          </Link>
          <a href="#about" className="text-[var(--dw-muted)] transition hover:text-[var(--dw-ivory)]">
            About
          </a>
          <a href="#contact" className="text-[var(--dw-muted)] transition hover:text-[var(--dw-ivory)]">
            Contact
          </a>
        </nav>
      </header>

      <aside className="dw-rail" aria-hidden>
        {PROGRESS_RAIL.map((item, i) => (
          <span key={item.n} className={`dw-rail-item ${i === active ? "is-active" : ""}`}>
            {item.n} / {item.label}
          </span>
        ))}
      </aside>
    </>
  );
}

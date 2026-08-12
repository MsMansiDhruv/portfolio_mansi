"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/design-system-v2";
import ExperienceNav from "@/components/experience/ExperienceNav";
import QuickViewPanel from "@/components/universe/QuickViewPanel";
import WorkHallCanvas from "./WorkHallCanvas";
import InstallationGlyph from "./InstallationGlyph";
import {
  WORK_OPENING,
  WORK_INSTALLATIONS,
  WORK_SECONDARY,
  WORK_EXPERIMENTS,
} from "@/lib/data/work-exhibition";
import "@/styles/mansi-experience.css";
import "@/styles/mansi-work.css";

function useScrollProgress(trackRef, disabled) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (disabled) return;
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [trackRef, disabled]);
  return progress;
}

export default function WorkExhibition() {
  const { isDark } = useTheme();
  const reduced = useReducedMotion();
  const router = useRouter();
  const trackRef = useRef(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const progress = useScrollProgress(trackRef, Boolean(reduced || mobile));

  const onPick = useCallback(
    (idx) => {
      const inst = WORK_INSTALLATIONS[idx];
      if (inst) router.push(`/projects/${inst.slug}`);
    },
    [router]
  );

  const showFinale = progress > 0.82;

  return (
    <div className="mx-root wk-root" data-theme={isDark ? "dark" : "light"}>
      <ExperienceNav onQuickView={() => setQuickOpen(true)} />
      <QuickViewPanel open={quickOpen} onClose={() => setQuickOpen(false)} />

      {!mobile && !reduced ? (
        <div ref={trackRef} className="wk-track">
          <div className="wk-fixed">
            <WorkHallCanvas progress={progress} onPick={onPick} />
          </div>

          <div className="wk-overlay">
            <section className={`wk-hero ${progress < 0.18 ? "is-visible" : ""}`}>
              <p className="mx-coord">EXHIBITION</p>
              <h1 className="mx-statement mx-statement--hero wk-title">{WORK_OPENING.title}</h1>
              <div className="wk-hero-lines">
                {WORK_OPENING.lines.map((line) => (
                  <p key={line} className="mx-whisper">
                    {line}
                  </p>
                ))}
              </div>
            </section>

            <section className={`wk-index ${progress >= 0.15 && progress < 0.82 ? "is-visible" : ""}`}>
              <p className="mx-coord">INSTALLATIONS</p>
              <ul className="wk-destinations">
                {WORK_INSTALLATIONS.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className="wk-destination">
                      <span className="wk-destination-meta">
                        <InstallationGlyph type={p.glyph} className="wk-glyph" />
                        <span className="mx-mono">PROJECT {p.number}</span>
                      </span>
                      <span className="wk-destination-title">{p.cardTitle}</span>
                      <span className="wk-destination-problem">{p.problem}</span>
                      <span className="wk-destination-tech mx-mono">
                        {(p.tech || []).slice(0, 4).join(" · ")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className={`wk-finale ${showFinale ? "is-visible" : ""}`}>
              <p className="mx-coord">MINDSET</p>
              <p className="mx-statement mx-statement--word">{WORK_OPENING.finale.line1}</p>
              <p className="mx-statement mx-statement--word">{WORK_OPENING.finale.line2}</p>
              <p className="mx-whisper mt-8">Not isolated projects — expressions of the same engineering mind.</p>
            </section>
          </div>
        </div>
      ) : (
        <div className="wk-fallback">
          <p className="mx-coord">EXHIBITION</p>
          <h1 className="mx-statement mx-statement--hero text-6xl">{WORK_OPENING.title}</h1>
          <div className="wk-hero-lines">
            {WORK_OPENING.lines.map((line) => (
              <p key={line} className="mx-whisper">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="wk-secondary">
        <p className="mx-coord">MORE INSTRUMENTS</p>
        <div className="wk-secondary-list">
          {[...WORK_SECONDARY, ...WORK_EXPERIMENTS].map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="wk-secondary-item">
              <InstallationGlyph type={p.glyph} className="wk-glyph" />
              <div>
                <p className="mx-mono">{p.number} · {p.category}</p>
                <p className="wk-secondary-title">{p.title}</p>
                <p className="wk-secondary-problem">{p.problem}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

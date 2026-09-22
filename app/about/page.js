"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Award, ChevronLeft, ChevronRight, FileText, Mail } from "lucide-react";
import WorldPageNav from "@/components/world/WorldPageNav";
import SiteFooter from "@/components/world/SiteFooter";
import FieldSpirals from "@/components/world/FieldSpirals";
import { useStudioMotion } from "@/components/world/useStudioMotion";
import {
  AWARDS,
  CAREER_TIMELINE,
  CERTIFICATIONS,
} from "@/lib/data/career";
import { HOW_I_THINK, IDENTITY } from "@/lib/data/identity";
import { RECOMMENDATIONS, getRecommendationText } from "@/lib/data/recommendations";
import { useWorldTheme } from "@/lib/use-world-theme";
import "@/styles/mansi-world-of-data.css";
import "@/styles/mansi-studio.css";

function publicLabel(item) {
  if (item.showIdentity) return item.name;
  const rel = (item.relationship || "Colleague").toUpperCase();
  if (rel.includes("CLIENT")) return "Client";
  if (rel.includes("MANAGED")) return "Manager";
  if (rel.includes("SENIOR")) return "Senior colleague";
  if (rel.includes("TEAM")) return "Teammate";
  return "Colleague";
}

function excerpt(text, limit = 220) {
  const compact = String(text || "").replace(/\s+/g, " ").trim();
  if (compact.length <= limit) return compact;
  return `${compact.slice(0, limit).replace(/\s+\S*$/, "")}…`;
}

function Testimonials({ items }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;
  const item = items[index];

  useEffect(() => {
    if (paused || count < 2) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;
    const timer = window.setInterval(() => {
      setIndex((n) => (n + 1) % count);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  if (!item) return null;

  const full = getRecommendationText(item);
  const year = (item.date || "").match(/\d{4}/)?.[0] ?? "";

  return (
    <section
      id="recommendations"
      className="wd-studio-block wd-about-voices"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="wd-studio-kicker">Testimonials</p>
      <h2>How collaborators describe the work.</h2>
      <div className="wd-about-quote" aria-live="polite">
        <blockquote key={item.id} className="wd-about-quote__card">
          <p>{excerpt(full)}</p>
          <footer>
            <strong>{publicLabel(item)}</strong>
            {year ? <span>{year}</span> : null}
          </footer>
        </blockquote>
      </div>
      <div className="wd-about-quote__nav">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => setIndex((n) => (n - 1 + count) % count)}
        >
          <ChevronLeft size={18} strokeWidth={2} aria-hidden />
        </button>
        <ol>
          {items.map((rec, i) => (
            <li key={rec.id}>
              <button
                type="button"
                aria-label={`Testimonial ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={i === index ? "is-on" : ""}
                onClick={() => setIndex(i)}
              />
            </li>
          ))}
        </ol>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => setIndex((n) => (n + 1) % count)}
        >
          <ChevronRight size={18} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const [theme] = useWorldTheme();
  const rootRef = useRef(null);
  useStudioMotion(rootRef);

  return (
    <div
      ref={rootRef}
      className="wd-root wd-page wd-page--about wd-studio-shell"
      data-theme={theme}
      suppressHydrationWarning
    >
      <WorldPageNav active="about" />
      <FieldSpirals />
      <main id="about" className="wd-studio-main wd-about-main">
        <header className="wd-about-hero" data-rise>
          <p className="wd-studio-kicker">About</p>
          <h1>{IDENTITY.name}</h1>
          <p className="wd-about-hero__role">{IDENTITY.headline}</p>
          <p className="wd-about-hero__lead">{IDENTITY.statement}</p>
        </header>

        <section className="wd-studio-block">
          <p className="wd-studio-kicker">How I work</p>
          <h2>Three operating notes.</h2>
          <div className="wd-studio-grid">
            {HOW_I_THINK.slice(0, 3).map((thought, index) => (
              <article key={thought} className="wd-studio-card" data-rise>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{thought}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wd-studio-block">
          <p className="wd-studio-kicker">Experience</p>
          <h2>Roles, in sequence.</h2>
          <ol className="wd-about-rail">
            {CAREER_TIMELINE.map((entry) => (
              <li key={entry.id} data-rise>
                <b>{entry.year}</b>
                <strong>{entry.title}</strong>
                <em>{entry.focus}</em>
              </li>
            ))}
          </ol>
        </section>

        <section id="achievements" className="wd-studio-block">
          <p className="wd-studio-kicker">Achievements</p>
          <h2>Proof, not decoration.</h2>
          <div className="wd-about-marks">
            {AWARDS.map((award) => (
              <article key={award.id} data-rise>
                <em>{award.year}</em>
                <strong>{award.title}</strong>
              </article>
            ))}
          </div>
        </section>

        <section id="certifications" className="wd-studio-block">
          <p className="wd-studio-kicker">Certifications</p>
          <h2>Kept current.</h2>
          <div className="wd-about-certs">
            {CERTIFICATIONS.map((cert) => {
              const inner = (
                <>
                  <strong>{cert.title}</strong>
                  <span>
                    {cert.org} · {cert.issued}
                  </span>
                </>
              );
              return cert.link ? (
                <a
                  key={cert.id}
                  href={cert.link}
                  target="_blank"
                  rel="noreferrer"
                  className="wd-about-cert"
                  data-rise
                >
                  {inner}
                </a>
              ) : (
                <div key={cert.id} className="wd-about-cert" data-rise>
                  {inner}
                </div>
              );
            })}
          </div>
        </section>

        <Testimonials items={RECOMMENDATIONS} />

        <nav className="wd-studio-links" aria-label="Next">
          <a href="/resume.pdf" target="_blank" rel="noreferrer">
            <FileText size={16} /> Resume
          </a>
          <Link href="/contact">
            <Mail size={16} /> Contact
          </Link>
          <Link href="/projects">
            <Award size={16} /> Work
          </Link>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}

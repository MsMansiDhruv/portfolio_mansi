"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Award, FileText, Mail } from "lucide-react";
import WorldPageNav from "@/components/world/WorldPageNav";
import SiteFooter from "@/components/world/SiteFooter";
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
  if (rel.includes("CLIENT")) return "CLIENT";
  if (rel.includes("MANAGED")) return "MANAGED DIRECTLY";
  if (rel.includes("SENIOR")) return "SENIOR COLLEAGUE";
  if (rel.includes("TEAM")) return "TEAMMATE";
  return "COLLEAGUE";
}

function excerpt(text, limit = 140) {
  const compact = String(text || "").replace(/\s+/g, " ").trim();
  if (compact.length <= limit) return { short: compact, more: false };
  return { short: compact.slice(0, limit).replace(/\s+\S*$/, ""), more: true };
}

export default function CredentialsPage() {
  const [theme] = useWorldTheme();
  const [openSignals, setOpenSignals] = useState({});
  const rootRef = useRef(null);
  useStudioMotion(rootRef);

  return (
    <div ref={rootRef} className="wd-studio-shell" data-theme={theme} suppressHydrationWarning>
      <WorldPageNav active="about" />
      <main id="about" className="wd-studio-main">
        <header className="wd-studio-hero">
          <div data-rise>
            <p className="wd-studio-kicker">{IDENTITY.headline}</p>
            <h1>How the work got harder — and clearer.</h1>
            <p>{IDENTITY.statement}</p>
          </div>
          <div className="wd-studio-draw" aria-hidden data-rise>
            <svg viewBox="0 0 420 180">
              <path d="M 12 140 C 80 40, 150 40, 210 110 S 310 180, 400 52" />
              <circle cx="210" cy="110" r="5" />
              <circle cx="400" cy="52" r="6" />
            </svg>
          </div>
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
          <div className="wd-studio-line">
            {CAREER_TIMELINE.map((entry) => (
              <article key={entry.id} data-rise>
                <b>{entry.year}</b>
                <div>
                  <strong>{entry.title}</strong>
                  <p>{entry.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="achievements" className="wd-studio-block">
          <p className="wd-studio-kicker">Achievements</p>
          <h2>Proof, not decoration.</h2>
          <div className="wd-studio-grid">
            {AWARDS.map((award) => (
              <article key={award.id} className="wd-studio-card" data-rise>
                <em>{award.year}</em>
                <strong>{award.title}</strong>
                <p>
                  {award.org}. {award.summary}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="certifications" className="wd-studio-block">
          <p className="wd-studio-kicker">Certifications</p>
          <h2>Kept current.</h2>
          <div className="wd-studio-grid">
            {CERTIFICATIONS.map((cert) => {
              const inner = (
                <>
                  <em>
                    {cert.org} · {cert.issued}
                  </em>
                  <strong>{cert.title}</strong>
                </>
              );
              return cert.link ? (
                <a
                  key={cert.id}
                  href={cert.link}
                  target="_blank"
                  rel="noreferrer"
                  className="wd-studio-card"
                  data-rise
                >
                  {inner}
                </a>
              ) : (
                <div key={cert.id} className="wd-studio-card" data-rise>
                  {inner}
                </div>
              );
            })}
          </div>
        </section>

        <section id="recommendations" className="wd-studio-block">
          <p className="wd-studio-kicker">Recommendations</p>
          <h2>What it was like to work with.</h2>
          <div className="wd-studio-quotes">
            {RECOMMENDATIONS.map((item, index) => {
              const full = getRecommendationText(item);
              const { short, more } = excerpt(full);
              const open = !!openSignals[item.id];
              return (
                <article key={item.id} data-rise>
                  <header>
                    <span>{String(index + 1).padStart(2, "0")} · {publicLabel(item)}</span>
                    {item.featured ? <i>Featured</i> : null}
                  </header>
                  <blockquote>
                    <p>{open || !more ? full : `${short}…`}</p>
                  </blockquote>
                  {more ? (
                    <button
                      type="button"
                      onClick={() => setOpenSignals((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                    >
                      {open ? "Show less" : "Read more"}
                    </button>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

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

"use client";

import { useState } from "react";
import Link from "next/link";
import WorldPageNav from "@/components/world/WorldPageNav";
import FieldBackdropLazy from "@/components/world/FieldBackdropLazy";
import {
  ABOUT_ME,
  AWARDS,
  CAREER_TIMELINE,
  CERTIFICATIONS,
  getAboutHeroLine,
} from "@/lib/data/career";
import { HOW_I_THINK, IDENTITY_HERO } from "@/lib/data/identity";
import { RECOMMENDATIONS, getRecommendationText } from "@/lib/data/recommendations";
import { useWorldTheme } from "@/lib/use-world-theme";
import "@/styles/mansi-world-of-data.css";

const SIGNAL_LIMIT = 118;

function publicLabel(item) {
  if (item.showIdentity) return item.name;
  const rel = (item.relationship || "Colleague").toUpperCase();
  if (rel.includes("CLIENT")) return "CLIENT";
  if (rel.includes("MANAGED")) return "MANAGED DIRECTLY";
  if (rel.includes("SENIOR")) return "SENIOR COLLEAGUE";
  if (rel.includes("TEAM")) return "TEAMMATE";
  return "COLLEAGUE";
}

function excerpt(text, limit = SIGNAL_LIMIT) {
  const compact = String(text || "").replace(/\s+/g, " ").trim();
  if (compact.length <= limit) return { short: compact, more: false };
  return {
    short: compact.slice(0, limit).replace(/\s+\S*$/, ""),
    more: true,
  };
}

export default function CredentialsPage() {
  const [theme] = useWorldTheme();
  const [openSignals, setOpenSignals] = useState({});

  return (
    <div className="wd-root wd-page wd-page--field wd-page--copy is-ready" data-theme={theme} suppressHydrationWarning>
      <FieldBackdropLazy themeId={theme} layer="experience" className="wd-field-backdrop--copy" />
      <WorldPageNav active="about" />
      <main id="about" className="wd-page-main">
        <header className="wd-page-hero">
          <p className="wd-scroll-kicker">ABOUT</p>
          <h1 className="wd-page-title">How the work got harder — and clearer.</h1>
          <p className="wd-page-lead">{getAboutHeroLine()}</p>
          <p className="wd-page-body">{ABOUT_ME[0]}</p>
          <p className="wd-page-body">{ABOUT_ME[1]}</p>
        </header>

        <section className="wd-page-section wd-persona">
          <div className="wd-persona__intro">
            <p className="wd-scroll-kicker">How I work</p>
            <h2 className="wd-page-title wd-page-title--sub">Engineer by profession. Builder by obsession.</h2>
            <p className="wd-page-body">{IDENTITY_HERO.humanLine}</p>
          </div>
          <div className="wd-persona__grid">
            {HOW_I_THINK.slice(0, 3).map((thought, index) => (
              <article key={thought} className="wd-persona__card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{thought}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wd-page-section">
          <p className="wd-scroll-kicker">Experience</p>
          <div className="wd-scroll-timeline">
            {CAREER_TIMELINE.map((entry) => (
              <article key={entry.id}>
                <span>{entry.year}</span>
                <div>
                  <strong>{entry.title}</strong>
                  <p>{entry.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="achievements" className="wd-page-section">
          <p className="wd-scroll-kicker">Achievements</p>
          <div className="wd-awards">
            {AWARDS.map((award) => (
              <article key={award.id} className="wd-award">
                <span>{award.year}</span>
                <strong>{award.title}</strong>
                <p>
                  {award.org}. {award.summary}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="certifications" className="wd-page-section">
          <p className="wd-scroll-kicker">Certifications</p>
          <div className="wd-certs">
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
                  className={`wd-cert${cert.tier === "primary" ? " is-primary" : ""}`}
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={cert.id}
                  className={`wd-cert${cert.tier === "primary" ? " is-primary" : ""}`}
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </section>

        <section id="recommendations" className="wd-page-section">
          <p className="wd-scroll-kicker">Recommendations</p>
          <h2 className="wd-page-title wd-page-title--sub">What it was like to work with.</h2>
          <p className="wd-page-body">
            Notes from people I have worked with — clients, managers, and teammates.
          </p>
          <div className="wd-signals">
            {RECOMMENDATIONS.map((item, index) => {
              const full = getRecommendationText(item);
              const { short, more } = excerpt(full);
              const open = !!openSignals[item.id];
              return (
                <article
                  key={item.id}
                  className={`wd-signal${item.featured ? " is-featured" : ""}${open ? " is-open" : ""}`}
                >
                  <header>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{publicLabel(item)}</strong>
                    {item.featured ? <i>Featured</i> : null}
                  </header>
                  <blockquote>
                    <p>{open || !more ? full : `${short}…`}</p>
                  </blockquote>
                  {more ? (
                    <button
                      type="button"
                      className="wd-signal__more"
                      onClick={() =>
                        setOpenSignals((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                      }
                    >
                      {open ? "Show less" : "Read more"}
                    </button>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <div className="wd-scroll-links">
          <a href="/resume.pdf" target="_blank" rel="noreferrer">
            Resume
          </a>
          <Link href="/contact">Contact</Link>
          <Link href="/projects">Work</Link>
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import WorldPageNav from "@/components/world/WorldPageNav";
import WorldFieldBackdrop from "@/components/world/WorldFieldBackdrop";
import {
  WORK_OPENING,
  WORK_INSTALLATIONS,
  WORK_SECONDARY,
  WORK_EXPERIMENTS,
} from "@/lib/data/work-exhibition";
import { useWorldTheme } from "@/lib/use-world-theme";
import "@/styles/mansi-world-of-data.css";

function CatalogItem({ project, kicker }) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <span className="wd-catalog__meta">
        {kicker || `${project.number} · ${project.category}`}
      </span>
      <span className="wd-catalog__title">{project.cardTitle || project.title}</span>
      {project.problem ? <span className="wd-catalog__problem">{project.problem}</span> : null}
      {project.tech?.length ? (
        <span className="wd-catalog__tech">{project.tech.slice(0, 4).join(" · ")}</span>
      ) : null}
    </Link>
  );
}

export default function WorkExhibition() {
  const [theme] = useWorldTheme();

  return (
    <div className="wd-root wd-page wd-page--field wd-page--work is-ready" data-theme={theme} suppressHydrationWarning>
      <WorldFieldBackdrop themeId={theme} layer="work" size="compact" className="wd-field-backdrop--work" />
      <WorldPageNav active="work" />
      <main className="wd-page-main">
        <section className="wd-work-hero">
          <div className="wd-work-hero__copy">
            <p className="wd-scroll-kicker">Work</p>
            <h1 className="wd-page-title">{WORK_OPENING.title}</h1>
            {WORK_OPENING.lines.map((line) => (
              <p key={line} className="wd-page-body">
                {line}
              </p>
            ))}
          </div>
        </section>

        <section className="wd-page-section">
          <p className="wd-scroll-kicker">Selected work</p>
          <div className="wd-catalog">
            {WORK_INSTALLATIONS.map((project) => (
              <CatalogItem
                key={project.slug}
                project={project}
                kicker={`Project ${project.number}`}
              />
            ))}
          </div>
        </section>

        {WORK_EXPERIMENTS.length || WORK_SECONDARY.length ? (
          <section className="wd-page-section">
            <p className="wd-scroll-kicker">Experiments &amp; side builds</p>
            <p className="wd-page-body">
              GPU research, product experiments, and independent work.
            </p>
            <div className="wd-catalog">
              {[...WORK_EXPERIMENTS, ...WORK_SECONDARY].map((project) => (
                <CatalogItem key={project.slug} project={project} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="wd-page-section">
          <p className="wd-page-lead">
            {WORK_OPENING.finale.line1} {WORK_OPENING.finale.line2}
          </p>
        </section>
      </main>
    </div>
  );
}

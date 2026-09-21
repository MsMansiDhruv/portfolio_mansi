"use client";

import { useRef } from "react";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Briefcase,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileText,
  GitBranch,
  Layers,
  Github,
  Lightbulb,
  Linkedin,
  Mail,
  MessageSquare,
  MessagesSquare,
  Sparkles,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";
import { TECHNICAL_PROFILE } from "@/lib/data/credentials-content";
import { CAREER_TIMELINE, getAboutBadges } from "@/lib/data/career";
import { SOCIAL_LINKS } from "@/lib/data/social-links";
import { tiltHandlers } from "./DataField";
import { useGsapPress } from "./useGsapPress";
import { useGsapRise } from "./riseText";

const TECH_ICONS = {
  Spark: Cpu,
  PySpark: Cpu,
  SQL: Database,
  Glue: Workflow,
  AWS: Cloud,
  S3: Database,
  Redshift: Database,
  Lambda: Cloud,
  Databricks: Layers,
  Python: Code2,
  Scala: Code2,
  DynamoDB: Database,
  Aurora: Database,
  Terraform: Wrench,
  Docker: Boxes,
  Delta: Database,
  MLflow: Sparkles,
  "Applied AI": Sparkles,
};

export const AI_MODES = [
  { id: "ask", label: "Ask", Icon: MessageSquare, hint: "Architecture, trade-offs, SQL" },
  { id: "architecture", label: "Architecture", Icon: GitBranch, hint: "How systems are shaped" },
  { id: "pipeline", label: "Pipeline", Icon: Workflow, hint: "Ingest → transform → serve" },
  { id: "sql", label: "SQL", Icon: Database, hint: "Queries against the work" },
];

const ABOUT_ICONS = [Layers, Cloud, Cpu, Code2, Database, Wrench, Sparkles, BarChart3];

export function AiLabBoard({ onOpen }) {
  const chips = Object.entries(TECHNICAL_PROFILE).flatMap(([group, items]) =>
    items.slice(0, group === "Languages" ? 3 : 4).map((name) => ({ group, name }))
  );

  return (
    <div className="wd-icon-board">
      <div className="wd-icon-board__modes">
        {AI_MODES.map((mode) => (
          <button key={mode.id} type="button" onClick={() => onOpen(mode.id)} {...tiltHandlers()}>
            <mode.Icon strokeWidth={1.6} aria-hidden />
            <strong>{mode.label}</strong>
            <span>{mode.hint}</span>
          </button>
        ))}
      </div>
      <ul className="wd-icon-board__chips">
        {chips.map((chip) => {
          const Icon = TECH_ICONS[chip.name] || Boxes;
          return (
            <li key={`${chip.group}-${chip.name}`}>
              <Icon strokeWidth={1.75} aria-hidden />
              {chip.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function AboutBoard() {
  const badges = getAboutBadges();
  return (
    <div className="wd-icon-board wd-icon-board--about">
      <ul className="wd-icon-board__chips">
        {badges.map((badge, i) => {
          const Icon = ABOUT_ICONS[i % ABOUT_ICONS.length];
          return (
            <li key={badge}>
              <Icon strokeWidth={1.75} aria-hidden />
              {badge}
            </li>
          );
        })}
      </ul>
      <ul className="wd-icon-board__chips wd-icon-board__chips--tech">
        {["Spark", "Databricks", "AWS", "Python", "SQL", "Terraform", "MLflow", "Delta"].map((name) => {
          const Icon = TECH_ICONS[name] || Boxes;
          return (
            <li key={name}>
              <Icon strokeWidth={1.75} aria-hidden />
              {name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const PIPELINE = [
  { n: "01", label: "Ingest", copy: "Sourced facility coordinates. No invented points." },
  { n: "02", label: "Transform", copy: "Project GPS onto the map and attach a power region." },
  { n: "03", label: "Model", copy: "Size, brightness, and pulse from what the sources support." },
  { n: "04", label: "Visualize", copy: "Layers you can read: power, data centres, AI, growth." },
];

export function WorkPipelineBoard() {
  return (
    <ol className="wd-pipeline" aria-label="How the map is built">
      {PIPELINE.map((step, i) => (
        <li key={step.n} className="wd-pipeline__step" {...tiltHandlers()}>
          <span className="wd-pipeline__n">{step.n}</span>
          <strong>{step.label}</strong>
          <p>{step.copy}</p>
          {i < PIPELINE.length - 1 ? (
            <ArrowRight className="wd-pipeline__arrow" size={16} strokeWidth={1.75} aria-hidden />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

const ERA_TONES = ["lead", "senior", "core", "start"];

export function ExperienceErasBoard() {
  const eras = CAREER_TIMELINE.slice(0, 4);
  return (
    <div className="wd-eras" aria-label="Roles over time">
      {eras.map((entry, i) => (
        <article key={entry.id} className={`wd-era wd-era--${ERA_TONES[i] || "core"}`} {...tiltHandlers()}>
          <span className="wd-era__year">{entry.year}</span>
          <div className="wd-era__body">
            <strong>{entry.title}</strong>
            <p>{entry.focus || entry.desc}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ContactRouteBoard() {
  const rootRef = useRef(null);
  useGsapPress(rootRef);
  useGsapRise(rootRef);

  return (
    <div className="wd-route wd-route--panel wd-route--close" ref={rootRef}>
      <div className="wd-route-close__board">
        <p className="wd-scroll-kicker wd-route-close__kicker" data-rise-text>
          Contact
        </p>
        <h2 className="wd-route-close__title" data-rise-text>
          If the work holds, <span className="wd-mark">write.</span>
        </h2>
        <p className="wd-route-close__lede" data-rise-text>
          Open to interesting data engineering, architecture, and collaboration opportunities.
        </p>
        <a className="wd-route-panel__mail" href={`mailto:${SOCIAL_LINKS.email}`} data-gsap-btn>
          <Mail size={16} strokeWidth={1.9} aria-hidden />
          {SOCIAL_LINKS.email}
          <ArrowRight size={16} strokeWidth={1.9} aria-hidden />
        </a>

        <section className="wd-route-close__list wd-route-close__list--also">
          <h3 data-rise-text>Also on</h3>
          <nav className="wd-route-panel__links" aria-label="Profiles">
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" data-gsap-btn>
              <Linkedin size={16} strokeWidth={1.75} aria-hidden />
              LinkedIn
            </a>
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" data-gsap-btn>
              <Github size={16} strokeWidth={1.75} aria-hidden />
              GitHub
            </a>
            <a href="/resume.pdf" target="_blank" rel="noreferrer" data-gsap-btn>
              <FileText size={16} strokeWidth={1.75} aria-hidden />
              Resume (PDF)
            </a>
          </nav>
        </section>

        <section className="wd-route-close__list wd-route-close__list--open">
          <h3 data-rise-text>Open to</h3>
          <ul>
            <li>
              <Briefcase size={16} strokeWidth={1.8} aria-hidden />
              Full-time opportunities
            </li>
            <li>
              <Users size={16} strokeWidth={1.8} aria-hidden />
              Collaborations
            </li>
            <li>
              <Lightbulb size={16} strokeWidth={1.8} aria-hidden />
              Interesting data problems
            </li>
            <li>
              <MessagesSquare size={16} strokeWidth={1.8} aria-hidden />
              Technical conversations
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

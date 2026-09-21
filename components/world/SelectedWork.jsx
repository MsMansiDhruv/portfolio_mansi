"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Cpu,
  GitBranch,
  Layers,
  Timer,
  Wallet,
  Workflow,
} from "lucide-react";
import { HOME_FEATURED_SLUGS } from "@/lib/data/exhibition-order";
import { getProjectMeta } from "@/lib/data/project-meta";
import { getWorkArt } from "@/lib/data/work-art";
import { useGsapPress } from "./useGsapPress";
import { useGsapRise } from "./useGsapRise";

const METRIC_ICONS = {
  layers: Layers,
  workflow: Workflow,
  check: CheckCircle2,
  timer: Timer,
  coins: Wallet,
  bot: Bot,
  cpu: Cpu,
  git: GitBranch,
};

function brief(text) {
  if (!text) return "";
  const cut = text.split(/(?<=\.)\s/)[0];
  return cut.length > 220 ? `${cut.slice(0, 217).trim()}…` : cut;
}

export default function SelectedWork() {
  const rootRef = useRef(null);
  useGsapPress(rootRef);
  useGsapRise(rootRef);

  const frames = HOME_FEATURED_SLUGS.map((slug, index) => {
    const meta = getProjectMeta(slug);
    const home = getWorkArt(slug);
    if (!meta || !home) return null;
    return {
      ...meta,
      ...home,
      code: String(index + 1).padStart(2, "0"),
      blurb: brief(meta.summary || meta.purpose || meta.problem),
    };
  }).filter(Boolean);

  return (
    <div className="wd-pops wd-pops--gallery" ref={rootRef}>
      <header className="wd-pops__intro">
        <p data-rise-text>Featured work</p>
        <div className="wd-pops__title-row">
          <div>
            <h2 data-rise-text>Real problems. Scalable systems.</h2>
            <p className="wd-pops__lede" data-rise-text>
              A few projects where I designed, built, and delivered end-to-end data solutions.
            </p>
          </div>
          <Link href="/projects" className="wd-pops__archive" data-gsap-btn>
            View all projects →
          </Link>
        </div>
      </header>
      <div className="wd-pops__viewport">
        <div className="wd-pops__track">
          {frames.map((item) => (
            <Link key={item.slug} href={`/projects/${item.slug}`} className="wd-tile wd-tile--system">
              <span className="wd-tile__main">
                <span className="wd-tile__body">
                  <em data-rise-text>
                    {item.code} / {item.kicker}
                  </em>
                  <strong data-rise-text>{item.cardTitle || item.title}</strong>
                  {item.blurb ? (
                    <span className="wd-tile__blurb" data-rise-text>
                      {item.blurb}
                    </span>
                  ) : null}
                  <span className="wd-tile__tags">
                    {(item.tech || []).slice(0, 5).map((tech) => (
                      <i key={tech}>{tech}</i>
                    ))}
                  </span>
                </span>
                <span className="wd-tile__art">
                  <img src={item.art} alt={item.artAlt} />
                </span>
              </span>
              <span className="wd-tile__foot">
                {item.metrics?.length ? (
                  <span className="wd-tile__metrics">
                    {item.metrics.map((metric) => {
                      const Icon = METRIC_ICONS[metric.icon] || CheckCircle2;
                      return (
                        <span key={metric.label}>
                          <Icon size={14} strokeWidth={2} aria-hidden />
                          <b>{metric.value}</b>
                          <small>{metric.label}</small>
                        </span>
                      );
                    })}
                  </span>
                ) : null}
                <span className="wd-tile__go" data-gsap-btn aria-hidden>
                  <ArrowUpRight size={18} strokeWidth={2.2} />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

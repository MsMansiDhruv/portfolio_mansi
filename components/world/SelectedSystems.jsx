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
import { getWorkArt } from "@/lib/data/workArtLive";
import { useGsapPress } from "./useGsapPress";
import { useGsapRise } from "./riseText";

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

export default function SelectedWork() {
  const rootRef = useRef(null);
  useGsapPress(rootRef);
  useGsapRise(rootRef);

  const frames = HOME_FEATURED_SLUGS.map((slug, index) => {
    const meta = getProjectMeta(slug);
    const home = getWorkArt(slug);
    if (!meta || !home?.taste) return null;
    return {
      slug,
      code: String(index + 1).padStart(2, "0"),
      kicker: home.kicker,
      art: home.art,
      artAlt: home.artAlt,
      metrics: (home.metrics || []).filter((metric) => String(metric.value).includes("%")),
      ...home.taste,
    };
  }).filter(Boolean);

  return (
    <div className="wd-pops wd-pops--gallery" ref={rootRef}>
      <header className="wd-pops__intro">
        <p data-rise-text>Featured work</p>
        <div className="wd-pops__title-row">
          <div>
            <h2 data-rise-text>Four systems.</h2>
            <p className="wd-pops__lede" data-rise-text>
              Real engineering problems. Open a system for the decisions.
            </p>
          </div>
          <Link href="/projects" className="wd-pops__archive" data-gsap-btn>
            View work →
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
                  <strong data-rise-text>{item.title}</strong>
                  <span className="wd-tile__stack" data-rise-text>
                    {item.stack.join(" · ")}
                  </span>
                  <span className="wd-tile__blurb" data-rise-text>
                    {item.arc}
                  </span>
                  <span className="wd-tile__lenses">
                    {item.lenses.map((lens) => (
                      <i key={lens}>{lens}</i>
                    ))}
                  </span>
                </span>
                <span className="wd-tile__art">
                  <img src={item.art} alt={item.artAlt} />
                </span>
              </span>
              <span className="wd-tile__foot">
                {item.metrics.length ? (
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
                <span className="wd-tile__go" aria-hidden>
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

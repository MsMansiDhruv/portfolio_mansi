"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HOME_FEATURED_SLUGS } from "@/lib/data/exhibition-order";
import { getProjectMeta } from "@/lib/data/project-meta";
import { getWorkArt } from "@/lib/data/work-art";
import { useGsapPress } from "./useGsapPress";
import { useGsapRise } from "./useGsapRise";

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
      ...home.taste,
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
              A tiny taste of the architecture. Open a system for the decisions.
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
            <Link key={item.slug} href={`/projects/${item.slug}`} className="wd-tile wd-tile--system wd-tile--taste">
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
                <span className="wd-tile__go" data-gsap-btn>
                  Open case study
                  <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

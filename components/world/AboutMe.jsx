"use client";

import { useRef } from "react";
import { Cloud, Code2, Layers, Timer } from "lucide-react";
import {
  ABOUT_ME,
  CURRENT_ROLE,
  getAtAGlance,
} from "@/lib/data/career";
import { getExperienceYearsLabel } from "@/lib/career/experience";
import { HOW_I_THINK, IDENTITY_HERO, PORTRAIT } from "@/lib/data/identity";
import { useGsapRise } from "./useGsapRise";

export default function AboutMe() {
  const rootRef = useRef(null);
  useGsapRise(rootRef);
  const glance = getAtAGlance();
  const years = getExperienceYearsLabel();

  return (
    <div className="wd-about wd-about--card" ref={rootRef}>
      <figure className="wd-about-card__still">
        <img src="/lab/mansi-face.png" alt={PORTRAIT.alt} />
      </figure>
      <div className="wd-about-card__copy">
        <p className="wd-voices__kicker" data-rise-text>
          {CURRENT_ROLE} · Solution Architect
        </p>
        <h2 data-rise-text>
          {IDENTITY_HERO.name.split(" ")[0]}{" "}
          <span className="wd-mark">{IDENTITY_HERO.name.split(" ").slice(1).join(" ")}</span>
        </h2>
        <p className="wd-about-card__lede" data-rise-text>{ABOUT_ME[0]}</p>
        <p className="wd-about-card__body" data-rise-text>{ABOUT_ME[1]}</p>
        <ul className="wd-about-card__chips">
          <li>
            <span className="wd-about-card__icon" aria-hidden>
              <Timer size={18} strokeWidth={1.7} />
            </span>
            <strong>{years}</strong>
            <em>Experience</em>
          </li>
          <li>
            <span className="wd-about-card__icon" aria-hidden>
              <Layers size={18} strokeWidth={1.7} />
            </span>
            <strong>Data Platforms</strong>
            <em>{glance.domains.replace("Data Platforms · ", "")}</em>
          </li>
          <li>
            <span className="wd-about-card__icon" aria-hidden>
              <Cloud size={18} strokeWidth={1.7} />
            </span>
            <strong>{glance.cloud}</strong>
            <em>Cloud</em>
          </li>
          <li>
            <span className="wd-about-card__icon" aria-hidden>
              <Code2 size={18} strokeWidth={1.7} />
            </span>
            <strong>Python · Scala</strong>
            <em>SQL · Spark</em>
          </li>
        </ul>
        <p className="wd-about-card__quote" data-rise-text>“{HOW_I_THINK[0]}”</p>
      </div>
    </div>
  );
}

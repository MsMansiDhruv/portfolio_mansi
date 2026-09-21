"use client";

import { useRef } from "react";
import { Layers, Timer } from "lucide-react";
import {
  ABOUT_ME,
} from "@/lib/data/career";
import { getExperienceYearsLabel } from "@/lib/career/experience";
import { HOW_I_THINK, IDENTITY, PORTRAIT } from "@/lib/data/identity";
import { useGsapRise } from "./riseText";

export default function AboutMe() {
  const rootRef = useRef(null);
  useGsapRise(rootRef);
  const years = getExperienceYearsLabel();

  return (
    <div className="wd-about wd-about--card" ref={rootRef}>
      <figure className="wd-about-card__still">
        <img src="/lab/mansi-face.png" alt={PORTRAIT.alt} />
      </figure>
      <div className="wd-about-card__copy">
        <p className="wd-voices__kicker" data-rise-text>
          {IDENTITY.headline}
        </p>
        <h2 data-rise-text>
          {IDENTITY.givenName}{" "}
          <span className="wd-mark">{IDENTITY.name.split(" ").slice(1).join(" ")}</span>
        </h2>
        <p className="wd-about-card__lede" data-rise-text>{IDENTITY.statement}</p>
        <p className="wd-about-card__body" data-rise-text>{ABOUT_ME[1]}</p>
        <p className="wd-about-card__tech" data-rise-text>
          Python · SQL · PySpark · AWS · Databricks · Redshift · Terraform
        </p>
      </div>
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
          <em>Cloud · MLOps</em>
        </li>
      </ul>
      <p className="wd-about-card__quote" data-rise-text>“{HOW_I_THINK[0]}”</p>
    </div>
  );
}

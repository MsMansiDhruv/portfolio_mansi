"use client";

import { useMemo, useState } from "react";
import {
  AI_FOCUS_IDS,
  COMPUTE_SITES,
  COMPUTE_WEATHER,
  project,
} from "@/lib/data/compute-weather";
import LAND_PATHS from "@/lib/data/world-land-paths.json";
import DC_ATLAS from "@/lib/data/dc-atlas.json";
import { CAREER_TIMELINE } from "@/lib/data/career";
import { SOCIAL_LINKS } from "@/lib/data/social-links";

const STEPS = [
  {
    id: "ingest",
    n: "01",
    label: "Ingest",
    copy: "Pull facility coordinates from ATLAS and IEA-named clusters. Nothing is invented at this step — only sourced points.",
  },
  {
    id: "transform",
    n: "02",
    label: "Transform",
    copy: "Project lat/lng onto the map, attach each cluster to its electricity region, and drop points that have no GPS.",
  },
  {
    id: "model",
    n: "03",
    label: "Model",
    copy: "Encode what the sources actually support: size from IT-load rank, brightness from AI concentration, pulse from pipeline pressure.",
  },
  {
    id: "visualize",
    n: "04",
    label: "Visualize",
    copy: "Layers the reader can switch: power, data centres, AI, grid, growth. The hero map is this pipeline, rendered.",
  },
];

function feeder(site) {
  const [x1, y1] = project(site.lat, site.lng);
  const [x2, y2] = project(site.grid.lat, site.grid.lng);
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

function MiniMap({ children, className }) {
  return (
    <svg viewBox="0 0 1000 500" className={className} aria-hidden>
      {LAND_PATHS.map((d, i) => (
        <path key={i} d={d} className="wd-map-stage__land" />
      ))}
      {children}
    </svg>
  );
}

function AtlasDots({ stride = 6 }) {
  const dots = useMemo(() => {
    const xy = DC_ATLAS.xy;
    const out = [];
    for (let i = 0; i < xy.length; i += stride * 2) {
      out.push(<circle key={i} cx={xy[i]} cy={xy[i + 1]} r="1.2" />);
    }
    return out;
  }, [stride]);
  return <g className="wd-map-stage__atlas">{dots}</g>;
}

export default function MapScrollStage({ chapter }) {
  const [step, setStep] = useState("ingest");
  const [hot, setHot] = useState(null);
  const activeStep = STEPS.find((s) => s.id === step) || STEPS[0];
  const aiSites = COMPUTE_SITES.filter((s) => AI_FOCUS_IDS.has(s.id));
  const hotSite = COMPUTE_SITES.find((s) => s.id === hot);
  const careers = CAREER_TIMELINE.slice(0, 4);

  if (chapter === "work") {
    return (
      <div className="wd-map-stage" data-step={step}>
        <MiniMap className="wd-map-stage__svg">
          <AtlasDots />
          {COMPUTE_SITES.map((s) => {
            const [x, y] = project(s.lat, s.lng);
            return (
              <g key={s.id}>
                {step === "transform" || step === "visualize" ? (
                  <path d={feeder(s)} className="wd-map-stage__feeder" />
                ) : null}
                <circle
                  cx={x}
                  cy={y}
                  r={step === "model" || step === "visualize" ? 3.2 + s.power * 7 : 3.4}
                  className={`wd-map-stage__cluster${hot === s.id ? " is-hot" : ""}`}
                  onPointerEnter={() => setHot(s.id)}
                  onPointerLeave={() => setHot(null)}
                  onClick={() => setHot(s.id)}
                />
              </g>
            );
          })}
        </MiniMap>
        <nav className="wd-map-stage__rail" aria-label="Pipeline steps">
          {STEPS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={step === item.id ? "is-on" : ""}
              onClick={() => setStep(item.id)}
            >
              <span>{item.n}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <p className="wd-map-stage__line">{activeStep.copy}</p>
      </div>
    );
  }

  if (chapter === "ai") {
    return (
      <div className="wd-map-stage">
        <MiniMap className="wd-map-stage__svg">
          <AtlasDots stride={10} />
          {aiSites.map((s) => {
            const [x, y] = project(s.lat, s.lng);
            return (
              <g
                key={s.id}
                className={`wd-map-stage__hit${hot === s.id ? " is-hot" : ""}`}
                transform={`translate(${x} ${y})`}
                onPointerEnter={() => setHot(s.id)}
                onPointerLeave={() => setHot(null)}
                onClick={() => setHot(s.id)}
              >
                <circle r={6 + s.ai * 8} className="wd-map-stage__bloom" />
                <circle r={4.2} className="wd-map-stage__cluster" />
              </g>
            );
          })}
        </MiniMap>
        <div className="wd-map-stage__chips">
          {aiSites.map((s) => (
            <button
              key={s.id}
              type="button"
              className={hot === s.id ? "is-on" : ""}
              onClick={() => setHot(s.id === hot ? null : s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p className="wd-map-stage__readout">
          <strong>{hotSite ? hotSite.name : "AI-concentrated hubs"}</strong>
          {hotSite ? hotSite.facts.ai : "The IEA flags these markets as where AI-scale load is physically concentrating. Pick one."}
        </p>
      </div>
    );
  }

  if (chapter === "experience") {
    return (
      <div className="wd-map-stage wd-map-stage--experience">
        <svg viewBox="0 0 640 360" className="wd-map-stage__svg" aria-hidden>
          <path d="M 48 180 H 592" className="wd-map-stage__feeder" />
          {careers.map((entry, i) => {
            const x = 80 + i * 160;
            const on = hot === entry.id;
            return (
              <g
                key={entry.id}
                className={`wd-map-stage__hit${on ? " is-hot" : ""}`}
                transform={`translate(${x} 180)`}
                onPointerEnter={() => setHot(entry.id)}
                onClick={() => setHot(entry.id)}
              >
                <circle r={on ? 28 : 18} className="wd-map-stage__bloom" />
                <circle r="8" className="wd-map-stage__cluster" />
                <text x="0" y="-36" textAnchor="middle">{entry.year}</text>
                <text x="0" y="52" className="wd-map-stage__sub" textAnchor="middle">
                  {(entry.title || "").split(" ").slice(0, 3).join(" ")}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="wd-map-stage__readout">
          <strong>{careers.find((c) => c.id === hot)?.title || "Follow the load over time"}</strong>
          {careers.find((c) => c.id === hot)?.desc ||
            "Each role added more of the same stack the map is built from: ingest, transform, serve."}
        </p>
      </div>
    );
  }

  if (chapter === "about") {
    const picks = COMPUTE_SITES.filter((s) => ["nva", "dublin", "singapore", "beijing"].includes(s.id));
    return (
      <div className="wd-map-stage">
        <MiniMap className="wd-map-stage__svg">
          {picks.map((s) => {
            const [x, y] = project(s.lat, s.lng);
            return (
              <g key={s.id} transform={`translate(${x} ${y})`}>
                <circle r="22" className="wd-map-stage__bloom" />
                <circle r="5" className="wd-map-stage__cluster" />
                <text x="10" y="4">{s.name}</text>
              </g>
            );
          })}
        </MiniMap>
        <p className="wd-map-stage__readout">
          <strong>Reliability has a geography too</strong>
          Same grammar as the map: few places carry most of the load. I build platforms that stay readable when the concentration gets real.
        </p>
      </div>
    );
  }

  return (
    <div className="wd-map-stage wd-map-stage--contact">
      <MiniMap className="wd-map-stage__svg">
        {COMPUTE_SITES.slice(0, 8).map((s) => (
          <path key={s.id} d={feeder(s)} className="wd-map-stage__feeder" />
        ))}
        {COMPUTE_SITES.map((s) => {
          const [x, y] = project(s.lat, s.lng);
          return <circle key={s.id} cx={x} cy={y} r="3.2" className="wd-map-stage__cluster" />;
        })}
      </MiniMap>
      <div className="wd-map-stage__chips">
        <a href={`mailto:${SOCIAL_LINKS.email}`}>Email</a>
        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
      </div>
      <p className="wd-map-stage__readout">
        <strong>Open a route</strong>
        {COMPUTE_WEATHER.chain}. If you want to talk about building the live grid layer next, start here.
      </p>
    </div>
  );
}

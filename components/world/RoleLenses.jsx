"use client";

import { useState } from "react";
import { HOW_I_THINK } from "@/lib/data/identity";

const STATES = [
  { id: "ingest", label: "Ingest", line: "Land once. Keep the clock.", tiles: ["Event time", "Idempotent", "Named keys"] },
  { id: "contract", label: "Contract", line: "Schema owned. Fail loud.", tiles: ["Producer", "PII at door", "No silent drift"] },
  { id: "transform", label: "Transform", line: "Replay a day on purpose.", tiles: ["Spark jobs", "Cost visible", "Delta state"] },
  { id: "serve", label: "Serve", line: "SQL matches the workload.", tiles: ["OLTP path", "OLAP split", "BI you can own"] },
  { id: "observe", label: "Observe", line: "Know when to worry.", tiles: ["Freshness", "Named fails", "Act"] },
];

export default function RoleLenses() {
  const [on, setOn] = useState("ingest");
  const active = STATES.find((item) => item.id === on) || STATES[0];

  return (
    <div className="wd-operate wd-operate--ring">
      <p className="wd-lenses__kicker">Where I operate</p>
      <h2>
        One pipe.
        <span className="wd-mark">Five gates.</span>
      </h2>
      <div className="wd-ring" data-on={on}>
        <svg className="wd-ring__svg" viewBox="0 0 640 360" aria-hidden>
          <path
            id="wd-ring-path"
            d="M70 180 C 160 40, 480 40, 570 180 C 480 320, 160 320, 70 180"
            fill="none"
          />
          <circle r="8" fill="#f97316">
            <animateMotion dur="6s" repeatCount="indefinite">
              <mpath href="#wd-ring-path" />
            </animateMotion>
          </circle>
        </svg>
        {STATES.map((item, i) => {
          const angle = (i / STATES.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(angle) * 38;
          const y = 50 + Math.sin(angle) * 34;
          return (
            <button
              key={item.id}
              type="button"
              className={item.id === on ? "is-on" : ""}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => setOn(item.id)}
            >
              <em>{String(i + 1).padStart(2, "0")}</em>
              {item.label}
            </button>
          );
        })}
        <div className="wd-ring__core">
          <p>{active.label}</p>
          <strong>{active.line}</strong>
          <ul>
            {active.tiles.map((tile) => (
              <li key={tile}>{tile}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="wd-operate__think">“{HOW_I_THINK[2]}”</p>
    </div>
  );
}

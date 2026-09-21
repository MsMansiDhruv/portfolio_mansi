"use client";

import { useEffect, useState } from "react";
import { IDENTITY } from "@/lib/data/identity";
import LatticeLoader from "./LatticeLoader";

const PHASES = [
  "Tracing the grid",
  "Lighting the halls",
  "Opening the map",
];

export default function WelcomeGate({ open, loading, onEnter }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!loading) {
      setPhase(0);
      return undefined;
    }
    const timer = window.setInterval(() => {
      setPhase((n) => (n + 1) % PHASES.length);
    }, 520);
    return () => window.clearInterval(timer);
  }, [loading]);

  return (
    <div className={`wd-welcome${open ? " is-open" : " is-leaving"}`} role="dialog" aria-label="Enter">
      <div className="wd-welcome__waves" aria-hidden />
      <svg className="wd-welcome__orbit" viewBox="0 0 420 420" aria-hidden>
        <circle cx="210" cy="210" r="168" />
        <circle cx="210" cy="210" r="128" />
        <g className="wd-welcome__pkt">
          <circle cx="210" cy="42" r="5" />
          <circle cx="378" cy="210" r="4" />
          <circle cx="210" cy="378" r="5" />
        </g>
      </svg>
      <p className="wd-welcome__kicker">{IDENTITY.name}</p>
      <h1>
        {IDENTITY.role}
        <span>{IDENTITY.domains}</span>
      </h1>
      <p className="wd-welcome__line">{IDENTITY.statement}</p>
      <button
        type="button"
        className={`wd-welcome__btn${loading ? " is-boot" : ""}`}
        onClick={onEnter}
        disabled={loading}
      >
        <LatticeLoader
          className="wd-welcome__lattice"
          status="working"
          label={loading ? PHASES[phase] : "Ready"}
          pattern="orbit"
          grid={3}
          shape="round"
          color="var(--wd-accent)"
          doneColor="#1cd6ac"
          cellSize={6}
          gap={3}
          fontSize={11}
          glow
          glowColor="var(--wd-accent)"
          showTimer={false}
        />
        <span className="wd-welcome__cta">
          {loading ? PHASES[phase] : "See the work"}
        </span>
      </button>
    </div>
  );
}

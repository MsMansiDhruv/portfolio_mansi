"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  PRECISION_ASSETS,
  PRECISION_BEATS,
  DESTINATIONS,
  getConvergenceState,
  remap,
  lerp,
  smoothstep,
} from "@/lib/data/precision";
import ConvergenceRails, { actIIVisibility } from "./ConvergenceRails";

function Layer({ src, opacity, transform, video, poster, dayLift, eager }) {
  if (opacity < 0.01) return null;

  return (
    <div
      className={`mp-layer${dayLift ? " mp-layer--day-lift" : ""}`}
      style={{ opacity, transform }}
    >
      {video ? (
        <video
          src={src}
          poster={poster}
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" draggable={false} loading={eager ? "eager" : "lazy"} />
      )}
    </div>
  );
}

export default function CinematicStage({ progress, theme }) {
  const [cursor, setCursor] = useState({ nx: 0.5, ny: 0.5 });
  const observeRef = useRef(null);
  const isDay = theme === "day";

  const onMove = useCallback((e) => {
    const el = observeRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCursor({
      nx: (e.clientX - r.left) / r.width,
      ny: (e.clientY - r.top) / r.height,
    });
  }, []);

  const p = progress;
  const actI = remap(p, PRECISION_BEATS.actI.start, PRECISION_BEATS.actI.end);
  const transit = remap(p, PRECISION_BEATS.transit.start, PRECISION_BEATS.transit.end);
  const actII = remap(p, PRECISION_BEATS.actII.start, PRECISION_BEATS.actII.end);
  const actIII = remap(p, PRECISION_BEATS.actIII.start, PRECISION_BEATS.actIII.end);
  const state = getConvergenceState(actII);

  // Camera: slow establish → approach → close → beyond
  const camScale = lerp(1.02, 1.22, smoothstep(0, 0.55, p)) + lerp(0, 0.08, actIII);
  const camX =
    lerp(0, -2.2, smoothstep(0.1, 0.45, p)) +
    lerp(0, 1.5, smoothstep(0.55, 0.85, p)) +
    (cursor.nx - 0.5) * 0.6;
  const camY =
    lerp(0, -1.2, smoothstep(0, 0.35, p)) +
    lerp(0, 1.8, actIII) +
    (cursor.ny - 0.5) * 0.35;
  const camRot = lerp(0, -0.35, smoothstep(0.2, 0.5, p)) + lerp(0, 0.25, actIII);

  const cameraTransform = `translate3d(${camX}%, ${camY}%, 0) scale(${camScale}) rotate(${camRot}deg)`;

  // Layer opacities — cinematic crossfades, not cuts
  const heroOp = isDay
    ? 0
    : (1 - smoothstep(0.12, 0.32, p));
  const observingOp = isDay
    ? 0
    : smoothstep(0.02, 0.14, p) * (1 - smoothstep(0.22, 0.38, p));
  const nightFocusOp = !isDay
    ? smoothstep(0.08, 0.2, p) * (1 - smoothstep(0.28, 0.42, p))
    : 0;
  const dayClarityOp = isDay
    ? (1 - smoothstep(0.28, 0.44, p))
    : 0;
  const movingOp = !isDay
    ? smoothstep(0.18, 0.3, p) * (1 - smoothstep(0.36, 0.48, p)) * 0.85
    : smoothstep(0.24, 0.36, p) * (1 - smoothstep(0.4, 0.52, p)) * 0.4;

  const signatureOp =
    smoothstep(0.28, 0.4, p) * (1 - smoothstep(0.52, 0.68, p));
  const visualOp =
    smoothstep(0.4, 0.52, p) * (1 - smoothstep(0.62, 0.76, p));
  const clarifyingOp =
    smoothstep(0.55, 0.68, p) * (1 - smoothstep(0.78, 0.9, p));
  const videoOp =
    smoothstep(0.42, 0.55, p) * (1 - smoothstep(0.72, 0.86, p)) * (isDay ? 0.35 : 0.72);

  const exhibitionOp = smoothstep(0.78, 0.9, p);
  const transformationOp = smoothstep(0.84, 0.95, p) * 0.85;
  const lookingBackOp = smoothstep(0.9, 0.98, p) * 0.55;

  // Copy visibility
  const titleOp = smoothstep(0.02, 0.1, p) * (1 - smoothstep(0.24, 0.34, p));
  const roleOp = smoothstep(0.06, 0.14, p) * (1 - smoothstep(0.26, 0.36, p));
  const statementOp = smoothstep(0.1, 0.18, p) * (1 - smoothstep(0.28, 0.38, p));
  const clarityOp =
    state.id === "clarified" || (state.id === "output" && actII < 0.92)
      ? smoothstep(0.62, 0.7, actII) * (1 - smoothstep(0.82, 0.92, actII))
      : 0;
  const worldOp = smoothstep(0.86, 0.94, p);
  const hintOp = 1 - smoothstep(0.02, 0.08, p);
  const railsVis = actIIVisibility(p);

  // Subtle environmental breathing (no particles)
  const [breath, setBreath] = useState(0);
  useEffect(() => {
    let raf;
    let t0 = performance.now();
    const tick = (now) => {
      setBreath(Math.sin((now - t0) / 4200) * 0.35);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const micro = `translate3d(0, ${breath * 0.15}%, 0)`;

  return (
    <div className="mp-stage">
      <div className="mp-camera" style={{ transform: cameraTransform }}>
        {/* ACT I — atmosphere */}
        <Layer
          src={PRECISION_ASSETS.hero}
          opacity={heroOp}
          transform={`${micro} scale(1.04)`}
          eager
        />
        <Layer
          src={PRECISION_ASSETS.observing}
          opacity={observingOp}
          transform={`scale(${1.02 + transit * 0.04}) translate(${transit * -1}%, 0)`}
        />
        <Layer
          src={PRECISION_ASSETS.nightFocus}
          opacity={nightFocusOp}
          transform={`scale(${1.05 + actI * 0.03})`}
        />
        <Layer
          src={PRECISION_ASSETS.dayClarity}
          opacity={dayClarityOp}
          transform={`scale(${1.03 + actI * 0.04})`}
          eager={isDay}
        />
        <Layer
          src={PRECISION_ASSETS.moving}
          opacity={movingOp}
          transform={`scale(${1.07 + transit * 0.05}) translate(0, ${transit * -1.5}%)`}
          dayLift={isDay}
        />

        {/* ACT II — Convergence */}
        <Layer
          src={PRECISION_ASSETS.signature}
          opacity={signatureOp}
          transform={`scale(${1.06 + actII * 0.06}) translate(${(cursor.nx - 0.5) * -0.8}%, 0)`}
          dayLift={isDay}
        />
        <Layer
          src={PRECISION_ASSETS.visual}
          opacity={visualOp}
          transform={`scale(${1.08 + actII * 0.05})`}
          dayLift={isDay}
        />
        <Layer
          src={PRECISION_ASSETS.clarifying}
          opacity={clarifyingOp}
          transform={`scale(${1.1 + actII * 0.04})`}
          dayLift={isDay}
        />
        <Layer
          src={PRECISION_ASSETS.convergenceVideo}
          video
          poster={PRECISION_ASSETS.signature}
          opacity={videoOp}
          transform={`scale(${1.05 + actII * 0.03})`}
        />

        {/* ACT III — larger world */}
        <Layer
          src={PRECISION_ASSETS.exhibition}
          opacity={exhibitionOp}
          transform={`scale(${1.08 + actIII * 0.06}) translate(0, ${actIII * -2}%)`}
          dayLift={isDay}
        />
        <Layer
          src={PRECISION_ASSETS.transformation}
          opacity={transformationOp}
          transform={`scale(${1.1 + actIII * 0.05})`}
          dayLift={isDay}
        />
        <Layer
          src={PRECISION_ASSETS.lookingBack}
          opacity={lookingBackOp}
          transform={`scale(1.12)`}
        />
      </div>

      <div className="mp-atmosphere" />
      <div className="mp-vignette" />
      <div className="mp-grain" />

      <ConvergenceRails
        progress={actII}
        stateId={state.id}
        cursor={cursor}
        visible={railsVis}
      />

      {/* Editorial frame */}
      <div className="mp-overlay" aria-hidden>
        <div
          className="mp-frame-line mp-frame-line--h"
          style={{ top: "18%", left: "4%", opacity: 0.5 + titleOp * 0.3 }}
        />
        <div
          className="mp-frame-line mp-frame-line--v"
          style={{ top: "18%", left: "4%", opacity: 0.4 }}
        />
        <div
          className="mp-meta mp-meta--tl"
          style={{ opacity: 0.35 + titleOp * 0.4 }}
        >
          MP-01 · ATRIUM
        </div>
        <div
          className="mp-meta mp-meta--bl"
          style={{ opacity: 0.25 + railsVis * 0.5 }}
        >
          {railsVis > 0.2 ? state.label : "ESTABLISHING"}
        </div>
        <div className="mp-meta mp-meta--br" style={{ opacity: 0.3 }}>
          {isDay ? "DAY · CLARITY" : "NIGHT · FOCUS"}
        </div>
      </div>

      {/* ACT I copy */}
      <div
        className="mp-copy mp-copy--acti"
        style={{
          opacity: Math.max(titleOp, roleOp, statementOp),
          transform: `translateY(${lerp(18, 0, titleOp)}px)`,
        }}
      >
        <h1 className="mp-title" style={{ opacity: titleOp }}>
          Mansi
        </h1>
        <p className="mp-role" style={{ opacity: roleOp }}>
          Data Engineer · Builder · Explorer
        </p>
        <p className="mp-statement" style={{ opacity: statementOp }}>
          I build systems that make complex things clear.
        </p>
      </div>

      {/* ACT II clarified */}
      <div
        className="mp-copy mp-copy--clarity"
        style={{
          opacity: clarityOp,
          transform: `translate(-50%, calc(-50% + ${lerp(16, 0, clarityOp)}px))`,
        }}
      >
        <p className="mp-clarity">Clarity is an engineering decision.</p>
        <div className="mp-clarity-rule" />
      </div>

      {/* ACT III world */}
      <div
        className="mp-copy mp-copy--world"
        style={{
          opacity: worldOp,
          transform: `translateY(${lerp(20, 0, worldOp)}px)`,
        }}
      >
        <p className="mp-world-kicker">Act III · The World</p>
        <h2 className="mp-world-title">The installation was only the beginning.</h2>
        <p className="mp-world-sub">
          Distant systems appear beyond the output pathway—destinations, not a menu.
        </p>
      </div>

      <div className="mp-destinations" style={{ opacity: worldOp }} aria-hidden>
        {DESTINATIONS.map((d, i) => (
          <div
            key={d.id}
            className="mp-dest"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              opacity: smoothstep(0.88 + i * 0.015, 0.94 + i * 0.015, p),
              transform: `translate(-50%, -50%) scale(${0.92 + worldOp * 0.08})`,
            }}
          >
            <div className="mp-dest__hair" />
            <div className="mp-dest__node" />
            <span className="mp-dest__label">{d.label}</span>
          </div>
        ))}
      </div>

      <div className="mp-scroll-hint" style={{ opacity: hintOp }}>
        <span>Scroll</span>
        <div className="mp-scroll-hint__line" />
      </div>

      <div className="mp-end" style={{ opacity: smoothstep(0.96, 1, p) }}>
        <p className="mp-end__note">Prototype ends · Art direction test</p>
      </div>

      <div
        ref={observeRef}
        className="mp-observe"
        onMouseMove={onMove}
        aria-hidden
      />
    </div>
  );
}

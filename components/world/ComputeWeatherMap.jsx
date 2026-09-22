"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AI_FOCUS_IDS,
  COMPUTE_SITES,
  COMPUTE_WEATHER,
  project,
} from "@/lib/data/compute-weather";
import LAND_PATHS from "@/lib/data/world-land-paths.json";
import DC_ATLAS from "@/lib/data/dc-atlas.json";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { LANDING_HERO } from "@/lib/data/identity";
import { TechRail } from "./HomeBands";

const ORIGIN = {
  lat: 37.7749,
  lng: -122.4194,
  name: "San Francisco",
};

const BEATS = [
  {
    id: "origin",
    at: 900,
    progress: 0.14,
    title: "San Francisco",
    line: "The boom begins. OpenAI lights the first cluster.",
  },
  {
    id: "dallas",
    at: 2400,
    progress: 0.32,
    title: "Texas",
    line: "Training load finds cheap power.",
  },
  {
    id: "nva",
    at: 3900,
    progress: 0.58,
    title: "Northern Virginia",
    line: "Data Centre Alley takes the grid.",
  },
  {
    id: "singapore",
    at: 5400,
    progress: 0.74,
    title: "Singapore",
    line: "The pulse jumps an ocean.",
  },
];

const SITE_BEATS = new Set(["dallas", "nva", "singapore", "sanjose"]);

function nodeRadius(site, layer) {
  if (layer === "centres") return 4.1;
  if (layer === "ai") return AI_FOCUS_IDS.has(site.id) ? 4.2 + site.ai * 6.2 : 2.4;
  if (layer === "growth") return 3.4 + site.growth * 5.2;
  if (layer === "grid") return 3.6 + site.power * 4.2;
  return 3.8 + site.power * 9.4;
}

function aiConstellation() {
  const pts = COMPUTE_SITES.filter((s) => AI_FOCUS_IDS.has(s.id))
    .map((s) => ({ s, xy: project(s.lat, s.lng) }))
    .sort((a, b) => a.xy[0] - b.xy[0]);
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p.xy[0]} ${p.xy[1]}`).join(" ");
  return { d, pts };
}

function powerLinks() {
  const ranked = [...COMPUTE_SITES].sort((a, b) => b.power - a.power).slice(0, 9);
  return ranked.slice(0, -1).map((site, i) => {
    const next = ranked[i + 1];
    const [x1, y1] = project(site.lat, site.lng);
    const [x2, y2] = project(next.lat, next.lng);
    const cx = (x1 + x2) / 2;
    const cy = Math.min(y1, y2) - 28;
    return { id: `${site.id}-${next.id}`, d: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}` };
  });
}

function LayerTabs({ layer, onChange }) {
  return (
    <div className="wd-compute__layers" role="tablist" aria-label="Map layers">
      {COMPUTE_WEATHER.layers.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={layer === item.id}
          className={layer === item.id ? "is-on" : ""}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function gridPath(site) {
  const [x1, y1] = project(site.lat, site.lng);
  const [x2, y2] = project(site.grid.lat, site.grid.lng);
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

function centresSpinePath() {
  const [ox, oy] = project(ORIGIN.lat, ORIGIN.lng);
  return [...COMPUTE_SITES]
    .sort((a, b) => distFromOrigin(a) - distFromOrigin(b))
    .map((site) => {
      const [x, y] = project(site.lat, site.lng);
      return `M ${ox} ${oy} L ${x} ${y}`;
    })
    .join(" ");
}

function CentreSpine({ d, active }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const len = el.getTotalLength();
    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;
    el.style.transition = "none";
    if (!active) return undefined;
    const frame = window.requestAnimationFrame(() => {
      el.style.transition = "stroke-dashoffset 8.5s cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.strokeDashoffset = "0";
    });
    return () => window.cancelAnimationFrame(frame);
  }, [d, active]);

  return <path ref={ref} d={d} className="wd-compute__spread wd-compute__spread--spine" pointerEvents="none" />;
}

function distFromOrigin(site) {
  return Math.hypot(site.lat - ORIGIN.lat, site.lng - ORIGIN.lng);
}

export default function ComputeWeatherMap({ playStats = true, chrome = "full" }) {
  const [layer, setLayer] = useState("centres");
  const [hot, setHot] = useState(null);
  const [sim, setSim] = useState("calm");
  const [lit, setLit] = useState(() => new Set());
  const [caption, setCaption] = useState(null);
  const [progress, setProgress] = useState(0);
  const rootRef = useRef(null);
  const seenRef = useRef(true);
  const [seq, setSeq] = useState(0);
  const byId = useMemo(() => Object.fromEntries(COMPUTE_SITES.map((s) => [s.id, s])), []);
  const cluster = hot ? byId[hot] : null;
  const simulating = sim !== "done";
  const showGrid = layer === "grid";
  const showGrowth = layer === "growth";
  const showAi = layer === "ai";
  const showPower = layer === "power";
  const synapse = useMemo(() => aiConstellation(), []);
  const volts = useMemo(() => powerLinks(), []);
  const spreadOrder = useMemo(
    () =>
      COMPUTE_SITES.filter((s) => !SITE_BEATS.has(s.id)).sort(
        (a, b) => distFromOrigin(a) - distFromOrigin(b)
      ),
    []
  );
  const originXY = useMemo(() => project(ORIGIN.lat, ORIGIN.lng), []);
  const spine = useMemo(() => centresSpinePath(), []);

  const atlasDots = useMemo(() => {
    const xy = DC_ATLAS.xy;
    const dots = [];
    for (let i = 0; i < xy.length; i += 2) {
      dots.push(<circle key={i} cx={xy[i]} cy={xy[i + 1]} r="1.15" />);
    }
    return dots;
  }, []);

  useEffect(() => {
    if (!playStats) {
      setSim("calm");
      setLit(new Set());
      setCaption(null);
      setProgress(0);
      return undefined;
    }

    const timers = [];
    const later = (ms, fn) => timers.push(window.setTimeout(fn, ms));

    setSim("calm");
    setLit(new Set());
    setCaption(null);
    setProgress(0);

    later(280, () => {
      setSim("live");
      setCaption({ title: "Live grid", line: "The map is quiet. Then a model needs power." });
    });

    later(BEATS[0].at, () => {
      setSim("origin");
      setLit(new Set(["sanjose"]));
      setProgress(BEATS[0].progress);
      setCaption({ title: BEATS[0].title, line: BEATS[0].line });
    });

    later(BEATS[1].at, () => {
      setSim("texas");
      setLit((prev) => new Set([...prev, "dallas"]));
      setProgress(BEATS[1].progress);
      setCaption({ title: BEATS[1].title, line: BEATS[1].line });
    });

    later(BEATS[2].at, () => {
      setSim("virginia");
      setLit((prev) => new Set([...prev, "nva"]));
      setProgress(BEATS[2].progress);
      setCaption({ title: BEATS[2].title, line: BEATS[2].line });
    });

    later(BEATS[3].at, () => {
      setSim("singapore");
      setLit((prev) => new Set([...prev, "singapore"]));
      setProgress(BEATS[3].progress);
      setCaption({ title: BEATS[3].title, line: BEATS[3].line });
    });

    const spreadStart = 6800;
    later(spreadStart, () => {
      setSim("spread");
      setCaption({
        title: "The contagion",
        line: "Hubs come online. The simulation fills the planet.",
      });
    });

    spreadOrder.forEach((site, i) => {
      later(spreadStart + 180 + i * 160, () => {
        setLit((prev) => new Set([...prev, site.id]));
      });
    });

    const worldAt = spreadStart + 180 + spreadOrder.length * 160 + 500;
    later(worldAt, () => {
      setSim("world");
      setProgress(1);
      setCaption({
        title: "The physical internet",
        line: "6,131 halls. This is where intelligence actually lives.",
      });
    });

    later(worldAt + 2200, () => {
      setLit(new Set(COMPUTE_SITES.map((s) => s.id)));
      setProgress(1);
      setSim("done");
    });

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [playStats, spreadOrder, seq]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || !playStats) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          if (!seenRef.current) {
            seenRef.current = true;
            setSeq((n) => n + 1);
          }
        } else if (!entry.isIntersecting) {
          seenRef.current = false;
        }
      },
      { threshold: [0, 0.4, 0.7] }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [playStats]);

  return (
    <div className={`wd-compute-wrap${chrome === "cover" ? " is-cover" : ""}`}>
    <div ref={rootRef} className={`wd-compute${chrome === "cover" ? " wd-compute--cover" : ""}`}>
      {chrome === "cover" ? null : (
      <div className="wd-compute__copy">
        <p className="wd-compute__kicker">{LANDING_HERO.kicker}</p>
        <h1>
          {LANDING_HERO.titleBefore}
          <em>{LANDING_HERO.titleMark}</em>
        </h1>
        <p className="wd-compute__lead">{LANDING_HERO.support}</p>
        <div className="wd-compute__actions">
          <Link href={LANDING_HERO.primaryCta.href} className="wd-compute__cta wd-compute__cta--solid">
            {LANDING_HERO.primaryCta.label}
            <ArrowRight size={16} aria-hidden />
          </Link>
          <Link href={LANDING_HERO.secondaryCta.href} className="wd-compute__cta">
            {LANDING_HERO.secondaryCta.label}
            <MessageCircle size={16} aria-hidden />
          </Link>
        </div>
      </div>
      )}

      <figure className="wd-compute__stage">
        <svg
          viewBox="0 0 1000 500"
          className="wd-compute__svg"
          data-layer={layer}
          data-sim={sim}
          role="img"
          aria-label="Industry map of global data-centre facilities. Electricity figures are IEA/ATLAS context, not personal impact."
        >
          {LAND_PATHS.map((d, i) => (
            <path key={i} d={d} className="wd-compute__land" />
          ))}
          <g className="wd-compute__atlas" pointerEvents="none">
            {atlasDots}
          </g>
          {layer === "centres" ? <CentreSpine d={spine} active={playStats && sim !== "calm"} /> : null}
          {showPower
            ? volts.map((link) => (
                <g key={link.id} pointerEvents="none">
                  <path d={link.d} className="wd-compute__volt wd-compute__volt--glow" />
                  <path d={link.d} className="wd-compute__volt" />
                  <circle r="2.2" className="wd-compute__particle">
                    <animateMotion dur="2.4s" repeatCount="indefinite" path={link.d} />
                  </circle>
                </g>
              ))
            : null}
          {showAi ? (
            <>
              <path d={synapse.d} className="wd-compute__synapse wd-compute__synapse--glow" pointerEvents="none" />
              <path d={synapse.d} className="wd-compute__synapse" pointerEvents="none" />
              <circle r="2.2" className="wd-compute__particle" pointerEvents="none">
                <animateMotion dur="3.2s" repeatCount="indefinite" path={synapse.d} />
              </circle>
            </>
          ) : null}
          {showGrid
            ? COMPUTE_SITES.map((s) => {
                const [gx, gy] = project(s.grid.lat, s.grid.lng);
                return (
                  <g key={`g-${s.id}`} pointerEvents="none">
                    <path d={gridPath(s)} className="wd-compute__feeder wd-compute__feeder--glow" />
                    <path d={gridPath(s)} className="wd-compute__feeder" />
                    <rect x={gx - 3} y={gy - 3} width="6" height="6" className="wd-compute__grid-pin" />
                    <circle r="2.4" className="wd-compute__particle">
                      <animateMotion dur={`${1.6 + (1 - s.power) * 1.2}s`} repeatCount="indefinite" path={gridPath(s)} />
                    </circle>
                  </g>
                );
              })
            : null}
          {sim !== "calm" && sim !== "live" && sim !== "done" ? (
            <g className="wd-compute__origin" transform={`translate(${originXY[0]} ${originXY[1]})`} pointerEvents="none">
              {sim === "origin" || sim === "texas" ? (
                <>
                  <circle r="18" className="wd-compute__shock" />
                  <circle r="18" className="wd-compute__shock wd-compute__shock--late" />
                </>
              ) : null}
              <circle r="12" className="wd-compute__glow" />
              <circle r="5.4" className="wd-compute__origin-core" />
            </g>
          ) : null}
          {COMPUTE_SITES.map((s) => {
            const [x, y] = project(s.lat, s.lng);
            const on = hot === s.id;
            const aiDim = showAi && !AI_FOCUS_IDS.has(s.id);
            const r = nodeRadius(s, layer);
            const waiting = simulating && !lit.has(s.id);
            return (
              <g
                key={s.id}
                className={`wd-compute__site${on ? " is-hot" : ""}${aiDim ? " is-dim" : ""}${waiting ? " is-wait" : ""}${lit.has(s.id) ? " is-lit" : ""}`}
                style={{
                  "--cw-pulse": `${2.6 - s.power * 1.2}s`,
                  "--cw-grow": `${1.8 + (1 - s.growth) * 1.6}s`,
                }}
                transform={`translate(${x} ${y})`}
                onPointerEnter={() => setHot(s.id)}
                onPointerLeave={() => setHot(null)}
                tabIndex={waiting ? -1 : 0}
                role="button"
                aria-label={s.name}
              >
                {lit.has(s.id) && simulating && layer !== "centres" ? (
                  <circle r={r * 2.8} className="wd-compute__birth" />
                ) : null}
                {showPower ? <circle r={r * 2.05} className="wd-compute__glow" /> : null}
                {!waiting ? (
                  <>
                    <circle r={r * 2.4} className="wd-compute__pop" />
                    <circle r={r * 1.15} className="wd-compute__flare" />
                    <circle r={r * 0.28} className="wd-compute__spark" />
                  </>
                ) : null}
                <rect
                  className="wd-compute__dot wd-compute__node"
                  x={-r}
                  y={-r}
                  width={r * 2}
                  height={r * 2}
                  rx={r}
                />
              </g>
            );
          })}
        </svg>

        <div className="wd-compute__controls">
          <LayerTabs layer={layer} onChange={setLayer} />
        </div>
        {cluster && !simulating ? (
          <aside className="wd-compute__card">
            <p className="wd-compute__card-kicker">{cluster.region}</p>
            <h2>{cluster.name}</h2>
            <p>{cluster.facts.role}</p>
            <dl>
              <div>
                <dt>Capacity</dt>
                <dd>{cluster.facts.capacity}</dd>
              </div>
              <div>
                <dt>Pipeline</dt>
                <dd>{cluster.facts.pipeline}</dd>
              </div>
              <div>
                <dt>Grid</dt>
                <dd>{cluster.facts.grid}</dd>
              </div>
              <div>
                <dt>AI exposure</dt>
                <dd>{cluster.facts.ai}</dd>
              </div>
            </dl>
          </aside>
        ) : null}

        <figcaption>
          <a href={COMPUTE_WEATHER.source.href} target="_blank" rel="noreferrer">
            {COMPUTE_WEATHER.source.label}
          </a>
          {" · "}
          <a href={COMPUTE_WEATHER.atlas.href} target="_blank" rel="noreferrer">
            {COMPUTE_WEATHER.atlas.label}
          </a>
        </figcaption>
      </figure>
    </div>
    {chrome === "cover" ? null : <TechRail />}
    </div>
  );
}

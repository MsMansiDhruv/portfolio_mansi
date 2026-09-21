"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { IDENTITY } from "@/lib/data/identity";
import WorldPageNav from "@/components/world/WorldPageNav";
import SiteFooter from "@/components/world/SiteFooter";
import ProjectPager from "./ProjectPager";
import InstallationGlyph from "./InstallationGlyph";
import FlowingArchitectureGraph from "@/components/projects/FlowingArchitectureGraph";
import { useGsapLenis } from "@/components/world/useGsapLenis";
import { bindCaseMotion } from "@/components/world/bindWorkMotion";
import { EXHIBITION_ORDER } from "@/lib/data/exhibition-order";
import { getInstallation, getInstallationNav } from "@/lib/data/work-exhibition";
import { getProjectFlowGraph } from "@/lib/data/project-flow-graphs";
import { useWorldTheme } from "@/lib/use-world-theme";
import {
  AlertTriangle,
  ArrowLeftRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  Cloud,
  Cpu,
  Database,
  Filter,
  GitBranch,
  Layers,
  Lightbulb,
  ListTodo,
  Scale,
  Server,
  Sparkles,
  Workflow,
} from "lucide-react";
import "@/styles/mansi-world-of-data.css";
import "@/styles/mansi-work.css";

const LAYER_ICONS = [Database, Filter, Layers, BarChart3, Cloud, Workflow, Server, Sparkles];
const FLOW_ICONS = [GitBranch, Cpu, Boxes, BarChart3, Cloud];

function techIcon(name = "") {
  const n = String(name).toLowerCase();
  if (n.includes("s3") || n.includes("redshift") || n.includes("postgres") || n.includes("sql") || n.includes("delta")) return Database;
  if (n.includes("glue") || n.includes("spark") || n.includes("databricks")) return Cpu;
  if (n.includes("lambda") || n.includes("cloud") || n.includes("aws") || n.includes("ec2")) return Cloud;
  if (n.includes("bi") || n.includes("quick") || n.includes("athena")) return BarChart3;
  if (n.includes("ml") || n.includes("flow") || n.includes("model")) return Sparkles;
  return Boxes;
}

function SectionHead({ kicker, children }) {
  const parts = String(kicker).split(" — ");
  const indexed = parts.length > 1 && /^\d{2}/.test(parts[0]);
  return (
    <header className="wd-case__head">
      <p className="wd-scroll-kicker">
        {indexed ? <b className="wd-orange">{parts[0]}</b> : null}
        {indexed ? ` — ${parts.slice(1).join(" — ")}` : kicker}
      </p>
      {children || null}
    </header>
  );
}

function ProjectSchematic({ schematic }) {
  if (!schematic) return null;
  const stages = schematic.stages || [];

  if (schematic.type === "split") {
    return (
      <figure className="wd-case__schematic wd-case__schematic--split">
        <div className="wd-case__split">
          <div>
            <p>{schematic.left?.title}</p>
            <ul>
              {(schematic.left?.items || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <span aria-hidden>→</span>
          <div>
            <p>{schematic.right?.title}</p>
            <ul>
              {(schematic.right?.items || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        {schematic.caption ? <figcaption>{schematic.caption}</figcaption> : null}
      </figure>
    );
  }

  if (!stages.length) return null;

  return (
    <figure className="wd-case__schematic">
      <ol>
        {stages.map((stage, i) => {
          const title = typeof stage === "string" ? stage : stage.title;
          const detail = typeof stage === "string" ? null : stage.detail;
          return (
            <li key={`${title}-${i}`}>
              <em>{String(i + 1).padStart(2, "0")}</em>
              <strong>{title}</strong>
              {detail ? <span>{detail}</span> : null}
            </li>
          );
        })}
      </ol>
      {schematic.caption ? <figcaption>{schematic.caption}</figcaption> : null}
    </figure>
  );
}

function ThemeEvidence({ evidence, title }) {
  const src = evidence.src;
  if (!src) return null;
  return (
    <figure className="wd-case__evidence">
      <img className="wd-case__evidence-img" src={src} alt={evidence.caption || title} />
      {evidence.caption ? <figcaption>{evidence.caption}</figcaption> : null}
    </figure>
  );
}

function DecisionCard({ d }) {
  const decision = d.decision || d.title;
  const why = d.why || d.reasoning;
  if (!decision && !why) return null;
  return (
    <article className="wd-case__decision">
      <em className="wd-orange">Decision</em>
      <h3>{decision}</h3>
      {why ? (
        <>
          <b>Why</b>
          <p>{why}</p>
        </>
      ) : null}
      {d.alternative ? (
        <>
          <b>Alternative</b>
          <p>{d.alternative}</p>
        </>
      ) : null}
      {d.tradeoff ? (
        <>
          <b>Trade-off</b>
          <p>{d.tradeoff}</p>
        </>
      ) : null}
      {d.problem ? (
        <>
          <b>Context</b>
          <p>{d.problem}</p>
        </>
      ) : null}
    </article>
  );
}

export default function InstallationRoom({ slug }) {
  const [theme] = useWorldTheme();
  const [activeLayer, setActiveLayer] = useState(0);
  const rootRef = useRef(null);
  const setup = useCallback(bindCaseMotion, []);
  useGsapLenis(rootRef, setup);

  const install = getInstallation(slug);
  const nav = getInstallationNav(slug);
  if (!install) return null;

  const decisions = (install.caseDecisions?.length ? install.caseDecisions : install.decisions) || [];
  const layers = (install.flow?.length
    ? install.flow.map((item) => item.title)
    : install.architectureLayers) || [];
  const stack = install.stackRationale?.length
    ? install.stackRationale
    : (install.tech || []).map((name) => ({ name, why: null }));
  const detailedFlow = (install.flow || []).filter((step) => step.body);
  const thesis = install.engineeringNotes?.[0] || install.tagline;
  const takeawayPoints = (install.engineeringNotes || []).slice(1);
  const hasEvidence = Boolean(
    install.evidence?.src ||
      install.schematic?.type === "split" ||
      install.schematic?.stages?.length
  );
  const flowGraph = getProjectFlowGraph(install.slug);
  const code =
    install.number && install.number !== "—"
      ? install.number
      : String(Math.max(1, EXHIBITION_ORDER.indexOf(install.slug) + 1)).padStart(2, "0");

  return (
    <div
      ref={rootRef}
      className="wd-root wd-page wk-root wd-case is-ready"
      data-theme={theme}
      data-metaphor={install.metaphor}
      suppressHydrationWarning
    >
      <WorldPageNav active="work" />
      <div className="wd-case__progress" aria-hidden>
        <span />
      </div>

      <header className="wd-case__hero">
        <div className="wd-case__intro">
          <div>
            <p className="wd-case__crumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/projects">Work</Link>
            </p>
            <p className="wd-scroll-kicker">
              <InstallationGlyph type={install.glyph} className="wk-glyph inline" />
              <b className="wd-orange">Project {code}</b>
            </p>
            <h1 className="wd-page-title">{install.title}</h1>
          </div>
          <div className="wd-case__intro-side">
            <p className="wd-page-lead">{install.tagline || install.subtitle || install.purpose}</p>
            <p className="wd-case__meta">
              <span className="wd-orange">{IDENTITY.headline}</span>
              {install.timeline ? <span>{install.timeline}</span> : null}
              <span>{install.category}</span>
            </p>
            <div className="wd-tile__tags wd-case__tags">
              {(install.tech || []).slice(0, 6).map((tech) => (
                <i key={tech}>{tech}</i>
              ))}
            </div>
          </div>
        </div>
        {flowGraph ? (
          <div className="wd-case__graph">
            <div className="wd-case__graph-face">
              <FlowingArchitectureGraph graph={flowGraph} />
            </div>
          </div>
        ) : null}
      </header>

      <div className="wd-case__body">
        <section className="wd-case__chapter">
          <SectionHead kicker="01 — The problem" />
          <p className="wd-case__lead">{install.problem}</p>
        </section>

        {layers.length ? (
          <section className="wd-case__chapter">
            <SectionHead kicker="02 — The system" />
            <p className="wd-case__hint">Select a layer to see its role.</p>
            <div className="wd-case__layers">
              {layers.map((layer, i) => {
                const label = typeof layer === "string" ? layer : layer;
                const note = install.architectureNotes?.[i] || null;
                const flow = install.flow?.[i] || null;
                const LayerIcon = LAYER_ICONS[i % LAYER_ICONS.length];
                return (
                  <button
                    key={label}
                    type="button"
                    className={`wd-case__layer${activeLayer === i ? " is-active" : ""}`}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "touch") return;
                      setActiveLayer(i);
                    }}
                    onFocus={() => setActiveLayer(i)}
                    onClick={() => setActiveLayer(i)}
                  >
                    <span>
                      <LayerIcon strokeWidth={1.75} />
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <strong>{label}</strong>
                    <em>{flow?.body || note || "Part of the documented architecture."}</em>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {detailedFlow.length ? (
          <section className="wd-case__chapter wd-case__chapter--wide">
            <SectionHead kicker="Data flow" />
            <ol className="wd-case__flow">
              {detailedFlow.map((f, i) => {
                const FlowIcon = FLOW_ICONS[i % FLOW_ICONS.length];
                return (
                  <li key={f.n + f.title}>
                    <FlowIcon strokeWidth={1.75} />
                    <em>{f.n}</em>
                    <strong>{f.title}</strong>
                    <span>{f.body}</span>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : null}

        {decisions.length ? (
          <section className="wd-case__chapter wd-case__chapter--wide">
            <SectionHead kicker="03 — The decision" />
            <div className="wd-case__decisions">
              {decisions.map((d, i) => (
                <DecisionCard key={d.n || d.decision || i} d={d} />
              ))}
            </div>
          </section>
        ) : null}

        {install.tradeoffs ? (
          <section className="wd-case__chapter wd-case__chapter--wide">
            <SectionHead kicker="04 — The trade-off" />
            <div className="wd-case__trade">
              {install.tradeoffs.optimizedFor?.length ? (
                <div>
                  <p>
                    <CheckCircle2 strokeWidth={1.75} /> Optimized for
                  </p>
                  <ul>
                    {install.tradeoffs.optimizedFor.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {install.tradeoffs.sacrificed?.length ? (
                <div className="is-risk">
                  <p>
                    <AlertTriangle strokeWidth={1.75} /> Sacrificed
                  </p>
                  <ul>
                    {install.tradeoffs.sacrificed.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {stack.length ? (
          <section className="wd-case__chapter wd-case__chapter--wide">
            <SectionHead kicker="Technology — why it was used" />
            <div className="wd-case__stack">
              {stack.map((t) => {
                const TechIcon = techIcon(t.name);
                return (
                  <div key={t.name}>
                    <p>
                      <TechIcon strokeWidth={1.75} />
                      {t.name}
                    </p>
                    {t.why ? <span>{t.why}</span> : null}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {hasEvidence ? (
          <section className="wd-case__chapter wd-case__chapter--wide">
            <SectionHead kicker="05 — Evidence" />
            {install.evidence?.src ? (
              <ThemeEvidence evidence={install.evidence} title={install.title} />
            ) : (
              <ProjectSchematic schematic={install.schematic} />
            )}
          </section>
        ) : null}

        <section className="wd-case__chapter wd-case__chapter--wide wd-case__take">
          <SectionHead kicker="Takeaway" />
          <p className="wd-case__thesis">
            <Lightbulb strokeWidth={1.75} />
            {thesis}
          </p>
          {takeawayPoints.length ? (
            <ul>
              {takeawayPoints.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
          {install.outcomes?.length ? (
            <div>
              <p>
                <CheckCircle2 strokeWidth={1.75} /> What landed
              </p>
              <ul>
                {install.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {install.learnings?.length ? (
            <div>
              <p>
                <ListTodo strokeWidth={1.75} /> What I would do next
              </p>
              <ul>
                {install.learnings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </div>
      <ProjectPager prev={nav.prev} next={nav.next} />
      <SiteFooter />
    </div>
  );
}

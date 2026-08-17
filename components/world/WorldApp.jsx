"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/styles/mansi-world-of-data.css";
import {
  WORLD_HERO,
  WORLD_NAV,
  NAV_PORTAL_MAP,
  LAYER_CAM,
  TECH_META,
  getWorkClusters,
} from "@/lib/data/data-world";
import {
  ABOUT_ME,
  AWARDS,
  CAREER_TIMELINE,
  CERTIFICATIONS,
  getAboutHeroLine,
} from "@/lib/data/career";
import { SOCIAL_LINKS } from "@/lib/data/social-links";
import { WORK_EXPERIMENTS } from "@/lib/data/work-exhibition";
import {
  RECOMMENDATIONS,
  getRecommendationText,
} from "@/lib/data/recommendations";
import WorldCanvas from "./WorldCanvas";
import AiModeSurface from "./AiModeSurface";
import { HOME_CAM, approachNode } from "./CameraRig";
import { getProjectMeta } from "@/lib/data/project-meta";
import { writeWorldTheme } from "@/lib/world-theme";
import { useWorldTheme } from "@/lib/use-world-theme";
const RESUME_HREF = "/resume.pdf";
const PRIMARY_CERTS = CERTIFICATIONS.filter((c) => c.tier === "primary");
const FEATURED_VOICES = RECOMMENDATIONS.filter((r) => r.featured).concat(
  RECOMMENDATIONS.filter((r) => !r.featured)
).slice(0, 2);

/**
 * One world. Contextual information only — never permanent side boxes.
 */
export default function WorldApp() {
  const [theme, setTheme] = useWorldTheme();
  const [themePulse, setThemePulse] = useState(false);
  const [ready, setReady] = useState(false);
  const [story, setStory] = useState("silence");
  const [layer, setLayer] = useState("world");
  const [navOpen, setNavOpen] = useState(false);
  const [techHover, setTechHover] = useState(null);
  const [workHover, setWorkHover] = useState(null);
  const [workSelected, setWorkSelected] = useState(null);
  const [pipelineReady, setPipelineReady] = useState(false);
  const [heroSettled, setHeroSettled] = useState(false);
  const [routeFound, setRouteFound] = useState(false);
  const storyRef = useRef(null);
  const [aiMode, setAiMode] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [portalHover, setPortalHover] = useState(null);
  const workProjects = useMemo(() => getWorkClusters(), []);
  const selectedProject = workSelected?.slug
    ? getProjectMeta(workSelected.slug)
    : null;
  const hasDocumentedFlow = !!selectedProject?.architectureLayers?.length;
  const projectFlow = hasDocumentedFlow
    ? selectedProject.architectureLayers
    : selectedProject?.tech?.slice(0, 4) || [];

  const cameraTargetRef = useRef({
    position: [...(LAYER_CAM.world?.position || HOME_CAM.position)],
    lookAt: [...(LAYER_CAM.world?.lookAt || HOME_CAM.lookAt)],
    fov: LAYER_CAM.world?.fov || HOME_CAM.fov,
    mode: "stream",
    token: 1,
    mid: null,
    zoomDelta: 0,
  });
  const cursorRef = useRef({
    nx: 0,
    ny: 0,
    vx: 0,
    vy: 0,
    dragActive: false,
    dragDX: 0,
    dragDY: 0,
    dragVX: 0,
    dragVY: 0,
    x: 0,
    y: 0,
    z: 0,
    active: false,
  });
  const stateRef = useRef({
    globeEnergy: 0.02,
    globeRotY: 0,
    globeRotX: 0,
    breath: 0,
    reveal: 0,
    colourWake: 0,
    wake: 0,
    infraWake: null,
    story: "silence",
    layer: "world",
    decompose: 0,
    secretWake: 0,
    pipelineActive: false,
    aiConsoleOpen: false,
    aiThinking: false,
    scrollVelocity: 0,
    scrollProgress: 0,
    shapeFrom: "world",
    shapeTo: "world",
    shapeMix: 1,
    shapeProgress: 0,
    assemble: 0,
  });
  const startedAt = useRef(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      stateRef.current.assemble = 1;
      setReady(true);
      return undefined;
    }
    const origin = performance.now();
    let raf = 0;
    let settleTimer = 0;
    let settled = false;
    const tick = () => {
      const t = Math.min(1, (performance.now() - origin) / 2600);
      const eased = t * t * (3 - 2 * t);
      stateRef.current.assemble = eased;
      if (t >= 1 && !settled) {
        settled = true;
        stateRef.current.assemble = 1;
        settleTimer = window.setTimeout(() => setReady(true), 220);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("wd-active");
    return () => document.documentElement.classList.remove("wd-active");
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return undefined;
    const target = document.getElementById(hash);
    if (!target) return undefined;
    const timer = window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let previousY = window.scrollY;
    let previousTime = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const elapsed = Math.max(16, now - previousTime);
      stateRef.current.scrollVelocity = Math.max(-2.4, Math.min(2.4, (y - previousY) / elapsed));
      stateRef.current.scrollProgress = y / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      previousY = y;
      previousTime = now;

      const root = storyRef.current;
      const sections = root ? [...root.querySelectorAll("[data-world-layer]")] : [];
      if (sections.length) {
        const mid = window.innerHeight * 0.48;
        let index = 0;
        for (let i = 0; i < sections.length - 1; i += 1) {
          if (sections[i + 1].getBoundingClientRect().top <= mid) index = i + 1;
          else break;
        }
        const current = sections[index];
        const next = sections[Math.min(index + 1, sections.length - 1)];
        const fromId = current?.dataset?.worldLayer || "world";
        const toId = next?.dataset?.worldLayer || fromId;
        let mix = 0;
        if (current && next && current !== next) {
          const a = current.getBoundingClientRect();
          const b = next.getBoundingClientRect();
          const aAnchor = a.top + a.height * 0.42;
          const bAnchor = b.top + b.height * 0.42;
          const span = bAnchor - aAnchor;
          mix = span === 0 ? 0 : Math.max(0, Math.min(1, (mid - aAnchor) / span));
        }
        stateRef.current.shapeFrom = fromId;
        stateRef.current.shapeTo = toId;
        stateRef.current.shapeMix = mix;
        stateRef.current.shapeProgress = index + mix;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ready) {
      setStory("silence");
      stateRef.current.story = "silence";
      return undefined;
    }
    setStory("explore");
    stateRef.current.story = "explore";
    startedAt.current = performance.now();
    return undefined;
  }, [ready]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const secret = stateRef.current.secretWake || 0;
      if (secret > 0.72 && layer === "world" && !routeFound) setRouteFound(true);
    }, 160);
    return () => clearInterval(id);
  }, [layer, routeFound]);

  useEffect(() => {
    stateRef.current.story = story;
  }, [story]);

  useEffect(() => {
    stateRef.current.layer = layer;
  }, [layer]);

  useEffect(() => {
    if (story !== "explore" || layer !== "world") return undefined;
    const t = window.setTimeout(() => setHeroSettled(true), 3200);
    return () => clearTimeout(t);
  }, [story, layer]);

  useEffect(() => {
    if (layer !== "world") setHeroSettled(true);
  }, [layer]);

  useEffect(() => {
    stateRef.current.pipelineActive = !!workSelected;
  }, [workSelected]);

  useEffect(() => {
    stateRef.current.aiConsoleOpen = !!aiMode;
    if (!aiMode) setAiThinking(false);
  }, [aiMode]);

  useEffect(() => {
    stateRef.current.aiThinking = aiThinking;
  }, [aiThinking]);

  const setCam = useCallback((cam, mode = "stream") => {
    const from = cameraTargetRef.current || {};
    const fromPos = from.position || HOME_CAM.position;
    const fromLook = from.lookAt || HOME_CAM.lookAt;
    cameraTargetRef.current = {
      position: [...cam.position],
      lookAt: [...cam.lookAt],
      fov: cam.fov,
      mode,
      token: Date.now(),
      zoomDelta: 0,
      mid: {
        position: [
          (fromPos[0] + cam.position[0]) * 0.5,
          Math.max(fromPos[1], cam.position[1]) + 0.2,
          (fromPos[2] + cam.position[2]) * 0.55,
        ],
        lookAt: [
          (fromLook[0] + cam.lookAt[0]) * 0.5,
          (fromLook[1] + cam.lookAt[1]) * 0.5,
          (fromLook[2] + cam.lookAt[2]) * 0.5,
        ],
      },
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setThemePulse(true);
    window.setTimeout(() => setThemePulse(false), 1400);
    setTheme((prev) => {
      const next = prev === "night" ? "day" : "night";
      writeWorldTheme(next);
      return next;
    });
  }, []);

  const onTechSelect = useCallback(
    (node, pos) => {
      if (story !== "explore" && story !== "identity") return;
      if (layer !== "world") return;
      const meta = TECH_META[node?.id];
      if (meta?.targetLayer) {
        setPortalHover(node.id);
      }
    },
    [story, layer]
  );

  const onWorkSelect = useCallback(
    (cluster, pos) => {
      setWorkSelected(cluster);
      setPipelineReady(false);
      setCam(approachNode(pos, 2.2), "enter");
      window.setTimeout(() => setCam(LAYER_CAM.pipeline, "enter"), 700);
    },
    [setCam]
  );

  const onHome = useCallback(() => {
    setTechHover(null);
    setPortalHover(null);
    setWorkSelected(null);
    setWorkHover(null);
    setPipelineReady(false);
    setAiMode(null);
    setLayer("world");
    setNavOpen(false);
    setCam(LAYER_CAM.world, "stream");
    document.getElementById("world-world")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [setCam]);

  const goLayer = useCallback(
    (id) => {
      setNavOpen(false);
      document.getElementById(`world-${id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    []
  );

  useEffect(() => {
    const root = storyRef.current;
    if (!root) return undefined;
    const sections = [...root.querySelectorAll("[data-world-layer]")];
    let pendingId = null;
    let timer = 0;
    const applyLayer = (id) => {
      setLayer((previous) => {
        if (previous === id) return previous;
        setTechHover(null);
        setPortalHover(null);
        setWorkSelected(null);
        setWorkHover(null);
        setPipelineReady(false);
        setAiMode(null);
        setCam(LAYER_CAM[id] || LAYER_CAM.world, "stream");
        return id;
      });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = current?.target?.dataset?.worldLayer;
        if (!id) return;
        pendingId = id;
        window.clearTimeout(timer);
        // Debounce layer morphs so fast scrolling does not restart particle
        // transitions on every section edge.
        timer = window.setTimeout(() => {
          if (pendingId) applyLayer(pendingId);
        }, 80);
      },
      {
        threshold: [0.35, 0.55],
        rootMargin: "-18% 0px -22% 0px",
      }
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [setCam]);

  const closeProject = useCallback(() => {
    setWorkSelected(null);
    setPipelineReady(false);
    setCam(LAYER_CAM.work, "stream");
  }, [setCam]);

  const explored = story === "explore" || story === "identity";
  return (
    <div
      className={`wd-root${ready ? " is-ready" : ""}${themePulse ? " is-theme-shift" : ""}${workSelected ? " wd-project-open" : ""}${aiMode ? " wd-ai-open" : ""}`}
      data-theme={theme}
      data-story={story}
      data-layer={layer}
      data-hero={heroSettled && layer === "world" ? "settled" : "impact"}
      suppressHydrationWarning
    >
      <div className={`wd-loader${ready ? " is-done" : ""}`} aria-hidden>
        <span className="wd-loader__mark">Assembling the data field</span>
        <span className="wd-loader__sub">Scattered signal resolving into system</span>
      </div>

      <header className="wd-bar">
        <button type="button" className="wd-brand" onClick={onHome}>
          Mansi
        </button>
        <nav className={`wd-nav${navOpen ? " is-open" : ""}`} aria-label="System">
          {WORLD_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`wd-nav__item${layer === item.id ? " is-active" : ""}`}
              onClick={() => goLayer(item.id)}
              onMouseEnter={() => {
                if (layer === "world") setPortalHover(NAV_PORTAL_MAP[item.id] || null);
              }}
              onMouseLeave={() => {
                if (layer === "world") setPortalHover(null);
              }}
              aria-current={layer === item.id ? "page" : undefined}
            >
              <span className="wd-nav__label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="wd-bar__end">
          <button
            type="button"
            className="wd-nav-toggle"
            aria-expanded={navOpen}
            aria-label="Open navigation"
            onClick={() => setNavOpen((v) => !v)}
          >
            Menu
          </button>
          <button
            type="button"
            className="wd-theme"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "night" ? "day" : "night"} mode`}
          >
            <span className="wd-theme__pip" />
            <span suppressHydrationWarning>
              {theme === "night" ? "Night" : "Day"}
            </span>
          </button>
        </div>
      </header>

      <WorldCanvas
        themeId={theme}
        layer={layer}
        cameraTargetRef={cameraTargetRef}
        cursorRef={cursorRef}
        stateRef={stateRef}
        workHover={workHover?.slug || null}
        workSelected={workSelected}
        onWorkHover={(c) => {
          if (layer !== "work" || workSelected) return;
          setWorkHover(c);
        }}
        onWorkSelect={onWorkSelect}
        onPipelineReady={() => setPipelineReady(true)}
      />

      <main className="wd-scroll-story" ref={storyRef}>
        <section id="world-world" className="wd-scroll-section wd-scroll-section--hero" data-world-layer="world">
          <div className="wd-scroll-copy wd-scroll-copy--hero">
            <p className="wd-scroll-kicker">DATA SYSTEMS, MADE LEGIBLE.</p>
            <h1>{WORLD_HERO.name}</h1>
            <p className="wd-scroll-role">{WORLD_HERO.role}</p>
            <p>I build reliable data platforms—from raw inputs to decisions teams can trust.</p>
            <button type="button" className="wd-scroll-action" onClick={() => goLayer("work")}>Explore selected systems <span>↓</span></button>
          </div>
          <p className="wd-scroll-index" aria-hidden>01 — HOME</p>
        </section>

        <section id="world-work" className="wd-scroll-section" data-world-layer="work">
          <div className="wd-scroll-copy">
            <p className="wd-scroll-kicker">SELECTED WORK</p>
            <h2>Architecture that earns its complexity.</h2>
            <p>Hover a project to preview it. Open one to see the architecture, constraints, and production choices.</p>
            <div className="wd-work-keys" aria-label="Work themes">
              <span>01 / SIGNAL</span><span>02 / SYSTEM</span><span>03 / OUTCOME</span>
            </div>
            <Link href="/projects" className="wd-scroll-action">
              See all projects <span>↗</span>
            </Link>
          </div>
          <div className="wd-project-atlas" aria-label="Selected projects">
            {workProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className={`wd-project-atlas__card${workSelected?.slug === project.slug ? " is-selected" : ""}`}
                onMouseEnter={() => setWorkHover(project)}
                onMouseLeave={() => setWorkHover(null)}
                onFocus={() => setWorkHover(project)}
                onBlur={() => setWorkHover(null)}
              >
                <span className="wd-project-atlas__number">{project.code}</span>
                <span className="wd-project-atlas__title">{project.cardTitle}</span>
                <span className="wd-project-atlas__story">{project.story}</span>
                <span className="wd-project-atlas__cue">Open architecture ↗</span>
              </Link>
            ))}
            {WORK_EXPERIMENTS.length ? (
              <nav className="wd-side-atlas" aria-label="Experiments and side builds">
                <p className="wd-side-atlas__kicker">Also</p>
                <div className="wd-scroll-links wd-side-atlas__links">
                  {WORK_EXPERIMENTS.map((project) => (
                    <Link key={project.slug} href={`/projects/${project.slug}`}>
                      {project.number} {project.title}
                    </Link>
                  ))}
                </div>
              </nav>
            ) : null}
          </div>
          <p className="wd-scroll-index" aria-hidden>02 — WORK</p>
        </section>

        <section id="world-ai" className="wd-scroll-section" data-world-layer="ai">
          <div className="wd-scroll-copy">
            <p className="wd-scroll-kicker">AI LAB</p>
            <h2>Ask Mansi</h2>
            <p>Ask about the work — architecture, pipelines, SQL, and trade-offs.</p>
            <button type="button" className="wd-scroll-action" onClick={() => setAiMode("ask")}>
              Ask Mansi <span>↗</span>
            </button>
            <p className="wd-scroll-detail">Or go straight to a mode</p>
            <div className="wd-ai-launchers" aria-label="Other modes">
              <button type="button" onClick={() => setAiMode("architecture")}>Architecture</button>
              <button type="button" onClick={() => setAiMode("pipeline")}>Pipeline</button>
              <button type="button" onClick={() => setAiMode("sql")}>SQL</button>
            </div>
          </div>
          <p className="wd-scroll-index" aria-hidden>03 — AI LAB</p>
        </section>

        <section id="world-experience" className="wd-scroll-section" data-world-layer="experience">
          <div className="wd-scroll-copy wd-scroll-copy--right">
            <p className="wd-scroll-kicker">EXPERIENCE</p>
            <h2>Roles that got more complex over time.</h2>
            <div className="wd-scroll-timeline">
              {CAREER_TIMELINE.slice(0, 4).map((entry) => (
                <article key={entry.id}>
                  <span>{entry.year}</span>
                  <div>
                    <strong>{entry.title}</strong>
                    <p>{entry.focus || entry.desc}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="wd-scroll-detail">
              {AWARDS[0]?.title} · {PRIMARY_CERTS[0]?.title} · {CERTIFICATIONS.length} credentials
            </p>
            <Link href="/credentials" className="wd-scroll-action">
              Full journey <span>↗</span>
            </Link>
          </div>
          <p className="wd-scroll-index" aria-hidden>04 — EXPERIENCE</p>
        </section>

        <section id="world-about" className="wd-scroll-section" data-world-layer="about">
          <div className="wd-scroll-copy">
            <p className="wd-scroll-kicker">ABOUT</p>
            <span className="wd-about-mark" aria-hidden>M</span>
            <h2>I build systems people can rely on.</h2>
            <p>{ABOUT_ME[0]}</p>
            <p className="wd-scroll-detail">{getAboutHeroLine()}</p>
            {FEATURED_VOICES[0] ? (
              <p className="wd-scroll-detail">
                “{getRecommendationText(FEATURED_VOICES[0]).slice(0, 118).trim()}…”
              </p>
            ) : null}
            <Link href="/credentials#recommendations" className="wd-scroll-action">
              All testimonials <span>↗</span>
            </Link>
          </div>
          <p className="wd-scroll-index" aria-hidden>05 — ABOUT</p>
        </section>

        <section id="world-contact" className="wd-scroll-section wd-scroll-section--contact" data-world-layer="contact">
          <div className="wd-scroll-copy wd-scroll-copy--right">
            <p className="wd-scroll-kicker">CONTACT</p>
            <span className="wd-contact-mark" aria-hidden>✦</span>
            <h2>Let&apos;s build something dependable.</h2>
            <p>For collaboration, hiring, speaking, or a technical conversation.</p>
            <div className="wd-scroll-links">
              <a href={`mailto:${SOCIAL_LINKS.email}`}>Email</a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={RESUME_HREF} target="_blank" rel="noreferrer">Resume</a>
            </div>
          </div>
          <p className="wd-scroll-index" aria-hidden>06 — CONTACT</p>
        </section>
      </main>

      <div className="wd-hud">
        {workHover && !workSelected && (
          <div className="wd-float wd-float--quiet" role="status">
            <p className="wd-float__kicker">Project {workHover.code}</p>
            <p className="wd-float__title">{workHover.cardTitle}</p>
            {workHover.story && <p className="wd-float__stack">{workHover.story}</p>}
          </div>
        )}

        {workSelected && pipelineReady && (
          <div className="wd-float wd-float--project" role="status">
            <p className="wd-float__kicker">Project {workSelected.code}</p>
            <p className="wd-float__title">{workSelected.cardTitle}</p>
            {workSelected.story && <p className="wd-float__stack">{workSelected.story}</p>}
            {selectedProject?.summary && (
              <p className="wd-float__body">{selectedProject.summary}</p>
            )}
            {!!projectFlow.length && (
              <section className="wd-project-flow" aria-label="Project system flow">
                <div className="wd-project-flow__heading">
                  <p>{hasDocumentedFlow ? "Active data flow" : "System components"}</p>
                  <span>
                    {hasDocumentedFlow
                      ? "Stages in the documented data flow, left to right."
                      : "Technologies used in this project."}
                  </span>
                </div>
                <ol>
                  {projectFlow.map((stage, index) => (
                    <li key={stage}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{stage}</strong>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            <div className="wd-float__walkthrough" aria-label="Project walkthrough">
              {workSelected.problem && (
                <div className="wd-float__step">
                  <p>01 / THE CONSTRAINT</p>
                  <span>{workSelected.problem}</span>
                </div>
              )}
              {workSelected.purpose && (
                <div className="wd-float__step">
                  <p>02 / THE SYSTEM RESPONSE</p>
                  <span>{workSelected.purpose}</span>
                </div>
              )}
              {selectedProject?.outcomes?.[0] && (
                <div className="wd-float__step">
                  <p>03 / WHAT CHANGED</p>
                  <span>{selectedProject.outcomes[0]}</span>
                </div>
              )}
            </div>
            <button type="button" className="wd-float__action" onClick={closeProject}>
              Exit system
            </button>
            {workSelected?.slug ? (
              <Link href={`/projects/${workSelected.slug}`} className="wd-float__action">
                Open case study ↗
              </Link>
            ) : null}
          </div>
        )}

        {layer === "ai" && aiMode && (
          <AiModeSurface
            modeId={aiMode}
            onClose={() => {
              setAiThinking(false);
              setAiMode(null);
            }}
            onModeChange={setAiMode}
            onBusyChange={setAiThinking}
          />
        )}

      </div>
    </div>
  );
}



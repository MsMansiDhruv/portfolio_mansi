"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "@/styles/mansi-world-of-data.css";
import {
  WORLD_HERO,
  WORLD_NAV,
  STORY,
  LAYER_CAM,
  TECH_META,
} from "@/lib/data/data-world";
import {
  ABOUT_ME,
  CAREER_TIMELINE,
  getAboutHeroLine,
  CURRENT_ROLE,
} from "@/lib/data/career";
import { SOCIAL_LINKS } from "@/lib/data/social-links";
import WorldCanvas from "./WorldCanvas";
import SystemCursor from "./SystemCursor";
import { HOME_CAM, approachNode } from "./CameraRig";

const THEME_KEY = "mansi-world-theme";
const RESUME_HREF = "/resume.pdf";

/**
 * Living Data Universe — one continuous production machine.
 */
export default function WorldApp() {
  const [theme, setTheme] = useState("night");
  const [themePulse, setThemePulse] = useState(false);
  const [ready, setReady] = useState(false);
  const [story, setStory] = useState("silence");
  const [layer, setLayer] = useState("world");
  const [navOpen, setNavOpen] = useState(false);
  const [techHover, setTechHover] = useState(null);
  const [focused, setFocused] = useState(null);
  const [workHover, setWorkHover] = useState(null);
  const [workSelected, setWorkSelected] = useState(null);
  const [pipelineReady, setPipelineReady] = useState(false);
  const [aiFocus, setAiFocus] = useState(null);
  const [aiHover, setAiHover] = useState(null);
  const [expHover, setExpHover] = useState(null);
  const [aboutHover, setAboutHover] = useState(null);
  const [meta, setMeta] = useState("SYSTEM / ONLINE");
  const [isMobile, setIsMobile] = useState(false);
  const [uiReady, setUiReady] = useState(false);
  const [heroSettled, setHeroSettled] = useState(false);

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
    x: 0,
    y: 0,
    z: 0,
    active: false,
  });
  const stateRef = useRef({
    globeEnergy: 0.08,
    globeRotY: 0,
    globeRotX: 0,
    breath: 0,
    reveal: 0,
    colourWake: 0,
    wake: 0,
    infraWake: null,
    story: "silence",
    layer: "world",
  });
  const startedAt = useRef(null);

  useEffect(() => {
    setUiReady(true);
    try {
      const s = localStorage.getItem(THEME_KEY);
      if (s === "day" || s === "night") setTheme(s);
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setReady(true), 320);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!uiReady) return undefined;
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, [uiReady]);

  useEffect(() => {
    document.documentElement.classList.add("wd-active");
    return () => document.documentElement.classList.remove("wd-active");
  }, []);

  useEffect(() => {
    const onWheel = (e) => {
      if (!e.target?.closest?.(".wd-stage, canvas")) return;
      e.preventDefault();
      const cur = cameraTargetRef.current;
      if (!cur) return;
      cur.zoomDelta = (cur.zoomDelta || 0) + e.deltaY;
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    startedAt.current = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = (performance.now() - startedAt.current) / 1000;
      let next = "silence";
      if (elapsed >= STORY.explore.at) next = "explore";
      else if (elapsed >= STORY.identity.at) next = "identity";
      else if (elapsed >= STORY.reveal.at) next = "reveal";
      else if (elapsed >= STORY.connection.at) next = "connection";
      else if (elapsed >= STORY.emergence.at) next = "emergence";
      setStory((prev) => (prev === next ? prev : next));
      stateRef.current.story = next;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const e = stateRef.current.globeEnergy || 0;
      const y = stateRef.current.globeRotY || 0;
      setMeta(
        `E ${e.toFixed(2)} · θ ${(((y % (Math.PI * 2)) / (Math.PI * 2)) * 360).toFixed(1)}°`
      );
    }, 160);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    stateRef.current.story = story;
  }, [story]);

  useEffect(() => {
    stateRef.current.layer = layer;
  }, [layer]);

  // MANSI hero impact → settles so the world becomes the hero again
  useEffect(() => {
    if (story !== "explore" || layer !== "world") return undefined;
    const t = window.setTimeout(() => setHeroSettled(true), 4200);
    return () => clearTimeout(t);
  }, [story, layer]);

  useEffect(() => {
    if (layer !== "world") setHeroSettled(false);
  }, [layer]);

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
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const onTechSelect = useCallback(
    (node, pos) => {
      if (story !== "explore" && story !== "identity") return;
      if (layer !== "world") return;
      setFocused(node);
      setCam(approachNode(pos), "enter");
    },
    [setCam, story, layer]
  );

  const onWorkSelect = useCallback(
    (cluster, pos) => {
      setWorkSelected(cluster);
      setPipelineReady(false);
      setCam(approachNode(pos, 2.2), "enter");
      window.setTimeout(() => {
        setCam(LAYER_CAM.pipeline, "enter");
      }, 700);
    },
    [setCam]
  );

  const onHome = useCallback(() => {
    setFocused(null);
    setTechHover(null);
    setWorkSelected(null);
    setWorkHover(null);
    setPipelineReady(false);
    setAiFocus(null);
    setLayer("world");
    setNavOpen(false);
    setCam(LAYER_CAM.world, "stream");
  }, [setCam]);

  const goLayer = useCallback(
    (id) => {
      setFocused(null);
      setTechHover(null);
      setWorkSelected(null);
      setWorkHover(null);
      setPipelineReady(false);
      setAiFocus(null);
      setExpHover(null);
      setAboutHover(null);
      setLayer(id);
      setNavOpen(false);
      const cam = LAYER_CAM[id] || LAYER_CAM.world;
      setCam(cam, id === "world" ? "stream" : "enter");
    },
    [setCam]
  );

  const closeProject = useCallback(() => {
    setWorkSelected(null);
    setPipelineReady(false);
    setCam(LAYER_CAM.work, "stream");
  }, [setCam]);

  const explored = story === "explore" || story === "identity";
  const showName = story === "identity" || story === "explore";
  const showRole = story === "identity" || story === "explore";
  const showLine = story === "explore";
  const showHint = explored && layer === "world" && !focused;

  const cursorMode =
    workSelected || focused || techHover || workHover || aiHover || aboutHover
      ? "target"
      : "data";

  const statusLine = (() => {
    if (workSelected)
      return pipelineReady
        ? `INSIDE · PROJECT ${workSelected.code}`
        : `ENTERING · PROJECT ${workSelected.code}`;
    if (focused) return `NODE · ${focused.label}`;
    if (techHover) return `LINK · ${techHover.label}`;
    if (workHover) return `CLUSTER · ${workHover.cardTitle}`;
    if (aiHover) return `CONCEPT · ${aiHover}`;
    if (aiFocus) return `FOCUS · ${aiFocus}`;
    if (expHover) return `${expHover.year} · ${expHover.title}`;
    if (aboutHover) return aboutHover.label;
    if (!explored) return STORY[story]?.label || "";
    if (layer === "work") return "SELECT A SYSTEM · ENTER THE PIPELINE";
    if (layer === "ai") return "CLICK A CONCEPT · OPEN A MODE";
    if (layer === "experience") return "TRACE THE SYSTEM EVOLUTION";
    if (layer === "about") return "DISCOVER THE PERSON";
    if (layer === "contact") return "ONE SIGNAL";
    return "HOVER NODE · CLICK TO ENTER";
  })();

  return (
    <div
      className={`wd-root${ready ? " is-ready" : ""}${themePulse ? " is-theme-shift" : ""}`}
      data-theme={theme}
      data-story={story}
      data-layer={layer}
      data-hero={heroSettled && layer === "world" ? "settled" : "impact"}
      suppressHydrationWarning
    >
      <div className={`wd-loader${ready ? " is-done" : ""}`} aria-hidden>
        <span className="wd-loader__mark">Entering the data system</span>
      </div>

      {uiReady && !isMobile && (
        <SystemCursor mode={cursorMode} enabled={ready} />
      )}

      <header className="wd-bar">
        <div className="wd-bar__left">
          <button type="button" className="wd-brand" onClick={onHome}>
            Mansi
          </button>
          <button
            type="button"
            className="wd-nav-toggle"
            aria-expanded={navOpen}
            aria-label="Open navigation"
            onClick={() => setNavOpen((v) => !v)}
          >
            Menu
          </button>
          <nav
            className={`wd-nav${navOpen ? " is-open" : ""}`}
            aria-label="System"
          >
            {WORLD_NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`wd-nav__item${layer === item.id ? " is-active" : ""}`}
                onClick={() => explored && goLayer(item.id)}
                disabled={!explored}
                aria-current={layer === item.id ? "page" : undefined}
              >
                {layer === item.id && (
                  <span className="wd-nav__signal" aria-hidden />
                )}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
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
      </header>

      <WorldCanvas
        themeId={theme}
        layer={layer}
        cameraTargetRef={cameraTargetRef}
        cursorRef={cursorRef}
        stateRef={stateRef}
        techHover={techHover?.id || null}
        onTechHover={(n) => {
          if (!explored || layer !== "world") return;
          setTechHover(n);
        }}
        onTechSelect={onTechSelect}
        workHover={workHover?.slug || null}
        workSelected={workSelected}
        onWorkHover={(c) => {
          if (layer !== "work" || workSelected) return;
          setWorkHover(c);
        }}
        onWorkSelect={onWorkSelect}
        onPipelineReady={() => setPipelineReady(true)}
        aiFocusWord={aiFocus}
        onWordHover={setAiHover}
        onWordSelect={setAiFocus}
        onModeSelect={(chamber) => {
          if (chamber?.href) window.location.href = chamber.href;
        }}
        onExperienceHover={setExpHover}
        onExperienceSelect={(stage, pos) => {
          if (pos) setCam(approachNode([pos[0] + 1.55, pos[1] + 0.05, pos[2]]), "enter");
          setExpHover(stage);
        }}
        onAboutHover={setAboutHover}
      />

      <div className="wd-hud">
        <div className="wd-meta wd-meta--tl">
          {layer === "world"
            ? "DATA ORBIT"
            : `SYSTEM / ${layer.replace("-", " ").toUpperCase()}`}
        </div>
        <div className="wd-meta wd-meta--tr">
          {theme === "day" ? "DAY · CLARITY" : "NIGHT · DEEP COMPUTE"}
        </div>
        <div className="wd-coords">{meta}</div>
        <div className="wd-meta wd-meta--br">{statusLine}</div>

        {layer === "world" && !focused && (
          <div
            className={`wd-hero${heroSettled ? " is-settled" : ""}${!showName ? " is-waiting" : ""}`}
          >
            <p className="wd-hero__rail">SYSTEM 00 · IDENTITY</p>
            <h1 className={showName ? "is-in" : ""}>{WORLD_HERO.name}</h1>
            <p className={`wd-hero__role${showRole ? " is-in" : ""}`}>
              {WORLD_HERO.role}
            </p>
            <p className={`wd-hero__sub${showRole ? " is-in" : ""}`}>
              {WORLD_HERO.roleLine}
            </p>
            <p className={`wd-hero__line${showLine ? " is-in" : ""}`}>
              {WORLD_HERO.line}
            </p>
          </div>
        )}

        {layer === "world" && focused && (
          <aside className="wd-tech-rail" aria-label="Technology detail">
            <p className="wd-tech-rail__code">NODE · {focused.label}</p>
            <h2>{focused.label}</h2>
            <p className="wd-tech-rail__role">
              {TECH_META[focused.id]?.role || focused.kind?.toUpperCase?.() || "SYSTEM"}
            </p>
            <p className="wd-tech-rail__blurb">
              {TECH_META[focused.id]?.blurb ||
                "Connected in the live technology constellation."}
            </p>
            <p className="wd-tech-rail__orbit">
              ORBIT · {(focused.orbit || "").toUpperCase()}
            </p>
            <button
              type="button"
              className="wd-tech-rail__close"
              onClick={onHome}
            >
              Release node
            </button>
          </aside>
        )}

        {layer === "work" && !workSelected && (
          <div className="wd-hero wd-hero--layer wd-hero--compact">
            <p className="wd-hero__rail">SYSTEM 01 · WORK</p>
            <h1 className="is-in">WORK</h1>
            <p className="wd-hero__sub is-in">Four system exhibits</p>
            <p className="wd-hero__line is-in">
              Select a cluster. Enter the architecture.
            </p>
          </div>
        )}

        {workSelected && (
          <aside
            className={`wd-exhibit${pipelineReady ? " is-ready" : ""}`}
            aria-label="Project exhibit"
          >
            <p className="wd-exhibit__code">PROJECT {workSelected.code}</p>
            <h2>{workSelected.cardTitle}</h2>
            <p className="wd-exhibit__story">{workSelected.story}</p>
            {pipelineReady && workSelected.problem && (
              <div className="wd-exhibit__block">
                <span>PROBLEM</span>
                <p>{workSelected.problem}</p>
              </div>
            )}
            {pipelineReady && workSelected.purpose && (
              <div className="wd-exhibit__block">
                <span>APPROACH</span>
                <p>{workSelected.purpose}</p>
              </div>
            )}
            {pipelineReady && workSelected.tech?.length > 0 && (
              <div className="wd-exhibit__block">
                <span>TECHNOLOGY</span>
                <p className="wd-exhibit__tech">
                  {workSelected.tech.slice(0, 8).join(" · ")}
                </p>
              </div>
            )}
            {pipelineReady && workSelected.outcomes?.[0] && (
              <div className="wd-exhibit__block">
                <span>OUTCOME</span>
                <p>{workSelected.outcomes[0]}</p>
              </div>
            )}
            <button
              type="button"
              className="wd-exhibit__close"
              onClick={closeProject}
            >
              Return through the pathway
            </button>
          </aside>
        )}

        {layer === "ai" && (
          <div className="wd-hero wd-hero--layer wd-hero--compact">
            <p className="wd-hero__rail">SYSTEM 02 · AI LAB</p>
            <h1 className="is-in">AI LAB</h1>
            <p className="wd-hero__sub is-in">Semantic field</p>
            <p className="wd-hero__line is-in">
              Click a concept. Open a mode from the field.
            </p>
          </div>
        )}

        {layer === "experience" && (
          <div className="wd-panel">
            <p className="wd-hero__rail">SYSTEM 03 · EXPERIENCE</p>
            <h2>System evolution</h2>
            <ul className="wd-timeline">
              {[...CAREER_TIMELINE].reverse().map((row) => (
                <li
                  key={row.id}
                  className={expHover?.id === row.id ? "is-hot" : ""}
                >
                  <span>{row.year}</span>
                  <strong>{row.title}</strong>
                  <em>{row.focus}</em>
                </li>
              ))}
            </ul>
          </div>
        )}

        {layer === "about" && (
          <div className="wd-panel wd-panel--about">
            <p className="wd-hero__rail">SYSTEM 04 · ABOUT</p>
            <h2>Mansi</h2>
            <p className="wd-panel__lead">{getAboutHeroLine()}</p>
            {ABOUT_ME.map((p) => (
              <p key={p.slice(0, 24)} className="wd-panel__body">
                {p}
              </p>
            ))}
            <p className="wd-panel__meta">{CURRENT_ROLE}</p>
            {aboutHover && (
              <p className="wd-panel__insight">
                <span>{aboutHover.label}</span>
                {aboutHover.insight}
              </p>
            )}
          </div>
        )}

        {layer === "contact" && (
          <div className="wd-panel wd-panel--contact">
            <p className="wd-hero__rail">SYSTEM 05 · CONTACT</p>
            <h2>Let&apos;s build what&apos;s next.</h2>
            <p className="wd-panel__lead">
              One clean signal. The world stays alive behind it.
            </p>
            <div className="wd-contact-links">
              <a href={`mailto:${SOCIAL_LINKS.email}`}>Email</a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={RESUME_HREF} target="_blank" rel="noreferrer">
                Resume
              </a>
            </div>
          </div>
        )}

        <p className={`wd-hint${showHint ? " is-in" : ""}`}>
          Explore the system
        </p>
      </div>
    </div>
  );
}

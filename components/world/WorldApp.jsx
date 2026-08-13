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
  getAboutHeroLine,
  CURRENT_ROLE,
} from "@/lib/data/career";
import { SOCIAL_LINKS } from "@/lib/data/social-links";
import { EXPERIENCE_CHAMBERS } from "@/lib/data/mansi-experience";
import { SEMANTIC_WORDS } from "./SemanticField";
import WorldCanvas from "./WorldCanvas";
import SystemCursor from "./SystemCursor";
import AiModeSurface from "./AiModeSurface";
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
  const [routeFound, setRouteFound] = useState(false);
  const [exhibitOpen, setExhibitOpen] = useState(false);
  const [aiMode, setAiMode] = useState(null);

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
    // Show shell immediately; 3D densifies progressively
    const t = setTimeout(() => setReady(true), 90);
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
      const secret = stateRef.current.secretWake || 0;
      if (secret > 0.72 && layer === "world" && !routeFound) {
        setRouteFound(true);
      }
      setMeta(
        secret > 0.45
          ? `ROUTE · ${(secret * 100).toFixed(0)}%`
          : `E ${e.toFixed(2)} · θ ${(((y % (Math.PI * 2)) / (Math.PI * 2)) * 360).toFixed(1)}°`
      );
    }, 160);
    return () => clearInterval(id);
  }, [layer, routeFound]);

  useEffect(() => {
    stateRef.current.story = story;
  }, [story]);

  useEffect(() => {
    stateRef.current.layer = layer;
  }, [layer]);

  // MANSI hero impact → settles into nav identity
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
      setExhibitOpen(false);
      setCam(approachNode(pos, 2.2), "enter");
      window.setTimeout(() => {
        setCam(LAYER_CAM.pipeline, "enter");
      }, 700);
      window.setTimeout(() => setExhibitOpen(true), 1400);
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
    setAiMode(null);
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
      setAiMode(null);
      setExpHover(null);
      setAboutHover(null);
      setExhibitOpen(false);
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
    setExhibitOpen(false);
    setCam(LAYER_CAM.work, "stream");
  }, [setCam]);

  const explored = story === "explore" || story === "identity";
  const showName = story === "identity" || story === "explore";
  const showRole = story === "identity" || story === "explore";
  const showLine = story === "explore";
  const cursorMode =
    workSelected || focused || techHover || workHover || aiHover || aboutHover || aiMode
      ? "target"
      : "data";

  // Quiet state readout — no instructional paste-ons
  const statusLine = (() => {
    if (aiMode) return `MODE · ${aiMode.toUpperCase()}`;
    if (workSelected)
      return pipelineReady
        ? `INSIDE · ${workSelected.code}`
        : `ENTERING · ${workSelected.code}`;
    if (focused) return focused.label;
    if (techHover) return techHover.label;
    if (workHover) return workHover.cardTitle;
    if (aiHover) return String(aiHover).toUpperCase();
    if (aiFocus) return String(aiFocus).toUpperCase();
    if (expHover) return `${expHover.year}`;
    if (aboutHover) return aboutHover.label;
    if (!explored) return STORY[story]?.label || "";
    if (layer === "world" && routeFound) return "ROUTE";
    return layer.replace("-", " ").toUpperCase();
  })();

  const focusedWord = SEMANTIC_WORDS.find((w) => w.id === aiFocus);
  const modeFromConcept = focusedWord
    ? EXPERIENCE_CHAMBERS.find((c) => c.id === focusedWord.mode)
    : null;

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
                className={`wd-nav__item${layer === item.id ? " is-active" : ""}${
                  item.id === "work" && routeFound && layer === "world"
                    ? " is-route"
                    : ""
                }`}
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
        onModeSelect={() => {}}
        onExperienceHover={setExpHover}
        onExperienceSelect={(stage, pos) => {
          if (pos) setCam(approachNode([pos[0] + 1.2, pos[1] + 0.02, pos[2]]), "enter");
          setExpHover(stage);
        }}
        onAboutHover={setAboutHover}
      />

      <div className="wd-hud">
        <div className="wd-meta wd-meta--tl">
          {layer === "world"
            ? "DATA CORE"
            : `SYSTEM / ${layer.replace("-", " ").toUpperCase()}`}
        </div>
        <div className="wd-meta wd-meta--tr">
          {theme === "day" ? "DAY · CLARITY" : "NIGHT · DEEP COMPUTE"}
        </div>
        <div className="wd-meta wd-meta--br">{statusLine}</div>

        {layer === "world" && !focused && (
          <div
            className={`wd-hero${heroSettled ? " is-settled" : ""}${!showName ? " is-waiting" : ""}${routeFound ? " is-route" : ""}`}
          >
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

        {workSelected && pipelineReady && !exhibitOpen && (
          <button
            type="button"
            className="wd-route-cue"
            onClick={() => setExhibitOpen(true)}
          >
            Notes
          </button>
        )}

        {workSelected && (
          <aside
            className={`wd-exhibit${exhibitOpen ? " is-open is-ready" : ""}`}
            aria-label="Project exhibit"
            aria-hidden={!exhibitOpen}
          >
            <p className="wd-exhibit__code">PROJECT {workSelected.code}</p>
            <h2>{workSelected.cardTitle}</h2>
            <p className="wd-exhibit__story">{workSelected.story}</p>
            {workSelected.problem && (
              <div className="wd-exhibit__block">
                <span>PROBLEM</span>
                <p>{workSelected.problem}</p>
              </div>
            )}
            {workSelected.purpose && (
              <div className="wd-exhibit__block">
                <span>APPROACH</span>
                <p>{workSelected.purpose}</p>
              </div>
            )}
            {workSelected.tech?.length > 0 && (
              <div className="wd-exhibit__block">
                <span>TECHNOLOGY</span>
                <p className="wd-exhibit__tech">
                  {workSelected.tech.slice(0, 8).join(" · ")}
                </p>
              </div>
            )}
            {workSelected.outcomes?.[0] && (
              <div className="wd-exhibit__block">
                <span>OUTCOME</span>
                <p>{workSelected.outcomes[0]}</p>
              </div>
            )}
            <button
              type="button"
              className="wd-exhibit__close"
              onClick={() => setExhibitOpen(false)}
            >
              Close notes
            </button>
            <button
              type="button"
              className="wd-exhibit__close"
              onClick={closeProject}
            >
              Return to systems
            </button>
          </aside>
        )}

        {layer === "ai" && !aiMode && modeFromConcept && (
          <aside className="wd-exhibit is-open is-ready" aria-label="AI mode">
            <p className="wd-exhibit__code">MODE</p>
            <h2>{modeFromConcept.label}</h2>
            <p className="wd-exhibit__story">{modeFromConcept.hint}</p>
            <button
              type="button"
              className="wd-exhibit__close"
              onClick={() => setAiMode(modeFromConcept.id)}
            >
              Open in field
            </button>
          </aside>
        )}

        {layer === "ai" && aiMode && (
          <AiModeSurface modeId={aiMode} onClose={() => setAiMode(null)} />
        )}

        {layer === "experience" && expHover && (
          <aside className="wd-exhibit is-open is-ready" aria-label="Experience">
            <p className="wd-exhibit__code">{expHover.year}</p>
            <h2>{expHover.title}</h2>
            <p className="wd-exhibit__story">{expHover.focus}</p>
          </aside>
        )}

        {layer === "about" && (
          <aside className="wd-exhibit is-open is-ready wd-exhibit--human">
            <p className="wd-exhibit__code">MANSI</p>
            <h2>{getAboutHeroLine()}</h2>
            {ABOUT_ME.slice(0, 2).map((p) => (
              <div key={p.slice(0, 24)} className="wd-exhibit__block">
                <p>{p}</p>
              </div>
            ))}
            <p className="wd-exhibit__story">{CURRENT_ROLE}</p>
            {aboutHover && (
              <div className="wd-exhibit__block">
                <span>{aboutHover.label}</span>
                <p>{aboutHover.insight}</p>
              </div>
            )}
          </aside>
        )}

        {layer === "contact" && (
          <aside className="wd-exhibit is-open is-ready">
            <p className="wd-exhibit__code">SIGNAL</p>
            <h2>Let&apos;s build what&apos;s next.</h2>
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
          </aside>
        )}
      </div>
    </div>
  );
}

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
 * One world. Contextual information only — never permanent side boxes.
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
  const [isMobile, setIsMobile] = useState(false);
  const [uiReady, setUiReady] = useState(false);
  const [heroSettled, setHeroSettled] = useState(false);
  const [routeFound, setRouteFound] = useState(false);
  const [floatOpen, setFloatOpen] = useState(false);
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
      setFloatOpen(false);
      setCam(approachNode(pos, 2.2), "enter");
      window.setTimeout(() => setCam(LAYER_CAM.pipeline, "enter"), 700);
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
    setFloatOpen(false);
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
      setFloatOpen(false);
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
    setFloatOpen(false);
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

  const focusedWord = SEMANTIC_WORDS.find((w) => w.id === aiFocus);
  const modeFromConcept = focusedWord
    ? EXPERIENCE_CHAMBERS.find((c) => c.id === focusedWord.mode)
    : null;

  const techMeta = focused ? TECH_META[focused.id] : null;

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
        <button type="button" className="wd-brand" onClick={onHome}>
          Mansi
        </button>
        <nav className={`wd-nav${navOpen ? " is-open" : ""}`} aria-label="System">
          {WORLD_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`wd-nav__item${layer === item.id ? " is-active" : ""}${
                item.id === "work" && routeFound && layer === "world" ? " is-route" : ""
              }`}
              onClick={() => explored && goLayer(item.id)}
              disabled={!explored}
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
        techHover={techHover?.id || focused?.id || null}
        focusedTechId={focused?.id || null}
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
        {layer === "world" && !focused && (
          <div
            className={`wd-hero${heroSettled ? " is-settled" : ""}${!showName ? " is-waiting" : ""}`}
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

        {/* Contextual floats — typography only, no cards */}
        {focused && techMeta && (
          <div className="wd-float" role="status">
            <p className="wd-float__kicker">{techMeta.role}</p>
            <p className="wd-float__title">{focused.label}</p>
            <p className="wd-float__body">{techMeta.blurb}</p>
            <button type="button" className="wd-float__action" onClick={onHome}>
              Release
            </button>
          </div>
        )}

        {workHover && !workSelected && (
          <div className="wd-float wd-float--quiet" role="status">
            <p className="wd-float__kicker">PROJECT {workHover.code}</p>
            <p className="wd-float__title">{workHover.cardTitle}</p>
          </div>
        )}

        {workSelected && pipelineReady && (
          <div className="wd-float" role="status">
            <p className="wd-float__kicker">PROJECT {workSelected.code}</p>
            <p className="wd-float__title">{workSelected.cardTitle}</p>
            {!floatOpen ? (
              <button
                type="button"
                className="wd-float__action"
                onClick={() => setFloatOpen(true)}
              >
                Details
              </button>
            ) : (
              <>
                {workSelected.problem && (
                  <p className="wd-float__body">{workSelected.problem}</p>
                )}
                {workSelected.purpose && (
                  <p className="wd-float__body">{workSelected.purpose}</p>
                )}
                <button
                  type="button"
                  className="wd-float__action"
                  onClick={() => setFloatOpen(false)}
                >
                  Hide
                </button>
              </>
            )}
            <button type="button" className="wd-float__action" onClick={closeProject}>
              Exit system
            </button>
          </div>
        )}

        {layer === "ai" && !aiMode && modeFromConcept && (
          <div className="wd-float" role="status">
            <p className="wd-float__kicker">MODE</p>
            <p className="wd-float__title">{modeFromConcept.label}</p>
            <p className="wd-float__body">{modeFromConcept.hint}</p>
            <button
              type="button"
              className="wd-float__action"
              onClick={() => setAiMode(modeFromConcept.id)}
            >
              Open
            </button>
          </div>
        )}

        {layer === "ai" && aiMode && (
          <AiModeSurface modeId={aiMode} onClose={() => setAiMode(null)} />
        )}

        {layer === "experience" && expHover && (
          <div className="wd-float" role="status">
            <p className="wd-float__kicker">{expHover.year}</p>
            <p className="wd-float__title">{expHover.title}</p>
            <p className="wd-float__body">{expHover.focus}</p>
          </div>
        )}

        {layer === "about" && (
          <div className="wd-float wd-float--human" role="status">
            <p className="wd-float__kicker">MANSI</p>
            <p className="wd-float__title">{getAboutHeroLine()}</p>
            <p className="wd-float__body">{ABOUT_ME[0]}</p>
            <p className="wd-float__body wd-float__quiet">{CURRENT_ROLE}</p>
            {aboutHover && (
              <p className="wd-float__body">
                <em>{aboutHover.label}</em> — {aboutHover.insight}
              </p>
            )}
          </div>
        )}

        {layer === "contact" && (
          <div className="wd-float" role="status">
            <p className="wd-float__kicker">SIGNAL</p>
            <p className="wd-float__title">Let&apos;s build what&apos;s next.</p>
            <div className="wd-float__links">
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
      </div>
    </div>
  );
}

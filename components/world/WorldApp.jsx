"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "@/styles/mansi-world-of-data.css";
import { WORLD_HERO, WORLD_NAV, STORY } from "@/lib/data/data-world";
import WorldCanvas from "./WorldCanvas";
import SystemCursor from "./SystemCursor";
import { HOME_CAM, approachNode } from "./CameraRig";

const THEME_KEY = "mansi-world-theme";

const WORK_CAM = {
  position: [0.2, 0.4, 9.2],
  lookAt: [2.2, 0.1, 0],
  fov: 36,
};

/**
 * Living Data World — one continuous machine.
 * WORLD → WORK (orbit unfolds). Other layers attach as system states.
 */
export default function WorldApp() {
  const [theme, setTheme] = useState("night");
  const [ready, setReady] = useState(false);
  const [story, setStory] = useState("silence");
  const [layer, setLayer] = useState("world");
  const [techHover, setTechHover] = useState(null);
  const [focused, setFocused] = useState(null);
  const [workHover, setWorkHover] = useState(null);
  const [workSelected, setWorkSelected] = useState(null);
  const [meta, setMeta] = useState("SYSTEM / ONLINE");

  const cameraTargetRef = useRef({
    position: [...HOME_CAM.position],
    lookAt: [...HOME_CAM.lookAt],
    fov: HOME_CAM.fov,
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
    try {
      const s = localStorage.getItem(THEME_KEY);
      if (s === "day" || s === "night") setTheme(s);
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setReady(true), 380);
    return () => clearTimeout(t);
  }, []);

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
      setCam(approachNode(pos, 2.8), "enter");
    },
    [setCam]
  );

  const onHome = useCallback(() => {
    setFocused(null);
    setTechHover(null);
    setWorkSelected(null);
    setWorkHover(null);
    setLayer("world");
    setCam(HOME_CAM, "stream");
  }, [setCam]);

  const goLayer = useCallback(
    (id) => {
      if (id !== "world" && id !== "work") {
        // Layers attach progressively — keep visitor in one machine
        return;
      }
      setFocused(null);
      setTechHover(null);
      setWorkSelected(null);
      setWorkHover(null);
      setLayer(id);
      if (id === "work") setCam(WORK_CAM, "enter");
      else setCam(HOME_CAM, "stream");
    },
    [setCam]
  );

  const closeProject = useCallback(() => {
    setWorkSelected(null);
    setCam(WORK_CAM, "stream");
  }, [setCam]);

  const explored = story === "explore" || story === "identity";
  const showName = story === "identity" || story === "explore";
  const showRole = story === "identity" || story === "explore";
  const showLine = story === "explore";
  const showHint = explored && layer === "world" && !focused;
  const cursorMode = workSelected || focused || techHover || workHover
    ? "target"
    : cursorRef.current?.active
      ? "data"
      : "idle";

  return (
    <div
      className={`wd-root${ready ? " is-ready" : ""}`}
      data-theme={theme}
      data-story={story}
      data-layer={layer}
      suppressHydrationWarning
    >
      <div className={`wd-loader${ready ? " is-done" : ""}`} aria-hidden>
        <span className="wd-loader__mark">Entering the data system</span>
      </div>

      <SystemCursor mode={cursorMode} enabled={ready} />

      <header className="wd-bar">
        <div className="wd-bar__left">
          <button type="button" className="wd-brand" onClick={onHome}>
            Mansi
          </button>
          <nav className="wd-nav" aria-label="System">
            {WORLD_NAV.map((item) => {
              const live = item.id === "world" || item.id === "work";
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`wd-nav__item${layer === item.id ? " is-active" : ""}${live ? "" : " is-soon"}`}
                  onClick={() => live && goLayer(item.id)}
                  disabled={!live || !explored}
                  aria-current={layer === item.id ? "page" : undefined}
                >
                  {layer === item.id && <span className="wd-nav__signal" aria-hidden />}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <button
          type="button"
          className="wd-theme"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "night" ? "day" : "night"} mode`}
        >
          <span className="wd-theme__pip" />
          <span suppressHydrationWarning>{theme === "night" ? "Night" : "Day"}</span>
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
        workSelected={workSelected?.slug || null}
        onWorkHover={(c) => {
          if (layer !== "work") return;
          setWorkHover(c);
        }}
        onWorkSelect={onWorkSelect}
      />

      <div className="wd-hud">
        <div className="wd-meta wd-meta--tl">
          {layer === "work" ? "SYSTEM / WORK" : "DATA ORBIT"}
        </div>
        <div className="wd-meta wd-meta--tr">
          {theme === "day" ? "DAY · MACHINE LIGHT" : "NIGHT · DEEP COMPUTE"}
        </div>
        <div className="wd-coords">{meta}</div>
        <div className="wd-meta wd-meta--br">
          {workSelected
            ? `PROJECT ${workSelected.code} · ${workSelected.story}`
            : focused
              ? `NODE · ${focused.label}`
              : techHover
                ? `LINK · ${techHover.label}`
                : workHover
                  ? `CLUSTER · ${workHover.cardTitle}`
                  : explored
                    ? layer === "work"
                      ? "SELECT A SYSTEM CLUSTER"
                      : "HOVER NODE · CLICK TO ENTER"
                    : STORY[story]?.label || ""}
        </div>

        {layer === "world" && (
          <div className={`wd-hero${focused ? " is-dim" : ""}`}>
            <p className="wd-hero__rail">SYSTEM 00 · IDENTITY</p>
            <h1 className={showName ? "is-in" : ""}>{WORLD_HERO.name}</h1>
            <p className={`wd-hero__role${showRole ? " is-in" : ""}`}>
              {WORLD_HERO.role}
              <span className="wd-hero__sep"> · </span>
              {WORLD_HERO.roleLine}
            </p>
            <p className={`wd-hero__line${showLine ? " is-in" : ""}`}>
              {WORLD_HERO.line}
            </p>
          </div>
        )}

        {layer === "work" && !workSelected && (
          <div className="wd-hero wd-hero--work">
            <p className="wd-hero__rail">SYSTEM 01 · WORK</p>
            <h1 className="is-in">WORK</h1>
            <p className="wd-hero__role is-in">Four system exhibits</p>
            <p className="wd-hero__line is-in">
              The orbit unfolds. Architecture becomes the hero.
            </p>
          </div>
        )}

        {workSelected && (
          <aside className="wd-exhibit" aria-label="Project exhibit">
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
            <button type="button" className="wd-exhibit__close" onClick={closeProject}>
              Return to orbit
            </button>
          </aside>
        )}

        <p className={`wd-hint${showHint ? " is-in" : ""}`}>
          Explore the system
        </p>
      </div>
    </div>
  );
}

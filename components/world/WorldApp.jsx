"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "@/styles/mansi-world-of-data.css";
import { WORLD_HERO, STORY } from "@/lib/data/data-world";
import WorldCanvas from "./WorldCanvas";
import { HOME_CAM, approachNode } from "./CameraRig";

const THEME_KEY = "mansi-world-theme";

/**
 * World of Data — operating system shell.
 * Homepage narrative: silence → emergence → connection → exploration.
 * Deeper layers (projects / AI Lab / experience) attach later — same world.
 */
export default function WorldApp() {
  const [theme, setTheme] = useState("night");
  const [ready, setReady] = useState(false);
  const [story, setStory] = useState("silence");
  const [techHover, setTechHover] = useState(null);
  const [focused, setFocused] = useState(null);
  const [meta, setMeta] = useState("INITIALISING");

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
  });
  const startedAt = useRef(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(THEME_KEY);
      if (s === "day" || s === "night") setTheme(s);
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setReady(true), 420);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("wd-active");
    return () => document.documentElement.classList.remove("wd-active");
  }, []);

  // Wheel zoom — move camera toward / away from the world
  useEffect(() => {
    const onWheel = (e) => {
      if (!e.target?.closest?.(".wd-stage, canvas")) return;
      e.preventDefault();
      const cur = cameraTargetRef.current;
      if (!cur) return;
      cur.zoomDelta = (cur.zoomDelta || 0) + e.deltaY;
      // If focused on a node, scrolling out far enough returns home feel
      if (e.deltaY > 40 && cur.mode === "enter") {
        /* keep focus; zoom still works via CameraRig */
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // Story clock
  useEffect(() => {
    if (!ready) return undefined;
    startedAt.current = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = (performance.now() - startedAt.current) / 1000;
      let next = "silence";
      if (elapsed >= STORY.explore.at) next = "explore";
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
    }, 140);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    stateRef.current.story = story;
  }, [story]);

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
          Math.max(fromPos[1], cam.position[1]) + 0.25,
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
      if (story !== "explore") return;
      setFocused(node);
      setCam(approachNode(pos), "enter");
    },
    [setCam, story]
  );

  const onHome = useCallback(() => {
    setFocused(null);
    setTechHover(null);
    setCam(HOME_CAM, "stream");
  }, [setCam]);

  const showName = story !== "silence";
  const showRole = story === "emergence" || story === "connection" || story === "explore";
  const showLine = story === "connection" || story === "explore";
  const showHint = story === "explore" && !focused;

  return (
    <div
      className={`wd-root${ready ? " is-ready" : ""}`}
      data-theme={theme}
      data-story={story}
      suppressHydrationWarning
    >
      <div className={`wd-loader${ready ? " is-done" : ""}`} aria-hidden>
        <span className="wd-loader__mark">Entering computational space</span>
      </div>

      <header className="wd-bar">
        <button type="button" className="wd-brand" onClick={onHome}>
          Mansi
        </button>
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
        cameraTargetRef={cameraTargetRef}
        cursorRef={cursorRef}
        stateRef={stateRef}
        techHover={techHover?.id || null}
        onTechHover={(n) => {
          if (story !== "explore") return;
          setTechHover(n);
        }}
        onTechSelect={onTechSelect}
      />

      <div className="wd-hud">
        <div className="wd-meta wd-meta--tl">WORLD OF DATA</div>
        <div className="wd-meta wd-meta--tr">
          {theme === "day" ? "DAY · CLARITY" : "NIGHT · DEEP COMPUTE"}
        </div>
        <div className="wd-coords">{meta}</div>
        <div className="wd-meta wd-meta--br">
          {focused
            ? `NODE · ${focused.label}`
            : techHover
              ? `LINK · ${techHover.label} · ${techHover.orbit?.toUpperCase?.() || ""}`
              : story === "explore"
                ? "HOVER NODE · CLICK TO APPROACH"
                : STORY[story]?.label || ""}
        </div>

        <div className={`wd-hero${focused ? " is-dim" : ""}`}>
          <h1 className={showName ? "is-in" : ""}>{WORLD_HERO.name}</h1>
          <p className={`wd-hero__role${showRole ? " is-in" : ""}`}>
            {WORLD_HERO.role}
          </p>
          <p className={`wd-hero__line${showLine ? " is-in" : ""}`}>
            {WORLD_HERO.line}
          </p>
        </div>

        <p className={`wd-hint${showHint ? " is-in" : ""}`}>
          Explore the system · Colour wakes on contact
        </p>
      </div>
    </div>
  );
}

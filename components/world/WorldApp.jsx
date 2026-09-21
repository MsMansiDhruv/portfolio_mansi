"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import dynamic from "next/dynamic";
import "@/styles/mansi-world-of-data.css";
import {
  LAYER_CAM,
  HOME_CAM,
  getWorkClusters,
  approachNode,
} from "@/lib/data/data-world";
import { getProjectMeta } from "@/lib/data/project-meta";
import { useWorldTheme } from "@/lib/use-world-theme";
import { useWorldViewport } from "@/lib/use-world-viewport";
import { useCursorField } from "@/lib/use-cursor-field";
import WelcomeGate from "./WelcomeGate";
import WorldPageNav from "./WorldPageNav";
import SiteFooter from "./SiteFooter";
import { bindStackMotion } from "./bindStackMotion";
import PanelCard from "./PanelCard";

const ComputeWeatherMap = dynamic(() => import("./ComputeWeatherMap"), {
  ssr: false,
  loading: () => <div className="wd-compute wd-compute--loading" aria-hidden />,
});

const SelectedWork = dynamic(() => import("./SelectedSystems"), { ssr: false });
const AskMansi = dynamic(() => import("./AskMansi"), { ssr: false });
const AboutMe = dynamic(() => import("./AboutMe"), { ssr: false });
const FieldSpirals = dynamic(() => import("./FieldSpirals"), { ssr: false });
const SystemCursor = dynamic(() => import("./SystemCursor"), { ssr: false });
const AiModeSurface = dynamic(() => import("./AiModeSurface"), { ssr: false });
const ContactRouteBoard = dynamic(
  () => import("./IconBoards").then((m) => ({ default: m.ContactRouteBoard })),
  { ssr: false }
);

/**
 * One world. Contextual information only - never permanent side boxes.
 */
export default function WorldApp({ skipWelcome = false }) {
  const [theme] = useWorldTheme();
  useWorldViewport();
  const [story, setStory] = useState("silence");
  const [layer, setLayer] = useState("world");
  const [aiMode, setAiMode] = useState(null);
  const [techHover, setTechHover] = useState(null);
  const [workHover, setWorkHover] = useState(null);
  const [workSelected, setWorkSelected] = useState(null);
  const [pipelineReady, setPipelineReady] = useState(false);
  const [heroSettled, setHeroSettled] = useState(false);
  const [routeFound, setRouteFound] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(!skipWelcome);
  const [welcomeLoading, setWelcomeLoading] = useState(false);
  const [welcomeMounted, setWelcomeMounted] = useState(!skipWelcome);
  const storyRef = useRef(null);
  const lenis = useLenis();
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
  useCursorField(cursorRef);
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
    stateRef.current.assemble = 1;
  }, []);

  useEffect(() => {
    stateRef.current.aiConsoleOpen = Boolean(aiMode);
    if (!aiMode) stateRef.current.aiThinking = false;
    document.documentElement.classList.toggle("wd-ai-lock", Boolean(aiMode));
    return () => document.documentElement.classList.remove("wd-ai-lock");
  }, [aiMode]);

  useEffect(() => {
    document.documentElement.classList.add("wd-active");
    if (window.location.hash) {
      setWelcomeOpen(false);
      setWelcomeMounted(false);
    }
    return () => document.documentElement.classList.remove("wd-active");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("wd-welcome-lock", welcomeOpen);
    if (welcomeOpen) lenis?.stop();
    else lenis?.start();
    return () => document.documentElement.classList.remove("wd-welcome-lock");
  }, [welcomeOpen, lenis]);

  useEffect(() => {
    if (welcomeOpen) return undefined;
    const jumpHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const target = document.getElementById(hash);
      if (!target) return;
      if (lenis) {
        lenis.start();
        lenis.scrollTo(target, { offset: -8, lerp: 0.12 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    const timers = [80, 240, 560, 1000].map((ms) => window.setTimeout(jumpHash, ms));
    window.addEventListener("hashchange", jumpHash);
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("hashchange", jumpHash);
    };
  }, [welcomeOpen, lenis]);

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
    const offLenis = lenis ? lenis.on("scroll", onScroll) : null;
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (typeof offLenis === "function") offLenis();
      else lenis?.off?.("scroll", onScroll);
    };
  }, [lenis]);

  useEffect(() => {
    setStory("explore");
    stateRef.current.story = "explore";
    startedAt.current = performance.now();
  }, []);

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
      token: (from.token || 0) + 1,
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

  const closeProject = useCallback(() => {
    setWorkSelected(null);
    setPipelineReady(false);
    setCam(LAYER_CAM.work, "stream");
  }, [setCam]);

  const enterWelcome = useCallback(() => {
    if (welcomeLoading || !welcomeOpen) return;
    setWelcomeLoading(true);
    window.setTimeout(() => {
      setWelcomeOpen(false);
      setWelcomeLoading(false);
    }, 2100);
    window.setTimeout(() => setWelcomeMounted(false), 2800);
  }, [welcomeLoading, welcomeOpen]);

  const onTechSelect = useCallback(
    (node) => {
      if (story !== "explore" && story !== "identity") return;
      if (layer !== "world") return;
      void node;
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

  const closeAi = useCallback(() => setAiMode(null), []);

  useEffect(() => {
    const root = storyRef.current;
    if (!root) return undefined;
    const nodes = [...root.querySelectorAll("[data-rise]")];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        });
      },
      { threshold: 0, rootMargin: "80px 0px 80px 0px" }
    );
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const root = storyRef.current;
    if (!root || welcomeOpen) return undefined;
    const applyLayer = (id) => {
      setLayer((previous) => {
        if (previous === id) return previous;
        setTechHover(null);
        setWorkSelected(null);
        setWorkHover(null);
        setPipelineReady(false);
        setCam(LAYER_CAM[id] || LAYER_CAM.world, "stream");
        return id;
      });
    };

    let disposed = false;
    let ctx;
    const unbindLenis = [];

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([gsapMod, stMod]) => {
      if (disposed) return;
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      gsap.ticker.lagSmoothing(0);
      ctx = gsap.context(() => {
        if (lenis) {
          const onScroll = () => ScrollTrigger.update();
          lenis.on("scroll", onScroll);
          unbindLenis.push(() => lenis.off("scroll", onScroll));
        }
        bindStackMotion(gsap, ScrollTrigger, root, applyLayer);
        ScrollTrigger.refresh();
      }, root);
    });

    return () => {
      disposed = true;
      unbindLenis.forEach((fn) => fn());
      ctx?.revert();
    };
  }, [lenis, setCam, welcomeOpen]);

  const explored = story === "explore" || story === "identity";
  return (
    <div
      className={`wd-root is-ready${workSelected ? " wd-project-open" : ""}${aiMode ? " wd-ai-open" : ""}`}
      data-theme={theme}
      data-story={story}
      data-layer={layer}
      data-hero={heroSettled && layer === "world" ? "settled" : "impact"}
      data-welcome={welcomeOpen ? "on" : "off"}
      suppressHydrationWarning
    >
      {welcomeMounted ? (
        <WelcomeGate open={welcomeOpen} loading={welcomeLoading} onEnter={enterWelcome} />
      ) : null}
      <FieldSpirals revealAfter="#world-work" />
      <SystemCursor />
      <WorldPageNav active={layer === "ai" ? "ai" : undefined} />

      <main className="wd-scroll-story wd-scroll-story--stack" ref={storyRef}>
        <section id="world-world" className="wd-scroll-section wd-scroll-section--hero" data-world-layer="world">
          <ComputeWeatherMap playStats={!welcomeOpen} />
        </section>
        <section id="world-work" className="wd-scroll-section wd-scroll-section--selected wd-panel" data-world-layer="work">
          <PanelCard>
            <SelectedWork />
          </PanelCard>
        </section>
        <section id="ask" className="wd-scroll-section wd-scroll-section--ask wd-panel" data-world-layer="ai">
          <PanelCard>
            <AskMansi />
          </PanelCard>
        </section>
        <section id="world-about" className="wd-scroll-section wd-scroll-section--about wd-scroll-section--voices wd-panel" data-world-layer="about">
          <PanelCard>
            <AboutMe />
          </PanelCard>
        </section>
        <section id="world-contact" className="wd-scroll-section wd-scroll-section--contact wd-panel" data-world-layer="contact">
          <PanelCard>
            <ContactRouteBoard />
          </PanelCard>
        </section>
      </main>
      <SiteFooter />

      <div className="wd-hud">
        {aiMode ? (
          <AiModeSurface
            modeId={aiMode}
            onClose={closeAi}
            onModeChange={setAiMode}
            onBusyChange={(busy) => {
              stateRef.current.aiThinking = Boolean(busy);
            }}
          />
        ) : null}
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
      </div>
    </div>
  );
}



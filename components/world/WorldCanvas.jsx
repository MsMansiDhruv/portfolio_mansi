"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { THEME } from "@/lib/data/data-world";
import DataGlobe from "./DataGlobe";
import TechConstellation from "./TechConstellation";
import ProjectOrbit from "./ProjectOrbit";
import CursorBridge from "./CursorBridge";
import CameraRig from "./CameraRig";

function Atmosphere({ themeId }) {
  const t = THEME[themeId] || THEME.night;
  return (
    <>
      <color attach="background" args={[t.bg]} />
      <fog attach="fog" args={[t.fog, t.fogNear, t.fogFar]} />
      <ambientLight intensity={t.ambient} />
      <hemisphereLight
        intensity={themeId === "day" ? 0.42 : 0.28}
        color={themeId === "day" ? "#f4efe6" : "#9eb0c4"}
        groundColor={themeId === "day" ? "#c8c0b2" : "#06080c"}
      />
      <directionalLight
        position={themeId === "day" ? [5, 8, 4] : [3, 5, 6]}
        intensity={t.key}
        color={themeId === "day" ? "#fff8ee" : "#dfe8f2"}
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={themeId === "day" ? 0.15 : 0.35}
        distance={8}
        color={t.accent}
      />
    </>
  );
}

export default function WorldCanvas({
  themeId,
  cameraTargetRef,
  cursorRef,
  stateRef,
  projects,
  view,
  techHover,
  projectHover,
  activeSlug,
  onTechHover,
  onProjectHover,
  onProjectSelect,
}) {
  const [mounted, setMounted] = useState(false);
  const t = THEME[themeId] || THEME.night;
  const reduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="wd-stage" aria-hidden />;

  const showTech = view === "home" || view === "ai-lab" || view === "work";
  const showProjects = view === "work" || view === "project";

  return (
    <div className="wd-stage">
      <Canvas
        dpr={[1, 1.25]}
        camera={{ fov: 42, near: 0.1, far: 50, position: [0, 0.35, 7.2] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.02,
        }}
        shadows={false}
        onCreated={({ gl }) => {
          gl.setClearColor(t.bg);
          gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
        }}
      >
        <Atmosphere themeId={themeId} />
        <CameraRig cameraTargetRef={cameraTargetRef} />
        <CursorBridge cursorRef={cursorRef} />
        <Suspense fallback={null}>
          <DataGlobe
            themeId={themeId}
            cursorRef={cursorRef}
            stateRef={stateRef}
            reducedMotion={reduced}
          />
        </Suspense>
        <Suspense fallback={null}>
          <TechConstellation
            themeId={themeId}
            hoverId={techHover}
            onHover={onTechHover}
            stateRef={stateRef}
            visible={showTech && view !== "project"}
          />
        </Suspense>
        <Suspense fallback={null}>
          <ProjectOrbit
            projects={projects}
            themeId={themeId}
            hoverSlug={projectHover?.slug || null}
            activeSlug={activeSlug}
            visible={showProjects}
            onHover={onProjectHover}
            onSelect={onProjectSelect}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

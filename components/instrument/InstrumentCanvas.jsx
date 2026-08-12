"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { THEME } from "@/lib/data/instrument";
import DataLattice from "./DataLattice";
import CursorBridge from "./CursorBridge";
import CameraRig from "./CameraRig";
import ProjectNodes from "./ProjectNodes";

function Lights({ themeId }) {
  const t = THEME[themeId] || THEME.night;
  return (
    <>
      <color attach="background" args={[t.bg]} />
      <fog attach="fog" args={[t.fog, t.fogNear, t.fogFar]} />
      <ambientLight intensity={t.ambient} />
      <hemisphereLight
        intensity={themeId === "day" ? 0.4 : 0.28}
        color={themeId === "day" ? "#f4efe6" : "#9eb0c4"}
        groundColor={themeId === "day" ? "#c8c0b2" : "#0a0e14"}
      />
      <directionalLight
        position={themeId === "day" ? [4, 8, 6] : [3, 6, 5]}
        intensity={t.key}
        color={themeId === "day" ? "#fff8ee" : "#e8eef6"}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, -1]}>
        <planeGeometry args={[24, 28]} />
        <meshStandardMaterial
          color={themeId === "day" ? "#d8d0c4" : "#10161f"}
          metalness={0.4}
          roughness={0.7}
          transparent
          opacity={themeId === "day" ? 0.55 : 0.65}
        />
      </mesh>
      {/* Axis guide */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.54, -1]}>
        <planeGeometry args={[0.04, 18]} />
        <meshBasicMaterial
          color={t.steel}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

export default function InstrumentCanvas({
  themeId,
  cameraTargetRef,
  cursorRef,
  stateRef,
  projects,
  hoverSlug,
  activeSlug,
  view,
  onHoverProject,
  onSelectProject,
}) {
  const [mounted, setMounted] = useState(false);
  const t = THEME[themeId] || THEME.night;
  const reduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="mi-canvas" aria-hidden />;

  return (
    <div className="mi-canvas">
      <Canvas
        dpr={[1, 1.25]}
        camera={{ fov: 40, near: 0.1, far: 60, position: [0.15, 1.55, 7.2] }}
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
        <Lights themeId={themeId} />
        <CameraRig cameraTargetRef={cameraTargetRef} />
        <CursorBridge cursorRef={cursorRef} />
        <Suspense fallback={null}>
          <DataLattice
            themeId={themeId}
            cursorRef={cursorRef}
            stateRef={stateRef}
            reducedMotion={reduced}
          />
        </Suspense>
        <Suspense fallback={null}>
          <ProjectNodes
            projects={projects}
            themeId={themeId}
            hoverSlug={hoverSlug}
            activeSlug={activeSlug}
            visible={view === "work" || view === "project"}
            onHover={onHoverProject}
            onSelect={onSelectProject}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

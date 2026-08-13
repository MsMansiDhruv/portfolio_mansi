"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { THEME } from "@/lib/data/data-world";
import DataGlobe from "./DataGlobe";
import TechConstellation from "./TechConstellation";
import InfraLayer from "./InfraLayer";
import CursorBridge from "./CursorBridge";
import CameraRig, { HOME_CAM } from "./CameraRig";

function Atmosphere({ themeId }) {
  const t = THEME[themeId] || THEME.night;
  const day = themeId === "day";
  return (
    <>
      {!day && <fog attach="fog" args={[t.fog, t.fogNear, t.fogFar]} />}
      <ambientLight intensity={t.ambient} color={day ? "#ffffff" : "#7a9ab8"} />
      <hemisphereLight
        intensity={day ? 0.5 : 0.36}
        color={day ? "#f8f9fb" : "#8ab0d0"}
        groundColor={day ? "#e6e8ee" : "#0c1420"}
      />
      <directionalLight
        position={[5, 8, 6]}
        intensity={t.key}
        color={day ? "#ffffff" : "#d8e8f8"}
      />
      <directionalLight
        position={[-4, 2, -4]}
        intensity={t.rim}
        color={day ? "#d0d4e0" : "#3a6a8a"}
      />
    </>
  );
}

export default function WorldCanvas({
  themeId,
  cameraTargetRef,
  cursorRef,
  stateRef,
  techHover,
  onTechHover,
  onTechSelect,
}) {
  const [mounted, setMounted] = useState(false);
  const t = THEME[themeId] || THEME.night;
  const reduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="wd-stage" aria-hidden />;

  return (
    <div className="wd-stage">
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          fov: HOME_CAM.fov,
          near: 0.08,
          far: 70,
          position: HOME_CAM.position,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: t.exposure,
        }}
        shadows={false}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        }}
      >
        <Atmosphere themeId={themeId} />
        <CameraRig cameraTargetRef={cameraTargetRef} cursorRef={cursorRef} />
        <CursorBridge cursorRef={cursorRef} />
        <group position={[2.45, 0.25, 0]}>
          <Suspense fallback={null}>
            <DataGlobe
              key={themeId}
              themeId={themeId}
              cursorRef={cursorRef}
              stateRef={stateRef}
              reducedMotion={reduced}
            />
          </Suspense>
          <Suspense fallback={null}>
            <TechConstellation
              key={`tech-${themeId}`}
              themeId={themeId}
              hoverId={techHover}
              onHover={onTechHover}
              onSelect={(node, pos) => {
                onTechSelect?.(node, [pos[0] + 2.45, pos[1] + 0.25, pos[2]]);
              }}
              stateRef={stateRef}
            />
          </Suspense>
          <Suspense fallback={null}>
            <InfraLayer themeId={themeId} stateRef={stateRef} />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}

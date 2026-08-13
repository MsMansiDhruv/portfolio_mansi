"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { THEME } from "@/lib/data/data-world";
import DataGlobe from "./DataGlobe";
import TechConstellation from "./TechConstellation";
import InfraLayer from "./InfraLayer";
import WorkField from "./WorkField";
import CursorBridge from "./CursorBridge";
import CameraRig, { HOME_CAM } from "./CameraRig";

function Atmosphere({ themeId }) {
  const t = THEME[themeId] || THEME.night;
  const day = themeId === "day";
  return (
    <>
      {!day && <fog attach="fog" args={[t.fog, t.fogNear, t.fogFar]} />}
      <ambientLight intensity={t.ambient} color={day ? "#f4f0e8" : "#6a849c"} />
      <hemisphereLight
        intensity={day ? 0.48 : 0.34}
        color={day ? "#f8f4ec" : "#7a9ab8"}
        groundColor={day ? "#ddd6cc" : "#0a1018"}
      />
      <directionalLight
        position={[5, 8, 6]}
        intensity={t.key}
        color={day ? "#fff8f0" : "#d0e0f0"}
      />
      <directionalLight
        position={[-4, 2, -4]}
        intensity={t.rim}
        color={day ? "#c8c0b4" : "#3a5a72"}
      />
    </>
  );
}

export default function WorldCanvas({
  themeId,
  layer = "world",
  cameraTargetRef,
  cursorRef,
  stateRef,
  techHover,
  onTechHover,
  onTechSelect,
  workHover,
  workSelected,
  onWorkHover,
  onWorkSelect,
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
              layer={layer}
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
              layer={layer}
            />
          </Suspense>
          <Suspense fallback={null}>
            <InfraLayer themeId={themeId} stateRef={stateRef} layer={layer} />
          </Suspense>
          <Suspense fallback={null}>
            <WorkField
              themeId={themeId}
              active={layer === "work"}
              hoverSlug={workHover}
              selectedSlug={workSelected}
              onHover={onWorkHover}
              onSelect={(cluster, pos) => {
                onWorkSelect?.(cluster, [
                  pos[0] + 2.45,
                  pos[1] + 0.25,
                  pos[2],
                ]);
              }}
            />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}

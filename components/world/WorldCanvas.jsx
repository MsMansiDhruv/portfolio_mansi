"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { THEME } from "@/lib/data/data-world";
import DataGlobe from "./DataGlobe";
import TechConstellation from "./TechConstellation";
import InfraLayer from "./InfraLayer";
import WorkField from "./WorkField";
import ProjectPipeline from "./ProjectPipeline";
import SemanticField from "./SemanticField";
import ExperienceField from "./ExperienceField";
import AboutField from "./AboutField";
import ContactField from "./ContactField";
import CursorBridge from "./CursorBridge";
import CameraRig, { HOME_CAM } from "./CameraRig";

function Atmosphere({ themeId }) {
  const t = THEME[themeId] || THEME.night;
  const day = themeId === "day";
  return (
    <>
      <fog attach="fog" args={[t.fog, t.fogNear, t.fogFar]} />
      <ambientLight intensity={t.ambient} color={day ? "#f2f5f8" : "#6a849c"} />
      <hemisphereLight
        intensity={day ? 0.52 : 0.34}
        color={day ? "#ffffff" : "#7a9ab8"}
        groundColor={day ? "#d0d6de" : "#0a1018"}
      />
      <directionalLight
        position={[5, 8, 6]}
        intensity={t.key}
        color={day ? "#ffffff" : "#d0e0f0"}
      />
      <directionalLight
        position={[-4, 2, -4]}
        intensity={t.rim}
        color={day ? "#b8c4d4" : "#3a5a72"}
      />
    </>
  );
}

/**
 * ONE shared WebGL scene. Only the active layer system runs.
 * Homepage globe never competes with Work / AI / etc.
 */
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
  onPipelineReady,
  aiFocusWord,
  onWordHover,
  onWordSelect,
  onModeSelect,
  onExperienceHover,
  onExperienceSelect,
  onAboutHover,
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
        dpr={[1, typeof window !== "undefined" && window.innerWidth < 768 ? 1.2 : 1.5]}
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
        {/* Data Core centered in optical axis — left CSS rail owns identity copy */}
        <group position={[1.55, 0.05, 0]}>
          {layer === "world" && (
            <>
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
                    onTechSelect?.(node, [
                      pos[0] + 1.55,
                      pos[1] + 0.05,
                      pos[2],
                    ]);
                  }}
                  stateRef={stateRef}
                  layer={layer}
                />
              </Suspense>
              <Suspense fallback={null}>
                <InfraLayer
                  themeId={themeId}
                  stateRef={stateRef}
                  layer={layer}
                />
              </Suspense>
            </>
          )}

          {layer === "work" && (
            <>
              <Suspense fallback={null}>
                <WorkField
                  themeId={themeId}
                  active={!workSelected}
                  hoverSlug={workHover}
                  selectedSlug={workSelected?.slug || null}
                  cursorRef={cursorRef}
                  onHover={onWorkHover}
                  onSelect={(cluster, pos) => {
                    onWorkSelect?.(cluster, [
                      pos[0] + 1.55,
                      pos[1] + 0.05,
                      pos[2],
                    ]);
                  }}
                />
              </Suspense>
              <Suspense fallback={null}>
                <ProjectPipeline
                  themeId={themeId}
                  cluster={workSelected}
                  active={!!workSelected}
                  cursorRef={cursorRef}
                  onReady={onPipelineReady}
                />
              </Suspense>
            </>
          )}

          {layer === "ai" && (
            <Suspense fallback={null}>
              <SemanticField
                themeId={themeId}
                active
                focusWord={aiFocusWord}
                onWordHover={onWordHover}
                onWordSelect={onWordSelect}
                onModeSelect={onModeSelect}
              />
            </Suspense>
          )}

          {layer === "experience" && (
            <Suspense fallback={null}>
              <ExperienceField
                themeId={themeId}
                active
                onHover={onExperienceHover}
                onSelect={onExperienceSelect}
              />
            </Suspense>
          )}

          {layer === "about" && (
            <Suspense fallback={null}>
              <AboutField
                themeId={themeId}
                active
                onHover={onAboutHover}
              />
            </Suspense>
          )}

          {layer === "contact" && (
            <Suspense fallback={null}>
              <ContactField themeId={themeId} active />
            </Suspense>
          )}
        </group>
      </Canvas>
    </div>
  );
}

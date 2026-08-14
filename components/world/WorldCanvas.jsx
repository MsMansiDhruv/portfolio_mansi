"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { THEME } from "@/lib/data/data-world";
import DataGlobe from "./DataGlobe";
import TechConstellation from "./TechConstellation";
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
 * ONE persistent WebGL world. Layers change state — they do not swap scenes.
 */
export default function WorldCanvas({
  themeId,
  layer = "world",
  cameraTargetRef,
  cursorRef,
  stateRef,
  techHover,
  focusedTechId = null,
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

  const inWorld = layer === "world";
  const inWork = layer === "work";
  const inAi = layer === "ai";
  const inExp = layer === "experience";
  const inAbout = layer === "about";
  const inContact = layer === "contact";

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
        <group position={[1.2, 0.02, 0]}>
          {/* Persistent Data Core — morphs through every system state */}
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

          {inWorld && (
            <Suspense fallback={null}>
              <TechConstellation
                key={`tech-${themeId}`}
                themeId={themeId}
                hoverId={techHover}
                selectedId={focusedTechId}
                onHover={onTechHover}
                onSelect={(node, pos) => {
                  onTechSelect?.(node, [pos[0] + 1.2, pos[1] + 0.02, pos[2]]);
                }}
                stateRef={stateRef}
                layer={layer}
              />
            </Suspense>
          )}

          {inWork && (
            <>
              <Suspense fallback={null}>
                <WorkField
                  themeId={themeId}
                  active={!workSelected}
                  hoverSlug={workHover}
                  selectedSlug={workSelected?.slug || null}
                  cursorRef={cursorRef}
                  stateRef={stateRef}
                  onHover={onWorkHover}
                  onSelect={(cluster, pos) => {
                    onWorkSelect?.(cluster, [
                      pos[0] + 1.2,
                      pos[1] + 0.02,
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

          {inAi && (
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

          {inExp && (
            <Suspense fallback={null}>
              <ExperienceField
                themeId={themeId}
                active
                onHover={onExperienceHover}
                onSelect={onExperienceSelect}
              />
            </Suspense>
          )}

          {inAbout && (
            <Suspense fallback={null}>
              <AboutField themeId={themeId} active onHover={onAboutHover} />
            </Suspense>
          )}

          {inContact && (
            <Suspense fallback={null}>
              <ContactField themeId={themeId} active />
            </Suspense>
          )}
        </group>
      </Canvas>
    </div>
  );
}

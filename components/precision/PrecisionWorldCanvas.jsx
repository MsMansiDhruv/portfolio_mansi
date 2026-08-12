"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import PrecisionWorld from "./world/PrecisionWorld";
import { THEME_PALETTE } from "@/lib/data/precision";

export default function PrecisionWorldCanvas({
  theme,
  cameraTargetRef,
  lookOffsetRef,
  interactionRef,
  activeSlug,
  hoverSlug,
  onSelectExhibit,
  onHoverExhibit,
  controlsEnabled,
}) {
  const [mounted, setMounted] = useState(false);
  const palette = THEME_PALETTE[theme] || THEME_PALETTE.night;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="mp-stage mp-stage--world" aria-hidden />;
  }

  return (
    <div className="mp-stage mp-stage--world">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 38, near: 0.1, far: 100, position: [0.2, 1.62, 15.5] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.02,
        }}
        shadows
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl }) => {
          gl.setClearColor(palette.background);
        }}
      >
        <color attach="background" args={[palette.background]} />
        <fog attach="fog" args={[palette.fog, palette.fogNear, palette.fogFar]} />
        <Suspense fallback={null}>
          <PrecisionWorld
            theme={theme}
            cameraTargetRef={cameraTargetRef}
            lookOffsetRef={lookOffsetRef}
            interactionRef={interactionRef}
            activeSlug={activeSlug}
            hoverSlug={hoverSlug}
            onSelectExhibit={onSelectExhibit}
            onHoverExhibit={onHoverExhibit}
            controlsEnabled={controlsEnabled}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

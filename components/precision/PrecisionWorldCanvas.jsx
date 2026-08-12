"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import PrecisionWorld from "./world/PrecisionWorld";

export default function PrecisionWorldCanvas({
  progressRef,
  theme,
  exhibitRef,
  activeSlug,
  nearSlug,
  onSelectExhibit,
}) {
  const [mounted, setMounted] = useState(false);

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
        camera={{ fov: 40, near: 0.1, far: 120, position: [0.35, 1.55, 22.5] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        shadows
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0e1520");
        }}
        onPointerMissed={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <Suspense fallback={null}>
          <PrecisionWorld
            theme={theme}
            progressRef={progressRef}
            exhibitRef={exhibitRef}
            activeSlug={activeSlug}
            nearSlug={nearSlug}
            onSelectExhibit={onSelectExhibit}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

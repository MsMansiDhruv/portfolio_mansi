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
  activeExhibit,
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
        camera={{ fov: 38, near: 0.1, far: 120, position: [0.2, 1.65, 22] }}
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
          gl.setClearColor("#0c121c");
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
            activeExhibit={activeExhibit}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

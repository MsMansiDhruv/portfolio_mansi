"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import PrecisionWorld from "./world/PrecisionWorld";

export default function PrecisionWorldCanvas({ progressRef, theme }) {
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
        dpr={[1, 1.6]}
        camera={{ fov: 40, near: 0.1, far: 80, position: [0.35, 1.55, 22.5] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        shadows
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <PrecisionWorld theme={theme} progressRef={progressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

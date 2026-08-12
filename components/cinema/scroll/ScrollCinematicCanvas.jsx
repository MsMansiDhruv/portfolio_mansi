"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import CinematicWorld from "./CinematicWorld";

function SceneFallback() {
  return (
    <>
      <color attach="background" args={["#0b0f18"]} />
      <ambientLight intensity={0.1} />
    </>
  );
}

export default function ScrollCinematicCanvas({ progress }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 42, near: 0.1, far: 30, position: [1.8, 1.3, 3.5] }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={<SceneFallback />}>
        <CinematicWorld progress={progress} />
      </Suspense>
    </Canvas>
  );
}

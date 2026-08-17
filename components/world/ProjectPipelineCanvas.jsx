"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { THEME, WORK_METAPHOR } from "@/lib/data/data-world";
import ProjectPipeline from "./ProjectPipeline";

const PAGE_TOPOLOGY = {
  "gpu-bench": "tangle",
  "cuda-tiling": "tangle",
  "pc-accessories": "hub",
  "acrylic-store": "hub",
  "saffron-research": "fan",
};

export default function ProjectPipelineCanvas({ slug, themeId = "night", stages = [] }) {
  const t = THEME[themeId] || THEME.night;
  const cluster = useMemo(() => {
    const metaphor = WORK_METAPHOR[slug];
    return {
      slug,
      index: metaphor?.code ? Number(metaphor.code) - 1 : 8,
      topology: metaphor?.topology || PAGE_TOPOLOGY[slug] || "tangle",
      flow: stages,
    };
  }, [slug, stages]);
  const cursorRef = useMemo(
    () => ({ current: { active: false, nx: 0, ny: 0, vx: 0, vy: 0 } }),
    []
  );

  return (
    <div className="wd-pipeline-stage">
      <Canvas
        dpr={[1, 1.35]}
        camera={{ fov: 32, near: 0.08, far: 40, position: [0, 0.12, 5.4] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={t.ambient} />
        <directionalLight position={[4, 6, 5]} intensity={t.key} />
        <Suspense fallback={null}>
          <ProjectPipeline
            themeId={themeId}
            cluster={cluster}
            active
            cursorRef={cursorRef}
            layout="page"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

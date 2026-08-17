"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { THEME } from "@/lib/data/data-world";
import DataGlobe from "./DataGlobe";
import { HOME_CAM } from "./CameraRig";

const LAYER_PROGRESS = {
  world: 0,
  work: 1,
  ai: 2,
  experience: 3,
  about: 4,
  contact: 5,
};

/**
 * Homepage particle field as a quiet backdrop for inner world pages.
 * Pointer-events stay off so catalog and journey copy remain clickable.
 */
export default function WorldFieldBackdrop({
  themeId = "night",
  layer = "world",
  size = "full",
  className = "",
}) {
  const [mounted, setMounted] = useState(false);
  const t = THEME[themeId] || THEME.night;
  const reduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);
  const cursorRef = useRef({
    nx: 0,
    ny: 0,
    vx: 0,
    vy: 0,
    active: false,
  });
  const stateRef = useRef({
    globeEnergy: 0.02,
    story: "explore",
    layer,
    assemble: 1,
    shapeFrom: layer,
    shapeTo: layer,
    shapeMix: 0,
    shapeProgress: LAYER_PROGRESS[layer] ?? 0,
    pipelineActive: false,
    aiConsoleOpen: false,
    aiThinking: false,
    scrollVelocity: 0,
    scrollProgress: 0,
  });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    stateRef.current.layer = layer;
    stateRef.current.shapeFrom = layer;
    stateRef.current.shapeTo = layer;
    stateRef.current.shapeProgress = LAYER_PROGRESS[layer] ?? 0;
  }, [layer]);

  useEffect(() => {
    if (reduced) {
      stateRef.current.assemble = 1;
      return undefined;
    }
    stateRef.current.assemble = 0;
    const origin = performance.now();
    let raf = 0;
    const tick = () => {
      const progress = Math.min(1, (performance.now() - origin) / 2200);
      stateRef.current.assemble = progress * progress * (3 - 2 * progress);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else stateRef.current.assemble = 1;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [layer, reduced]);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handlePointerMove = (event) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const nx = (event.clientX / w) * 2 - 1;
      const ny = (event.clientY / h) * 2 - 1;
      const c = cursorRef.current;
      c.vx = nx - c.nx;
      c.vy = ny - c.ny;
      c.nx = nx;
      c.ny = ny;
      c.active = true;
    };

    const handlePointerLeave = () => {
      cursorRef.current.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, []);

  const compact = size === "compact";
  const classes = ["wd-field-backdrop", compact ? "wd-field-backdrop--compact" : "", className]
    .filter(Boolean)
    .join(" ");

  if (!mounted) {
    return <div className={classes} aria-hidden />;
  }

  return (
    <div className={classes} aria-hidden>
      <Canvas
        dpr={[1, 1.2]}
        camera={{
          fov: compact ? 38 : HOME_CAM.fov,
          near: 0.08,
          far: 70,
          position: compact ? [0, 0.08, 11.4] : HOME_CAM.position,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={t.ambient} color={themeId === "day" ? "#fbfaf8" : "#ece8f4"} />
        <directionalLight position={[5, 8, 6]} intensity={t.key} color="#f6f4f2" />
        <group position={compact ? [0.2, 0.06, 0] : layer === "world" ? [0.85, 0.02, 0] : [0, 0.04, 0]} scale={compact ? 0.62 : 1}>
          <Suspense fallback={null}>
            <DataGlobe
              themeId={themeId}
              cursorRef={cursorRef}
              stateRef={stateRef}
              reducedMotion={reduced}
              layer={layer}
            />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}

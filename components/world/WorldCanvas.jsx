"use client";

import { Component, Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { THEME, HOME_CAM } from "@/lib/data/data-world";
import CameraRig from "./CameraRig";
import { isWorldCompact } from "@/lib/world-device";

const DataGlobe = lazy(() => import("./DataGlobe"));
const WorkField = lazy(() => import("./WorkField"));
const ProjectPipeline = lazy(() => import("./ProjectPipeline"));
const CursorBridge = lazy(() => import("./CursorBridge"));

function Atmosphere({ themeId, compact = false }) {
  const t = THEME[themeId] || THEME.night;
  const day = themeId === "day";
  return (
    <>
      {day || compact ? null : <fog attach="fog" args={["#111113", t.fogNear, t.fogFar]} />}
      <ambientLight intensity={t.ambient} color={day ? "#fbfaf8" : "#ece8f4"} />
      <hemisphereLight
        intensity={day ? (compact ? 0.38 : 0.52) : compact ? 0.26 : 0.34}
        color={day ? "#fbfaf8" : "#b9aef4"}
        groundColor={day ? "#eeecf0" : "#1a1a1f"}
      />
      <directionalLight
        position={[5, 8, 6]}
        intensity={compact ? t.key * 0.72 : t.key}
        color={day ? "#fbfaf8" : "#f6f4f2"}
      />
      {compact ? null : (
        <directionalLight
          position={[-4, 2, -4]}
          intensity={t.rim}
          color={day ? "#bd629d" : "#dc8fc7"}
        />
      )}
    </>
  );
}

class StageBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false, gen: 0 };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    if (this.state.gen >= 1) return;
    window.clearTimeout(this.retry);
    this.retry = window.setTimeout(() => {
      this.setState((state) => ({ failed: false, gen: state.gen + 1 }));
    }, 280);
  }

  componentWillUnmount() {
    window.clearTimeout(this.retry);
  }

  render() {
    if (this.state.failed) return <div className="wd-stage" aria-hidden />;
    return <div key={this.state.gen}>{this.props.children}</div>;
  }
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function WorldCanvas({
  themeId,
  layer = "world",
  cameraTargetRef,
  cursorRef,
  stateRef,
  workHover,
  workSelected,
  onWorkHover,
  onWorkSelect,
  onPipelineReady,
}) {
  const [mounted, setMounted] = useState(false);
  const t = THEME[themeId] || THEME.night;
  const reduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  const [compact, setCompact] = useState(false);
  const [allowGL, setAllowGL] = useState(false);
  useEffect(() => {
    setMounted(true);
    const apply = () => setCompact(isWorldCompact());
    apply();
    const raf = window.requestAnimationFrame(() => setAllowGL(true));
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, []);
  if (!mounted || !allowGL) return <div className="wd-stage" aria-hidden />;
  if (!hasWebGL()) return <div className="wd-stage" aria-hidden />;

  const inWork = layer === "work";

  return (
    <StageBoundary>
    <div className="wd-stage">
      <Canvas
        dpr={compact ? 1 : [1, 1.35]}
        camera={{
          fov: compact ? 34 : HOME_CAM.fov,
          near: 0.08,
          far: compact ? 28 : 70,
          position: compact ? [0, 0.08, 7.35] : HOME_CAM.position,
        }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: compact ? "low-power" : "default",
          failIfMajorPerformanceCaveat: false,
          toneMapping: compact ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping,
          toneMappingExposure: t.exposure,
        }}
        shadows={false}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.setPixelRatio(compact ? 1 : Math.min(window.devicePixelRatio || 1, 1.35));
          const canvas = gl.domElement;
          const onLost = (event) => event.preventDefault();
          canvas.addEventListener("webglcontextlost", onLost, { passive: false });
        }}
      >
        <Atmosphere themeId={themeId} compact={compact} />
        <CameraRig cameraTargetRef={cameraTargetRef} cursorRef={cursorRef} />
        <Suspense fallback={null}>
          <CursorBridge cursorRef={cursorRef} />
        </Suspense>

        <group position={[0, 0.02, 0]}>
          <Suspense fallback={null}>
            <DataGlobe
              themeId={themeId}
              cursorRef={cursorRef}
              stateRef={stateRef}
              reducedMotion={reduced}
              layer={layer}
            />
          </Suspense>

          {inWork && !compact && (
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
                    onWorkSelect?.(cluster, [pos[0], pos[1] + 0.02, pos[2]]);
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

        </group>
      </Canvas>
    </div>
    </StageBoundary>
  );
}

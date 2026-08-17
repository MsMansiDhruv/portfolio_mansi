"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { THEME } from "@/lib/data/data-world";
import DataGlobe from "./DataGlobe";
import WorkField from "./WorkField";
import ProjectPipeline from "./ProjectPipeline";
import CursorBridge from "./CursorBridge";
import CameraRig, { HOME_CAM } from "./CameraRig";

function Atmosphere({ themeId }) {
  const t = THEME[themeId] || THEME.night;
  const day = themeId === "day";
  return (
    <>
      {day ? null : <fog attach="fog" args={["#111113", t.fogNear, t.fogFar]} />}
      <ambientLight intensity={t.ambient} color={day ? "#fbfaf8" : "#ece8f4"} />
      <hemisphereLight
        intensity={day ? 0.52 : 0.34}
        color={day ? "#fbfaf8" : "#b9aef4"}
        groundColor={day ? "#eeecf0" : "#1a1a1f"}
      />
      <directionalLight
        position={[5, 8, 6]}
        intensity={t.key}
        color={day ? "#fbfaf8" : "#f6f4f2"}
      />
      <directionalLight
        position={[-4, 2, -4]}
        intensity={t.rim}
        color={day ? "#bd629d" : "#dc8fc7"}
      />
    </>
  );
}

function CosmicTrails({ themeId }) {
  const tailsRef = useRef();
  const headsRef = useRef();
  const stars = 11;
  const tailLength = 8;
  const day = themeId === "day";
  const trailState = useMemo(
    () => Array.from({ length: stars }, (_, i) => ({
      x: -5.8,
      y: -1.35 + ((i * 1.91) % 4.7),
      z: -2.5 - (i % 4) * 0.82,
      speed: 1.72 + ((i * 0.17) % 0.62),
      length: 0.1 + ((i * 0.07) % 0.16),
      life: -((i * 0.19) % 1.8),
      duration: 5.4 + ((i * 0.31) % 2.2),
    })),
    []
  );
  const tailGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(stars * (tailLength - 1) * 3), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(stars * (tailLength - 1) * 3), 3));
    return g;
  }, []);
  const headGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(stars * 3), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(stars * 3), 3));
    return g;
  }, []);
  const sprite = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const context = canvas.getContext("2d");
    const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, "rgba(255,255,255,1)");
    glow.addColorStop(0.16, "rgba(255,255,255,0.98)");
    glow.addColorStop(0.48, "rgba(255,255,255,0.24)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  useFrame((_, delta) => {
    if (!tailsRef.current || !headsRef.current) return;
    const positions = tailsRef.current.geometry.attributes.position.array;
    const colors = tailsRef.current.geometry.attributes.color.array;
    const headPositions = headsRef.current.geometry.attributes.position.array;
    const headColors = headsRef.current.geometry.attributes.color.array;
    const base = day ? [0.96, 0.38, 0.015] : [0.7, 0.64, 1];
    const head = day ? [1, 0.78, 0.2] : [0.98, 0.96, 1];

    for (let i = 0; i < stars; i++) {
      const star = trailState[i];
      star.life += delta / star.duration;
      if (star.life >= 1) {
        star.life = -(0.28 + Math.random() * 1.5);
        star.x = -5.8;
        star.y = -1.45 + Math.random() * 4.9;
        star.z = -2.3 - Math.random() * 3.4;
        star.speed = 1.65 + Math.random() * 0.82;
        star.length = 0.1 + Math.random() * 0.17;
        star.duration = 5.1 + Math.random() * 2.5;
      }
      const appeared = THREE.MathUtils.smoothstep(star.life, 0, 0.14);
      const faded = 1 - THREE.MathUtils.smoothstep(star.life, 0.68, 1);
      const intensity = Math.max(0, appeared * faded);
      const progress = THREE.MathUtils.clamp(star.life, 0, 1);
      const x = star.x + progress * star.speed * star.duration;
      const y = star.y - progress * star.speed * star.duration * 0.32;

      const h = i * 3;
      headPositions[h] = x;
      headPositions[h + 1] = y;
      headPositions[h + 2] = star.z;
      headColors[h] = head[0] * intensity;
      headColors[h + 1] = head[1] * intensity;
      headColors[h + 2] = head[2] * intensity;

      for (let j = 1; j < tailLength; j++) {
        const index = i * (tailLength - 1) + (j - 1);
        const offset = j * star.length;
        const tail = intensity * Math.pow(1 - j / tailLength, 2.1);
        const p = index * 3;
        positions[p] = x - offset;
        positions[p + 1] = y + offset * 0.32;
        positions[p + 2] = star.z;
        const mix = Math.max(0, 1 - j / 2.4);
        colors[p] = (base[0] + (head[0] - base[0]) * mix) * tail;
        colors[p + 1] = (base[1] + (head[1] - base[1]) * mix) * tail;
        colors[p + 2] = (base[2] + (head[2] - base[2]) * mix) * tail;
      }
    }
    tailsRef.current.geometry.attributes.position.needsUpdate = true;
    tailsRef.current.geometry.attributes.color.needsUpdate = true;
    headsRef.current.geometry.attributes.position.needsUpdate = true;
    headsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  if (day) return null;

  return (
    <group>
      <points ref={tailsRef} geometry={tailGeometry} renderOrder={-2} frustumCulled={false}>
        <pointsMaterial
          map={sprite}
          vertexColors
          size={day ? 3.8 : 2.5}
          sizeAttenuation={false}
          transparent
          opacity={day ? 0.92 : 0.64}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
      <points ref={headsRef} geometry={headGeometry} renderOrder={-1} frustumCulled={false}>
        <pointsMaterial
          map={sprite}
          vertexColors
          size={day ? 10 : 5.8}
          sizeAttenuation={false}
          transparent
          opacity={day ? 1 : 0.92}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
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

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="wd-stage" aria-hidden />;

  const inWork = layer === "work";

  return (
    <div className="wd-stage">
      <Canvas
        dpr={[1, typeof window !== "undefined" && window.innerWidth < 768 ? 1.1 : 1.35]}
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
          gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
        }}
      >
        <Atmosphere themeId={themeId} />
        <CameraRig cameraTargetRef={cameraTargetRef} cursorRef={cursorRef} />
        <CursorBridge cursorRef={cursorRef} />

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
  );
}

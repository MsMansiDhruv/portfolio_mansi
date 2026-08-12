"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  PRECISION_ASSETS,
  THEME_PALETTE,
  remap,
  smoothstep,
} from "@/lib/data/precision";

function Rail({ start, end, progressRef, index, color, accent }) {
  const ref = useRef();
  const mid = useMemo(() => {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    return a.clone().lerp(b, 0.5);
  }, [start, end]);

  const dir = useMemo(() => {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    return b.clone().sub(a);
  }, [start, end]);

  const length = dir.length();
  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir.clone().normalize());
    return q;
  }, [dir]);

  useFrame(() => {
    if (!ref.current) return;
    const local = remap(progressRef.current || 0, 0.34, 0.72);
    const converge = smoothstep(0.4, 0.65, local);
    const clarified = smoothstep(0.65, 0.85, local);
    const active = local > 0.18;
    const quiet = clarified > 0.4 && index % 3 !== 1;
    const mat = ref.current.material;
    mat.opacity = quiet ? 0.18 : active ? 0.55 + converge * 0.4 : 0.35;
    mat.color.set(converge > 0.7 && !quiet ? accent : color);
    const settle = converge * 0.08;
    ref.current.position.y = mid.y + (index % 2 === 0 ? -settle : settle) * (1 - clarified);
  });

  return (
    <mesh ref={ref} position={mid.toArray()} quaternion={quat} castShadow>
      <boxGeometry args={[length, 0.04, 0.04]} />
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.26}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

function MechanismVideo({ opacity = 0.5 }) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = PRECISION_ASSETS.convergenceVideo;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";

    let tex;
    const onReady = () => {
      tex = new THREE.VideoTexture(video);
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
      video.play().catch(() => {});
    };

    video.addEventListener("loadeddata", onReady);
    video.load();

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.pause();
      video.src = "";
      tex?.dispose();
    };
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, 0.02, 0.3]}>
      <planeGeometry args={[0.42, 0.62]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
}

export default function Convergence({ theme, progressRef }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const signal = useRef();
  const ring = useRef();
  const core = useRef();
  const outRail = useRef();

  const plateTex = useTexture(PRECISION_ASSETS.visual);
  plateTex.colorSpace = THREE.SRGBColorSpace;

  const rails = useMemo(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const y = 0.75 + i * 0.2;
      const zSpread = (i - 3) * 0.32;
      list.push({
        start: [-5.1, y, 1.2 + zSpread],
        end: [-0.5, 1.45, -0.15 + (i - 3) * 0.05],
      });
      list.push({
        start: [5.1, y, 1.2 + zSpread],
        end: [0.5, 1.45, -0.15 + (i - 3) * 0.05],
      });
    }
    return list;
  }, []);

  useFrame(() => {
    const local = remap(progressRef.current || 0, 0.34, 0.72);
    const converge = smoothstep(0.4, 0.65, local);
    const clarified = smoothstep(0.65, 0.85, local);
    const output = smoothstep(0.82, 1, local);

    if (signal.current) {
      signal.current.material.emissiveIntensity = clarified * 2.1;
      signal.current.visible = clarified > 0.05;
    }
    if (ring.current) {
      ring.current.scale.setScalar(1 - converge * 0.1);
    }
    if (core.current) {
      core.current.rotation.y = converge * 0.04;
    }
    if (outRail.current) {
      outRail.current.material.emissiveIntensity = clarified * 0.25 + output * 0.2;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 1.3, 0.64, 48]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.86} roughness={0.3} />
      </mesh>

      <group ref={core} position={[0, 1.45, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.95, 2.15, 0.5]} />
          <meshStandardMaterial color={p.metal} metalness={0.92} roughness={0.24} />
        </mesh>

        <mesh position={[0, 0.08, 0.28]}>
          <planeGeometry args={[0.7, 1.35]} />
          <meshStandardMaterial
            map={plateTex}
            metalness={0.15}
            roughness={0.5}
            transparent
            opacity={theme === "day" ? 0.7 : 0.88}
          />
        </mesh>

        <MechanismVideo opacity={theme === "day" ? 0.35 : 0.5} />

        <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0.34]}>
          <torusGeometry args={[0.2, 0.01, 10, 64]} />
          <meshStandardMaterial color={p.aluminium} metalness={0.95} roughness={0.18} />
        </mesh>

        <mesh ref={signal} position={[0, 0.02, 0.38]} visible={false}>
          <sphereGeometry args={[0.04, 20, 20]} />
          <meshStandardMaterial
            color={p.amber}
            emissive={p.amber}
            emissiveIntensity={0}
            roughness={0.35}
          />
        </mesh>
      </group>

      {rails.map((rail, i) => (
        <Rail
          key={`r-${i}`}
          index={i}
          start={rail.start}
          end={rail.end}
          progressRef={progressRef}
          color={p.aluminium}
          accent={p.amber}
        />
      ))}

      <mesh ref={outRail} position={[0, 0.92, -5]} castShadow>
        <boxGeometry args={[0.16, 0.055, 10]} />
        <meshStandardMaterial
          color={p.aluminium}
          metalness={0.93}
          roughness={0.2}
          emissive={p.amber}
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  );
}

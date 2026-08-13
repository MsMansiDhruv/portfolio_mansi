"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getPointMap } from "./pointMap";
import { THEME, semanticColor } from "@/lib/data/data-world";

const SOURCE_COUNT = 48;
const FLOW_PER_CURVE = 3;

function rnd(i) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Scatter sources on a wide arc; converge to amber signal at center-front */
function buildConvergence() {
  const sources = [];
  const curves = [];
  const target = new THREE.Vector3(0, 0, 0.35);

  for (let i = 0; i < SOURCE_COUNT; i++) {
    const a = (i / SOURCE_COUNT) * Math.PI * 2;
    const r = 1.15 + rnd(i) * 0.55;
    const start = new THREE.Vector3(
      Math.cos(a) * r,
      (rnd(i + 5) - 0.5) * 1.1,
      -0.65 + rnd(i + 11) * 0.35
    );
    sources.push(start);
    const mid = start
      .clone()
      .lerp(target, 0.45)
      .add(new THREE.Vector3((rnd(i + 3) - 0.5) * 0.25, rnd(i + 7) * 0.15, 0.1));
    curves.push(new THREE.QuadraticBezierCurve3(start, mid, target.clone()));
  }
  return { sources, curves, target };
}

/**
 * Contact layer — many points converging along curves toward one signal node.
 */
export default function ContactField({ themeId, active }) {
  const root = useRef();
  const sourceRef = useRef();
  const signalRef = useRef();
  const flowRef = useRef();
  const lineMats = useRef([]);
  const fade = useRef(0);
  const converge = useRef(0);
  const t = THEME[themeId] || THEME.night;

  const { sources, curves, target } = useMemo(() => buildConvergence(), []);
  const flowCount = curves.length * FLOW_PER_CURVE;

  const sourceGeom = useMemo(() => {
    const arr = new Float32Array(SOURCE_COUNT * 3);
    sources.forEach((v, i) => {
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [sources]);

  const signalGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0.35]), 3));
    return g;
  }, []);

  const flowGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(flowCount * 3), 3)
    );
    return g;
  }, [flowCount]);

  const lineGeoms = useMemo(
    () =>
      curves.map((curve) => {
        const pts = curve.getPoints(28);
        return new THREE.BufferGeometry().setFromPoints(pts);
      }),
    [curves]
  );

  useEffect(() => {
    if (!active) {
      fade.current = 0;
      converge.current = 0;
    }
  }, [active]);

  useFrame((state, dt) => {
    if (!root.current) return;
    const d = Math.min(dt, 0.05);
    fade.current = THREE.MathUtils.damp(fade.current, active ? 1 : 0, active ? 2.5 : 5, d);
    converge.current = THREE.MathUtils.damp(
      converge.current,
      active ? 1 : 0,
      active ? 0.85 : 4,
      d
    );
    root.current.visible = fade.current > 0.02;

    const time = state.clock.elapsedTime;
    const u = converge.current;
    const lineOpacity = fade.current * 0.06;

    lineMats.current.forEach((mat) => {
      if (mat) mat.opacity = lineOpacity;
    });

    if (sourceRef.current?.geometry) {
      const arr = sourceRef.current.geometry.attributes.position.array;
      sources.forEach((start, i) => {
        const i3 = i * 3;
        arr[i3] = THREE.MathUtils.lerp(start.x, target.x, u * 0.15);
        arr[i3 + 1] = THREE.MathUtils.lerp(start.y, target.y, u * 0.15);
        arr[i3 + 2] = THREE.MathUtils.lerp(start.z, target.z, u * 0.08);
      });
      sourceRef.current.geometry.attributes.position.needsUpdate = true;
      sourceRef.current.material.opacity = fade.current * (0.2 + u * 0.35);
      sourceRef.current.material.color.set(semanticColor("data", themeId));
    }

    if (flowRef.current) {
      const fArr = flowGeom.attributes.position.array;
      let fi = 0;
      curves.forEach((curve, ci) => {
        for (let k = 0; k < FLOW_PER_CURVE; k++) {
          const i3 = fi * 3;
          const speed = 0.06 + (ci % 5) * 0.008;
          const pt = curve.getPoint((time * speed + ci * 0.07 + k / FLOW_PER_CURVE) % 1);
          fArr[i3] = pt.x;
          fArr[i3 + 1] = pt.y;
          fArr[i3 + 2] = pt.z;
          fi++;
        }
      });
      flowGeom.attributes.position.needsUpdate = true;
      flowRef.current.material.opacity = fade.current * (0.25 + u * 0.5);
      flowRef.current.material.color.set(t.accent);
      flowRef.current.material.size = 0.05 + u * 0.025;
    }

    if (signalRef.current?.material) {
      const pulse = 0.75 + Math.sin(time * 1.2) * 0.25;
      signalRef.current.material.opacity = fade.current * pulse;
      signalRef.current.material.size = 0.16 + u * 0.06;
      signalRef.current.material.color.set(t.accent);
    }
  });

  return (
    <group ref={root} visible={false}>
      {lineGeoms.map((g, ci) => (
        <line key={`cv-${ci}`} geometry={g}>
          <lineBasicMaterial
            ref={(m) => {
              lineMats.current[ci] = m;
            }}
            color={t.steel}
            transparent
            opacity={0.06}
            depthWrite={false}
          />
        </line>
      ))}
      <points ref={sourceRef} geometry={sourceGeom} frustumCulled={false}>
        <pointsMaterial
          map={getPointMap()}
          size={0.045}
          sizeAttenuation
          color={t.data}
          transparent
          opacity={0.3}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <points ref={flowRef} geometry={flowGeom} frustumCulled={false}>
        <pointsMaterial
          map={getPointMap()}
          size={0.055}
          sizeAttenuation
          color={t.accent}
          transparent
          opacity={0.4}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <points ref={signalRef} geometry={signalGeom} frustumCulled={false}>
        <pointsMaterial
          map={getPointMap()}
          size={0.16}
          sizeAttenuation
          color={t.accent}
          transparent
          opacity={0.8}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

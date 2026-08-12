"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import {
  TECH_NODES,
  TECH_LINKS,
  THEME,
  latLonToVec,
  kindColor,
} from "@/lib/data/data-world";

const ORBIT_R = 2.35;

function TechNode({ node, themeId, hot, onHover }) {
  const ref = useRef();
  const t = THEME[themeId] || THEME.night;
  const color = kindColor(node.kind, themeId);
  const pos = useMemo(
    () => latLonToVec(node.lat, node.lon, ORBIT_R),
    [node.lat, node.lon]
  );

  useFrame((_, dt) => {
    if (!ref.current) return;
    const s = hot ? 1.35 : 1;
    ref.current.scale.setScalar(
      THREE.MathUtils.damp(ref.current.scale.x, s, 5, Math.min(dt, 0.05))
    );
  });

  return (
    <group
      ref={ref}
      position={pos}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover?.(node);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover?.(null);
      }}
    >
      <mesh>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={hot ? t.accent : color}
          emissiveIntensity={hot ? 0.45 : 0.12}
          metalness={0.6}
          roughness={0.35}
        />
      </mesh>
      {hot && (
        <Text
          position={[0, 0.14, 0]}
          fontSize={0.07}
          color={t.ink}
          anchorX="center"
          outlineWidth={0.004}
          outlineColor={t.bg}
        >
          {node.label}
        </Text>
      )}
    </group>
  );
}

/**
 * Technology constellation + relationship arcs around the globe.
 */
export default function TechConstellation({
  themeId,
  hoverId,
  onHover,
  stateRef,
  visible = true,
}) {
  const root = useRef();
  const flowRef = useRef();
  const t = THEME[themeId] || THEME.night;

  const { linePos, travellers } = useMemo(() => {
    const positions = [];
    const travellers = [];
    TECH_LINKS.forEach(([a, b], li) => {
      const na = TECH_NODES.find((n) => n.id === a);
      const nb = TECH_NODES.find((n) => n.id === b);
      if (!na || !nb) return;
      const pa = new THREE.Vector3(...latLonToVec(na.lat, na.lon, ORBIT_R));
      const pb = new THREE.Vector3(...latLonToVec(nb.lat, nb.lon, ORBIT_R));
      const mid = pa.clone().add(pb).multiplyScalar(0.5).normalize().multiplyScalar(ORBIT_R * 1.18);
      const curve = new THREE.QuadraticBezierCurve3(pa, mid, pb);
      const pts = curve.getPoints(24);
      for (let i = 0; i < pts.length - 1; i++) {
        positions.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
      }
      travellers.push({ curve, a, b, phase: li * 0.17 });
    });
    return { linePos: new Float32Array(positions), travellers };
  }, []);

  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    return g;
  }, [linePos]);

  const flowGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = travellers.length;
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    return g;
  }, [travellers.length]);

  useFrame((state, dt) => {
    if (!root.current) return;
    const show = visible ? 1 : 0;
    root.current.scale.setScalar(
      THREE.MathUtils.damp(root.current.scale.x || 0.001, show, 2.5, Math.min(dt, 0.05))
    );
    root.current.visible = root.current.scale.x > 0.04;

    // Match globe rotation so nodes stay fixed on the sphere frame
    const gy = stateRef?.current?.globeRotY ?? 0;
    root.current.rotation.y = gy * 0.35;

    if (flowRef.current) {
      const arr = flowRef.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;
      travellers.forEach((tr, i) => {
        const lit =
          !hoverId || hoverId === tr.a || hoverId === tr.b;
        const u = (time * 0.12 + tr.phase) % 1;
        const p = tr.curve.getPoint(u);
        const i3 = i * 3;
        arr[i3] = p.x;
        arr[i3 + 1] = p.y;
        arr[i3 + 2] = p.z;
        // hide travellers on inactive links by pushing far (cheap)
        if (!lit) arr[i3 + 1] = -99;
      });
      flowRef.current.geometry.attributes.position.needsUpdate = true;
      flowRef.current.material.opacity = hoverId ? 0.95 : 0.55;
    }
  });

  return (
    <group ref={root} scale={0.001}>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial
          color={t.wire}
          transparent
          opacity={themeId === "day" ? 0.16 : 0.22}
          depthWrite={false}
        />
      </lineSegments>

      <points ref={flowRef} geometry={flowGeom} frustumCulled={false}>
        <pointsMaterial
          color={t.accent}
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </points>

      {TECH_NODES.map((node) => (
        <TechNode
          key={node.id}
          node={node}
          themeId={themeId}
          hot={hoverId === node.id}
          onHover={onHover}
        />
      ))}
    </group>
  );
}

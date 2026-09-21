"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Component, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { COMPUTE_SITES } from "@/lib/data/compute-weather";

const R = 1.25;

function latLngToVec(lat, lng, radius = R) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

class GlobeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return this.props.fallback || null;
    return this.props.children;
  }
}

function EarthBody() {
  const map = useMemo(() => {
    const tex = new THREE.TextureLoader().load(
      "/textures/earth-blue.jpg",
      undefined,
      undefined,
      () => {}
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <mesh>
      <sphereGeometry args={[R, 64, 64]} />
      <meshBasicMaterial map={map} color="#8af0e4" toneMapped={false} />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh scale={1.08}>
      <sphereGeometry args={[R, 48, 48]} />
      <meshBasicMaterial
        color="#5eead4"
        transparent
        opacity={0.16}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function ClusterPulses({ hot, onHot }) {
  const group = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const s = COMPUTE_SITES[i];
      const pulse = 1 + Math.sin(t * (1.6 + s.growth) + i) * 0.28;
      child.scale.setScalar((0.04 + s.power * 0.045) * pulse * (hot === s.id ? 1.4 : 1));
    });
  });

  return (
    <group ref={group}>
      {COMPUTE_SITES.map((site) => {
        const p = latLngToVec(site.lat, site.lng, R + 0.02);
        return (
          <mesh
            key={site.id}
            position={p}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHot(site.id);
            }}
            onPointerOut={() => onHot(null)}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshBasicMaterial color={hot === site.id ? "#e7fffb" : "#5eead4"} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function GlobeScene({ hot, onHot }) {
  const root = useRef();
  useFrame((state, delta) => {
    if (!root.current) return;
    root.current.rotation.y += delta * 0.08;
  });
  return (
    <group ref={root} rotation={[0.35, -1.4, 0]}>
      <EarthBody />
      <Atmosphere />
      <ClusterPulses hot={hot} onHot={onHot} />
    </group>
  );
}

function GlobeCanvas({ cluster, onHot }) {
  const [hot, setHot] = useState(null);
  const active = cluster?.id || hot;

  return (
    <Canvas
      camera={{ position: [0, 0.15, 3.6], fov: 42, near: 0.1, far: 20 }}
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%", display: "block" }}
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
      onCreated={({ gl, camera }) => {
        gl.setClearColor("#061110", 0);
        camera.lookAt(0, 0, 0);
      }}
    >
      <ambientLight intensity={1.2} />
      <GlobeScene
        hot={active}
        onHot={(id) => {
          setHot(id);
          onHot?.(id);
        }}
      />
    </Canvas>
  );
}

export default function PowerGlobe({ cluster, onHot, fallback = null }) {
  return (
    <div className="wd-globe">
      <GlobeErrorBoundary fallback={fallback}>
        <GlobeCanvas cluster={cluster} onHot={onHot} />
      </GlobeErrorBoundary>
    </div>
  );
}

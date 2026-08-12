"use client";

import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { CHARACTER } from "@/lib/data/identity";

/**
 * Sparse human-scale reference — never the center of the interface.
 */
export default function MansiFigure({ theme, interactionRef, activeSlug }) {
  const root = useRef();
  const plate = useRef();
  const map = useLoader(THREE.TextureLoader, CHARACTER.src);
  map.colorSpace = THREE.SRGBColorSpace;

  useFrame(({ camera }, delta) => {
    if (!root.current) return;
    const dt = Math.min(delta, 0.05);
    const hide = !!activeSlug;
    root.current.visible = !hide;
    if (hide) return;

    const energy = interactionRef?.current?.energy ?? 0.25;
    const tx = 3.4 + energy * 0.15;
    const tz = 11.4;

    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, tx, 1.1, dt);
    root.current.position.z = THREE.MathUtils.damp(root.current.position.z, tz, 1.1, dt);

    if (plate.current) {
      plate.current.lookAt(
        camera.position.x,
        root.current.position.y + 0.85,
        camera.position.z
      );
    }
  });

  return (
    <group ref={root} position={[3.4, 0, 11.4]}>
      <mesh ref={plate} position={[0, 0.85, 0]}>
        <planeGeometry args={[0.52, 1.08]} />
        <meshBasicMaterial
          map={map}
          transparent
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
          opacity={theme === "day" ? 0.55 : 0.62}
        />
      </mesh>
    </group>
  );
}

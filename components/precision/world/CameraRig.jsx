"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { sampleCameraPath } from "@/lib/data/precision";

/**
 * Scroll = camera travel through one continuous hall.
 * No teleport. No background swap.
 */
export default function CameraRig({ progressRef }) {
  const { camera } = useThree();
  const look = useRef({ x: 0, y: 1.2, z: 8 });
  const pos = useRef({ x: 0.35, y: 1.55, z: 22.5 });
  const fov = useRef(40);

  useFrame((_, delta) => {
    const target = sampleCameraPath(progressRef.current || 0);
    const damp = 1 - Math.exp(-2.4 * delta);

    pos.current.x += (target.position[0] - pos.current.x) * damp;
    pos.current.y += (target.position[1] - pos.current.y) * damp;
    pos.current.z += (target.position[2] - pos.current.z) * damp;

    look.current.x += (target.lookAt[0] - look.current.x) * damp;
    look.current.y += (target.lookAt[1] - look.current.y) * damp;
    look.current.z += (target.lookAt[2] - look.current.z) * damp;

    fov.current += (target.fov - fov.current) * damp;

    camera.position.set(pos.current.x, pos.current.y, pos.current.z);
    camera.lookAt(look.current.x, look.current.y, look.current.z);
    if (Math.abs(camera.fov - fov.current) > 0.01) {
      camera.fov = fov.current;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

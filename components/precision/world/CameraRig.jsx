"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sampleCameraPath } from "@/lib/data/precision";

/**
 * Stable camera — clamps delta spikes (tab focus) that cause glitchy jumps.
 */
export default function CameraRig({ progressRef, exhibitRef }) {
  const { camera } = useThree();
  const look = useRef({ x: -2.2, y: 1.35, z: 14.5 });
  const pos = useRef({ x: 0.4, y: 1.6, z: 21.5 });
  const fov = useRef(42);
  const blend = useRef(0);
  const lastToken = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(Math.max(delta, 0), 0.05);
    const exhibit = exhibitRef?.current;
    const journey = sampleCameraPath(progressRef.current || 0);

    let target = journey;
    let rate = 1.85;

    if (exhibit?.active && exhibit.cam && exhibit.look) {
      if (exhibit.token && exhibit.token !== lastToken.current) {
        lastToken.current = exhibit.token;
        blend.current = 0;
      }
      blend.current = THREE.MathUtils.damp(blend.current, 1, 1.15, dt);
      const b = blend.current;
      const mid = exhibit.mid || {
        position: [
          (journey.position[0] + exhibit.cam[0]) * 0.5,
          Math.max(journey.position[1], exhibit.cam[1]) + 0.15,
          (journey.position[2] + exhibit.cam[2]) * 0.5,
        ],
        lookAt: exhibit.look,
      };

      const from = b < 0.5 ? journey : mid;
      const to =
        b < 0.5
          ? mid
          : { position: exhibit.cam, lookAt: exhibit.look, fov: exhibit.fov || 34 };
      const local = THREE.MathUtils.smoothstep(b < 0.5 ? b / 0.5 : (b - 0.5) / 0.5, 0, 1);

      const fromLook = from.lookAt || journey.lookAt;
      const toLook = to.lookAt || exhibit.look;

      target = {
        position: [
          from.position[0] + (to.position[0] - from.position[0]) * local,
          from.position[1] + (to.position[1] - from.position[1]) * local,
          from.position[2] + (to.position[2] - from.position[2]) * local,
        ],
        lookAt: [
          fromLook[0] + (toLook[0] - fromLook[0]) * local,
          fromLook[1] + (toLook[1] - fromLook[1]) * local,
          fromLook[2] + (toLook[2] - fromLook[2]) * local,
        ],
        fov: THREE.MathUtils.lerp(journey.fov, exhibit.fov || 34, b),
      };
      rate = 2.2;
    } else {
      lastToken.current = 0;
      blend.current = THREE.MathUtils.damp(blend.current, 0, 1.8, dt);
      rate = 1.85;
    }

    const damp = 1 - Math.exp(-rate * dt);

    pos.current.x += (target.position[0] - pos.current.x) * damp;
    pos.current.y += (target.position[1] - pos.current.y) * damp;
    pos.current.z += (target.position[2] - pos.current.z) * damp;

    look.current.x += (target.lookAt[0] - look.current.x) * damp;
    look.current.y += (target.lookAt[1] - look.current.y) * damp;
    look.current.z += (target.lookAt[2] - look.current.z) * damp;

    fov.current += (target.fov - fov.current) * damp;

    camera.position.set(pos.current.x, pos.current.y, pos.current.z);
    camera.lookAt(look.current.x, look.current.y, look.current.z);
    if (Math.abs(camera.fov - fov.current) > 0.02) {
      camera.fov = fov.current;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

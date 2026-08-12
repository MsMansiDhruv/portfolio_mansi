"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Maps pointer to a world-space point on a horizontal plane (y≈1.25).
 * Drives subtle data influence — never a giant game cursor.
 */
export default function CursorBridge({ cursorRef }) {
  const { camera, gl } = useThree();
  const ndc = useRef(new THREE.Vector2(0, 0));
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.25));
  const hit = useRef(new THREE.Vector3());

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      ndc.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [gl]);

  useFrame(() => {
    if (!cursorRef?.current) return;
    raycaster.current.setFromCamera(ndc.current, camera);
    const ok = raycaster.current.ray.intersectPlane(plane.current, hit.current);
    if (ok) {
      cursorRef.current.x = THREE.MathUtils.damp(cursorRef.current.x, hit.current.x, 8, 0.016);
      cursorRef.current.y = THREE.MathUtils.damp(cursorRef.current.y, hit.current.y, 8, 0.016);
      cursorRef.current.z = THREE.MathUtils.damp(cursorRef.current.z, hit.current.z, 8, 0.016);
    }
  });

  return null;
}

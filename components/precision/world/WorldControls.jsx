"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Hall observation controls:
 * - drag to look (subtle)
 * - wheel to move forward/back through the atrium
 * Disabled while inside an exhibit.
 */
export default function WorldControls({ cameraTargetRef, lookOffsetRef, enabled }) {
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onDown = (e) => {
      if (!enabled) return;
      // Right-drag observes; left click reserved for exhibits / UI
      if (e.button !== 2) return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onUp = () => {
      dragging = false;
    };

    const onMove = (e) => {
      if (!enabled || !dragging || !lookOffsetRef?.current) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      lookOffsetRef.current.yaw = Math.max(-1.8, Math.min(1.8, lookOffsetRef.current.yaw - dx * 0.004));
      lookOffsetRef.current.pitch = Math.max(-0.6, Math.min(0.6, lookOffsetRef.current.pitch + dy * 0.003));
    };

    const onWheel = (e) => {
      if (!enabled || !cameraTargetRef?.current) return;
      e.preventDefault();
      const t = cameraTargetRef.current;
      if (t.mode !== "hall") return;
      const step = Math.sign(e.deltaY) * 0.85;
      const nextZ = Math.max(-16, Math.min(16, t.position[2] + step));
      const nextLookZ = Math.max(-24, Math.min(10, t.lookAt[2] + step));
      cameraTargetRef.current = {
        ...t,
        token: Date.now(),
        mode: "hall",
        position: [t.position[0], t.position[1], nextZ],
        lookAt: [t.lookAt[0], t.lookAt[1], nextLookZ],
        mid: null,
      };
      // Soften look offset when travelling
      if (lookOffsetRef?.current) {
        lookOffsetRef.current.yaw *= 0.85;
        lookOffsetRef.current.pitch *= 0.85;
      }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("wheel", onWheel);
    };
  }, [gl, enabled, cameraTargetRef, lookOffsetRef]);

  return null;
}

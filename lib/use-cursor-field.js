"use client";

import { useEffect } from "react";

/** Smoothed window pointer for the particle field (desktop + touch). */
export function useCursorField(cursorRef) {
  useEffect(() => {
    const target = { nx: 0, ny: 0, active: false };
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: coarse)")?.matches;
    let raf = 0;
    let touchActive = false;

    const toNdc = (clientX, clientY) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      return {
        nx: (clientX / w) * 2 - 1,
        ny: -((clientY / h) * 2 - 1),
      };
    };

    const move = (event) => {
      const next = toNdc(event.clientX, event.clientY);
      target.nx = next.nx;
      target.ny = next.ny;
      target.active = true;
    };
    const down = () => {
      touchActive = true;
      target.active = true;
    };
    const stop = () => {
      if (coarse && touchActive) return;
      target.active = false;
    };
    const up = () => {
      touchActive = false;
      if (coarse) target.active = false;
    };
    const tick = () => {
      const cur = cursorRef.current;
      if (cur) {
        const ease = target.active ? (coarse ? 0.2 : 0.14) : 0.08;
        const nx = cur.nx + (target.nx - cur.nx) * ease;
        const ny = cur.ny + (target.ny - cur.ny) * ease;
        cur.vx = nx - cur.nx;
        cur.vy = ny - cur.ny;
        cur.nx = nx;
        cur.ny = ny;
        if (cur.x == null) {
          cur.x = nx * 2.4;
          cur.y = ny * 1.5;
          cur.z = 0;
        }
        const stillMoving = Math.hypot(target.nx - nx, target.ny - ny) > 0.003;
        cur.active = target.active || stillMoving;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", up);
    window.addEventListener("blur", stop);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("blur", stop);
    };
  }, [cursorRef]);
}

"use client";

import { useEffect } from "react";

/** Drive the particle field from window pointer, even when the canvas cannot receive events. */
export function useCursorField(cursorRef) {
  useEffect(() => {
    const move = (event) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const nx = (event.clientX / w) * 2 - 1;
      const ny = -((event.clientY / h) * 2 - 1);
      const cur = cursorRef.current;
      if (!cur) return;
      cur.vx = nx - cur.nx;
      cur.vy = ny - cur.ny;
      cur.nx = nx;
      cur.ny = ny;
      cur.x = nx * 2.4;
      cur.y = ny * 1.5;
      cur.z = 0;
      cur.active = true;
    };
    const stop = () => {
      if (cursorRef.current) cursorRef.current.active = false;
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", stop);
    document.addEventListener("mouseleave", stop);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", stop);
      document.removeEventListener("mouseleave", stop);
    };
  }, [cursorRef]);
}

"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL = 16;

export default function SystemCursor({ enabled = true }) {
  const headRef = useRef(null);
  const trailRef = useRef(null);
  const pos = useRef({ x: -80, y: -80 });
  const points = useRef(Array.from({ length: TRAIL }, () => ({ x: -80, y: -80 })));
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;

    const root = document.querySelector(".wd-root");
    root?.classList.add("wd-has-cursor");

    let raf = 0;
    const move = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      setOn(true);
    };
    const leave = () => setOn(false);

    const tick = () => {
      const pts = points.current;
      pts[0].x += (pos.current.x - pts[0].x) * 0.42;
      pts[0].y += (pos.current.y - pts[0].y) * 0.42;
      for (let i = 1; i < TRAIL; i += 1) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * (0.28 - i * 0.008);
        pts[i].y += (pts[i - 1].y - pts[i].y) * (0.28 - i * 0.008);
      }
      if (headRef.current) {
        headRef.current.style.transform = `translate3d(${pts[0].x}px, ${pts[0].y}px, 0)`;
      }
      const nodes = trailRef.current?.children;
      if (nodes) {
        for (let i = 0; i < nodes.length; i += 1) {
          const p = pts[i + 1];
          if (!p) break;
          nodes[i].style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(${1 - i / TRAIL})`;
          nodes[i].style.opacity = String(0.55 * (1 - i / TRAIL));
        }
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
      root?.classList.remove("wd-has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={`wd-cursor-field${on ? " is-on" : ""}`} aria-hidden>
      <div ref={headRef} className="wd-cursor-field__head" />
      <div ref={trailRef} className="wd-cursor-field__trail">
        {Array.from({ length: TRAIL - 1 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  );
}

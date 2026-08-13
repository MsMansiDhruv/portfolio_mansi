"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Precision reticle — expands over data / targets when interactive.
 */
export default function SystemCursor({ mode = "idle", enabled = true }) {
  const ref = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.querySelector(".wd-root");
    if (root) root.classList.add("wd-has-cursor");

    let raf = 0;
    const onMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    const tick = () => {
      smooth.current.x += (pos.current.x - smooth.current.x) * 0.22;
      smooth.current.y += (pos.current.y - smooth.current.y) * 0.22;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${smooth.current.x}px, ${smooth.current.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      root?.classList.remove("wd-has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      className={`wd-cursor wd-cursor--${mode}${visible ? " is-on" : ""}`}
      aria-hidden
    >
      <span className="wd-cursor__ring" />
      <span className="wd-cursor__core" />
    </div>
  );
}

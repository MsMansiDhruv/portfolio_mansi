"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Precision reticle with spring interpolation.
 */
export default function SystemCursor({ mode = "idle", enabled = true }) {
  const ref = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const vel = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

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
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const tick = () => {
      // Spring toward pointer
      const stiffness = 0.18;
      const damping = 0.72;
      const dx = pos.current.x - smooth.current.x;
      const dy = pos.current.y - smooth.current.y;
      vel.current.x = (vel.current.x + dx * stiffness) * damping;
      vel.current.y = (vel.current.y + dy * stiffness) * damping;
      smooth.current.x += vel.current.x;
      smooth.current.y += vel.current.y;
      if (ref.current) {
        const s = pressed ? 0.86 : 1;
        ref.current.style.transform = `translate3d(${smooth.current.x}px, ${smooth.current.y}px, 0) scale(${s})`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
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

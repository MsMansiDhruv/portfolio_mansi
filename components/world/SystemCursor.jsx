"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Minimal precision instrument — small point, subtle state ring.
 */
export default function SystemCursor({ mode = "idle", enabled = true }) {
  const ref = useRef(null);
  const pos = useRef({ x: -40, y: -40 });
  const smooth = useRef({ x: -40, y: -40 });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.querySelector(".wd-root");
    root?.classList.add("wd-has-cursor");

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
      smooth.current.x += (pos.current.x - smooth.current.x) * 0.28;
      smooth.current.y += (pos.current.y - smooth.current.y) * 0.28;
      if (ref.current) {
        const s = pressed ? 0.78 : 1;
        ref.current.style.transform = `translate3d(${smooth.current.x}px, ${smooth.current.y}px, 0) scale(${s})`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
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
      className={`wd-cursor wd-cursor--${mode}${visible ? " is-on" : ""}${pressed ? " is-press" : ""}`}
      aria-hidden
    >
      <span className="wd-cursor__dot" />
      <span className="wd-cursor__halo" />
    </div>
  );
}

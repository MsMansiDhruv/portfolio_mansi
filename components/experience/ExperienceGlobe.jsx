"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/design-system-v2";
import { createDhruvaSky } from "./engine/createDhruvaSky";

export default function ExperienceGlobe({ progress, visible, onTerritoryHover, onTerritoryClick }) {
  const canvasRef = useRef(null);
  const worldRef = useRef(null);
  const rafRef = useRef(null);
  const progressRef = useRef(0);
  const mountedThemeRef = useRef(null);
  const hoverRef = useRef(onTerritoryHover);
  const clickRef = useRef(onTerritoryClick);
  const { isDark } = useTheme();

  hoverRef.current = onTerritoryHover;
  clickRef.current = onTerritoryClick;

  useEffect(() => {
    progressRef.current = progress;
    worldRef.current?.setProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (!visible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const world = createDhruvaSky(canvas, {
      isDark: mountedThemeRef.current ?? isDark,
      onTerritoryHover: (idx) => hoverRef.current?.(idx),
    });
    mountedThemeRef.current = isDark;
    worldRef.current = world;

    const onResize = () => world.resize(window.innerWidth, window.innerHeight);
    onResize();
    window.addEventListener("resize", onResize);

    const onMove = (e) => {
      world.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const onClick = () => {
      const idx = world.click();
      if (idx >= 0) clickRef.current?.(idx);
    };
    canvas.addEventListener("click", onClick);

    const loop = (now) => {
      world.setProgress(progressRef.current);
      world.render(now);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("click", onClick);
      world.dispose();
      worldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    worldRef.current?.setTheme(isDark);
  }, [isDark]);

  if (!visible) return null;

  return (
    <div className="mx-canvas-wrap" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}

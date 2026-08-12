"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/design-system-v2";
import { createExhibitionHall } from "./engine/createExhibitionHall";

export default function WorkHallCanvas({ progress, onPick }) {
  const canvasRef = useRef(null);
  const worldRef = useRef(null);
  const rafRef = useRef(null);
  const progressRef = useRef(0);
  const pickRef = useRef(onPick);
  const { isDark } = useTheme();
  pickRef.current = onPick;

  useEffect(() => {
    progressRef.current = progress;
    worldRef.current?.setProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const world = createExhibitionHall(canvasRef.current, { isDark });
    worldRef.current = world;

    const onResize = () => world.resize(window.innerWidth, window.innerHeight);
    onResize();
    window.addEventListener("resize", onResize);

    const onMove = (e) => {
      world.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const onClick = () => {
      const idx = world.pick();
      if (idx >= 0) pickRef.current?.(idx);
    };
    canvasRef.current.addEventListener("click", onClick);

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
      canvasRef.current?.removeEventListener("click", onClick);
      world.dispose();
      worldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    worldRef.current?.setTheme(isDark);
  }, [isDark]);

  return (
    <div className="wk-canvas" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}

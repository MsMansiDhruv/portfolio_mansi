"use client";

import { useEffect, useRef, useState } from "react";
import { createDataWorld } from "./engine/createDataWorld";
import WorldOverlay from "./WorldOverlay";
import WorldNav from "./WorldNav";
import WorldFallback from "./WorldFallback";
import "@/styles/data-world.css";

export default function DataWorldExperience() {
  const canvasRef = useRef(null);
  const trackRef = useRef(null);
  const worldRef = useRef(null);
  const rafRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    if (reduced || mobile) {
      setUseFallback(true);
      return;
    }

    let disposed = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const world = createDataWorld(canvas);
    worldRef.current = world;

    const onResize = () => {
      world.resize(window.innerWidth, window.innerHeight);
    };
    onResize();
    window.addEventListener("resize", onResize);

    const loop = () => {
      if (disposed) return;
      world.render();
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    let scrollTriggerCleanup = () => {};

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapMod, stMod]) => {
      if (disposed) return;
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        trigger: trackRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          world.setProgress(self.progress);
          setProgress(self.progress);
        },
      });
      scrollTriggerRef.current = st;
      scrollTriggerCleanup = () => st.kill();
      setReady(true);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      scrollTriggerCleanup();
      world.dispose();
    };
  }, []);

  if (useFallback) {
    return <WorldFallback />;
  }

  return (
    <div className="data-world">
      <WorldNav progress={progress} />

      <div className="dw-canvas-wrap" aria-hidden>
        <canvas ref={canvasRef} />
      </div>

      <div className="dw-vignette" />
      <div className="dw-grain" />

      <WorldOverlay progress={progress} />

      <div ref={trackRef} className="dw-scroll-track" aria-hidden={!ready} />

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-20 -translate-x-1/2">
        <p className="dw-mono text-[10px] text-[var(--dw-muted)] opacity-60">Scroll to travel</p>
      </div>
    </div>
  );
}

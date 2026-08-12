"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/design-system-v2";
import { createUniverse } from "./engine/createUniverse";
import { UNIVERSE_NODES } from "@/lib/data/universe-nodes";

export default function UniverseCanvas({ onHover, onTransitionStart, worldRef: externalWorldRef }) {
  const canvasRef = useRef(null);
  const localWorldRef = useRef(null);
  const rafRef = useRef(null);
  const onHoverRef = useRef(onHover);
  const onTransitionStartRef = useRef(onTransitionStart);
  const { isDark } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    onHoverRef.current = onHover;
  }, [onHover]);

  useEffect(() => {
    onTransitionStartRef.current = onTransitionStart;
  }, [onTransitionStart]);

  const handleNodeClick = useCallback(
    (nodeId) => {
      const node = UNIVERSE_NODES.find((n) => n.id === nodeId);
      if (!node) return;
      if (node.href) {
        onTransitionStartRef.current?.(node);
        const world = localWorldRef.current;
        if (world?.beginTransition) {
          world.beginTransition(nodeId, () => router.push(node.href));
        } else {
          router.push(node.href);
        }
        return;
      }
      if (node.vignette) {
        onHoverRef.current?.({ ...node, click: true });
      }
    },
    [router]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const world = createUniverse(canvasRef.current, {
      nodes: UNIVERSE_NODES,
      isDark,
      onHover: (id) => {
        const node = UNIVERSE_NODES.find((n) => n.id === id);
        onHoverRef.current?.(node ?? null);
      },
      onNodeClick: handleNodeClick,
    });
    localWorldRef.current = world;
    if (externalWorldRef) externalWorldRef.current = world;

    const onResize = () => {
      world.resize(window.innerWidth, window.innerHeight);
    };
    onResize();
    window.addEventListener("resize", onResize);

    const introStart = performance.now();
    const loop = (now) => {
      const intro = Math.min(1, (now - introStart) / 2200);
      world.setIntro(intro);
      world.render();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      if (externalWorldRef) externalWorldRef.current = null;
      localWorldRef.current = null;
      world.dispose();
    };
  }, [mounted, handleNodeClick, isDark, externalWorldRef]);

  useEffect(() => {
    localWorldRef.current?.setTheme(isDark);
  }, [isDark]);

  return (
    <div className="universe-canvas-wrap">
      <canvas ref={canvasRef} aria-label="Interactive personal universe. Drag to rotate. Click nodes to explore." />
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";

const NODES = [
  { x: "12%", y: "18%", size: 4, delay: 0 },
  { x: "78%", y: "12%", size: 6, delay: 0.4 },
  { x: "88%", y: "62%", size: 3, delay: 0.8 },
  { x: "22%", y: "72%", size: 5, delay: 0.2 },
  { x: "55%", y: "45%", size: 2, delay: 1 },
];

export default function WorldAmbient() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="world-grain" />
      <div className="absolute inset-0 world-grid opacity-40" />
      <p
        className="world-display absolute -left-[5%] top-[8%] select-none text-[clamp(5rem,18vw,14rem)] font-extrabold leading-none text-white/[0.025]"
      >
        MANSI
      </p>
      <p className="world-editorial absolute bottom-[12%] right-[2%] select-none text-[clamp(3rem,10vw,8rem)] text-white/[0.03]">
        systems
      </p>
      {!reduced
        ? NODES.map((node, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-[var(--world-cyan)]"
              style={{
                left: node.x,
                top: node.y,
                width: node.size,
                height: node.size,
                boxShadow: `0 0 ${node.size * 4}px rgba(61, 224, 255, 0.35)`,
              }}
              animate={{ opacity: [0.25, 0.7, 0.25], scale: [1, 1.2, 1] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: node.delay }}
            />
          ))
        : null}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(61,224,255,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_80%,rgba(157,123,255,0.08),transparent_50%)]" />
    </div>
  );
}

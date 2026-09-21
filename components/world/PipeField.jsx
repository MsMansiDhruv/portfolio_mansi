"use client";

import { useEffect, useId, useRef, useState } from "react";

const NODES = [
  { id: "spark", x: 16, y: 26, label: "Spark" },
  { id: "delta", x: 38, y: 68, label: "Delta" },
  { id: "aws", x: 62, y: 22, label: "AWS" },
  { id: "sql", x: 84, y: 64, label: "SQL" },
  { id: "ml", x: 50, y: 46, label: "MLflow" },
];

export default function PipeField({ accent = "about" }) {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef(null);
  const [hot, setHot] = useState(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const parent = root.parentElement;
    const onMove = (event) => {
      const box = root.getBoundingClientRect();
      root.style.setProperty("--px", `${((event.clientX - box.left) / box.width) * 100}%`);
      root.style.setProperty("--py", `${((event.clientY - box.top) / box.height) * 100}%`);
    };
    parent?.addEventListener("pointermove", onMove);
    return () => parent?.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={rootRef} className={`wd-pipespace wd-pipespace--${accent}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path id={`${uid}-a`} d="M4 22 C 28 8, 36 44, 52 46 S 78 12, 96 28" />
        <path id={`${uid}-b`} d="M4 78 C 26 58, 42 90, 68 72 S 88 90, 96 60" />
        <path d="M8 50 H 92" />
        <circle r="1.6" fill="var(--wd-accent)">
          <animateMotion dur="5.5s" repeatCount="indefinite">
            <mpath href={`#${uid}-a`} />
          </animateMotion>
        </circle>
        <circle r="1.5" fill="#f97316">
          <animateMotion dur="7.2s" repeatCount="indefinite">
            <mpath href={`#${uid}-b`} />
          </animateMotion>
        </circle>
      </svg>
      {NODES.map((node) => (
        <button
          key={node.id}
          type="button"
          className={`wd-pipespace__node${hot === node.id ? " is-on" : ""}`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          onClick={() => setHot(node.id)}
        >
          {node.label}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

export default function DataField({ variant = "wave" }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    const host = node?.parentElement;
    if (!node || !host) return undefined;
    const onMove = (event) => {
      const box = host.getBoundingClientRect();
      node.style.setProperty("--mx", `${((event.clientX - box.left) / box.width) * 100}%`);
      node.style.setProperty("--my", `${((event.clientY - box.top) / box.height) * 100}%`);
    };
    host.addEventListener("pointermove", onMove);
    return () => host.removeEventListener("pointermove", onMove);
  }, []);

  return <div ref={ref} className={`wd-datafield wd-datafield--${variant}`} aria-hidden />;
}

export function tiltHandlers() {
  return {
    onPointerMove: (event) => {
      const el = event.currentTarget;
      const box = el.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      el.style.setProperty("--rx", `${(-y * 9).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 11).toFixed(2)}deg`);
      el.style.setProperty("--lx", `${(x + 0.5) * 100}%`);
      el.style.setProperty("--ly", `${(y + 0.5) * 100}%`);
    },
    onPointerLeave: (event) => {
      const el = event.currentTarget;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    },
  };
}

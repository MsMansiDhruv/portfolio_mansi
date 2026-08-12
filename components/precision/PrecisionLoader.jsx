"use client";

import { useEffect, useState } from "react";
import ConvergenceMark from "./ConvergenceMark";

export default function PrecisionLoader({ ready }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const done = mounted && ready;

  return (
    <div className={`mp-loader${done ? " is-done" : ""}`} aria-hidden={done}>
      <div className="mp-loader__inner">
        <ConvergenceMark size={28} />
        <span className="mp-loader__label">Calibrating</span>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

function CountUp({ value, duration = 1200 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * value));

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function ActivityStats({ isDay }) {
  // 🔁 replace later with real analytics
  const stats = [
    { label: "Page Views", value: 12874 },
    { label: "Clicks", value: 2319 },
    { label: "Unique Visits", value: 4861 },
  ];

  return (
    <div
      className={`mt-6 rounded-lg border p-4 ${
        isDay
          ? "bg-white/70 border-slate-200"
          : "bg-slate-900/60 border-slate-700"
      }`}
    >
      <div className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">
        Activity
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div
              className="text-xl font-bold"
              style={{ color: "var(--accent)" }}
            >
              <CountUp value={s.value} />
            </div>
            <div className="text-xs mt-1 text-slate-500 dark:text-slate-400">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

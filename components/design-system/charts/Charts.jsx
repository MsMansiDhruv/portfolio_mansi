"use client";

import { useMemo } from "react";
import { cn } from "../../lib/cn";

const DEFAULT_COLORS = [
  "var(--ds-chart-1)",
  "var(--ds-chart-2)",
  "var(--ds-chart-3)",
  "var(--ds-chart-4)",
  "var(--ds-chart-5)",
];

function scaleLinear(domain, range, value) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  if (d1 === d0) return r0;
  return r0 + ((value - d0) / (d1 - d0)) * (r1 - r0);
}

export function Sparkline({
  data = [],
  width = 120,
  height = 32,
  stroke = "var(--ds-accent)",
  className,
  fill = true,
}) {
  const path = useMemo(() => {
    if (!data.length) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const pad = 2;
    const points = data.map((v, i) => {
      const x = scaleLinear([0, data.length - 1], [pad, width - pad], i);
      const y = scaleLinear([min, max], [height - pad, pad], v);
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  }, [data, width, height]);

  const areaPath = fill && path ? `${path} L ${width - 2} ${height} L 2 ${height} Z` : "";

  return (
    <svg width={width} height={height} className={cn("ds-chart", className)} aria-hidden>
      {areaPath ? (
        <path d={areaPath} fill="var(--ds-accent-subtle)" stroke="none" />
      ) : null}
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BarChart({
  data = [],
  width = 320,
  height = 160,
  barGap = 8,
  className,
  showGrid = true,
}) {
  const { bars, max } = useMemo(() => {
    const values = data.map((d) => (typeof d === "number" ? d : d.value));
    const maxV = Math.max(...values, 1);
    const chartH = height - 28;
    const barW = (width - barGap * (data.length + 1)) / Math.max(data.length, 1);
    const bars = data.map((d, i) => {
      const value = typeof d === "number" ? d : d.value;
      const label = typeof d === "number" ? "" : d.label;
      const h = (value / maxV) * chartH;
      const x = barGap + i * (barW + barGap);
      const y = height - 24 - h;
      return { x, y, w: barW, h, label, value, color: DEFAULT_COLORS[i % DEFAULT_COLORS.length] };
    });
    return { bars, max: maxV };
  }, [data, width, height, barGap]);

  return (
    <svg
      width={width}
      height={height}
      className={cn("ds-chart", className)}
      role="img"
      aria-label="Bar chart"
    >
      {showGrid
        ? [0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1={0}
              x2={width}
              y1={height - 24 - (height - 28) * t}
              y2={height - 24 - (height - 28) * t}
              className="ds-chart__grid-line"
            />
          ))
        : null}
      {bars.map((b) => (
        <g key={b.label || b.x}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4} fill={b.color} opacity={0.9} />
          {b.label ? (
            <text x={b.x + b.w / 2} y={height - 6} textAnchor="middle" className="ds-chart__axis">
              {b.label}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}

export function LineChart({
  series = [],
  width = 320,
  height = 160,
  className,
  showGrid = true,
}) {
  const paths = useMemo(() => {
    const allY = series.flatMap((s) => s.data);
    if (!allY.length) return [];
    const min = Math.min(...allY);
    const max = Math.max(...allY);
    const chartW = width - 16;
    const chartH = height - 24;

    return series.map((s, si) => {
      const len = s.data.length;
      const pts = s.data.map((v, i) => {
        const x = 8 + scaleLinear([0, len - 1], [0, chartW], i);
        const y = 8 + scaleLinear([max, min], [0, chartH], v);
        return `${x},${y}`;
      });
      return {
        d: `M ${pts.join(" L ")}`,
        color: s.color || DEFAULT_COLORS[si % DEFAULT_COLORS.length],
        name: s.name,
      };
    });
  }, [series, width, height]);

  return (
    <svg width={width} height={height} className={cn("ds-chart", className)} role="img" aria-label="Line chart">
      {showGrid
        ? [0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1={8}
              x2={width - 8}
              y1={8 + (height - 32) * t}
              y2={8 + (height - 32) * t}
              className="ds-chart__grid-line"
            />
          ))
        : null}
      {paths.map((p) => (
        <path key={p.name || p.d} d={p.d} fill="none" stroke={p.color} strokeWidth={2} strokeLinecap="round" />
      ))}
    </svg>
  );
}

export function DonutChart({
  segments = [],
  size = 120,
  strokeWidth = 14,
  className,
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width={size} height={size} className={cn("ds-chart", className)} role="img" aria-label="Donut chart">
      <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
        {segments.map((seg, i) => {
          const len = (seg.value / total) * c;
          const dash = `${len} ${c - len}`;
          const el = (
            <circle
              key={seg.label || i}
              r={r}
              fill="none"
              stroke={seg.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
          offset += len;
          return el;
        })}
      </g>
    </svg>
  );
}

export { DEFAULT_COLORS as chartColors };

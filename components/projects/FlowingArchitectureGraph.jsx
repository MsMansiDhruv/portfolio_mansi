"use client";

import { useId, useMemo, useState } from "react";

function port(node, side) {
  if (side === "left") return [node.x, node.y + node.h / 2];
  if (side === "top") return [node.x + node.w / 2, node.y];
  if (side === "bottom") return [node.x + node.w / 2, node.y + node.h];
  return [node.x + node.w, node.y + node.h / 2];
}

function edgePath(a, b, fromSide = "right", toSide = "left") {
  const [x1, y1] = port(a, fromSide);
  const [x2, y2] = port(b, toSide);
  if (fromSide === "bottom" && toSide === "top") {
    const mid = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`;
  }
  if (fromSide === "right" && toSide === "bottom") {
    return `M ${x1} ${y1} C ${x2} ${y1}, ${x2} ${y1}, ${x2} ${y2}`;
  }
  if (fromSide === "left" && toSide === "right") {
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  }
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function viewBoxFor(graph) {
  let maxX = 320;
  let maxY = 220;
  (graph.zones || []).forEach((z) => {
    maxX = Math.max(maxX, z.x + z.w);
    maxY = Math.max(maxY, z.y + z.h);
  });
  (graph.nodes || []).forEach((n) => {
    maxX = Math.max(maxX, n.x + n.w);
    maxY = Math.max(maxY, n.y + n.h);
  });
  return `0 0 ${Math.ceil(maxX + 18)} ${Math.ceil(maxY + 18)}`;
}

export default function FlowingArchitectureGraph({ graph, compact = false }) {
  const uid = useId().replace(/:/g, "");
  const [active, setActive] = useState(null);
  const nodes = graph?.nodes || [];
  const edges = graph?.edges || [];
  const zones = graph?.zones || [];
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const linked = useMemo(() => {
    if (!active) return new Set();
    const ids = new Set([active]);
    (edges || []).forEach((e) => {
      if (e.from === active) ids.add(e.to);
      if (e.to === active) ids.add(e.from);
    });
    return ids;
  }, [active, edges]);

  if (!nodes.length) return null;

  return (
    <figure className={`wk-flow-graph${compact ? " wk-flow-graph--compact" : ""}`} aria-label={graph.caption || graph.title}>
      <svg
        className="wk-flow-graph__svg"
        viewBox={viewBoxFor(graph)}
        role="img"
        aria-labelledby={`${uid}-title ${uid}-desc`}
      >
        <title id={`${uid}-title`}>{graph.title || "Architecture flow"}</title>
        <desc id={`${uid}-desc`}>{graph.caption || ""}</desc>
        {(zones || []).map((z) => (
          <g key={z.id} className="wk-flow-zone">
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="16" />
            <text x={z.x + 14} y={z.y + 22}>
              {z.label}
            </text>
          </g>
        ))}

        {(edges || []).map((edge, i) => {
          const a = byId[edge.from];
          const b = byId[edge.to];
          if (!a || !b) return null;
          const d = edgePath(a, b, edge.fromSide, edge.toSide);
          const pid = `${uid}-p${i}`;
          const live = !active || linked.has(edge.from) || linked.has(edge.to);
          return (
            <g key={`${edge.from}-${edge.to}-${i}`} className={`wk-flow-edge ${live ? "is-live" : "is-dim"}`}>
              <path id={pid} d={d} className="wk-flow-edge__rail" fill="none" />
              <path d={d} className="wk-flow-edge__dash" pathLength="100" fill="none" />
              <circle r="3.2" className="wk-flow-edge__dot">
                <animateMotion dur={`${2.4 + (i % 5) * 0.35}s`} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#${pid}`} />
                </animateMotion>
              </circle>
            </g>
          );
        })}

        {nodes.map((node) => {
          const on = !active || linked.has(node.id);
          return (
            <g
              key={node.id}
              className={`wk-flow-node ${node.accent ? "is-accent" : ""} ${on ? "is-on" : "is-dim"} ${active === node.id ? "is-active" : ""}`}
              transform={`translate(${node.x} ${node.y})`}
              onPointerEnter={compact ? undefined : () => setActive(node.id)}
              onPointerLeave={compact ? undefined : () => setActive(null)}
              onFocus={compact ? undefined : () => setActive(node.id)}
              onBlur={compact ? undefined : () => setActive(null)}
              tabIndex={compact ? undefined : 0}
              role={compact ? undefined : "button"}
              aria-label={node.sub ? `${node.label}, ${node.sub}` : node.label}
            >
              <rect width={node.w} height={node.h} rx="10" />
              <text className="wk-flow-node__label" x={node.w / 2} y={node.sub ? node.h / 2 - 4 : node.h / 2 + 4}>
                {node.label}
              </text>
              {node.sub ? (
                <text className="wk-flow-node__sub" x={node.w / 2} y={node.h / 2 + 12}>
                  {node.sub}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      {!compact && graph.caption ? <figcaption className="wk-flow-graph__cap">{graph.caption}</figcaption> : null}
    </figure>
  );
}

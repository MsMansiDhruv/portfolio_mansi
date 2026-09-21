import { AMC_FLOW_GRAPH } from "@/lib/data/amc-flow-graph";
import { getProjectMeta } from "@/lib/data/project-meta";

const NODE_W = 138;
const NODE_H = 46;
const COL_GAP = 26;

function columnGraph({ title, caption, columns }) {
  let x = 14;
  const zones = [];
  const nodes = [];
  const edges = [];
  let prevIds = [];
  const colHeights = columns.map((col) => 52 + col.nodes.length * (NODE_H + 14) - 14);
  const zoneH = Math.max(220, ...colHeights);

  columns.forEach((col, ci) => {
    const w = NODE_W + 28;
    zones.push({ id: col.zone, label: col.zone, x, y: 18, w, h: zoneH });
    const ids = [];
    const stackH = col.nodes.length * (NODE_H + 14) - 14;
    const startY = 52 + Math.max(0, (zoneH - 40 - stackH) / 2);
    col.nodes.forEach((n, ni) => {
      nodes.push({
        ...n,
        x: x + 14,
        y: startY + ni * (NODE_H + 14),
        w: n.w || NODE_W,
        h: n.h || NODE_H,
        zone: col.zone,
      });
      ids.push(n.id);
    });
    if (ci > 0) {
      if (ids.length === 1) prevIds.forEach((pid) => edges.push({ from: pid, to: ids[0] }));
      else if (prevIds.length === 1) ids.forEach((id) => edges.push({ from: prevIds[0], to: id }));
      else {
        const n = Math.min(prevIds.length, ids.length);
        for (let i = 0; i < n; i += 1) edges.push({ from: prevIds[i], to: ids[i] });
        if (prevIds.length > ids.length) {
          prevIds.slice(ids.length).forEach((pid) => edges.push({ from: pid, to: ids[ids.length - 1] }));
        }
      }
    }
    prevIds = ids;
    x += w + COL_GAP;
  });

  return { title, caption, zones, nodes, edges };
}

function graphFromLayers(meta) {
  const layers =
    (meta.architectureLayers && meta.architectureLayers.length && meta.architectureLayers) ||
    (meta.responsibilities && meta.responsibilities.slice(0, 4)) ||
    (meta.tech && meta.tech.slice(0, 4)) ||
    ["System"];
  return columnGraph({
    title: meta.title,
    caption: meta.summary || meta.purpose || "",
    columns: layers.map((label, i) => {
      const [head, tail] = String(label).split("—").map((s) => s.trim());
      return {
        zone: head.slice(0, 18),
        nodes: [
          {
            id: `n${i}`,
            label: head.slice(0, 22),
            sub: tail ? tail.slice(0, 26) : null,
            accent: i === layers.length - 1 || i === Math.floor((layers.length - 1) / 2),
          },
        ],
      };
    }),
  });
}

const GRAPHS = {
  "project-amc-datalake-solution": {
    ...AMC_FLOW_GRAPH,
    title: "Legacy data platform",
  },

  "automated-intelligence-pipeline": {
    title: "Web intelligence pipeline",
    caption: "RSS, generic, and site-specific crawlers merge into unique storage, then DS classification and reporting.",
    zones: [
      { id: "src", label: "Sources", x: 12, y: 20, w: 150, h: 340 },
      { id: "extract", label: "Extract", x: 176, y: 20, w: 320, h: 340 },
      { id: "store", label: "Store", x: 510, y: 20, w: 168, h: 340 },
      { id: "score", label: "Classify", x: 692, y: 20, w: 176, h: 340 },
      { id: "out", label: "Report", x: 882, y: 20, w: 168, h: 340 },
    ],
    nodes: [
      { id: "start", label: "Start", x: 26, y: 168, w: 122, h: 42, zone: "src" },
      { id: "links", label: "Source links", x: 26, y: 230, w: 122, h: 44, zone: "src", accent: true },
      { id: "rss", label: "RSS crawler", sub: "feedparser", x: 194, y: 56, w: 140, h: 48, zone: "extract" },
      { id: "generic", label: "Generic crawler", sub: "Selenium", x: 194, y: 168, w: 140, h: 48, zone: "extract" },
      { id: "specific", label: "Site-specific", sub: "antibot + scrape", x: 194, y: 280, w: 140, h: 48, zone: "extract" },
      { id: "articles", label: "Extract articles", x: 350, y: 168, w: 128, h: 48, zone: "extract" },
      { id: "unique", label: "Unique store", sub: "dedupe", x: 528, y: 164, w: 132, h: 52, zone: "store", accent: true },
      { id: "model", label: "DS classifier", sub: "relevancy", x: 712, y: 164, w: 136, h: 52, zone: "score", accent: true },
      { id: "report", label: "Report", sub: "stakeholders", x: 900, y: 164, w: 132, h: 52, zone: "out" },
    ],
    edges: [
      { from: "start", to: "links", fromSide: "bottom", toSide: "top" },
      { from: "links", to: "rss" },
      { from: "links", to: "generic" },
      { from: "links", to: "specific" },
      { from: "rss", to: "articles" },
      { from: "generic", to: "articles" },
      { from: "specific", to: "articles" },
      { from: "articles", to: "unique" },
      { from: "unique", to: "model" },
      { from: "model", to: "report" },
    ],
  },

  "brain-mvp": {
    title: "Allocation engine",
    caption: "Signals become eligibility, classification, allocation, then a user-facing recommendation.",
    zones: [
      { id: "in", label: "Signals", x: 12, y: 20, w: 168, h: 300 },
      { id: "ml", label: "Decisioning", x: 196, y: 20, w: 360, h: 300 },
      { id: "out", label: "Serving", x: 572, y: 20, w: 176, h: 300 },
      { id: "infra", label: "Infrastructure", x: 764, y: 20, w: 300, h: 300 },
    ],
    nodes: [
      { id: "user", label: "User signals", x: 28, y: 90, w: 136, h: 46, zone: "in" },
      { id: "elig", label: "Eligibility", x: 28, y: 200, w: 136, h: 46, zone: "in" },
      { id: "cls", label: "Classification", sub: "personas", x: 216, y: 140, w: 148, h: 50, zone: "ml", accent: true },
      { id: "alloc", label: "Allocation logic", x: 388, y: 140, w: 148, h: 50, zone: "ml", accent: true },
      { id: "api", label: "GraphQL", sub: "recommendation", x: 590, y: 140, w: 140, h: 50, zone: "out" },
      { id: "s3", label: "S3 / Delta", x: 784, y: 70, w: 126, h: 42, zone: "infra" },
      { id: "dbx", label: "Databricks", x: 922, y: 70, w: 126, h: 42, zone: "infra" },
      { id: "mlflow", label: "MLflow", x: 784, y: 150, w: 126, h: 42, zone: "infra" },
      { id: "ecr", label: "ECR + EC2", x: 922, y: 150, w: 126, h: 42, zone: "infra" },
    ],
    edges: [
      { from: "user", to: "cls" },
      { from: "elig", to: "cls" },
      { from: "cls", to: "alloc" },
      { from: "alloc", to: "api" },
      { from: "s3", to: "cls", fromSide: "left", toSide: "right" },
      { from: "mlflow", to: "alloc", fromSide: "left", toSide: "right" },
      { from: "ecr", to: "api" },
    ],
  },

  "olap-workload-architecture": {
    title: "Workload split",
    caption: "Mixed Redshift access forks into serving (DynamoDB / Aurora) and analytics (S3 Tables / Athena).",
    zones: [
      { id: "mix", label: "Shared", x: 12, y: 20, w: 300, h: 340 },
      { id: "serve", label: "Serving", x: 336, y: 20, w: 300, h: 150 },
      { id: "anal", label: "Analytics", x: 336, y: 186, w: 300, h: 174 },
      { id: "out", label: "Fit", x: 660, y: 20, w: 200, h: 340 },
    ],
    nodes: [
      { id: "app", label: "Application", x: 28, y: 90, w: 128, h: 44, zone: "mix" },
      { id: "api", label: "API / backend", x: 28, y: 170, w: 128, h: 44, zone: "mix" },
      { id: "rs", label: "Redshift", sub: "mixed workload", x: 176, y: 150, w: 120, h: 50, zone: "mix", accent: true },
      { id: "ddb", label: "DynamoDB", sub: "point lookups", x: 356, y: 56, w: 126, h: 48, zone: "serve", accent: true },
      { id: "aurora", label: "Aurora", sub: "operational CRUD", x: 494, y: 56, w: 126, h: 48, zone: "serve" },
      { id: "s3t", label: "S3 Tables", sub: "bulk / lake", x: 356, y: 236, w: 126, h: 48, zone: "anal", accent: true },
      { id: "athena", label: "Athena", sub: "aggregation", x: 494, y: 236, w: 126, h: 48, zone: "anal" },
      { id: "match", label: "Engine ↔ pattern", x: 680, y: 150, w: 160, h: 52, zone: "out" },
    ],
    edges: [
      { from: "app", to: "api", fromSide: "bottom", toSide: "top" },
      { from: "api", to: "rs" },
      { from: "rs", to: "ddb" },
      { from: "rs", to: "aurora" },
      { from: "rs", to: "s3t" },
      { from: "rs", to: "athena" },
      { from: "ddb", to: "match" },
      { from: "s3t", to: "match" },
    ],
  },

  "gpu-bench": columnGraph({
    title: "GPU benchmark pod",
    caption: "A controlled harness, kernel work, profiling, then a sizing recommendation.",
    columns: [
      { zone: "Harness", nodes: [{ id: "harness", label: "Isolated harness" }] },
      { zone: "Kernels", nodes: [{ id: "cuda", label: "CUDA kernels", sub: "shared memory", accent: true }] },
      { zone: "Profile", nodes: [{ id: "prof", label: "Profiling", sub: "occupancy / memory" }] },
      { zone: "Decide", nodes: [{ id: "size", label: "Sizing", sub: "platform choice", accent: true }] },
    ],
  }),

  "cuda-tiling": columnGraph({
    title: "CUDA tiling",
    caption: "Microbenchmarks compare shared-memory tiling variants under the same harness.",
    columns: [
      { zone: "Harness", nodes: [{ id: "h", label: "Microbenchmark" }] },
      {
        zone: "Variants",
        nodes: [
          { id: "a", label: "Baseline kernel" },
          { id: "b", label: "Tiled shared-mem", accent: true },
        ],
      },
      { zone: "Compare", nodes: [{ id: "p", label: "Profiling", accent: true }] },
    ],
  }),

  "pc-accessories": columnGraph({
    title: "Custom PC accessories",
    caption: "Design, fabricate, then fulfill a small custom product line.",
    columns: [
      { zone: "Design", nodes: [{ id: "d", label: "Prototype", accent: true }] },
      { zone: "Make", nodes: [{ id: "v", label: "Vendor / laser-cut" }] },
      { zone: "Ship", nodes: [{ id: "f", label: "Fulfill & iterate", accent: true }] },
    ],
  }),

  "acrylic-store": columnGraph({
    title: "Acrylic mods shop",
    caption: "A lightweight shop path from design through order intake and fulfillment.",
    columns: [
      { zone: "Product", nodes: [{ id: "p", label: "Product design" }] },
      { zone: "Orders", nodes: [{ id: "o", label: "Order intake", accent: true }] },
      { zone: "Make", nodes: [{ id: "m", label: "Fabricate & ship", accent: true }] },
    ],
  }),

  "saffron-research": columnGraph({
    title: "Saffron pilots",
    caption: "Pilot design, field observation, then a feasibility read.",
    columns: [
      { zone: "Pilot", nodes: [{ id: "p", label: "Pilot design" }] },
      { zone: "Field", nodes: [{ id: "f", label: "Field observation", accent: true }] },
      { zone: "Read", nodes: [{ id: "a", label: "Feasibility", accent: true }] },
    ],
  }),
};

export function getProjectFlowGraph(slug) {
  if (GRAPHS[slug]) return GRAPHS[slug];
  const meta = getProjectMeta(slug);
  if (!meta) return GRAPHS["project-amc-datalake-solution"];
  return graphFromLayers(meta);
}

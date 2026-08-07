import type { KnowledgeSection } from "../types";
import type { ConfidenceAssessment, PlannedSection, ReasoningContext, RetrievedDocument } from "./reasoning-types";
import type { UsageTracker } from "./usage-tracker";
import { trackDocument, trackTechnology } from "./usage-tracker";

export type GeneratedSection = {
  heading: string;
  body?: string;
  bullets?: string[];
};

const BLOCKED_PHRASES = [
  "i design data platforms around business reliability",
  "not just around the latest tool choice",
  "treat cloud cost as an architecture problem",
];

function normalize(value = "") {
  return String(value).trim();
}

function speaker(context: ReasoningContext) {
  const mode = String(context.mode || "ask");
  if (mode === "ask") return "I would";
  if (mode === "interview") return "Let's";
  return "I'd";
}

function findKbSection(document: RetrievedDocument, headings: string[]) {
  const map = new Map(document.sections.map((s) => [s.heading.toLowerCase(), s]));
  for (const h of headings) {
    const section = map.get(h.toLowerCase());
    if (section) return section;
  }
  return undefined;
}

function bulletsFromSection(section?: KnowledgeSection, limit = 4) {
  if (!section) return [];
  return [...section.paragraphs, ...section.bullets].map(normalize).filter(Boolean).slice(0, limit);
}

function pullPersonal(context: ReasoningContext, headings: string[], limit = 2, tracker?: UsageTracker) {
  const out: string[] = [];
  for (const doc of context.retrieval.personalKnowledge) {
    trackDocument(tracker, doc.id);
    for (const h of headings) {
      out.push(...bulletsFromSection(findKbSection(doc, [h]), 2));
    }
    if (out.length >= limit) break;
  }
  return out.slice(0, limit);
}

function pullTechnology(context: ReasoningContext, tech: string, headings: string[], tracker?: UsageTracker) {
  const doc = context.documents.find((d) => d.title.toLowerCase().includes(tech.toLowerCase()));
  if (!doc) return [];
  trackDocument(tracker, doc.id);
  trackTechnology(tracker, doc.title);
  return bulletsFromSection(findKbSection(doc, headings), 4);
}

function isIotStreaming(context: ReasoningContext) {
  return context.analysis.domain === "IoT" || (context.analysis.processingPattern === "streaming" && /\biot\b/i.test(context.question));
}

function isStreaming(context: ReasoningContext) {
  return context.analysis.processingPattern === "streaming" || /\bstream(ing)?\b/i.test(context.question);
}

function flowComponents(context: ReasoningContext) {
  if (context.entities.flowEntities.length) return context.entities.flowEntities.map((e) => e.label);
  return context.analysis.architectureComponents.length
    ? context.analysis.architectureComponents
    : context.analysis.technologies;
}

function isPowerBiContext(context: ReasoningContext) {
  const tech = context.entities.technologies[0]?.label || context.analysis.technologies[0] || "";
  return /\bpower\s*bi\b/i.test(tech) || /\bpower\s*bi\b/i.test(context.question);
}

function trackArchitectureContext(context: ReasoningContext, tracker?: UsageTracker) {
  const arch = context.documents.find((d) => d.category === "architecture");
  if (arch) trackDocument(tracker, arch.id);
}

function limitWords(text: string, maxWords: number) {
  const words = String(text).trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}…`;
}

function activeSubject(context: ReasoningContext) {
  return context.analysis.subject || context.entities.technologies[0]?.label || context.analysis.technologies[0] || "this component";
}

function resolveProjectDocument(context: ReasoningContext) {
  const q = context.question;
  const projectEntity = context.entities.entities.find((e) => e.kind === "project");
  if (projectEntity) {
    const label = projectEntity.label.toLowerCase();
    const byEntity = context.documents.find(
      (d) =>
        d.category === "project" &&
        (d.title.toLowerCase().includes(label) || d.matchedEntities.some((m) => m.toLowerCase().includes(label.split(" ")[0])))
    );
    if (byEntity) return byEntity;
  }
  if (/\bamc\b/i.test(q)) {
    const amc = context.documents.find((d) => d.category === "project" && /\bamc\b/i.test(d.title));
    if (amc) return amc;
  }
  if (/\bdatalake\b/i.test(q)) {
    const lake = context.documents.find((d) => d.category === "project" && /\bdatalake|data lake\b/i.test(d.title));
    if (lake) return lake;
  }
  return context.documents.find((d) => d.category === "project");
}

function looksLikeSqlStatement(text: string) {
  return /\bselect\b[\s\S]{0,800}\bfrom\b/i.test(text);
}

function analyzeSqlQuery(sql: string) {
  const issues: string[] = [];
  const rewrites: string[] = [];
  const joinOnCustomerId = /\join\s+customers?\s+\w+\s+on\s+\w+\.id\s*=\s*\w+\.id/i.test(sql);
  const joinOnOrderCustomer = /\join\s+customers?\s+\w+\s+on\s+\w+\.(\w+)\s*=\s*\w+\.(\w+)/i.exec(sql);
  if (joinOnCustomerId && !/\bcustomer_id\b/i.test(sql)) {
    issues.push("Join uses the same `.id` column on both sides—likely a cartesian or wrong-key join (orders.id = customers.id).");
    rewrites.push("Use the foreign key, e.g. `ON o.customer_id = c.customer_id` (or `c.id` if that is the surrogate key).");
  }
  if (/\bselect\s+\*\b/i.test(sql)) {
    issues.push("SELECT * pulls every column and blocks projection pushdown—bad for wide tables and downstream caches.");
    rewrites.push("List only needed columns; keep keys and filter columns required for joins.");
  }
  if (!issues.length && joinOnOrderCustomer) {
    issues.push("Validate join keys against the schema—surrogate `id` columns are easy to mix up across fact and dimension tables.");
  }
  return { issues, rewrites };
}

function generateById(plan: PlannedSection, context: ReasoningContext, tracker?: UsageTracker): GeneratedSection | null {
  const v = speaker(context);
  const id = plan.generatorId;
  const q = context.question;

  if (id.startsWith("review-component-")) {
    const idx = Number(id.split("-").pop());
    const components = flowComponents(context);
    const name = components[idx] || `Stage ${idx + 1}`;
    const lower = name.toLowerCase();
    trackTechnology(tracker, name);
    const bullets: string[] = [];
    if (/kafka/i.test(lower)) {
      bullets.push("Durable ingest buffer with partition-level ordering; size partitions for peak producer rate and retention for replay.");
      bullets.push("Check consumer lag, idempotent producers, and compaction policy if using compacted topics.");
    } else if (/spark/i.test(lower)) {
      bullets.push("Stateful stream processing or batch transforms; validate checkpoint interval, watermarking, and shuffle cost.");
      bullets.push("Right-size executors for memory-heavy joins or aggregations; watch skew on hot keys.");
    } else if (/s3/i.test(lower)) {
      bullets.push("Cheap durable object storage; define file format, partitioning, and lifecycle rules.");
      bullets.push("List and small-file costs matter at scale—plan compaction and target file sizes.");
    } else if (/power\s*bi|bi\b/i.test(lower)) {
      bullets.push("Semantic / consumption layer; push heavy aggregation upstream where possible.");
      bullets.push("Import mode vs DirectQuery affects freshness, cost, and refresh windows.");
    } else {
      bullets.push(`Clarify throughput, latency, and failure semantics for ${name}.`);
      bullets.push(`Define ownership, SLAs, and observability hooks at the ${name} boundary.`);
    }
    return { heading: plan.name, bullets };
  }

  switch (id) {
    case "tech-verdict": {
      const subject = activeSubject(context);
      const kb = pullTechnology(context, subject, ["Overview", "Why I Use It"], tracker);
      const body =
        kb[0] ||
        ( /power\s*bi/i.test(subject)
          ? `${speaker(context)} use ${subject} at the consumption / semantic layer—not as the core transformation engine.`
          : `${speaker(context)} choose ${subject} when its sweet spot matches the workload—not because it appears in a reference diagram.`);
      return { heading: plan.name, body: limitWords(body, 55) };
    }
    case "tech-why-fit": {
      const subject = activeSubject(context);
      const bullets = pullTechnology(context, subject, ["When I Choose It", "When I Use It", "Advantages"], tracker).slice(0, 4);
      return { heading: plan.name, bullets: bullets.length ? bullets : ["When team skills, SLA, and data volume align with the tool's strengths."] };
    }
    case "tech-avoid": {
      const subject = activeSubject(context);
      const bullets = pullTechnology(context, subject, ["When I Avoid It", "Disadvantages"], tracker).slice(0, 3);
      return { heading: plan.name, bullets: bullets.length ? bullets : ["When a simpler engine already meets latency and cost targets."] };
    }
    case "tech-tradeoff": {
      const subject = activeSubject(context);
      const bullets = pullTechnology(context, subject, ["Disadvantages", "Trade-offs"], tracker);
      const body =
        bullets[0] ||
        ( /spark/i.test(subject)
          ? "Spark buys scale and flexibility at the cost of cluster ops, shuffle tuning, and observability discipline."
          : "Every tool trades operational surface area for capability—match that trade to your team's skills and SLA.");
      return { heading: plan.name, body: limitWords(body, 45) };
    }
    case "tech-experience": {
      const subject = activeSubject(context);
      const projectDoc = context.documents.find(
        (d) => d.category === "project" && d.technologies.some((t) => t.toLowerCase().includes(subject.toLowerCase().split(" ")[0] || ""))
      );
      if (!projectDoc || projectDoc.score < 22) return null;
      trackDocument(tracker, projectDoc.id);
      return { heading: plan.name, bullets: [`${projectDoc.title}: documented use of ${subject} in delivery (see project notes in this lab).`] };
    }

    case "pipe-verdict": {
      const chain = flowComponents(context).join(" → ") || "your pipeline";
      return {
        heading: plan.name,
        body: limitWords(
          `Solid foundation for ${chain}, but I'd add explicit schema/contract validation, replay/DLQ paths, and end-to-end freshness monitoring before calling it production-ready.`,
          50
        ),
      };
    }
    case "pipe-works": {
      const components = flowComponents(context);
      const bullets = components.slice(0, 5).map((name) => {
        const lower = name.toLowerCase();
        if (/kafka/i.test(lower)) return "Kafka — durable ingest and replay buffer.";
        if (/spark/i.test(lower)) return "Spark — distributed transform/processing.";
        if (/s3/i.test(lower)) return "S3 — durable low-cost object storage.";
        if (/power\s*bi/i.test(lower)) return "Power BI — governed consumption / semantic layer.";
        return `${name} — clarify its SLA and ownership in the chain.`;
      });
      return { heading: plan.name, bullets };
    }
    case "pipe-changes":
      return {
        heading: plan.name,
        bullets: [
          "Add schema registry or contract tests between ingest and processing.",
          "Define checkpointing, idempotent sinks, and DLQ + replay runbooks.",
          "Insert data-quality gates before BI or serving layers.",
          "Target file sizes / partitioning before wide BI imports.",
          "Track freshness SLIs from source to dashboard.",
        ].slice(0, 5),
      };
    case "pipe-risk":
      return {
        heading: plan.name,
        bullets: [
          "Hidden coupling between stages without versioned contracts.",
          "BI freshness undefined while upstream reprocessing occurs.",
        ],
      };
    case "pipe-target":
      return {
        heading: plan.name,
        bullets: ["Kafka", "↓", "Spark / processing", "↓", "Curated storage (Delta/Iceberg-style)", "↓", "Semantic model", "↓", "Power BI or API consumers"],
      };

    case "portfolio-projects": {
      const projects = context.cache.documents.filter((d) => d.category === "project").slice(0, 6);
      for (const p of projects) trackDocument(tracker, p.id);
      const bullets = projects.map((p) => p.title);
      if (!bullets.length) {
        return { heading: plan.name, body: "I don't have enough project context in this lab to list work confidently." };
      }
      const intro = context.mode === "ask" ? "I've worked across several data and platform projects, including:" : "Documented portfolio projects include:";
      return { heading: plan.name, body: intro, bullets };
    }
    case "portfolio-role": {
      const resume = context.documents.find((d) => d.category === "resume");
      if (resume) trackDocument(tracker, resume.id);
      return {
        heading: plan.name,
        body:
          context.mode === "ask"
            ? "My work has moved from hands-on implementation toward broader platform and architecture decisions—still grounded in what we actually shipped."
            : "Role progression is documented in resume/career notes where available.",
      };
    }
    case "portfolio-tech": {
      const techs = new Set<string>();
      for (const doc of context.cache.documents.filter((d) => d.category === "project")) {
        for (const t of doc.technologies) techs.add(t);
      }
      return { heading: plan.name, bullets: Array.from(techs).slice(0, 12) };
    }

    case "place-summary": {
      const subject = activeSubject(context);
      const body = /power\s*bi/i.test(subject)
        ? `${speaker(context)} place Power BI at the consumption / semantic layer—not in the core transformation path. Business users interact with governed models; heavy joins and cleansing stay upstream.`
        : `${speaker(context)} place ${subject} where its operational sweet spot is in the reference stack, with clear boundaries for what upstream layers must provide.`;
      trackTechnology(tracker, subject);
      return { heading: plan.name, body };
    }
    case "place-flow":
      return {
        heading: plan.name,
        bullets: [
          "Sources → Ingestion → Storage → Transformation → Curated / gold data → Semantic model → BI / APIs → Business users",
          "Each hop should have explicit ownership, SLAs, and failure semantics.",
        ],
      };
    case "place-upstream":
      return {
        heading: plan.name,
        bullets: [
          "Trusted curated datasets or warehouse tables with documented grain and freshness.",
          "Identity and access patterns aligned to the BI workspace or app distribution model.",
          "Upstream quality gates so BI is not compensating for bad lake/warehouse data.",
        ],
      };
    case "place-owns": {
      const subject = activeSubject(context);
      const bullets = /power\s*bi/i.test(subject)
        ? [
            "Semantic models: relationships, measures, row-level security, certified datasets.",
            "Report and app delivery, self-service within governance guardrails.",
            "Refresh orchestration visibility (gateways, schedules, failures).",
          ]
        : [`Operational responsibilities and SLAs for ${subject} at its layer.`, "Interfaces and contracts exposed to downstream consumers."];
      return { heading: plan.name.replace("What the tool owns", `What ${subject} owns`), bullets };
    }
    case "place-not-owns":
      return {
        heading: plan.name,
        bullets: [
          "Core ingestion, heavy transformation, and business logic that should live in the warehouse/lake.",
          "One-off data fixes that belong in engineering pipelines, not report-local DAX hacks.",
          "Long-term retention policies and raw historical storage (stay in the data platform).",
        ],
      };
    case "place-semantic":
      return {
        heading: plan.name,
        bullets: [
          "Import vs DirectQuery vs composite: freshness vs query cost vs dataset size.",
          "Incremental refresh and aggregation tables for large fact tables.",
          "Shared semantic model when multiple reports must agree on definitions.",
          "If multiple BI tools exist, decide which metrics are canonical in the warehouse vs the semantic layer.",
        ],
      };
    case "place-example":
      return {
        heading: plan.name,
        bullets: [
          "Devices/APIs → stream/batch ingest → bronze/silver tables → Spark/dbt transforms → gold tables → Power BI semantic model → dashboards.",
          "Alerts/APIs can branch from the gold or streaming layer without bypassing governance.",
        ],
      };
    case "place-experience": {
      const subject = activeSubject(context);
      const projectDoc = context.documents.find(
        (d) => d.category === "project" && d.technologies.some((t) => t.toLowerCase().includes(subject.toLowerCase().split(" ")[0] || ""))
      );
      if (!projectDoc || projectDoc.score < 18) return null;
      trackDocument(tracker, projectDoc.id);
      return {
        heading: plan.name,
        bullets: [`${projectDoc.title}: relevant where curated lakehouse layers fed a governed reporting surface.`],
      };
    }

    case "component-role-summary": {
      const subject = activeSubject(context);
      const chain = flowComponents(context).join(" → ");
      return {
        heading: plan.name,
        body: `${speaker(context)} treat ${subject} as a stage in ${chain || "your pipeline"}—define its inputs, outputs, and failure semantics relative to adjacent components.`,
      };
    }
    case "component-io":
      return {
        heading: plan.name,
        bullets: [
          "Schema/version contract from upstream (registry or enforced tests).",
          "Partition keys and file layout written for downstream consumers.",
          "Idempotent writes so retries do not duplicate business events.",
        ],
      };
    case "component-processing":
      return {
        heading: plan.name,
        bullets: [
          "Stateful vs stateless transforms; watermarking if event-time matters.",
          "Push aggregations that BI would otherwise repeat.",
          "Separate batch correction path from low-latency path if both exist.",
        ],
      };
    case "component-failure":
      return {
        heading: plan.name,
        bullets: ["Checkpoint offsets / savepoints for replay.", "Dead-letter with alert and manual replay runbook.", "Backfill strategy when upstream reprocesses history."],
      };
    case "component-observability":
      return {
        heading: plan.name,
        bullets: ["Stage latency and rows in/out per run.", "Shuffle/IO metrics for Spark stages.", "Freshness SLI to the next consumer."],
      };
    case "component-mistakes":
      return {
        heading: plan.name,
        bullets: [
          "Using the processing stage as the system of record for business logic.",
          "Oversized wide extracts to BI instead of curated tables.",
          "Missing contract tests at the handoff to object storage.",
        ],
      };

    case "ingest-goal":
      return {
        heading: plan.name,
        body: `${speaker(context)} choose IoT ingestion based on device connectivity, event rate, and latency—not a default broker. Buffer, validate, and route before expensive processing.`,
      };
    case "ingest-requirements":
      return {
        heading: plan.name,
        bullets: [
          "Peak vs sustained events/sec and message size.",
          "Offline/buffering on devices vs always-on connectivity.",
          "Ordering, deduplication, and security (TLS, device identity).",
        ],
      };
    case "ingest-patterns":
      return {
        heading: plan.name,
        bullets: [
          "MQTT/HTTP through a gateway or IoT hub with backpressure.",
          "Durable buffer (managed streaming or Kafka-compatible) sized for retention/replay.",
          "Edge filtering to drop noise before cloud ingress on bandwidth-limited fleets.",
        ],
      };
    case "ingest-tradeoffs":
      return {
        heading: plan.name,
        bullets: [
          "Managed IoT/streaming services reduce ops but can increase unit cost.",
          "Direct-to-storage batch uploads simplify ops but hurt alert latency.",
          "Strong edge processing lowers cloud cost but complicates device software lifecycle.",
        ],
      };
    case "ingest-questions":
      return {
        heading: plan.name,
        bullets: ["What connectivity model do devices use?", "What alert latency vs analytics latency is required?", "Multi-tenant isolation requirements?"],
      };

    case "arch-goal": {
      trackArchitectureContext(context, tracker);
      const body = isIotStreaming(context)
        ? `${v} target reliable ingestion of device telemetry, low-latency processing for alerts, and durable storage for analytics—without assuming a specific vendor stack until requirements are clear.`
        : isStreaming(context)
          ? `${v} optimize for continuous ingestion, predictable processing latency, and replayable storage for downstream consumers.`
          : `${v} define the business outcomes first (freshness, correctness, cost ceiling), then map them to ingestion, processing, storage, and serving layers.`;
      return { heading: plan.name, body };
    }
    case "arch-requirements":
      return {
        heading: plan.name,
        bullets: [
          "Expected event rate (devices × messages/sec) and peak vs average load.",
          "End-to-end latency target (control/alerting vs analytics).",
          "Retention, replay, and ordering requirements per event type.",
          "Device connectivity model (MQTT/HTTP, offline buffering, gateway aggregation).",
          "Security: device identity, encryption in transit/at rest, tenant isolation.",
          "Multi-tenancy and regional residency if fleets span geographies.",
          ...(context.analysis.constraints.includes("cost") ? ["Explicit monthly cost budget or cost-per-event target."] : []),
          "Assumption if unspecified: moderate telemetry volume with seconds-level alerting and day-level analytics freshness.",
        ],
      };
    case "arch-recommended": {
      const body = isIotStreaming(context)
        ? `${v} choose ingest, processing, storage, and serving tiers after the requirements above—not a default vendor stack. A typical pattern is durable ingest → stream processing for rules/enrichment → time-partitioned storage → APIs or BI for operators, with managed services where ops headcount is limited.`
        : `${v} separate ingest, compute, and serving tiers so each can scale independently once throughput and latency targets are explicit.`;
      return { heading: plan.name, body };
    }
    case "arch-data-flow":
      return {
        heading: plan.name,
        bullets: isIotStreaming(context)
          ? [
              "Devices → gateway/protocol adapter → ingest topic → stream processor → curated stream/table.",
              "Parallel path to cold storage for training and batch analytics.",
              "Serving path for dashboards, APIs, and alert channels.",
            ]
          : [
              "Sources → ingest → processing → curated datasets → consumption endpoints.",
              "Dead-letter and quarantine path for malformed or late events.",
            ],
      };
    case "arch-ingestion":
      return {
        heading: plan.name,
        bullets: [
          "MQTT/HTTP adapters or IoT hub for device connectivity with backpressure.",
          "Partition by deviceId or siteId to preserve ordering where needed.",
          "Schema registry or contract tests before events enter the hot path.",
        ],
      };
    case "arch-processing":
      return {
        heading: plan.name,
        bullets: [
          "Stream jobs for windowed aggregations, anomaly detection, and enrichment joins.",
          "Idempotent sinks and exactly-once semantics where business rules require it.",
          "Separate hot-path (low latency) from warm-path (minutes delay) processing.",
        ],
      };
    case "arch-storage":
      return {
        heading: plan.name,
        bullets: [
          "Hot store for recent telemetry (hours–days); cold store for months–years.",
          "Columnar files or warehouse tables partitioned by time and tenant.",
          "Retention and compaction policies tied to compliance and cost.",
        ],
      };
    case "arch-serving":
      return {
        heading: plan.name,
        bullets: [
          "Operational dashboards for device health and SLAs.",
          "APIs for integrations; avoid pushing raw stream complexity to every consumer.",
          "Semantic metrics layer only if multiple BI tools need shared definitions.",
        ],
      };
    case "arch-observability":
      return {
        heading: plan.name,
        bullets: [
          "Lag, error rate, and end-to-end freshness SLIs per pipeline stage.",
          "Tracing from ingest through processing to sink offsets.",
          "Synthetic canary devices or replay tests after deployments.",
        ],
      };
    case "arch-quality":
      return {
        heading: plan.name,
        bullets: [
          "Validate schema, ranges, and required fields at the edge or ingest.",
          "Quarantine bad events with reason codes; do not silently drop.",
          "Reconciliation counts between source and curated layers.",
        ],
      };
    case "arch-security":
      return {
        heading: plan.name,
        bullets: [
          "Mutual TLS or token-based device auth; rotate credentials safely.",
          "Least-privilege IAM between services; no shared super-roles.",
          "PII tagging and masking before wide analytics consumption.",
        ],
      };
    case "arch-scalability":
      return {
        heading: plan.name,
        bullets: [
          "Horizontal scale ingest partitions and consumer groups with load tests.",
          "Autoscale processing on lag-based metrics, not CPU alone.",
          "Tier storage: hot NVMe/SSD paths vs cheap object storage for history.",
        ],
      };
    case "arch-failure":
      return {
        heading: plan.name,
        bullets: [
          "Replay from retained ingest log after processor fixes.",
          "Dead-letter queues with alerting and manual replay tooling.",
          "Graceful degradation: alerts still fire if analytics path is delayed.",
        ],
      };
    case "arch-cost":
      return {
        heading: plan.name,
        bullets: [
          "Ingest retention duration dominates streaming storage cost—right-size it.",
          "Small files in object storage inflate LIST/scan costs; schedule compaction.",
          "Right-size always-on clusters vs serverless/streaming units for bursty IoT.",
        ],
      };
    case "arch-tradeoffs":
      return {
        heading: plan.name,
        bullets: [
          "Streaming lowers latency but increases operational surface vs micro-batch.",
          "Strong ordering per device simplifies logic but limits partition spread.",
          "Managed services reduce ops burden but can increase unit cost at scale.",
        ],
      };
    case "arch-alternatives":
      return {
        heading: plan.name,
        bullets: [
          "Micro-batch (5–15 min) instead of continuous stream if alerts tolerate delay.",
          "Edge filtering to drop noise before cloud ingest on bandwidth-constrained devices.",
          "Single cloud-native streaming stack vs portable Kafka-compatible layer.",
        ],
      };
    case "arch-questions":
      return {
        heading: plan.name,
        bullets: [
          "What peak and sustained events/sec per region?",
          "What latency is required for control vs reporting use cases?",
          "Do you need per-device ordering and multi-tenant isolation?",
          "What retention and compliance rules apply to raw telemetry?",
        ],
      };

    case "review-overview": {
      const chain = flowComponents(context).join(" → ") || "the described pipeline";
      return {
        heading: plan.name,
        body: `This review focuses on the chain you provided: ${chain}. The analysis below is tied to each component and to gaps in the end-to-end flow—not a generic platform essay.`,
      };
    }
    case "review-connections": {
      const chain = flowComponents(context);
      const bullets: string[] = [];
      if (chain.length >= 2) {
        for (let i = 0; i < chain.length - 1; i++) {
          const left = chain[i];
          const right = chain[i + 1];
          bullets.push(`${left} → ${right}: validate schema contracts, failure semantics, and replay/idempotency at this handoff.`);
        }
      }
      bullets.push(
        "Ingestion → processing: enforce schema registry or contract tests; define late-arrival and poison-message handling.",
        "Processing → storage: checkpoint offsets; target file sizes; avoid small-file churn that inflates LIST cost.",
        "Storage → serving: semantic freshness vs BI refresh windows; push heavy aggregation upstream of import/DirectQuery.",
        "End-to-end: lineage from topic/table to dataset; reconciliation counts between stages."
      );
      return { heading: plan.name, bullets: bullets.slice(0, 8) };
    }
    case "review-gaps":
      return {
        heading: plan.name,
        bullets: [
          "Schema registry / contract validation between ingest and processing.",
          "Dead-letter handling and replay procedure after failures.",
          "Data quality checks before BI consumption.",
          "Orchestration or ownership model for multi-stage jobs.",
          ...(flowComponents(context).some((c) => /kafka/i.test(c)) ? [] : ["Durable ingest buffer if sources can spike or disconnect."]),
        ],
      };
    case "review-reliability":
      return {
        heading: plan.name,
        bullets: [
          "Single points of failure between stages; missing checkpointing on stateful steps.",
          "Backfill strategy when upstream reprocesses historical data.",
          "Idempotent writes to sinks to survive retries.",
        ],
      };
    case "review-ops":
      return {
        heading: plan.name,
        bullets: [
          "On-call ownership per stage; runbooks for lag and failed batches.",
          "Environment promotion and config drift between dev and prod.",
          "Capacity planning tied to peak business windows.",
        ],
      };
    case "review-monitoring":
      return {
        heading: plan.name,
        bullets: [
          "Freshness SLI from source arrival to BI dataset refresh.",
          "Consumer lag, failed task rate, and data volume anomalies.",
          "End-to-end reconciliation counts—not only infrastructure metrics.",
        ],
      };
    case "review-governance":
      return {
        heading: plan.name,
        bullets: [
          "Catalog of datasets feeding BI; column lineage where models are shared.",
          "Access policies aligned to warehouse/lake zones.",
          "Retention and PII classification on raw vs curated layers.",
        ],
      };
    case "review-security":
      return {
        heading: plan.name,
        bullets: [
          "Service identities between Spark jobs and object storage.",
          "Encryption defaults and key rotation for buckets and topics.",
          "Audit logs for privileged access to production data.",
        ],
      };
    case "review-improvements":
      return {
        heading: plan.name,
        bullets: [
          "Add explicit DLQ and replay tooling between processing and storage.",
          "Push aggregations upstream of BI to reduce import size and refresh time.",
          "Introduce quality gates before datasets power executive dashboards.",
        ],
      };
    case "review-questions":
      return {
        heading: plan.name,
        bullets: [
          "What freshness SLA does the BI layer require?",
          "Is Spark streaming, structured streaming, or batch micro-batch in use?",
          "How are schema changes propagated across stages?",
        ],
      };

    case "explain-summary": {
      const tech = context.entities.technologies[0]?.label || context.analysis.technologies[0] || "this technology";
      const kb = pullTechnology(context, tech, ["Why I Use It", "Overview", "When I Choose It"], tracker);
      const body =
        kb[0] ||
        `${v} explain ${tech} in terms of the workload it solves, its operational model, and where it becomes expensive or risky—not as a feature checklist.`;
      return { heading: plan.name, body };
    }
    case "explain-pbi-perspective": {
      const kb = pullTechnology(context, "Power BI", ["Overview", "Why I Use It"], tracker);
      const personal = kb[0] || "I use Power BI when the business needs a governed semantic layer and self-service reporting on top of a trustworthy data platform.";
      return {
        heading: plan.name,
        body: `${context.mode === "ask" ? "I" : "The advisor would"} start from the reporting problem: ${personal}`,
      };
    }
    case "explain-pbi-why": {
      const kb = pullTechnology(context, "Power BI", ["When I Choose It", "Why I Use It"], tracker);
      return {
        heading: plan.name,
        bullets: kb.length
          ? kb
          : [
              "Microsoft ecosystem fit: Entra ID, Azure data services, and M365-adjacent workflows reduce integration friction.",
              "Mature semantic modeling in Power BI Service for shared business logic instead of duplicating metrics in every report.",
              "Self-service for analysts within guardrails when a central team owns the model and certifications.",
            ],
      };
    }
    case "explain-pbi-technical": {
      return {
        heading: plan.name,
        bullets: [
          "Semantic models vs raw dataset imports: centralized measures/relationships vs report-local logic.",
          "Import vs DirectQuery vs composite: freshness, query cost, and dataset size trade-offs.",
          "Refresh architecture: gateway placement, incremental refresh, and failure alerting.",
          "Row-level security and workspace/app distribution for enterprise identity patterns.",
          "Performance: reduce cardinality, pre-aggregate heavy metrics upstream of the model.",
        ],
      };
    }
    case "explain-pbi-tradeoffs": {
      const kb = pullTechnology(context, "Power BI", ["Disadvantages", "Scaling Considerations"], tracker);
      return {
        heading: plan.name,
        bullets: kb.length
          ? kb
          : [
              "Licensing and capacity planning (Pro vs Premium/Fabric) affect who can publish and consume at scale.",
              "Weak upstream modeling forces Power BI to compensate with complex DAX and fragile refresh chains.",
              "Customization limits vs dedicated BI products when marketing-grade UX is the primary goal.",
            ],
      };
    }
    case "explain-pbi-avoid": {
      const kb = pullTechnology(context, "Power BI", ["When I Avoid It"], tracker);
      return {
        heading: plan.name,
        bullets: kb.length
          ? kb
          : [
              "When the organization is not Microsoft-oriented and identity/data already live elsewhere.",
              "When reports would become the system of record for business logic that belongs in the warehouse/lake.",
              "When embedded analytics or strict git-based BI workflows are the primary requirement (evaluate alternatives).",
            ],
      };
    }
    case "explain-pbi-alternatives": {
      const kb = pullTechnology(context, "Power BI", ["Alternatives"], tracker);
      return {
        heading: plan.name,
        bullets: kb.length
          ? [
              ...kb,
              "Tableau: strong visual exploration; weigh semantic centralization and Microsoft integration.",
              "Looker/LookML: git-native modeling; strong when metrics-as-code and warehouse-native semantics are priorities.",
            ].slice(0, 5)
          : [
              "Tableau for exploration-heavy cultures; compare semantic governance and total cost.",
              "Looker when LookML and warehouse-native semantics are non-negotiable.",
              "Warehouse-native dashboards when BI depth is light and SQL metrics suffice.",
            ],
      };
    }
    case "explain-pbi-experience": {
      const bullets = pullTechnology(context, "Power BI", ["Related Projects"], tracker);
      const projectDoc = context.documents.find((d) => d.category === "project" && d.technologies.some((t) => /power\s*bi/i.test(t)));
      if (projectDoc) trackDocument(tracker, projectDoc.id);
      if (!projectDoc && !bullets.length) return null;
      return {
        heading: plan.name,
        bullets: projectDoc
          ? [`${projectDoc.title}: governed reporting and semantic delivery on top of lakehouse processing—relevant when comparing serving-layer choices.`]
          : bullets,
      };
    }
    case "explain-what": {
      const tech = context.entities.technologies[0]?.label || context.analysis.technologies[0] || "the tool";
      return {
        heading: plan.name,
        bullets: pullTechnology(context, tech, ["Overview", "Why I Use It", "Advantages"], tracker).length
          ? pullTechnology(context, tech, ["Overview", "Why I Use It", "Advantages"], tracker)
          : [`${tech} addresses a specific layer in the data platform; define that layer before comparing vendors.`],
      };
    }
    case "explain-when-fit": {
      const tech = context.entities.technologies[0]?.label || context.analysis.technologies[0] || "";
      const bullets = tech ? pullTechnology(context, tech, ["When I Choose It", "When I Use It", "Enterprise Considerations"], tracker) : [];
      return {
        heading: plan.name,
        bullets: bullets.length ? bullets : ["When team skills, SLA, and data volume align with the tool's sweet spot."],
      };
    }
    case "explain-when-avoid": {
      const tech = context.entities.technologies[0]?.label || context.analysis.technologies[0] || "";
      const bullets = tech ? pullTechnology(context, tech, ["When I Avoid It", "Disadvantages", "Common Mistakes"], tracker) : [];
      return { heading: plan.name, bullets: bullets.length ? bullets : ["When a simpler service or existing stack already meets the SLA."] };
    }
    case "explain-tradeoffs": {
      const tech = context.entities.technologies[0]?.label || context.analysis.technologies[0] || "";
      const bullets = tech ? pullTechnology(context, tech, ["Trade-offs", "Alternatives", "Disadvantages"], tracker) : [];
      return { heading: plan.name, bullets: bullets.length ? bullets : ["Balance operational overhead, lock-in, and unit economics."] };
    }
    case "personal-related": {
      const bullets = pullPersonal(context, ["Related Projects", "Lessons Learned"], 3);
      if (!bullets.length) return null;
      return { heading: plan.name, bullets };
    }

    case "compare-summary": {
      const [a, b] = context.entities.technologies.length >= 2
        ? context.entities.technologies.map((e) => e.label)
        : context.analysis.technologies;
      return {
        heading: plan.name,
        body: a && b
          ? `${v} compare ${a} and ${b} on deployment model, operating cost, team skills, and workload fit—not on marketing feature lists.`
          : `${v} compare the options on cost, scale, ops burden, and lock-in.`,
      };
    }
    case "compare-dimensions":
      return {
        heading: plan.name,
        bullets: ["Unit economics at your data volume", "Operational overhead and required skills", "Integration with existing ingest and BI", "Governance, security, and multi-tenant needs"],
      };
    case "compare-a-pros":
    case "compare-a-cons":
    case "compare-b-pros":
    case "compare-b-cons": {
      const techs = context.entities.technologies.map((e) => e.label);
      const which = id.includes("compare-a") ? techs[0] : techs[1];
      if (!which) return { heading: plan.name, bullets: ["Need two explicit technologies in the question to compare."] };
      const section = id.includes("cons") ? ["Disadvantages", "When I Avoid It"] : ["Advantages", "Why I Use It"];
      return { heading: plan.name.replace("Option A", which).replace("Option B", which), bullets: pullTechnology(context, which, section, tracker) };
    }
    case "compare-recommendation":
      return {
        heading: plan.name,
        body: `${v} pick based on which platform already matches your ingestion pattern, SLA, and team's ability to operate it in production—then validate with a bounded POC on your data volumes.`,
      };

    case "project-summary":
    case "project-context":
    case "project-architecture":
    case "project-decisions":
    case "project-outcomes":
    case "project-lessons": {
      const projectDoc = resolveProjectDocument(context);
      if (!projectDoc) {
        return {
          heading: plan.name,
          body: "The knowledge base does not contain enough detail on that project to answer precisely.",
        };
      }
      const map: Record<string, string[]> = {
        "project-summary": ["Business Context", "Overview"],
        "project-context": ["Business Context", "Problem Statement"],
        "project-architecture": ["Architecture"],
        "project-decisions": ["Engineering Decisions", "Trade-offs"],
        "project-outcomes": ["Business Impact"],
        "project-lessons": ["Lessons Learned", "What I Would Improve Today"],
      };
      const bullets = bulletsFromSection(findKbSection(projectDoc, map[id] || []), 6);
      if (id === "project-summary" || id === "project-context") {
        return { heading: plan.name, body: bullets.join(" ") || projectDoc.summary };
      }
      return { heading: plan.name, bullets: bullets.length ? bullets : [projectDoc.excerpt || projectDoc.title] };
    }

    case "mentor-summary":
      return {
        heading: plan.name,
        body: `${speaker(context)} mentor by pairing clear expectations with incremental ownership—engineers ship, then we review design quality and operability together.`,
      };
    case "mentor-approach":
      return {
        heading: plan.name,
        bullets: pullPersonal(context, ["How I Mentor Engineers", "Mentoring", "Leadership"], 4, tracker).length
          ? pullPersonal(context, ["How I Mentor Engineers", "Mentoring", "Leadership"], 4, tracker)
          : [
              "Start from the outcome and constraints, not from tools.",
              "Review designs before large builds; focus on operability and cost.",
              "Use production incidents and postmortems as teaching moments.",
            ],
      };
    case "mentor-examples":
      return { heading: plan.name, bullets: pullPersonal(context, ["Examples", "Lessons Learned"], 3, tracker) };
    case "mentor-outcomes":
      return {
        heading: plan.name,
        bullets: ["Engineers who can own a service end-to-end", "Better design docs and clearer trade-off reasoning", "Fewer repeat incidents through shared runbooks"],
      };

    case "interview-prompt":
      return {
        heading: plan.name,
        body: "Design a near-real-time analytics platform for IoT telemetry at regional scale. Start by stating assumptions for device count, event rate, and latency before drawing components.",
      };
    case "interview-approach":
      return {
        heading: plan.name,
        bullets: [
          "Clarify functional requirements and SLAs before naming products.",
          "Draw data flow: ingest → process → store → serve.",
          "Call out failure modes, scaling knobs, and cost drivers.",
        ],
      };
    case "interview-probes":
      return {
        heading: plan.name,
        bullets: [
          "How would you handle a 10× spike in one device fleet?",
          "Where would you enforce schema validation?",
          "How do you test replay without duplicating alerts?",
        ],
      };

    case "interview-summary": {
      const behavioral = /\btell me about\b|\bdifficult\b|\bincident\b|\bconflict\b|\btime when\b/i.test(q);
      return {
        heading: plan.name,
        body: behavioral
          ? "The interviewer is testing judgment under constraints—how you framed the problem, who you aligned, and what changed afterward."
          : "Treat this as a structured story: context → decision → trade-offs → outcome → what you would do differently.",
      };
    }
    case "interview-answer":
      return {
        heading: plan.name,
        bullets: [
          "Situation: system, scale, and stakes in one sentence.",
          "Task: your ownership (not the whole team).",
          "Action: 2–3 concrete technical or organizational moves.",
          "Result: measurable outcome or risk removed.",
          "Close with the principle you still use.",
        ],
      };
    case "interview-rubric":
      return {
        heading: plan.name,
        bullets: [
          "Names alternatives considered and why one was rejected.",
          "Shows operational awareness (monitoring, rollback, cost).",
          "Weak answers stay vague ('we picked the best tool') with no trade-offs.",
        ],
      };
    case "interview-weak-answers":
      return {
        heading: plan.name,
        bullets: ["Listing tools without the decision driver.", "Blaming other teams without your mitigation steps."],
      };

    case "cost-summary":
      return {
        heading: plan.name,
        body: /\bsagemaker\b/i.test(q)
          ? `${v} start SageMaker cost reviews with always-on notebook instances, endpoint instance hours, and unattached EBS—then training job frequency and data transfer.`
          : `${v} start with the top three services on the invoice, then map each to architecture choices.`,
      };
    case "cost-drivers":
      return {
        heading: plan.name,
        bullets: /\bsagemaker\b/i.test(q)
          ? [
              "Idle notebook and Studio instances left running overnight.",
              "Over-provisioned real-time inference endpoints.",
              "Repeated large training runs without spot / checkpointing.",
              "Data egress between VPC, S3, and external consumers.",
            ]
          : ["Compute that never scales down", "Storage without lifecycle tiers", "Cross-AZ or egress traffic", "Orchestration overhead relative to useful work"],
      };
    case "cost-quick-wins":
      return {
        heading: plan.name,
        bullets: [
          "Stop or schedule non-prod SageMaker notebooks and endpoints.",
          "Right-size endpoint instance types after profiling traffic.",
          "Use spot training where checkpointing is implemented.",
        ],
      };
    case "cost-structural":
      return {
        heading: plan.name,
        bullets: [
          "Batch inference instead of 24/7 endpoints for intermittent scoring.",
          "Feature store reuse to avoid duplicate training pipelines.",
          "Shared multi-tenant training clusters with quotas.",
        ],
      };
    case "cost-sagemaker-ask":
      return {
        heading: plan.name,
        bullets: [
          "SageMaker line-item breakdown (notebooks vs endpoints vs training).",
          "Instance types, GPU vs CPU, and average hours running.",
          "Training vs inference split and endpoint count.",
          "Monthly SageMaker spend band (order of magnitude—not invented totals).",
        ],
      };
    case "cost-monitoring":
      return {
        heading: plan.name,
        bullets: ["Cost allocation tags by team and environment", "Alerts on daily spend anomalies", "Dashboards tying cost to GPU/CPU utilization"],
      };

    case "sql-summary": {
      const sql = looksLikeSqlStatement(q) ? q : "";
      const { issues } = sql ? analyzeSqlQuery(sql) : { issues: [] as string[] };
      const lead = issues.length
        ? `${v} fix correctness first (${issues[0].slice(0, 80)}…), then reduce scanned data and shuffle.`
        : `${v} optimize SQL by reducing scanned data first, then join order and shuffle-heavy operators.`;
      return { heading: plan.name, body: lead };
    }
    case "sql-shape": {
      const sql = looksLikeSqlStatement(q) ? q : "";
      const { issues } = sql ? analyzeSqlQuery(sql) : { issues: [] as string[] };
      if (issues.length) {
        return { heading: plan.name, bullets: issues };
      }
      return {
        heading: plan.name,
        bullets: [
          "Filters applied as early as possible on partitioned columns.",
          "Avoid SELECT * on wide tables; project only needed columns.",
          "Watch cartesian joins and exploding array/struct operations.",
        ],
      };
    }
    case "sql-rewrites": {
      const sql = looksLikeSqlStatement(q) ? q : "";
      const { rewrites } = sql ? analyzeSqlQuery(sql) : { rewrites: [] as string[] };
      if (rewrites.length) {
        return { heading: plan.name, bullets: rewrites };
      }
      return {
        heading: plan.name,
        bullets: [
          "Pre-aggregate before joining to large dimension tables.",
          "Replace correlated subqueries with window functions where appropriate.",
          "Broadcast small dimensions only when statistics confirm size.",
        ],
      };
    }
    case "sql-exec":
      return {
        heading: plan.name,
        bullets: ["Validate partition pruning in the explain plan", "Check shuffle read/write bytes", "Align file sizes and Z-order/cluster keys with filter predicates"],
      };

    case "perf-summary":
      trackTechnology(tracker, "Spark");
      return {
        heading: plan.name,
        body: /\bspark\b/i.test(q)
          ? `${v} reduce Spark cost by cutting shuffle bytes, idle cluster time, and over-partitioned stages before chasing micro-optimizations.`
          : `${v} isolate whether time is spent in I/O, shuffle, CPU, or metadata before changing code.`,
      };
    case "perf-bottlenecks":
      return {
        heading: plan.name,
        bullets: /\bspark\b/i.test(q)
          ? [
              "Shuffle read/write dominating spend on wide joins or skewed keys.",
              "Clusters left running after jobs finish (dynamic allocation misconfigured).",
              "Too many small tasks from tiny files or excessive partition counts.",
            ]
          : [
              "Skewed keys causing straggler tasks.",
              "Small files forcing excessive task overhead.",
              "Missing statistics leading to bad join plans.",
            ],
      };
    case "perf-steps":
      return {
        heading: plan.name,
        bullets: /\bspark\b/i.test(q)
          ? [
              "Right-size executors; enable autoscaling or job-level cluster policies.",
              "Fix skew and push filters early to reduce shuffle volume.",
              "Compact input files; align partitions with join/filter keys.",
              "Cache only when reuse justifies memory cost; unpersist aggressively.",
            ]
          : ["Capture stage-level metrics and the slowest operators", "Fix skew and partition filters", "Tune shuffle partitions and caching deliberately"],
      };
    case "perf-validate":
      return { heading: plan.name, bullets: ["Compare runtime and bytes read before/after", "Validate output row counts and business metrics unchanged"] };

    default:
      return null;
  }
}

export function generateSection(plan: PlannedSection, context: ReasoningContext, tracker?: UsageTracker): GeneratedSection | null {
  return generateById(plan, context, tracker);
}

export function containsBlockedPhrase(text: string) {
  const n = text.toLowerCase();
  return BLOCKED_PHRASES.some((p) => n.includes(p));
}

export function generateAllSections(plan: PlannedSection[], context: ReasoningContext, tracker?: UsageTracker) {
  const sections: GeneratedSection[] = [];
  for (const item of plan) {
    const generated = generateSection(item, context, tracker);
    if (!generated) continue;
    sections.push(generated);
  }
  return sections;
}

"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clipboard, Check } from "lucide-react";
import GpuSparks from "../../../components/GpuSparks";

/**
 * ProjectDetail — meta moved under title + wider architecture diagram
 * Replace: app/projects/[slug]/ProjectDetail.jsx
 */

export default function ProjectDetail({ project, slug }) {
  const [copied, setCopied] = useState(false);

  const p = project ?? {
    slug: "project-amc-datalake-solution",
    title: "AMC - Datalake Solution",
    desc: "Designing a cost-efficient cloud-native data solution for AMCs using AWS Cloud",
    content:
      "Built a cost-efficient, serverless, scalable data solution for AMC client. Focus areas: ingestion reliability, low-cost storage, fast analytical queries, and an easy metrics layer for downstream BI.",
    timeline: "6 months",
    role: "Lead Data Engineer",
    responsibilities: [
      "Architecture design and tradeoffs",
      "ETL Development",
      "Ingestion pipelines (PySpark on Glue), monitoring and alerting",
      "Cost/performance optimization using S3 + Iceberg and compaction strategies",
    ],
    outcomes: [
      "Cost reduced by ~38% vs. legacy architecture",
      "Query performance improved by ~60% for typical BI workloads",
      "Automated compaction and partitioning to reduce read amplification",
    ],
    tech: ["AWS (S3, Glue)", "Apache Iceberg", "PySpark", "Terraform", "Prometheus/Grafana"],
  };

  const accent = "var(--color-accent)";

  const codeSample = `# PySpark Ingestion job
    from pyspark.sql import SparkSession
    spark = SparkSession.builder.getOrCreate()

    def incremental_load(src_path, table_path, watermark_col):
        df = spark.read.parquet(src_path)
        df = df.dropDuplicates(["evt_id"])
        df.write.format("iceberg").mode("append").save(table_path)

    if __name__ == '__main__':
        incremental_load('s3://bucket/raw/events', 's3://bucket/iceberg/datamarts', 'event_time')
`;

  async function copyToClipboard(text = codeSample) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
        return;
      }
    } catch (err) {
      // fallback below
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      if (typeof ta.setSelectionRange === "function") ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
        return;
      }
    } catch (e) {
      // ignore
    }
    alert("Copy failed — please select the code and copy manually.");
  }

  return (
    // full-bleed padding so content sits toward left edge of viewport
    <div className="w-full px-6 md:px-12 lg:px-20 xl:px-28 py-16 animate-fadeIn">
      <GpuSparks  />
      {/* header + breadcrumb */}
      <div className="w-full max-w-none mx-0">
        <nav className="text-sm mb-4">
          <ol className="flex items-center gap-2 text-footer-sub">
            <li><a href="/" className="hover:underline text-nav">Home</a><span className="mx-2" style={{ color: accent }}>/</span></li>
            <li><a href="/projects" className="hover:underline text-nav">Projects</a><span className="mx-2" style={{ color: accent }}>/</span></li>
            <li className="font-medium" style={{ color: accent }}>{p.title}</li>
          </ol>
        </nav>

        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: accent }}>{p.title}</h1>

              {/* meta moved under title: single-line timeline · role */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <div className="text-card">
                  <span className="font-medium text-card-text">Timeline:</span>{" "}
                  <span className="ml-1">{p.timeline ?? "—"}</span>
                </div>
                <span style={{ color: accent, fontWeight: 700 }}>•</span>
                <div className="text-card">
                  <span className="font-medium text-card-text">Role:</span>{" "}
                  <span className="ml-1">{p.role ?? "—"}</span>
                </div>
              </div>

              <p className="mt-4 text-base md:text-lg text-card max-w-2xl">{p.desc ?? "No summary provided."}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                {(p.tech || []).map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-transparent border"
                    style={{ borderColor: "rgba(15,23,36,0.06)" }}>
                    <span style={{ color: accent, fontWeight: 700 }}>●</span>
                    <span className="font-semibold text-card-text">{t}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>
        </header>

        {/* main two-column area: left content + right sticky panel */}
        <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-10">
          {/* Left content column */}
          <main className="min-w-0">
            <article className="prose max-w-none dark:prose-invert leading-relaxed">
              <h3 className="text-xl font-semibold text-card-text">Project overview</h3>
              <p className="text-card">{p.content ?? "No detailed overview available."}</p>

              <h4 className="mt-6 font-medium text-card-text">Responsibilities</h4>
              {p.responsibilities && p.responsibilities.length ? (
                <ul className="list-disc ml-6 mt-3 text-card space-y-2">
                  {p.responsibilities.map((r) => <li key={r}>{r}</li>)}
                </ul>
              ) : (
                <p className="text-muted">No responsibilities listed.</p>
              )}

              <h4 className="mt-6 font-medium text-card-text">Outcomes</h4>
              {p.outcomes && p.outcomes.length ? (
                <ul className="list-disc ml-6 mt-3 text-card space-y-2">
                  {p.outcomes.map((o) => <li key={o}>{o}</li>)}
                </ul>
              ) : (
                <p className="text-muted">No outcomes recorded.</p>
              )}

              <div className="mt-8">
                <h4 className="font-medium text-card-text">Detailed notes</h4>
                <p className="mt-2 text-sm text-card">Key technical decisions:</p>
                <ol className="list-decimal ml-6 mt-3 text-sm text-card space-y-2">
                  <li>Use S3 as single source-of-truth and Apache Iceberg for table-level atomicity and schema evolution.</li>
                  <li>Glue + PySpark for scheduled batch ingestion with job bookmarks and dedup logic for incremental loads.</li>
                  <li>Partitioning strategy: hybrid date + composite id bucketing to balance read and write amplification.</li>
                  <li>Compaction & small-file management: periodic compaction jobs plus auto-compaction heuristics to maintain read throughput.</li>
                  <li>Monitoring: Prometheus exporters with Grafana dashboards for ingestion latency, job failures and S3 request cost heatmaps.</li>
                  <li>IaC: Terraform to deploy S3 lifecycle, Glue jobs, IAM roles and CloudWatch alerts.</li>
                </ol>
              </div>

              {/* code + copy */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-card-text">Example: ingestion job snippet</h3>

                  <button
                    onClick={() => copyToClipboard()}
                    className="relative inline-flex items-center gap-2 px-3 py-1 rounded text-sm
                      bg-card-bg border border-card-border text-card-text hover:bg-card-bg-hover transition-colors"
                    aria-live="polite"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-4 h-4" style={{ color: accent }} />
                        <span>Copy</span>
                      </>
                    )}

                    <span aria-hidden className={`absolute -top-8 right-0 rounded px-2 py-1 text-xs bg-slate-900 text-white ${copied ? "opacity-100" : "opacity-0"} transition-opacity`} style={{ pointerEvents: "none" }}>
                      {copied ? "Copied!" : ""}
                    </span>
                  </button>
                </div>

                <motion.pre
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="rounded-lg p-4 overflow-auto text-sm code-bg border border-code text-code"
                  style={{ whiteSpace: "pre" }}
                >
                  <code>
                    {codeSample.split("\n").map((line, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="leading-5">
                        <span className="text-code">{line}</span>
                        {"\n"}
                      </motion.div>
                    ))}
                  </code>
                </motion.pre>
              </div>
            </article>
          </main>

          {/* Right sticky panel (wider than before) */}
          <aside className="mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-24">
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }} className="p-6 rounded-xl bg-card-bg border border-card-border">
                <h4 className="text-lg font-medium mb-4 text-card-text">Project Architecture</h4>

                {/* Add image diagram here */}

                
              </motion.div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="p-3 rounded text-center bg-card-bg-hover text-card-text">
                  <div style={{ color: accent, fontWeight: 700 }}>Cost</div>
                  <div className="mt-1">−38%</div>
                </div>
                <div className="p-3 rounded text-center bg-card-bg-hover text-card-text">
                  <div style={{ color: accent, fontWeight: 700 }}>Perf</div>
                  <div className="mt-1">+60%</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

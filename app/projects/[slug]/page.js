// app/projects/[slug]/page.js
import GpuSparks from "../../../components/GpuSparks";
import ProjectDetails from "./ProjectDetails";

const META = {
  /* ===========================
     AMC DATAMART
     =========================== */
  "project-amc-datalake-solution": {
    slug: "project-amc-datalake-solution",
    title: "AMC - Datalake Solution",
    desc: "Reusable, cost-efficient cloud-native solution for Asset Management Companies",
    timeline: "6 months",
    role: "Lead Data Engineer",

    content: `
      Designed and implemented ETL systems for AMC Client.
      The solution unified multiple on premise data sources, data migration, network setup between on premise and cloud.
      Primary focus areas included ingestion reliability, low-cost scalable storage, fast analytical queries, and a clean
      metrics surface for BI and advanced analytics.
    `,

    responsibilities: [
      "Led end-to-end architecture design for a cloud-native solution",
      "Built incremental ingestion pipelines with reliability, validation, and idempotency guarantees",
      "Designed SCD-aware dimensions and transaction fact tables",
      "Developed CI/CD infrastructure using Terraform and CodeCommit",
      "Implemented partitioning, compaction, and file optimization strategies",
      "Collaborated with business and analytics teams to define KPIs and reporting surfaces"
    ],

    outcomes: [
      "Unified customer, transaction, and portfolio data into a single source of truth",
      "Enabled sub-10s BI queries on large transactional datasets",
      "Reduced operational complexity and improved data reliability",
      "Created a reusable blueprint that can onboard new AMCs with minimal changes"
    ],

    metrics: {
      cost: [
        "~35–40% reduction in monthly compute cost compared to legacy warehouse-based setup",
        "Optimized storage footprint using columnar open-table formats",
        "Incremental processing eliminated full reload compute overhead"
      ],
      performance: [
        "Typical BI queries improved from minutes to seconds",
        "Dashboard refresh latency reduced from hours to minutes",
        "Partition pruning and compaction reduced read amplification significantly"
      ]
    }
  },

  /* ===========================
     GPU BENCH
     =========================== */
  "gpu-bench": {
    slug: "gpu-bench",
    title: "GPU Benchmark Pod",
    desc: "CUDA kernels, shared memory optimization, and GPU performance tuning",
    timeline: "3 months",
    role: "Research Engineer",
    content: `
Designed microbenchmarks to analyze GPU kernel performance across different memory
and execution strategies on modern NVIDIA GPUs.
    `,
    responsibilities: [
      "Write CUDA microbenchmarks",
      "Optimize kernels using shared memory and tiling strategies",
      "Capture low-level metrics (occupancy, memory throughput, PTX behavior)"
    ],
    outcomes: [
      "Achieved ~2x performance improvement for selected kernels",
      "Built reusable benchmarking harness for future GPU experiments"
    ]
  },

  /* ===========================
     PC ACCESSORIES
     =========================== */
  "pc-accessories": {
    slug: "pc-accessories",
    title: "Custom PC Accessories",
    desc: "Side business building aesthetic GPU and PC customization components",
    timeline: "Ongoing",
    role: "Founder",
    content: `
Founded and operated a niche side business focused on custom PC aesthetic accessories
including GPU backplates, acrylic mods, and fan grills.
    `,
    responsibilities: [
      "Product design and prototyping",
      "Vendor coordination and laser cutting",
      "Client fulfillment and iteration based on feedback"
    ],
    outcomes: [
      "Launched MVP with 10+ paying customers",
      "Validated demand for custom PC aesthetic components"
    ]
  },

  /* ===========================
     FRIENDLY ALIAS
     =========================== */
  "amc": {
    // handled via alias resolution below
  }
};

export async function generateStaticParams() {
  return [
    { slug: "project-amc-datalake-solution" },
    { slug: "gpu-bench" },
    { slug: "pc-accessories" },
    { slug: "amc" }
  ];
}

export default async function Page(props) {
  // Next may provide params as a Promise
  const params = props?.params ? await props.params : null;
  const rawSlug = params?.slug
    ? Array.isArray(params.slug)
      ? params.slug[0]
      : params.slug
    : null;

  // Friendly alias handling
  const slug = rawSlug === "amc" ? "amc-datamart" : rawSlug;
  const project = slug ? META[slug] ?? null : null;

  if (!project) {
    return (
      <main className="max-w-3xl mx-auto py-16">
        <GpuSparks />
        <h1 className="text-2xl font-semibold">Project not found</h1>
        <p className="text-slate-400 mt-2">
          No project was found for <code>{rawSlug}</code>
        </p>
      </main>
    );
  }

  return <ProjectDetails project={project} slug={slug} />;
}

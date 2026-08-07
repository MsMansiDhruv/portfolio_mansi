/** Shared project index data — keep in sync with /projects/[slug] detail META where applicable */

export const PROJECTS = [
  {
    slug: "project-amc-datalake-solution",
    title: "AMC - Datalake Solution",
    desc: "Designing a cost-efficient cloud-native datamart",
    date: "2025-03",
    category: "Data Engineering",
    tech: ["S3", "Iceberg", "PySpark", "AWS", "Terraform", "Redshift"],
    tags: ["data", "iceberg", "aws", "data engineering"],
    pinned: true,
  },
  {
    slug: "gpu-bench",
    title: "GPU Benchmark Pod",
    desc: "CUDA experiments and performance tuning",
    date: "2023-11",
    category: "GPU / HPC",
    tech: ["CUDA", "Profiling"],
    tags: ["gpu", "cuda", "perf"],
    pinned: false,
  },
  {
    slug: "pc-accessories",
    title: "Custom PC Accessories",
    desc: "Side business — GPU backplates & acrylic plates",
    date: "2022-06",
    category: "Business",
    tech: ["Design", "Laser-cut"],
    tags: ["shop", "design"],
    pinned: false,
  },
  {
    slug: "small-data-lake",
    title: "Small Data Lake (PoC)",
    desc: "Lightweight data lake using Iceberg and Spark",
    date: "2024-03",
    category: "Data Engineering",
    tech: ["Iceberg", "Spark"],
    tags: ["data", "lake", "iceberg"],
    pinned: false,
  },
  {
    slug: "cuda-tiling",
    title: "CUDA Tiling Experiments",
    desc: "Shared memory tiling microbenchmarks",
    date: "2022-12",
    category: "GPU / HPC",
    tech: ["CUDA"],
    tags: ["gpu", "cuda", "benchmark"],
    pinned: false,
  },
  {
    slug: "acrylic-store",
    title: "Acrylic Mods — Shop",
    desc: "MVP for custom acrylic GPU backplates",
    date: "2021-11",
    category: "Business",
    tech: ["Design"],
    tags: ["shop", "acrylic"],
    pinned: false,
  },
  {
    slug: "saffron-research",
    title: "Saffron Harvesting Research",
    desc: "Feasibility research and pilot plots",
    date: "2020-05",
    category: "Research",
    tech: ["Agro"],
    tags: ["agro", "pilot"],
    pinned: false,
  },
];

export const FEATURED_PROJECT_SLUGS = [
  "project-amc-datalake-solution",
  "gpu-bench",
  "small-data-lake",
];

export function getFeaturedProjects() {
  return FEATURED_PROJECT_SLUGS.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter(Boolean);
}

export function formatProjectTech(tech = [], max = 5) {
  return tech.slice(0, max).join(" · ");
}

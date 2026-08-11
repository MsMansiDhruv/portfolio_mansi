import { PROJECT_META } from "@/lib/data/project-meta";

/** Maps knowledge document ids to published portfolio page slugs. */
const KNOWLEDGE_ID_TO_PAGE_SLUG: Record<string, string> = {
  "project/amc-datalake": "project-amc-datalake-solution",
  "project/olap-workload-architecture": "olap-workload-architecture",
  "project/brain-mvp": "brain-mvp",
  "project/automated-intelligence-pipeline": "automated-intelligence-pipeline",
  "project/gpu-benchmark": "gpu-bench",
};

const TITLE_TO_SLUG = Object.fromEntries(
  Object.entries(PROJECT_META).map(([slug, meta]) => [normalize(meta.title), slug])
);

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function knowledgeIdToPageSlug(knowledgeIdOrTitle: string): string | null {
  const raw = String(knowledgeIdOrTitle || "").trim();
  if (!raw) return null;

  if (KNOWLEDGE_ID_TO_PAGE_SLUG[raw]) return KNOWLEDGE_ID_TO_PAGE_SLUG[raw];
  if (PROJECT_META[raw]) return raw;

  const fromTitle = TITLE_TO_SLUG[normalize(raw)];
  if (fromTitle) return fromTitle;

  const tail = raw.split("/").pop() || raw;
  if (PROJECT_META[tail]) return tail;

  const partial = Object.entries(PROJECT_META).find(([, meta]) => normalize(meta.title).includes(normalize(tail)));
  return partial?.[0] || null;
}

export function projectHref(slug: string): string {
  return `/projects/${slug}`;
}

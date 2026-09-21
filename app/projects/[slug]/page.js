import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { PROJECT_META, getProjectMeta, resolveProjectSlug } from "@/lib/data/project-meta";
import { PUBLIC_WORK_SLUGS, isDraftWorkSlug, showDraftWork } from "@/lib/data/work-visibility";

const ProjectDetails = dynamic(() => import("./ProjectDetails"), {
  loading: () => <div className="wd-root wd-page is-ready" aria-busy="true" />,
});

const CASE_META = {
  "project-amc-datalake-solution": {
    title: "Legacy Data Modernization | Case Study",
    description:
      "Engineering case study: AWS data lake, Glue ETL, Redshift, and analytics modernization for a confidential asset-management client — architecture, decisions, and outcomes.",
  },
  "olap-workload-architecture": {
    title: "From OLAP to Workload-Specific Data Architecture | Mansi Dhruv",
    description:
      "Production data-platform migration: separating application serving and analytical workloads after Redshift cost and benchmark evidence.",
  },
  "brain-mvp": {
    title: "Productionizing an ML-Driven Allocation Engine | Mansi Dhruv",
    description:
      "Case study: ML allocation for a confidential fintech engagement — classification, production pipeline, and event-driven decisioning on AWS.",
  },
  "automated-intelligence-pipeline": {
    title: "Automated Web Intelligence Pipeline | Mansi Dhruv",
    description:
      "Data engineering case study: crawlers, extraction, deduplication, AWS infrastructure, and integration of a Data Science classification model into production reporting.",
  },
};

export async function generateStaticParams() {
  if (showDraftWork()) {
    const slugs = Object.keys(PROJECT_META);
    if (!slugs.includes("amc")) slugs.push("amc");
    return slugs.map((slug) => ({ slug }));
  }
  const slugs = [...PUBLIC_WORK_SLUGS];
  if (!slugs.includes("amc")) slugs.push("amc");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props) {
  const params = props?.params ? await props.params : null;
  const rawSlug = params?.slug ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : null;
  const slug = rawSlug ? resolveProjectSlug(rawSlug) : null;
  if (slug && isDraftWorkSlug(slug) && !showDraftWork()) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }
  const special = slug ? CASE_META[slug] : null;
  if (special) return special;

  const project = slug ? getProjectMeta(slug) : null;
  if (project) {
    return {
      title: `${project.title} | Work`,
      description: project.summary || project.desc,
    };
  }

  return { title: "Project" };
}

export default async function Page(props) {
  const params = props?.params ? await props.params : null;
  const rawSlug = params?.slug ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : null;
  const slug = rawSlug ? resolveProjectSlug(rawSlug) : null;
  const project = slug ? getProjectMeta(slug) : null;

  if (!project || (isDraftWorkSlug(slug) && !showDraftWork())) {
    notFound();
  }

  return <ProjectDetails project={project} />;
}

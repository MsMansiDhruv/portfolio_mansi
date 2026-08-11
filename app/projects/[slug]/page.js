import ProjectDetails from "./ProjectDetails";
import { PROJECT_META, getProjectMeta, resolveProjectSlug } from "@/lib/data/project-meta";
import { AMC_CASE_STUDY_SLUG } from "@/lib/data/amc-case-study";
import { OLAP_CASE_STUDY_SLUG } from "@/lib/data/olap-case-study";
import { BRAIN_CASE_STUDY_SLUG } from "@/lib/data/brain-case-study";
import { INTELLIGENCE_PIPELINE_SLUG } from "@/lib/data/intelligence-pipeline-case-study";

export async function generateStaticParams() {
  const slugs = Object.keys(PROJECT_META);
  if (!slugs.includes("amc")) slugs.push("amc");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props) {
  const params = props?.params ? await props.params : null;
  const rawSlug = params?.slug ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : null;
  const slug = rawSlug ? resolveProjectSlug(rawSlug) : null;

  if (slug === AMC_CASE_STUDY_SLUG) {
    return {
      title: "Legacy Data Modernization & ETL | Case Study",
      description:
        "Engineering case study: AWS data lake, Glue ETL, Redshift, and analytics modernization for a confidential asset-management client — architecture, decisions, and outcomes.",
    };
  }

  if (slug === OLAP_CASE_STUDY_SLUG) {
    return {
      title: "From OLAP to Workload-Specific Data Architecture | Mansi Dhruv",
      description:
        "Production data-platform migration: separating application serving and analytical workloads after Redshift cost and benchmark evidence.",
    };
  }

  if (slug === BRAIN_CASE_STUDY_SLUG) {
    return {
      title: "Productionizing an ML-Driven Allocation Engine | Mansi Dhruv",
      description:
        "Case study: ML allocation for a confidential fintech engagement — classification, production pipeline, and event-driven decisioning on AWS.",
    };
  }

  if (slug === INTELLIGENCE_PIPELINE_SLUG) {
    return {
      title: "Automated Web Intelligence Pipeline | Mansi Dhruv",
      description:
        "Data engineering case study: crawlers, extraction, deduplication, AWS infrastructure, and integration of a Data Science classification model into production reporting.",
    };
  }

  const project = slug ? getProjectMeta(slug) : null;
  if (project) {
    return {
      title: `${project.title} | Projects`,
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

  if (!project) {
    return (
      <main className="max-w-3xl py-16">
        <h1 className="text-2xl font-semibold">Project not found</h1>
        <p className="mt-2 text-slate-500">
          No project was found for <code>{rawSlug}</code>
        </p>
      </main>
    );
  }

  return <ProjectDetails project={project} />;
}

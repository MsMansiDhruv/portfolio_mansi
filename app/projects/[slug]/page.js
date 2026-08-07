import ProjectDetails from "./ProjectDetails";
import { PROJECT_META, getProjectMeta, resolveProjectSlug } from "@/lib/data/project-meta";
import { AMC_CASE_STUDY_SLUG } from "@/lib/data/amc-case-study";

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
        "Engineering case study: AWS data lake, Glue ETL, Redshift, and analytics modernization for a leading Indian AMC — architecture, decisions, and outcomes.",
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

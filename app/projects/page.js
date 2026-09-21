import nextDynamic from "next/dynamic";

export const dynamic = "force-static";
export const revalidate = 86400;

const WorkExhibition = nextDynamic(() => import("@/components/work/WorkExhibition"), {
  ssr: false,
  loading: () => <div className="wd-root is-ready" aria-busy="true" />,
});

/** Work — selected systems, without the homepage globe. */
export default function ProjectsPage() {
  return <WorkExhibition />;
}

"use client";

import dynamic from "next/dynamic";

const InstallationRoom = dynamic(() => import("@/components/work/InstallationRoom"), {
  loading: () => <div className="wd-root wd-page wk-root is-ready" aria-busy="true" />,
});

export default function ProjectDetails({ project }) {
  return <InstallationRoom slug={project.slug} />;
}

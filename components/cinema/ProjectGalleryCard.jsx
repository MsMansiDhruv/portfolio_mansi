"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { PROJECTS } from "@/lib/data/projects";
import { EXPERIMENT_PROJECT_SLUGS } from "@/lib/data/identity";
import { HOME_CASE_STUDIES } from "@/lib/data/home-content";

const COVERS = {
  "project-amc-datalake-solution": "/projects/amc/architecture.png",
  "automated-intelligence-pipeline": "/projects/intelligence/architecture.jpg",
};

export default function ProjectGalleryCard({ project, index }) {
  const reduced = useReducedMotion();
  const cs = HOME_CASE_STUDIES.find((c) => c.slug === project.slug);
  const isExperiment = EXPERIMENT_PROJECT_SLUGS.includes(project.slug);
  const cover = COVERS[project.slug];

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
    >
      <Link href={`/projects/${project.slug}`} className="group relative block overflow-hidden border border-white/10">
        <div className="relative aspect-[16/11] overflow-hidden bg-[var(--kairo-charcoal)]">
          {cover ? (
            <Image
              src={cover}
              alt=""
              fill
              className="object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: isExperiment
                  ? "radial-gradient(circle at 40% 40%, rgba(124,107,255,0.35), transparent 60%), #111827"
                  : "radial-gradient(circle at 40% 40%, rgba(40,217,240,0.2), transparent 60%), #0a0f1c",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--kairo-ink)] via-transparent to-transparent opacity-90 transition group-hover:opacity-70" />
          <span className="kairo-mono absolute left-4 top-4 text-[var(--kairo-gold)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          {isExperiment ? (
            <span className="kairo-mono absolute right-4 top-4 text-[var(--kairo-violet)]">EXPERIMENT</span>
          ) : null}
        </div>
        <div className="p-5 transition group-hover:bg-white/[0.03]">
          <h3 className="kairo-display text-xl font-bold group-hover:text-[var(--kairo-cyan)]">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-[var(--kairo-muted)]">{cs?.outcome || project.desc}</p>
          <p className="kairo-mono mt-3 text-[10px] text-[var(--kairo-muted)]">
            {(project.tech || project.tags || []).slice(0, 4).join(" · ")}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function useSortedProjects() {
  return [...PROJECTS].sort((a, b) => b.date.localeCompare(a.date));
}

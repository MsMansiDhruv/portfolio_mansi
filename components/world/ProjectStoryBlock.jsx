"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getProjectMeta } from "@/lib/data/project-meta";

const ACCENTS = ["var(--world-cyan)", "var(--world-blue)", "var(--world-coral)", "var(--world-violet)"];
const IMAGES = {
  "project-amc-datalake-solution": "/projects/amc/architecture.png",
  "automated-intelligence-pipeline": "/projects/intelligence/architecture.jpg",
};

export default function ProjectStoryBlock({ study, index, inverted = false }) {
  const reduced = useReducedMotion();
  const meta = getProjectMeta(study.slug);
  const accent = ACCENTS[index % ACCENTS.length];
  const image = IMAGES[study.slug];
  const chapters = [
    { title: "The problem", body: study.problem || meta?.problem },
    {
      title: "The decision",
      body:
        study.editorialNote ||
        meta?.decisions?.[0]?.why ||
        meta?.decisions?.[0]?.decision,
    },
    { title: "The result", body: study.outcome || meta?.summary },
  ].filter((c) => c.body);

  return (
    <motion.article
      id={index === 0 ? "act-work" : undefined}
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden ${inverted ? "world-act-paper text-[var(--world-ink)]" : "world-act-ink"}`}
    >
      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-2 lg:min-h-[32rem]">
        <div className={`flex flex-col justify-center px-5 py-14 sm:px-10 lg:px-14 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
          <p className="world-display text-xs font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>
            Project {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="world-display mt-4 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">{study.title}</h3>
          <p className="mt-3 text-sm uppercase tracking-wider opacity-60">{study.category}</p>

          <div className="mt-10 space-y-8">
            {chapters.map((ch, i) => (
              <div key={ch.title} className="border-l-2 pl-4" style={{ borderColor: accent }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-50">
                  Chapter {String(i + 1).padStart(2, "0")} · {ch.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed opacity-85 sm:text-base">{ch.body}</p>
              </div>
            ))}
          </div>

          <Link
            href={`/projects/${study.slug}`}
            className="world-display mt-10 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider transition hover:gap-3"
            style={{ color: accent }}
          >
            Full case study
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className={`relative min-h-[16rem] ${index % 2 === 1 ? "lg:order-1" : ""}`}>
          {image ? (
            <Image src={image} alt="" fill className="object-cover object-center opacity-90" sizes="(max-width: 1024px) 100vw, 50vw" />
          ) : (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 30% 40%, ${accent}, transparent 55%), linear-gradient(135deg, #111 0%, #1a1a24 100%)`,
              }}
            />
          )}
          <div className={`absolute inset-0 ${inverted ? "bg-gradient-to-r from-[var(--world-paper)] via-transparent to-transparent lg:w-1/3" : "bg-gradient-to-l from-[var(--world-ink)] via-transparent to-transparent lg:w-1/3"}`} />
        </div>
      </div>
    </motion.article>
  );
}

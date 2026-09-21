"use client";

import Link from "next/link";
import { Database, GitBranch, Layers, Sparkles, Workflow } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

const ICONS = [Layers, Workflow, Database, GitBranch, Sparkles];

function Header({ code, story }) {
  return (
    <div className="wd-bento__header">
      <span>{code}</span>
      <p>{story}</p>
    </div>
  );
}

export default function WorkBento({ projects = [], compact = false }) {
  const list = compact ? projects.slice(0, 7) : projects;
  return (
    <BentoGrid className={`wd-bento${compact ? " wd-bento--compact" : ""}`}>
      {list.map((item, i) => {
        const Icon = ICONS[i % ICONS.length];
        const wide = i === 0 || i === 3;
        return (
          <Link
            key={item.slug}
            href={`/projects/${item.slug}`}
            className={wide ? "md:col-span-2" : undefined}
          >
            <BentoGridItem
              className={`wd-bento__item${wide ? " md:col-span-2" : ""}`}
              title={item.cardTitle || item.title}
              description={item.problem || item.story || item.purpose}
              header={<Header code={item.code || item.number} story={item.story || item.category} />}
              icon={<Icon className="h-4 w-4" strokeWidth={1.7} />}
            />
          </Link>
        );
      })}
    </BentoGrid>
  );
}

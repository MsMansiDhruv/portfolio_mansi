"use client";

import Link from "next/link";
import { RECOMMENDATIONS, getRecommendationText } from "@/lib/data/recommendations";
import { Reveal } from "@/components/portfolio/motion";

function publicLabel(item) {
  if (item.showIdentity) return item.name;
  return item.relationship || "Colleague";
}

export default function HomeRecommendationsTeaser() {
  const featured = RECOMMENDATIONS.find((r) => r.featured) || RECOMMENDATIONS[0];
  if (!featured) return null;

  const text = getRecommendationText(featured);
  const excerpt = text.split(/\n/)[0]?.slice(0, 180) + (text.length > 180 ? "…" : "");

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">From collaborators</h2>
        <Link href="/credentials#recommendations" className="text-sm font-medium text-teal-800 dark:text-teal-400">
          Read all →
        </Link>
      </div>

      <Reveal className="mt-6 block">
        <blockquote className="max-w-3xl">
          <span className="font-serif text-4xl leading-none text-slate-300 dark:text-slate-600" aria-hidden>
            &ldquo;
          </span>
          <p className="mt-1 font-serif text-lg italic leading-relaxed text-slate-700 dark:text-slate-300">{excerpt}</p>
          <footer className="mt-4 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
            {publicLabel(featured)}
          </footer>
        </blockquote>
      </Reveal>
    </section>
  );
}

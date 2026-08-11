"use client";

import { TESTIMONIALS } from "@/lib/data/testimonials";
import { Reveal } from "@/components/portfolio/motion";

function TestimonialEntry({ item, index }) {
  return (
    <Reveal delay={index * 0.06} viewportAmount={0.15}>
      <figure className="relative min-w-0 border-l-2 border-teal-700/25 py-1 pl-5 dark:border-teal-500/30">
        <span
          className="pointer-events-none absolute -left-0.5 top-0 select-none font-serif text-3xl leading-none text-teal-800/20 dark:text-teal-400/25"
          aria-hidden
        >
          &ldquo;
        </span>
        <blockquote className="relative text-[0.9375rem] leading-[1.65] text-slate-700 dark:text-slate-300">
          {item.text}
        </blockquote>
        <figcaption className="mt-5 border-t border-slate-200/80 pt-4 dark:border-slate-800/80">
          <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.name}</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{item.title}</p>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export default function TestimonialsGrid({ items = TESTIMONIALS }) {
  if (!items?.length) return null;

  return (
    <div className="grid min-w-0 gap-x-10 gap-y-10 sm:grid-cols-2">
      {items.map((item, index) => (
        <TestimonialEntry key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}

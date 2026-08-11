"use client";

import { TESTIMONIALS } from "@/lib/data/testimonials";
import { Reveal } from "@/components/portfolio/motion";

function TestimonialBlock({ item, index }) {
  return (
    <Reveal delay={index * 0.06} viewportAmount={0.1}>
      <figure className="min-w-0">
        <blockquote className="relative border-l border-slate-300 pl-5 dark:border-slate-700">
          <span
            className="pointer-events-none mb-2 block font-serif text-4xl leading-none text-teal-800/15 dark:text-teal-400/20"
            aria-hidden
          >
            &ldquo;
          </span>
          <p className="text-[0.9375rem] leading-[1.7] text-slate-700 dark:text-slate-300">{item.text}</p>
        </blockquote>
        <figcaption className="mt-5 pl-5">
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
    <div className="grid min-w-0 gap-x-12 gap-y-12 lg:grid-cols-2">
      {items.map((item, index) => (
        <TestimonialBlock key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { RECOMMENDATIONS, getRecommendationText } from "@/lib/data/recommendations";

function publicLabel(item) {
  if (item.showIdentity) return item.name;
  return item.relationship || "Colleague";
}

function quoteExcerpt(rec) {
  const text = getRecommendationText(rec);
  const first = text.split(/\n/)[0]?.trim() ?? text;
  return first.length > 220 ? `${first.slice(0, 220)}…` : first;
}

export default function HumanSpread() {
  const reduced = useReducedMotion();
  const featured = RECOMMENDATIONS.filter((r) => r.featured).concat(RECOMMENDATIONS.filter((r) => !r.featured)).slice(0, 2);

  if (!featured.length) return null;

  return (
    <section id="act-human" className="world-act-paper relative px-5 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--world-muted)]">People I have worked with</p>
        <h2 className="world-display mt-4 text-[clamp(2rem,5vw,3rem)] font-bold">Trusted by teams who care about the craft.</h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          {featured.map((rec, i) => (
            <motion.blockquote
              key={rec.id}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <span className="world-editorial absolute -left-2 -top-8 text-7xl text-[var(--world-coral)]/30">&ldquo;</span>
              <p className="world-editorial text-xl leading-relaxed sm:text-2xl">{quoteExcerpt(rec)}</p>
              <footer className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[var(--world-ink)]/10" aria-hidden />
                <div>
                  <p className="text-sm font-semibold">{publicLabel(rec)}</p>
                  {rec.date ? <p className="text-xs uppercase tracking-wider opacity-50">{rec.date}</p> : null}
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        <Link
          href="/credentials#recommendations"
          className="world-display mt-12 inline-block text-sm font-semibold uppercase tracking-wider underline decoration-[var(--world-coral)] decoration-2 underline-offset-4"
        >
          More on credentials →
        </Link>
      </div>
    </section>
  );
}

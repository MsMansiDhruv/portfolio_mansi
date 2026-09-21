"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

function label(item) {
  return item?.cardTitle || item?.title || "Project";
}

export default function ProjectPager({ prev, next }) {
  return (
    <nav className="wd-pager" aria-label="Project navigation">
      {prev ? (
        <Link href={`/projects/${prev.slug}`} className="wd-pager__dir is-prev">
          <span className="wd-pager__hint">
            <ArrowLeft size={16} strokeWidth={1.8} aria-hidden />
            Previous
          </span>
          <strong>{label(prev)}</strong>
        </Link>
      ) : (
        <Link href="/projects" className="wd-pager__dir is-prev">
          <span className="wd-pager__hint">
            <ArrowLeft size={16} strokeWidth={1.8} aria-hidden />
            Back
          </span>
          <strong>All work</strong>
        </Link>
      )}

      <Link href="/projects" className="wd-pager__index">
        All work
      </Link>

      {next ? (
        <Link href={`/projects/${next.slug}`} className="wd-pager__dir is-next">
          <span className="wd-pager__hint">
            Next
            <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
          </span>
          <strong>{label(next)}</strong>
        </Link>
      ) : (
        <Link href="/" className="wd-pager__dir is-next">
          <span className="wd-pager__hint">
            Home
            <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
          </span>
          <strong>Back to the map</strong>
        </Link>
      )}
    </nav>
  );
}

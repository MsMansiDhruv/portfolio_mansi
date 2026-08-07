"use client";

import Link from "next/link";
import { cn } from "../../../lib/cn";

export function Breadcrumb({ items, className }) {
  if (!items?.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[var(--ds-text-muted)]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.href ?? item.label} className="inline-flex items-center gap-1.5">
              {!isLast && item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-[var(--ds-text)] transition-colors ds-focus-ring rounded-sm"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast && "font-medium text-[var(--ds-text)]")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <span className="text-[var(--ds-border-strong)] select-none" aria-hidden>
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Build crumbs from pathname segments */
export function breadcrumbsFromPath(pathname, labelMap = {}) {
  const parts = (pathname || "/").split("/").filter(Boolean);
  const items = [{ label: labelMap.home ?? "Home", href: "/" }];
  let acc = "";
  parts.forEach((segment) => {
    acc += `/${segment}`;
    items.push({
      href: acc,
      label:
        labelMap[segment] ??
        segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    });
  });
  return items;
}

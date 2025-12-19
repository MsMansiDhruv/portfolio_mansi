"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Reusable Breadcrumbs
 * - Automatically builds path from URL
 * - Optional label overrides
 * - Matches site accent + animation style
 */
export default function Breadcrumbs({
  labelMap = {},
  rootLabel = "Home",
}) {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) return null;

  const items = [{ href: "/", label: rootLabel }];

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

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm">
      <ol className="flex items-center flex-wrap gap-2 text-slate-600 dark:text-slate-400">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="flex items-center"
            >
              {!isLast ? (
                <Link
                  href={item.href}
                  className="hover:underline transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-medium"
                  style={{ color: "var(--site-accent)" }}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span
                  className="mx-2 select-none"
                  style={{ color: "var(--site-accent)" }}
                >
                  /
                </span>
              )}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}

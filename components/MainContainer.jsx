"use client";

import { Container, Stack } from "@/components/design-system-v2";
import { cn } from "@/lib/cn";

/**
 * Modern main content container for pages
 * Ensures consistent max-width, padding, and responsive behavior
 */
export default function MainContainer({
  children,
  size = "lg",
  className,
  noPadding = false,
  ...props
}) {
  return (
    <Container
      size={size}
      className={cn(
        "py-8 sm:py-12 md:py-16 lg:py-20",
        !noPadding && "px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </Container>
  );
}

/**
 * Responsive grid for displaying content items
 * Automatically adjusts columns based on screen size
 */
export function ResponsiveGrid({
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 3 },
  gap = "lg",
  className,
  ...props
}) {
  const gridClasses = {
    "grid-cols-1": cols.sm === 1,
    "sm:grid-cols-2": cols.md === 2,
    "sm:grid-cols-3": cols.md === 3,
    "sm:grid-cols-4": cols.md === 4,
    "md:grid-cols-2": cols.md === 2,
    "md:grid-cols-3": cols.md === 3,
    "md:grid-cols-4": cols.md === 4,
    "lg:grid-cols-2": cols.lg === 2,
    "lg:grid-cols-3": cols.lg === 3,
    "lg:grid-cols-4": cols.lg === 4,
    "lg:grid-cols-5": cols.lg === 5,
    "lg:grid-cols-6": cols.lg === 6,
    "xl:grid-cols-3": cols.xl === 3,
    "xl:grid-cols-4": cols.xl === 4,
    "xl:grid-cols-5": cols.xl === 5,
    "xl:grid-cols-6": cols.xl === 6,
  };

  const gapClasses = {
    xs: "gap-2",
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div
      className={cn(
        "grid",
        gridClasses,
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Page section with title and optional description
 */
export function PageSection({
  title,
  description,
  children,
  className,
  ...props
}) {
  return (
    <section className={cn("py-8 sm:py-12 md:py-16", className)} {...props}>
      {(title || description) && (
        <div className="mb-8 sm:mb-10 md:mb-12">
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * Hero section with centered content
 */
export function HeroSection({
  title,
  subtitle,
  description,
  children,
  className,
  ...props
}) {
  return (
    <section
      className={cn(
        "py-12 sm:py-16 md:py-24 lg:py-32 text-center",
        className
      )}
      {...props}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {title && (
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            {title}
          </h1>
        )}
        {subtitle && (
          <div className="text-xl sm:text-2xl text-blue-600 dark:text-blue-400 font-semibold mb-4">
            {subtitle}
          </div>
        )}
        {description && (
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { cn } from "../../lib/cn";

export function Nav({ className, children, ...props }) {
  return (
    <nav className={cn("ds-nav", className)} {...props}>
      {children}
    </nav>
  );
}

export function NavLink({ href, active, children, className, external, ...props }) {
  const classes = cn("ds-nav__link ds-focus-ring", active && "ds-nav__link--active", className);

  if (external || (href && String(href).startsWith("http"))) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

export function NavSection({ label, className, children }) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label ? (
        <span className="ds-text-overline px-3 py-1" style={{ fontSize: "var(--ds-text-xs)" }}>
          {label}
        </span>
      ) : null}
      {children}
    </div>
  );
}

export function NavBar({
  brand,
  children,
  actions,
  className,
  sticky = true,
}) {
  return (
    <header
      className={cn(
        "w-full border-b border-[var(--ds-border)] bg-[var(--ds-bg)]/80 backdrop-blur-md",
        sticky && "sticky top-0 z-[var(--ds-z-sticky)]",
        className
      )}
    >
      <div
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-6"
        style={{ paddingLeft: "var(--ds-space-4)", paddingRight: "var(--ds-space-4)" }}
      >
        <div className="flex items-center gap-8 min-w-0">
          {brand}
          <Nav className="hidden md:flex">{children}</Nav>
        </div>
        {actions ? <div className="flex items-center gap-2 shrink-0">{actions}</div> : null}
      </div>
    </header>
  );
}

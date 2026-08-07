/**
 * Navigation Components
 * Breadcrumb, Nav, and related navigation elements
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Breadcrumb Component
 */
export const Breadcrumb = React.forwardRef(function Breadcrumb(
  { className, children, separator = <ChevronRight size={16} />, ...props },
  ref
) {
  return (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      className={cn('ds-breadcrumb', className)}
      {...props}
    >
      <ol className="flex items-center gap-1 text-sm">
        {React.Children.map(children, (child, idx) => (
          <li key={idx} className="flex items-center gap-1">
            {child}
            {idx < React.Children.count(children) - 1 && (
              <span className="text-neutral-400 dark:text-neutral-600 mx-1">
                {separator}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

/**
 * BreadcrumbItem Component
 */
export const BreadcrumbItem = React.forwardRef(function BreadcrumbItem(
  { href, className, children, isActive = false, ...props },
  ref
) {
  const baseClasses = cn(
    'ds-breadcrumb-item',
    'transition-colors duration-200',
    isActive
      ? 'text-neutral-900 dark:text-neutral-50 font-medium'
      : 'text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400',
    className
  );

  if (href) {
    return (
      <Link ref={ref} href={href} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <span ref={ref} className={baseClasses} {...props}>
      {children}
    </span>
  );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';

/**
 * Breadcrumb Helper to create from path
 */
export function breadcrumbsFromPath(pathname = '') {
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: '/' + segment,
    }));

  return [
    { label: 'Home', href: '/', icon: Home },
    ...segments,
  ];
}

/**
 * Nav Component
 * Header navigation bar
 */
export const Nav = React.forwardRef(function Nav(
  { className, children, sticky = false, ...props },
  ref
) {
  return (
    <nav
      ref={ref}
      className={cn(
        'ds-nav',
        'bg-white dark:bg-neutral-900',
        'border-b border-neutral-200 dark:border-neutral-800',
        sticky && 'sticky top-0 z-50',
        className
      )}
      {...props}
    >
      {children}
    </nav>
  );
});

Nav.displayName = 'Nav';

/**
 * NavLink Component
 */
export const NavLink = React.forwardRef(function NavLink(
  { href, active = false, className, children, ...props },
  ref
) {
  return (
    <Link
      ref={ref}
      href={href}
      className={cn(
        'ds-nav-link',
        'px-3 py-2 rounded-md text-sm font-medium',
        'transition-colors duration-200',
        active
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950'
          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
});

NavLink.displayName = 'NavLink';

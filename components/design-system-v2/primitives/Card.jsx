/**
 * Premium Card Component
 * Base container for content with consistent styling and optional interactivity
 */

'use client';

import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '@/lib/cn';

const VARIANTS = {
  default: 'ds-card--default',
  elevated: 'ds-card--elevated',
  outlined: 'ds-card--outlined',
  ghost: 'ds-card--ghost',
  interactive: 'ds-card--interactive',
};

/**
 * Card Component
 */
export const Card = React.forwardRef(function Card(
  {
    variant = 'default',
    className,
    children,
    as = 'div',
    clickable = false,
    ...props
  },
  ref
) {
  const { isDark } = useTheme();
  const Component = as;

  const baseClasses = cn(
    'ds-card',
    'rounded-lg p-4 transition-all duration-200',
    VARIANTS[variant] || VARIANTS.default,
    clickable && 'cursor-pointer',
    className
  );

  return (
    <Component ref={ref} className={baseClasses} {...props}>
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

/**
 * CardHeader
 */
export const CardHeader = React.forwardRef(function CardHeader(
  { className, children, ...props },
  ref
) {
  return (
    <div ref={ref} className={cn('ds-card-header', 'mb-4', className)} {...props}>
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle
 */
export const CardTitle = React.forwardRef(function CardTitle(
  { className, children, ...props },
  ref
) {
  return (
    <h3
      ref={ref}
      className={cn(
        'ds-card-title',
        'text-lg font-semibold',
        'text-neutral-900 dark:text-neutral-50',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = 'CardTitle';

/**
 * CardDescription
 */
export const CardDescription = React.forwardRef(function CardDescription(
  { className, children, ...props },
  ref
) {
  return (
    <p
      ref={ref}
      className={cn(
        'ds-card-description',
        'text-sm',
        'text-neutral-600 dark:text-neutral-400',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

/**
 * CardContent
 */
export const CardContent = React.forwardRef(function CardContent(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('ds-card-content', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

/**
 * CardFooter
 */
export const CardFooter = React.forwardRef(function CardFooter(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('ds-card-footer', 'mt-4 flex gap-2', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

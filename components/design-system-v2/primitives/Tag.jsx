/**
 * Premium Tag & Badge Components
 * For labels, categories, and status indicators
 */

'use client';

import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '@/lib/cn';

const TAG_VARIANTS = {
  gray: 'ds-tag--gray',
  primary: 'ds-tag--primary',
  success: 'ds-tag--success',
  warning: 'ds-tag--warning',
  error: 'ds-tag--error',
  info: 'ds-tag--info',
};

const TAG_SIZES = {
  sm: 'ds-tag--sm',
  md: 'ds-tag--md',
  lg: 'ds-tag--lg',
};

/**
 * Tag Component
 * Inline, small label for categorization
 */
export const Tag = React.forwardRef(function Tag(
  {
    variant = 'gray',
    size = 'md',
    className,
    children,
    icon,
    onRemove,
    ...props
  },
  ref
) {
  const { isDark } = useTheme();

  return (
    <span
      ref={ref}
      className={cn(
        'ds-tag',
        'inline-flex items-center gap-1.5',
        'px-2.5 py-1 rounded-md',
        'font-medium text-sm',
        'transition-colors duration-200',
        TAG_VARIANTS[variant] || TAG_VARIANTS.gray,
        TAG_SIZES[size] || TAG_SIZES.md,
        className
      )}
      {...props}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="inline-flex ml-1 hover:scale-110 transition-transform"
          aria-label="Remove tag"
        >
          ×
        </button>
      )}
    </span>
  );
});

Tag.displayName = 'Tag';

/**
 * Badge Component
 * Indicator badge for status, count, or notification
 */
export const Badge = React.forwardRef(function Badge(
  {
    variant = 'primary',
    size = 'md',
    className,
    children,
    dot = false,
    animated = false,
    ...props
  },
  ref
) {
  const baseClasses = cn(
    'ds-badge',
    'inline-flex items-center justify-center gap-1',
    'font-medium text-xs',
    'rounded-full',
    'transition-all duration-200',
    dot && 'w-2 h-2 p-0',
    !dot && 'px-2 py-1',
    TAG_VARIANTS[variant] || TAG_VARIANTS.primary,
    animated && 'ds-badge--animated',
    className
  );

  return (
    <span ref={ref} className={baseClasses} {...props}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

/**
 * TagGroup Component
 * Container for multiple tags
 */
export const TagGroup = React.forwardRef(function TagGroup(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('ds-tag-group', 'flex flex-wrap gap-2', className)}
      {...props}
    >
      {children}
    </div>
  );
});

TagGroup.displayName = 'TagGroup';

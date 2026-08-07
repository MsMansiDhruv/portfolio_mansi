/**
 * Metric & Stat Components
 * For displaying key numbers and statistics
 */

'use client';

import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '@/lib/cn';

/**
 * Metric Component
 * Display a labeled metric or key number
 */
export const Metric = React.forwardRef(function Metric(
  {
    label,
    value,
    unit,
    trend,
    trendDirection = 'up', // 'up' | 'down' | 'neutral'
    size = 'md',
    className,
    icon,
    ...props
  },
  ref
) {
  const { isDark } = useTheme();

  const trendColor =
    trendDirection === 'up'
      ? 'text-green-600 dark:text-green-400'
      : trendDirection === 'down'
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-600 dark:text-gray-400';

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'ds-metric',
        'flex flex-col gap-1',
        'px-3 py-2 rounded-md',
        className
      )}
      {...props}
    >
      {icon && <div className="inline-flex text-primary-600 dark:text-primary-400">{icon}</div>}

      {label && (
        <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          {label}
        </div>
      )}

      <div className="flex items-baseline gap-1">
        <div className={cn(sizeClasses[size], 'font-bold text-neutral-900 dark:text-neutral-50')}>
          {value}
        </div>
        {unit && <span className="text-xs text-neutral-500 dark:text-neutral-400">{unit}</span>}
      </div>

      {trend && (
        <div className={cn('text-xs font-medium', trendColor)}>
          {trendDirection === 'up' && '↑'} {trendDirection === 'down' && '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
});

Metric.displayName = 'Metric';

/**
 * Stat Component
 * Larger, more prominent display for statistics
 */
export const Stat = React.forwardRef(function Stat(
  {
    label,
    value,
    description,
    icon,
    variant = 'default',
    className,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'ds-stat',
        'p-4 rounded-lg',
        'border border-neutral-200 dark:border-neutral-800',
        'bg-neutral-50 dark:bg-neutral-900',
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
            {label}
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mt-1">
            {value}
          </div>
          {description && (
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

Stat.displayName = 'Stat';

/**
 * MetricGrid Component
 * Container for multiple metrics
 */
export const MetricGrid = React.forwardRef(function MetricGrid(
  { className, children, cols = 3, ...props },
  ref
) {
  const gridColsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'ds-metric-grid',
        'grid gap-4',
        gridColsMap[cols] || gridColsMap[3],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

MetricGrid.displayName = 'MetricGrid';

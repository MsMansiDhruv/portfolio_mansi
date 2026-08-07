/**
 * Pipeline Component
 * Visual representation of data or process pipelines
 */

'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Pipeline Container
 */
export const Pipeline = React.forwardRef(function Pipeline(
  { className, children, orientation = 'horizontal', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'ds-pipeline',
        orientation === 'vertical' ? 'flex flex-col gap-4' : 'flex gap-2 items-center overflow-x-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Pipeline.displayName = 'Pipeline';

/**
 * Pipeline Stage
 */
export const PipelineStage = React.forwardRef(function PipelineStage(
  {
    label,
    icon,
    status = 'pending', // 'pending' | 'in-progress' | 'completed' | 'failed'
    description,
    className,
    ...props
  },
  ref
) {
  const statusColors = {
    pending: 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700',
    'in-progress': 'bg-primary-100 dark:bg-primary-900 border-primary-400 dark:border-primary-600',
    completed: 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600',
    failed: 'bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600',
  };

  const iconColors = {
    pending: 'text-neutral-600 dark:text-neutral-400',
    'in-progress': 'text-primary-600 dark:text-primary-400',
    completed: 'text-green-600 dark:text-green-400',
    failed: 'text-red-600 dark:text-red-400',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'ds-pipeline-stage',
        'flex flex-col items-center gap-2',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-lg border-2',
          'flex items-center justify-center',
          'transition-colors duration-200',
          statusColors[status]
        )}
      >
        {icon ? (
          <span className={iconColors[status]}>{icon}</span>
        ) : (
          <div
            className={cn(
              'w-3 h-3 rounded-full',
              status === 'completed' && 'bg-green-600 dark:bg-green-400',
              status === 'in-progress' && 'bg-primary-600 dark:bg-primary-400 animate-pulse',
              status === 'failed' && 'bg-red-600 dark:bg-red-400',
              status === 'pending' && 'bg-neutral-400 dark:bg-neutral-500'
            )}
          />
        )}
      </div>
      {label && (
        <div className="text-center">
          <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
            {label}
          </h4>
          {description && (
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

PipelineStage.displayName = 'PipelineStage';

/**
 * Pipeline Timeline
 * Linear progression view
 */
export const PipelineTimeline = React.forwardRef(function PipelineTimeline(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'ds-pipeline-timeline',
        'relative',
        className
      )}
      {...props}
    >
      {/* Vertical connector line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 to-neutral-300 dark:from-primary-600 dark:to-neutral-700" />

      <div className="space-y-6 pl-24">
        {children}
      </div>
    </div>
  );
});

PipelineTimeline.displayName = 'PipelineTimeline';

/**
 * Pipeline Timeline Item
 */
export const PipelineTimelineItem = React.forwardRef(function PipelineTimelineItem(
  {
    title,
    description,
    timestamp,
    icon,
    className,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'ds-pipeline-timeline-item',
        'relative',
        className
      )}
      {...props}
    >
      {/* Timeline dot */}
      <div className="absolute -left-16 top-0 w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border-2 border-primary-500 flex items-center justify-center">
        {icon ? (
          <span className="text-primary-600 dark:text-primary-400">{icon}</span>
        ) : (
          <div className="w-2 h-2 rounded-full bg-primary-500" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <h4 className="font-medium text-neutral-900 dark:text-neutral-50">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {description}
          </p>
        )}
        {timestamp && (
          <span className="text-xs text-neutral-500 dark:text-neutral-500 mt-2 block">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
});

PipelineTimelineItem.displayName = 'PipelineTimelineItem';

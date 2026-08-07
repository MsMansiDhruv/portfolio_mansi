/**
 * Architecture Component
 * Visual diagram for system architecture
 */

'use client';

import React from 'react';
import { cn } from '@/lib/cn';

/**
 * Architecture Diagram Container
 */
export const Architecture = React.forwardRef(function Architecture(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'ds-architecture',
        'p-6 rounded-lg',
        'bg-neutral-50 dark:bg-neutral-900',
        'border border-neutral-200 dark:border-neutral-800',
        className
      )}
      {...props}
    >
      <svg
        className="w-full h-auto"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid meet"
      >
        {children}
      </svg>
    </div>
  );
});

Architecture.displayName = 'Architecture';

/**
 * Architecture Layer
 */
export const ArchLayer = React.forwardRef(function ArchLayer(
  { x = 0, y = 0, width = 180, height = 100, label, icon, className, ...props },
  ref
) {
  return (
    <g ref={ref} {...props}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="currentColor"
        className={cn(
          'fill-primary-100 dark:fill-primary-900',
          'stroke-primary-400 dark:stroke-primary-600',
          'stroke-2',
          className
        )}
        rx="6"
      />
      {label && (
        <text
          x={x + width / 2}
          y={y + 30}
          textAnchor="middle"
          className="fill-neutral-900 dark:fill-neutral-50 font-semibold text-sm"
        >
          {label}
        </text>
      )}
    </g>
  );
});

ArchLayer.displayName = 'ArchLayer';

/**
 * Architecture Node
 */
export const ArchNode = React.forwardRef(function ArchNode(
  { cx = 0, cy = 0, r = 30, label, className, ...props },
  ref
) {
  return (
    <g ref={ref} {...props}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        className={cn(
          'fill-primary-100 dark:fill-primary-900',
          'stroke-primary-600 dark:stroke-primary-400',
          'stroke-2',
          className
        )}
      />
      {label && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-neutral-900 dark:fill-neutral-50 font-semibold text-xs"
        >
          {label}
        </text>
      )}
    </g>
  );
});

ArchNode.displayName = 'ArchNode';

/**
 * Architecture Connector
 */
export const ArchConnector = React.forwardRef(function ArchConnector(
  { x1 = 0, y1 = 0, x2 = 100, y2 = 100, label, className, ...props },
  ref
) {
  return (
    <g ref={ref} {...props}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={cn(
          'stroke-primary-400 dark:stroke-primary-600',
          'stroke-2',
          className
        )}
      />
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 - 4}
          textAnchor="middle"
          className="fill-neutral-600 dark:fill-neutral-400 text-xs"
        >
          {label}
        </text>
      )}
    </g>
  );
});

ArchConnector.displayName = 'ArchConnector';

/**
 * Architecture Reference Stack
 * Shows a stack of layers
 */
export const ArchReferenceStack = React.forwardRef(function ArchReferenceStack(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'ds-arch-stack',
        'space-y-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

ArchReferenceStack.displayName = 'ArchReferenceStack';

/**
 * Layout Components
 * Building blocks for consistent page and component layouts
 */

'use client';

import React from 'react';
import { cn } from '@/lib/cn';

/**
 * Container Component
 * Max-width centered container with consistent padding
 */
export const Container = React.forwardRef(function Container(
  { 
    size = 'lg',
    className, 
    children, 
    as = 'div',
    ...props 
  },
  ref
) {
  const Component = as;

  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'w-full',
  };

  return (
    <Component
      ref={ref}
      className={cn(
        'ds-container',
        'mx-auto px-4 sm:px-6 lg:px-8',
        sizeClasses[size] || sizeClasses.lg,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

Container.displayName = 'Container';

/**
 * Stack Component
 * Flexible vertical or horizontal spacing container
 */
export const Stack = React.forwardRef(function Stack(
  {
    direction = 'vertical',
    gap = 'md',
    align = 'stretch',
    justify = 'flex-start',
    className,
    children,
    as = 'div',
    ...props
  },
  ref
) {
  const Component = as;

  const gapMap = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  const isVertical = direction === 'vertical';

  return (
    <Component
      ref={ref}
      className={cn(
        'ds-stack',
        'flex',
        isVertical ? 'flex-col' : 'flex-row',
        gapMap[gap] || gapMap.md,
        alignMap[align] || alignMap.stretch,
        justifyMap[justify] || justifyMap['start'],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

Stack.displayName = 'Stack';

/**
 * Grid Component
 * Responsive grid layout
 */
export const Grid = React.forwardRef(function Grid(
  {
    cols = 3,
    gap = 'md',
    className,
    children,
    as = 'div',
    ...props
  },
  ref
) {
  const Component = as;

  const gapMap = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const colsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6',
  };

  return (
    <Component
      ref={ref}
      className={cn(
        'ds-grid',
        'grid',
        colsMap[cols] || colsMap[3],
        gapMap[gap] || gapMap.md,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

Grid.displayName = 'Grid';

/**
 * Flex Component
 * Flexible layout with fine-grained control
 */
export const Flex = React.forwardRef(function Flex(
  {
    direction = 'row',
    wrap = false,
    gap = 'md',
    align = 'stretch',
    justify = 'flex-start',
    className,
    children,
    as = 'div',
    ...props
  },
  ref
) {
  const Component = as;

  const gapMap = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  return (
    <Component
      ref={ref}
      className={cn(
        'ds-flex',
        'flex',
        `flex-${direction}`,
        wrap && 'flex-wrap',
        gapMap[gap] || gapMap.md,
        alignMap[align] || alignMap.stretch,
        justifyMap[justify] || justifyMap['start'],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

Flex.displayName = 'Flex';

/**
 * Chart Components
 * Simple, premium data visualization primitives
 */

'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export const chartColors = {
  primary: '#14B8A6',
  secondary: '#64748B',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0EA5E9',
};

/**
 * Sparkline
 * Minimal inline chart
 */
export const Sparkline = React.forwardRef(function Sparkline(
  { data = [], color = chartColors.primary, height = 20, width = 100, className, ...props },
  ref
) {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('ds-sparkline', className)}
      {...props}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
});

Sparkline.displayName = 'Sparkline';

/**
 * Bar Chart
 * Simple bar chart visualization
 */
export const BarChart = React.forwardRef(function BarChart(
  {
    data = [],
    color = chartColors.primary,
    height = 200,
    showLabels = true,
    className,
    ...props
  },
  ref
) {
  if (!data.length) return null;

  const max = Math.max(...data.map(d => d.value || 0));
  const barWidth = 100 / data.length;

  return (
    <div
      ref={ref}
      className={cn(
        'ds-bar-chart',
        'p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900',
        'border border-neutral-200 dark:border-neutral-800',
        className
      )}
      {...props}
    >
      <div style={{ height, position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
        {data.map((item, i) => (
          <div
            key={i}
            style={{
              width: `${barWidth}%`,
              height: `${(item.value / max) * 100}%`,
              backgroundColor: item.color || color,
              borderRadius: '4px 4px 0 0',
              transition: 'all 0.3s ease',
            }}
            title={`${item.label}: ${item.value}`}
          />
        ))}
      </div>
      {showLabels && (
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '8px', fontSize: '12px' }}>
          {data.map((item, i) => (
            <span key={i} className="text-neutral-600 dark:text-neutral-400">
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

BarChart.displayName = 'BarChart';

/**
 * Line Chart
 * Simple line chart visualization
 */
export const LineChart = React.forwardRef(function LineChart(
  {
    data = [],
    color = chartColors.primary,
    width = 400,
    height = 200,
    showGrid = true,
    className,
    ...props
  },
  ref
) {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      ref={ref}
      className={cn(
        'ds-line-chart',
        'p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900',
        'border border-neutral-200 dark:border-neutral-800',
        className
      )}
      {...props}
    >
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
});

LineChart.displayName = 'LineChart';

/**
 * Donut Chart
 * Circular data visualization
 */
export const DonutChart = React.forwardRef(function DonutChart(
  {
    data = [],
    size = 120,
    innerRadius = 0.6,
    showLabel = true,
    className,
    ...props
  },
  ref
) {
  if (!data.length) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2;
  const innerRad = radius * innerRadius;

  let currentAngle = -Math.PI / 2;
  const slices = data.map((item) => {
    const sliceAngle = (item.value / total) * Math.PI * 2;
    const startX = radius + radius * Math.cos(currentAngle);
    const startY = radius + radius * Math.sin(currentAngle);
    const endAngle = currentAngle + sliceAngle;
    const endX = radius + radius * Math.cos(endAngle);
    const endY = radius + radius * Math.sin(endAngle);
    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const path = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} L ${radius + innerRad * Math.cos(endAngle)} ${radius + innerRad * Math.sin(endAngle)} A ${innerRad} ${innerRad} 0 ${largeArc} 0 ${radius + innerRad * Math.cos(currentAngle)} ${radius + innerRad * Math.sin(currentAngle)} Z`;

    currentAngle = endAngle;
    return { ...item, path };
  });

  return (
    <div
      ref={ref}
      className={cn('ds-donut-chart', 'flex flex-col items-center gap-4', className)}
      {...props}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice, i) => (
          <path
            key={i}
            d={slice.path}
            fill={slice.color || chartColors.primary}
          />
        ))}
      </svg>
      {showLabel && (
        <div className="text-center">
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            {total}
          </div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400">
            Total
          </div>
        </div>
      )}
    </div>
  );
});

DonutChart.displayName = 'DonutChart';

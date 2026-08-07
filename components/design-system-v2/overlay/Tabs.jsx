/**
 * Tabs Component
 * Accessible tabbed interface
 */

'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/cn';

/**
 * Tabs Container
 */
export const Tabs = React.forwardRef(function Tabs(
  {
    defaultValue,
    value: controlledValue,
    onValueChange,
    className,
    children,
    ...props
  },
  ref
) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = useCallback(
    (value) => {
      if (!isControlled) {
        setUncontrolledValue(value);
      }
      onValueChange?.(value);
    },
    [isControlled, onValueChange]
  );

  return (
    <div
      ref={ref}
      className={cn('ds-tabs', className)}
      {...props}
    >
      <TabsContext.Provider value={{ currentValue, onValueChange: handleValueChange }}>
        {children}
      </TabsContext.Provider>
    </div>
  );
});

Tabs.displayName = 'Tabs';

/**
 * Tabs Context
 */
const TabsContext = React.createContext(undefined);

export function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {
    throw new Error('Tab components must be used within Tabs');
  }
  return ctx;
}

/**
 * TabsList
 */
export const TabsList = React.forwardRef(function TabsList(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        'ds-tabs-list',
        'flex gap-1 border-b border-neutral-200 dark:border-neutral-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

TabsList.displayName = 'TabsList';

/**
 * TabsTrigger
 */
export const TabsTrigger = React.forwardRef(function TabsTrigger(
  { value, className, children, disabled = false, ...props },
  ref
) {
  const { currentValue, onValueChange } = useTabsContext();
  const isActive = currentValue === value;

  return (
    <button
      ref={ref}
      role="tab"
      type="button"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      className={cn(
        'ds-tab-trigger',
        'px-4 py-2.5 font-medium text-sm',
        'border-b-2 transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
        isActive
          ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
          : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

/**
 * TabsContent
 */
export const TabsContent = React.forwardRef(function TabsContent(
  { value, className, children, ...props },
  ref
) {
  const { currentValue } = useTabsContext();

  if (currentValue !== value) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn('ds-tabs-content', 'py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
});

TabsContent.displayName = 'TabsContent';

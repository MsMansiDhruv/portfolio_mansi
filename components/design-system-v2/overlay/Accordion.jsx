/**
 * Accordion Component
 * Expandable/collapsible content sections
 */

'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/cn';
import { ChevronDown } from 'lucide-react';

/**
 * Accordion Container
 */
export const Accordion = React.forwardRef(function Accordion(
  {
    type = 'single', // 'single' | 'multiple'
    value: controlledValue,
    onValueChange,
    defaultValue,
    className,
    children,
    ...props
  },
  ref
) {
  const [uncontrolledValue, setUncontrolledValue] = useState(
    type === 'single' ? defaultValue : Array.isArray(defaultValue) ? defaultValue : []
  );

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = useCallback(
    (value) => {
      let newValue;

      if (type === 'single') {
        newValue = currentValue === value ? undefined : value;
      } else {
        newValue = Array.isArray(currentValue) ? [...currentValue] : [];
        const idx = newValue.indexOf(value);
        if (idx > -1) {
          newValue.splice(idx, 1);
        } else {
          newValue.push(value);
        }
      }

      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [currentValue, type, isControlled, onValueChange]
  );

  return (
    <div
      ref={ref}
      className={cn('ds-accordion', className)}
      {...props}
    >
      <AccordionContext.Provider value={{ currentValue, onValueChange: handleValueChange, type }}>
        {children}
      </AccordionContext.Provider>
    </div>
  );
});

Accordion.displayName = 'Accordion';

/**
 * Accordion Context
 */
const AccordionContext = React.createContext(undefined);

function useAccordionContext() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) {
    throw new Error('Accordion items must be used within Accordion');
  }
  return ctx;
}

/**
 * AccordionItem
 */
export const AccordionItem = React.forwardRef(function AccordionItem(
  { value, className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('ds-accordion-item', 'border-b border-neutral-200 dark:border-neutral-800', className)}
      {...props}
    >
      <AccordionItemContext.Provider value={value}>
        {children}
      </AccordionItemContext.Provider>
    </div>
  );
});

AccordionItem.displayName = 'AccordionItem';

/**
 * Accordion Item Context
 */
const AccordionItemContext = React.createContext(undefined);

/**
 * AccordionTrigger
 */
export const AccordionTrigger = React.forwardRef(function AccordionTrigger(
  { className, children, ...props },
  ref
) {
  const value = React.useContext(AccordionItemContext);
  const { currentValue, onValueChange, type } = useAccordionContext();

  const isOpen = type === 'single' ? currentValue === value : Array.isArray(currentValue) && currentValue.includes(value);

  return (
    <button
      ref={ref}
      onClick={() => onValueChange(value)}
      className={cn(
        'ds-accordion-trigger',
        'w-full flex items-center justify-between gap-4',
        'px-4 py-3 text-left font-medium text-sm',
        'hover:bg-neutral-50 dark:hover:bg-neutral-900',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500',
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        size={16}
        className={cn(
          'flex-shrink-0 transition-transform duration-200',
          isOpen && 'transform rotate-180'
        )}
      />
    </button>
  );
});

AccordionTrigger.displayName = 'AccordionTrigger';

/**
 * AccordionContent
 */
export const AccordionContent = React.forwardRef(function AccordionContent(
  { className, children, ...props },
  ref
) {
  const value = React.useContext(AccordionItemContext);
  const { currentValue, type } = useAccordionContext();

  const isOpen = type === 'single' ? currentValue === value : Array.isArray(currentValue) && currentValue.includes(value);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn('ds-accordion-content', 'px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400', className)}
      {...props}
    >
      {children}
    </div>
  );
});

AccordionContent.displayName = 'AccordionContent';

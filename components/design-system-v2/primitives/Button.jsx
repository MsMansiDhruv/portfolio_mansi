/**
 * Premium Button Component
 * Inspired by Linear, Vercel, and Stripe
 */

'use client';

import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii, transitions } from '../foundation/tokens';
import { cn } from '@/lib/cn';

const VARIANTS = {
  primary: 'ds-btn--primary',
  secondary: 'ds-btn--secondary',
  outline: 'ds-btn--outline',
  ghost: 'ds-btn--ghost',
  danger: 'ds-btn--danger',
  success: 'ds-btn--success',
};

const SIZES = {
  xs: 'ds-btn--xs',
  sm: 'ds-btn--sm',
  md: 'ds-btn--md',
  lg: 'ds-btn--lg',
  xl: 'ds-btn--xl',
};

/**
 * Button Component
 * Premium, accessible, responsive button with multiple variants
 */
export const Button = React.forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    className,
    children,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled = false,
    isLoading = false,
    as = 'button',
    ...props
  },
  ref
) {
  const { isDark } = useTheme();

  const baseClasses = cn(
    'ds-btn',
    'inline-flex items-center justify-center gap-2',
    'font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    fullWidth && 'w-full',
    className
  );

  const content = (
    <>
      {isLoading ? (
        <svg
          className="ds-btn-spinner"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" strokeDasharray="60" />
        </svg>
      ) : leftIcon ? (
        <span className="inline-flex">{leftIcon}</span>
      ) : null}

      {children}

      {!isLoading && rightIcon ? (
        <span className="inline-flex">{rightIcon}</span>
      ) : null}
    </>
  );

  const commonProps = {
    ref,
    className: baseClasses,
    disabled: disabled || isLoading,
    ...props,
  };

  if (as === 'a' || props.href) {
    return (
      <a {...commonProps} href={props.href}>
        {content}
      </a>
    );
  }

  return <button type="button" {...commonProps}>{content}</button>;
});

Button.displayName = 'Button';

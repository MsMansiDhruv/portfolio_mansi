/**
 * Modal Component
 * Accessible dialog/modal with backdrop
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';

export const Modal = React.forwardRef(function Modal(
  {
    isOpen = false,
    onClose,
    title,
    description,
    children,
    size = 'md',
    closeButton = true,
    backdrop = true,
    className,
    ...props
  },
  ref
) {
  const modalRef = useRef(null);
  const lastFocusRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    lastFocusRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e) {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return createPortal(
    <>
      {/* Backdrop */}
      {backdrop && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className={cn(
            'ds-modal',
            'w-full bg-white dark:bg-neutral-900',
            'rounded-lg shadow-lg',
            'border border-neutral-200 dark:border-neutral-800',
            'max-h-[90vh] overflow-y-auto',
            sizeClasses[size] || sizeClasses.md,
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {/* Header */}
          {(title || closeButton) && (
            <div className="ds-modal-header flex items-start justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex-1">
                {title && (
                  <h2
                    id="modal-title"
                    className="text-lg font-semibold text-neutral-900 dark:text-neutral-50"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    {description}
                  </p>
                )}
              </div>
              {closeButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="ds-modal-content p-6">{children}</div>
        </div>
      </div>
    </>,
    document.body
  );
});

Modal.displayName = 'Modal';

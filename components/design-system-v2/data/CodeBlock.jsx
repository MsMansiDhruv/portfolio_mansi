/**
 * CodeBlock Component
 * Syntax-highlighted code display
 */

'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * CodeBlock Component
 */
export const CodeBlock = React.forwardRef(function CodeBlock(
  {
    code = '',
    language = 'javascript',
    className,
    showLineNumbers = false,
    copyable = true,
    highlighter,
    ...props
  },
  ref
) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Split code into lines
  const lines = code.split('\n');

  return (
    <div
      ref={ref}
      className={cn(
        'ds-code-block',
        'relative rounded-lg overflow-hidden',
        'bg-neutral-900 dark:bg-neutral-950',
        'border border-neutral-800 dark:border-neutral-900',
        'text-neutral-100',
        className
      )}
      {...props}
    >
      {/* Header */}
      {(showLineNumbers || copyable) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 dark:border-neutral-900 bg-neutral-800/50">
          <span className="text-xs font-medium text-neutral-400">{language}</span>
          {copyable && (
            <button
              onClick={handleCopy}
              className="p-1.5 text-neutral-400 hover:text-neutral-200 transition-colors"
              aria-label="Copy code"
            >
              {copied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          )}
        </div>
      )}

      {/* Code content */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed font-mono">
        <code className={cn('language-' + language)}>
          {lines.map((line, idx) => (
            <div key={idx} className="flex">
              {showLineNumbers && (
                <span className="mr-4 text-neutral-600 select-none flex-shrink-0 w-8 text-right">
                  {idx + 1}
                </span>
              )}
              <span>{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';

/**
 * InlineCode Component
 */
export const InlineCode = React.forwardRef(function InlineCode(
  { className, children, ...props },
  ref
) {
  return (
    <code
      ref={ref}
      className={cn(
        'ds-inline-code',
        'px-1.5 py-0.5 rounded',
        'bg-neutral-100 dark:bg-neutral-900',
        'text-neutral-900 dark:text-neutral-100',
        'font-mono text-sm',
        'border border-neutral-200 dark:border-neutral-800',
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
});

InlineCode.displayName = 'InlineCode';

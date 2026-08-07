"use client";

import dynamic from "next/dynamic";

const SyntaxBlock = dynamic(
  () => import("./CodeBlockInner"),
  {
    ssr: false,
    loading: () => (
      <div className="ds-code-block">
        <div className="ds-code-block__header">
          <span>Loading…</span>
        </div>
        <pre className="ds-code-block__body p-4 text-sm font-mono text-[var(--ds-text-muted)]">…</pre>
      </div>
    ),
  }
);

export function CodeBlock(props) {
  return <SyntaxBlock {...props} />;
}

export { InlineCode } from "./CodeBlockInner";

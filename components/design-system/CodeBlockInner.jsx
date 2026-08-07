"use client";

import { useCallback, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "../../lib/cn";
import { Button } from "./Button";
import { useResolvedTheme } from "./theme/useResolvedTheme";

export function InlineCode({ className, children, ...props }) {
  return (
    <code className={cn("ds-inline-code", className)} {...props}>
      {children}
    </code>
  );
}

export default function CodeBlockInner({
  code,
  language = "text",
  filename,
  showLineNumbers = false,
  className,
}) {
  const resolved = useResolvedTheme();
  const [copied, setCopied] = useState(false);
  const theme = resolved === "dark" ? oneDark : oneLight;

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [code]);

  return (
    <div className={cn("ds-code-block", className)}>
      <div className="ds-code-block__header">
        <span>{filename || language}</span>
        <Button variant="ghost" size="sm" onClick={onCopy}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="ds-code-block__body">
        <SyntaxHighlighter
          language={language}
          style={theme}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            background: "transparent",
            fontSize: "var(--ds-text-sm)",
            fontFamily: "var(--ds-font-mono)",
          }}
        >
          {code.trimEnd()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

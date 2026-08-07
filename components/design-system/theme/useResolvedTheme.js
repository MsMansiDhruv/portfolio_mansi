"use client";

import { useEffect, useState } from "react";
import { useDsTheme } from "./ThemeProvider";

export function useResolvedTheme() {
  const { resolved: ctxResolved } = useDsTheme();
  const [resolved, setResolved] = useState(ctxResolved);

  useEffect(() => {
    const read = () => {
      const attr = document.documentElement.getAttribute("data-ds-theme");
      if (attr === "dark" || attr === "light") {
        setResolved(attr);
        return;
      }
      setResolved(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-ds-theme"],
    });
    return () => mo.disconnect();
  }, [ctxResolved]);

  return resolved;
}

"use client";

import { usePathname } from "next/navigation";
import LegacyShell from "@/components/LegacyShell";

export default function ToolsLayout({ children }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/tools/ai-lab")) return children;
  return <LegacyShell>{children}</LegacyShell>;
}

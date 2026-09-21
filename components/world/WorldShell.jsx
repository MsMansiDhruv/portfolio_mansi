"use client";

import WorldPageNav from "@/components/world/WorldPageNav";
import SiteFooter from "@/components/world/SiteFooter";
import { useWorldTheme } from "@/lib/use-world-theme";
import "@/styles/mansi-world-of-data.css";

export default function WorldShell({ children, active }) {
  const [theme] = useWorldTheme();

  return (
    <div className="wd-root wd-page wd-shell is-ready" data-theme={theme} suppressHydrationWarning>
      <WorldPageNav active={active} />
      <div className="wd-shell-body">{children}</div>
      <SiteFooter />
    </div>
  );
}

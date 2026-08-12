"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DSv2ThemeProvider } from "@/components/design-system-v2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import { cn } from "@/lib/cn";
import "@/styles/mansi-world.css";
import "@/styles/mansi-experience.css";

export default function AppShell({ children }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const pathname = usePathname();
  const isAiLab = pathname?.startsWith("/tools/ai-lab");
  const isHome = pathname === "/";
  const isSister = pathname === "/sister";
  const isFullBleed = isHome || isAiLab;

  useEffect(() => {
    document.getElementById("gpu-sparks-canvas")?.remove();
  }, [pathname]);

  if (isSister) {
    return <DSv2ThemeProvider defaultTheme="system" storageKey="theme">{children}</DSv2ThemeProvider>;
  }

  return (
    <DSv2ThemeProvider defaultTheme="system" storageKey="theme">
      <div className="story-page mansi-world flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-[var(--story-midnight)] text-[var(--story-ivory)]">
        {!isHome && <Header onCommandOpen={() => setCommandOpen(true)} cinematic />}

        <main className="min-w-0 flex-grow w-full">
          <div className={cn("min-w-0", isFullBleed ? "max-w-none px-0 py-0" : "max-w-none px-0 py-0")}>
            <PageTransition>{children}</PageTransition>
          </div>
        </main>

        {!isHome && <Footer cinematic />}
      </div>

      <CommandPalette
        isOpen={commandOpen}
        onOpen={() => setCommandOpen(true)}
        onClose={() => setCommandOpen(false)}
      />
      <ScrollToTop />
    </DSv2ThemeProvider>
  );
}

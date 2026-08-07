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

export default function AppShell({ children }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const pathname = usePathname();
  const isAiLab = pathname?.startsWith("/tools/ai-lab");
  const isHome = pathname === "/";

  useEffect(() => {
    document.getElementById("gpu-sparks-canvas")?.remove();
  }, [pathname]);

  return (
    <DSv2ThemeProvider defaultTheme="system" storageKey="theme">
      <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-[#faf9f6] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Header onCommandOpen={() => setCommandOpen(true)} />

        <main className="min-w-0 flex-grow w-full">
          <div
            className={cn(
              "min-w-0",
              isAiLab ? "max-w-none px-0 py-0" : "mx-auto max-w-7xl px-5 sm:px-6 lg:px-8",
              !isAiLab && (isHome ? "py-8 sm:py-10 lg:py-12" : "py-8 sm:py-10 lg:py-14")
            )}
          >
            <PageTransition>{children}</PageTransition>
          </div>
        </main>

        <Footer />
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

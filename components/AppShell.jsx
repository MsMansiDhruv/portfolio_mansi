"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DSv2ThemeProvider, useTheme } from "@/components/design-system-v2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import { cn } from "@/lib/cn";
import "@/styles/mansi-world.css";

function ShellBody({ children, isLiving, showChrome, onCommandOpen }) {
  const { isDark } = useTheme();

  return (
    <div
      className={cn(
        "flex min-h-screen min-w-0 flex-col overflow-x-hidden",
        isLiving
          ? "bg-transparent text-[var(--wd-ink,#f2f6fa)]"
          : "story-page mansi-world bg-[var(--story-midnight)] text-[var(--story-ivory)]"
      )}
      data-shell-theme={isDark ? "dark" : "light"}
    >
      {showChrome ? <Header onCommandOpen={onCommandOpen} cinematic /> : null}

      <main className="min-w-0 w-full flex-grow">
        <div className="min-w-0 max-w-none px-0 py-0">
          {isLiving ? children : <PageTransition>{children}</PageTransition>}
        </div>
      </main>

      {showChrome ? <Footer cinematic /> : null}
    </div>
  );
}

export default function AppShell({ children }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const pathname = usePathname();
  const isAiLab = pathname?.startsWith("/tools/ai-lab");
  const isHome = pathname === "/";
  const isSister = pathname === "/sister";
  const isLab = pathname?.startsWith("/lab/");
  const isPortraitTest = pathname === "/particle-portrait-test";
  const isWork = pathname === "/projects" || pathname?.startsWith("/projects/");
  const isJourney = pathname?.startsWith("/credentials") || pathname?.startsWith("/certification");
  const isContact = pathname === "/contact";
  const isLiving = isHome || isWork || isAiLab || isJourney || isContact;
  const showChrome = !isLiving && !isLab && !isPortraitTest;

  useEffect(() => {
    document.getElementById("gpu-sparks-canvas")?.remove();
  }, [pathname]);

  if (isSister || isLab || isPortraitTest) {
    return (
      <DSv2ThemeProvider defaultTheme="dark" storageKey="ds-v2-theme">
        {children}
      </DSv2ThemeProvider>
    );
  }

  return (
    <DSv2ThemeProvider defaultTheme="dark" storageKey="ds-v2-theme">
      <ShellBody isLiving={isLiving} showChrome={showChrome} onCommandOpen={() => setCommandOpen(true)}>
        {children}
      </ShellBody>

      <CommandPalette
        isOpen={commandOpen}
        onOpen={() => setCommandOpen(true)}
        onClose={() => setCommandOpen(false)}
      />
      {!isHome ? <ScrollToTop /> : null}
    </DSv2ThemeProvider>
  );
}

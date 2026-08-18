"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { DSv2ThemeProvider, useTheme } from "@/components/design-system-v2/theme/ThemeProvider";
import { cn } from "@/lib/cn";
import "@/app/globals.css";
import "@/styles/kairo.css";
import "@/components/design-system-v2/styles/index.css";
import "@/styles/mansi-world.css";

const Header = dynamic(() => import("@/components/Header"));
const Footer = dynamic(() => import("@/components/Footer"));
const CommandPalette = dynamic(() => import("@/components/CommandPalette"), { ssr: false });
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), { ssr: false });
const PageTransition = dynamic(() => import("@/components/PageTransition"));

function ShellBody({ children, onCommandOpen }) {
  const { isDark } = useTheme();

  return (
    <div
      className={cn(
        "story-page mansi-world flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-[var(--story-midnight)] text-[var(--story-ivory)]"
      )}
      data-shell-theme={isDark ? "dark" : "light"}
    >
      <Header onCommandOpen={onCommandOpen} cinematic />
      <main className="min-w-0 w-full flex-grow">
        <div className="min-w-0 max-w-none px-0 py-0">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
      <Footer cinematic />
    </div>
  );
}

export default function LegacyShell({ children }) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <DSv2ThemeProvider defaultTheme="dark" storageKey="ds-v2-theme">
      <ShellBody onCommandOpen={() => setCommandOpen(true)}>{children}</ShellBody>
      <CommandPalette
        isOpen={commandOpen}
        onOpen={() => setCommandOpen(true)}
        onClose={() => setCommandOpen(false)}
      />
      <ScrollToTop />
    </DSv2ThemeProvider>
  );
}

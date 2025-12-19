"use client";

import { useEffect, useRef, useState } from "react";
import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function RootLayout({ children }) {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(80); // fallback
  const [scrolled, setScrolled] = useState(false);

  // measure header height and keep main top padding aligned with header
  useEffect(() => {
    function measure() {
      if (headerRef.current) {
        const h = Math.ceil(headerRef.current.getBoundingClientRect().height);
        setHeaderHeight(h);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // efficient scroll listener using rAF
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || window.pageYOffset;
          setScrolled(y > 24); // threshold
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial state
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col transition-colors duration-300 bg-[#f3f4f6] text-slate-800 dark:bg-[#0c0c0c] dark:text-slate-100"
        style={{ WebkitFontSmoothing: "antialiased" }}
      >
        {/* FIXED HEADER */}
        <header
          ref={headerRef}
          className={`
              fixed left-0 right-0 top-0 z-50 px-4 py-3 transition-all duration-300
              ${scrolled
                ? "backdrop-blur-md bg-white/60 dark:bg-[#0a0a0a]/60 border-b border-primary/70 dark:border-primary/50"
                : "backdrop-blur-sm bg-white/40 dark:bg-[#0a0a0a]/40 border-b border-primary/40 dark:border-primary/30"
              }
            `}
          >
          <div>
            <Nav />
          </div>
        </header>

        {/* MAIN: add top padding equal to header height + margin so content doesn't sit under fixed header */}
        <main className="w-full flex-grow" style={{ paddingTop: headerHeight + 18 }}>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Command, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/design-system-v2";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/blog" },
  { label: "About", href: "/credentials" },
  { label: "AI Lab", href: "/tools/ai-lab", highlight: true },
];

const toolItems = [
  { label: "All Tools", href: "/tools" },
  { label: "AI Engineering Lab", href: "/tools/ai-lab" },
  { label: "Bill Generator", href: "/tools/bill" },
  { label: "JSON Analyser", href: "/tools/json" },
  { label: "QR Code Generator", href: "/tools/qr" },
];

export default function Header({ onCommandOpen }) {
  const pathname = usePathname();
  const { isDark, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 pt-[env(safe-area-inset-top)]",
          scrolled
            ? "bg-[#faf9f6]/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70 shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm">
                MD
              </div>
              <span className="sr-only">Mansi Dhruv</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} active={isActive(item.href)} highlight={item.highlight}>
                  {item.label}
                </NavLink>
              ))}

              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  onClick={() => setDropdownOpen((state) => !state)}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors pb-1 border-b-2",
                    isActive("/tools")
                      ? "text-slate-900 dark:text-white border-teal-600 dark:border-teal-400"
                      : "text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  Toolkit
                  <ChevronDown size={16} />
                </button>

                <div
                  className={cn(
                    "absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 transition duration-200",
                    dropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2",
                    "bg-white dark:bg-slate-950"
                  )}
                >
                  {toolItems.map((item, i) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-4 py-2 text-sm transition-colors",
                        i === 0 && "rounded-t-2xl",
                        i === toolItems.length - 1 && "rounded-b-2xl",
                        isActive(item.href)
                          ? "bg-teal-50 font-medium text-teal-800 dark:bg-teal-950/50 dark:text-teal-300"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-900 bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:border-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Resume
                <span aria-hidden className="text-xs opacity-80">
                  ↗
                </span>
              </a>
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                type="button"
                onClick={onCommandOpen}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                title="Open command palette (Cmd+K)"
              >
                <Command size={16} />
                <span className="hidden lg:inline">Search</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="md:hidden inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Open mobile menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 right-0 z-50 w-11/12 max-w-xs overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]" role="dialog" aria-modal="true" aria-label="Site menu">
            <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block min-h-[44px] rounded-xl px-4 py-3 text-sm font-medium transition",
                    isActive(item.href)
                      ? "bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 rounded-3xl bg-slate-50 dark:bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-3">Toolkit</p>
                <div className="space-y-1">
                  {toolItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block min-h-[44px] rounded-xl px-4 py-3 text-sm transition",
                        isActive(item.href)
                          ? "bg-teal-50 font-medium text-teal-800 dark:bg-teal-950/50 dark:text-teal-300"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              >
                Resume (PDF)
              </a>
              <button
                type="button"
                onClick={() => {
                  onCommandOpen();
                  setMobileOpen(false);
                }}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 text-sm font-medium transition hover:bg-slate-800 dark:hover:bg-slate-200"
              >
                <Command size={16} />
                Search
              </button>
            </nav>
          </aside>
        </>
      )}
    </>
  );
}

function NavLink({ href, active, highlight, children }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-sm text-sm font-medium transition-colors pb-1 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2",
        active
          ? "text-slate-900 dark:text-white border-teal-700 dark:border-teal-400"
          : highlight
            ? "text-teal-900/90 dark:text-teal-300 border-transparent hover:border-teal-600/40"
            : "text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white"
      )}
    >
      {children}
    </Link>
  );
}

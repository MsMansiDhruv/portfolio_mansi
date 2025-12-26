"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#050505] border-b border-primary/40">
        
        {/* INNER WRAPPER — NO CLAMP, NO TRICKS */}
        <div
          className="
            grid grid-cols-[auto,1fr,auto]
            items-center
            h-[88px]
            px-4
            sm:px-6
            lg:px-10
          "
        >
          {/* LEFT — BRAND */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-md flex items-center justify-center font-bold logo-bg text-black dark:text-white">
              MD
            </div>

            <div className="leading-snug">
              <div className="font-semibold text-logo-main">
                Mansi Dhruv
              </div>
              <div className="text-xs text-logo-sub">
                Lead Data Engineer · Solution Architect
              </div>
            </div>
          </Link>

          {/* CENTER SPACER */}
          <div />

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/" active={isActive("/")}>Home</NavLink>
            <NavLink href="/projects" active={isActive("/projects")}>Projects</NavLink>
            <NavLink href="/blog" active={isActive("/blog")}>Blog</NavLink>
            <NavLink href="/credentials" active={isActive("/credentials")}>Credentials</NavLink>

            <div className="relative group">
              <div
                className={`flex items-center gap-1 cursor-pointer
                  ${isActive("/tools") ? "text-primary font-semibold" : "text-nav hover:text-primary"}
                `}
              >
                Toolkit
                <ChevronDown size={16} />
              </div>

              <div
                className="
                  absolute right-0 top-full mt-2 w-56
                  opacity-0 invisible
                  group-hover:opacity-100 group-hover:visible
                  translate-y-1 group-hover:translate-y-0
                  transition-all
                  rounded-xl shadow-xl
                "
                style={{
                  background: "var(--dropdown-bg)",
                  border: "1px solid var(--dropdown-border)",
                }}
              >
                <NavItem href="/tools" active={isActive("/tools")}>All Tools</NavItem>
                <NavItem href="/tools/bill" active={isActive("/tools/bill")}>Bill Generator</NavItem>
                <NavItem href="/tools/json" active={isActive("/tools/json")}>JSON Analyser</NavItem>
                <NavItem href="/tools/qr" active={isActive("/tools/qr")}>QR Code Generator</NavItem>
              </div>
            </div>

            <a href="/resume.pdf" className="nav-link">Resume</a>
            <ThemeToggle />
          </nav>

          {/* MOBILE MENU */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden justify-self-end"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <aside className="fixed top-0 right-0 z-50 h-full w-[300px] bg-white dark:bg-[#050505] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <MobileLink href="/" onClick={() => setOpen(false)}>Home</MobileLink>
              <MobileLink href="/projects" onClick={() => setOpen(false)}>Projects</MobileLink>
              <MobileLink href="/blog" onClick={() => setOpen(false)}>Blog</MobileLink>
              <MobileLink href="/credentials" onClick={() => setOpen(false)}>Credentials</MobileLink>
              <MobileLink href="/tools" onClick={() => setOpen(false)}>Tools</MobileLink>
              <a href="/resume.pdf" className="nav-link">Resume</a>
            </div>

            <div className="mt-auto pt-6 border-t border-primary/20">
              <ThemeToggle />
            </div>
          </aside>
        </>
      )}
    </>
  );
}

/* -------- Components -------- */

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`nav-link ${active ? "text-primary font-semibold" : ""}`}
    >
      {children}
    </Link>
  );
}

function NavItem({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`block px-4 py-2 text-sm ${active ? "font-semibold" : ""}`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }) {
  return (
    <Link href={href} onClick={onClick} className="font-medium">
      {children}
    </Link>
  );
}

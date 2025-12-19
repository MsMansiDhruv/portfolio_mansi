"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { ChevronDown } from "lucide-react";

export default function Nav() {
  const pathname = usePathname();

  // helper: exact or section match
  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="w-full px-2 md:px-4 py-2 flex items-center relative z-50">

      {/* LEFT — Logo */}
      <Link href="/" className="block">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md flex items-center justify-center font-bold 
            logo-bg text-black dark:text-white">
            MD
          </div>

          <div>
            <div className="font-semibold text-logo-main">
              Mansi Dhruv
            </div>
            <div className="text-xs text-logo-sub">
              Lead Data Engineer • Solution Architect
            </div>
          </div>
        </div>
      </Link>

      <div className="flex-grow" />

      {/* NAV */}
      <nav className="hidden md:flex gap-6 mr-4 items-center">

        <NavLink href="/" active={isActive("/")}>Home</NavLink>
        <NavLink href="/projects" active={isActive("/projects")}>Projects</NavLink>
        <NavLink href="/blog" active={isActive("/blog")}>Blog</NavLink>
        <NavLink href="/credentials" active={isActive("/credentials")}>Credentials</NavLink>

        {/* TOOLKIT DROPDOWN */}
        <div className="relative group">
          <div
            className={`
              flex items-center gap-1 cursor-pointer select-none transition
              ${isActive("/tools") ? "text-primary" : "text-nav hover:text-primary"}
            `}
          >
            Toolkit
            <ChevronDown
              size={16}
              className="transition-transform duration-200 group-hover:rotate-180"
            />
          </div>

          {/* Dropdown */}
          <div
            className="
              absolute right-0 top-full mt-2 w-56
              opacity-0 invisible
              group-hover:opacity-100 group-hover:visible
              translate-y-1 group-hover:translate-y-0
              transition-all duration-200
              rounded-xl shadow-xl backdrop-blur-sm
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

        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
        >
          Resume
        </a>
      </nav>

      <ThemeToggle />
    </div>
  );
}

/* ---------- Components ---------- */

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`
        nav-link relative
        ${active ? "text-primary font-semibold" : ""}
      `}
    >
      {children}

      {/* active underline */}
      {active && (
        <span
          className="
            absolute -bottom-1 left-0 right-0 h-[2px]
            bg-primary rounded-full
          "
        />
      )}
    </Link>
  );
}

function NavItem({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`
        block px-4 py-2 text-sm transition-colors
        ${active ? "font-semibold" : ""}
      `}
      style={{
        color: active ? "var(--color-accent)" : "var(--dropdown-text)",
        background: active ? "var(--dropdown-hover)" : "transparent",
      }}
    >
      {children}
    </Link>
  );
}

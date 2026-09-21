"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORLD_NAV, WORLD_HREF } from "@/lib/data/world-nav";
import { toggleWorldTheme } from "@/lib/world-theme";
import { useWorldTheme } from "@/lib/use-world-theme";
import { useWorldViewport } from "@/lib/use-world-viewport";
import NavToggle from "./NavToggle";
import ThemeToggle from "./ThemeToggle";
import ResumeDock from "./ResumeDock";

function navIdFromPath(pathname) {
  if (pathname === "/") return "world";
  if (pathname?.startsWith("/projects")) return "work";
  if (pathname?.startsWith("/credentials") || pathname?.startsWith("/certification")) return "";
  if (pathname?.startsWith("/contact")) return "contact";
  return "";
}

function NavLinks({ current, idPrefix, onNavigate }) {
  return WORLD_NAV.map((item) => (
    <Link
      key={`${idPrefix}-${item.id}`}
      href={WORLD_HREF[item.id] || "/"}
      prefetch={false}
      scroll={item.id === "ai" || item.id === "about" ? false : undefined}
      className={`wd-nav__item${current === item.id ? " is-active" : ""}`}
      aria-current={current === item.id ? "page" : undefined}
      onClick={onNavigate}
    >
      <span className="wd-nav__label">{item.label}</span>
    </Link>
  ));
}

export default function WorldPageNav({ active }) {
  const pathname = usePathname();
  const current = active || navIdFromPath(pathname);
  const [theme, setTheme] = useWorldTheme();
  const [navOpen, setNavOpen] = useState(false);
  useWorldViewport();

  useLayoutEffect(() => {
    const root = document.querySelector(".wd-root, .wd-studio-shell");
    if (root && theme) root.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("wd-nav-lock", navOpen);
    return () => document.documentElement.classList.remove("wd-nav-lock");
  }, [navOpen]);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  const closeNavSoon = () => {
    window.setTimeout(() => setNavOpen(false), 0);
  };

  const toggleTheme = () => {
    setTheme(toggleWorldTheme());
  };

  return (
    <>
      <header className={`wd-bar${navOpen ? " is-nav-open" : ""}`} suppressHydrationWarning>
        <Link href="/" className="wd-brand">
          Mansi
        </Link>
        <nav className="wd-nav" aria-label="System">
          <NavLinks current={current} idPrefix="bar" onNavigate={closeNavSoon} />
        </nav>
        <div className="wd-bar__end">
          <ThemeToggle theme={theme} onClick={toggleTheme} />
          <NavToggle open={navOpen} onClick={() => setNavOpen((v) => !v)} />
        </div>
      </header>
      <nav
        className={`wd-nav-sheet${navOpen ? " is-open" : ""}`}
        aria-label="Pages"
        aria-hidden={!navOpen}
      >
        <NavLinks current={current} idPrefix="sheet" onNavigate={closeNavSoon} />
      </nav>
      <ResumeDock />
    </>
  );
}

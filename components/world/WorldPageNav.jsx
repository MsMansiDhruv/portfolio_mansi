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

function navIdFromPath(pathname, hash) {
  if (pathname === "/") {
    if (hash === "ask") return "ai";
    if (hash === "world-about" || hash === "world-impact") return "about";
    if (hash === "world-contact") return "contact";
    if (hash === "world-work") return "work";
    return "world";
  }
  if (pathname?.startsWith("/projects")) return "work";
  if (pathname?.startsWith("/tools/ai-lab")) return "ai";
  if (pathname?.startsWith("/credentials") || pathname?.startsWith("/certification")) {
    return "about";
  }
  if (pathname?.startsWith("/contact")) return "contact";
  return "";
}

function NavLinks({ current, idPrefix, onNavigate, pathname, onAsk, onAbout }) {
  return WORLD_NAV.map((item) => {
    const href = WORLD_HREF[item.id] || "/";
    return (
      <Link
        key={`${idPrefix}-${item.id}`}
        href={href}
        prefetch={false}
        className={`wd-nav__item${current === item.id ? " is-active" : ""}`}
        aria-current={current === item.id ? "page" : undefined}
        onClick={(event) => {
          if (item.id === "ai") {
            onAsk?.(event);
          }
          if (item.id === "about") {
            onAbout?.(event);
          }
          onNavigate?.();
        }}
      >
        <span className="wd-nav__label">{item.label}</span>
      </Link>
    );
  });
}

export default function WorldPageNav({ active }) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const current = active || navIdFromPath(pathname, hash);
  const [theme, setTheme] = useWorldTheme();
  const [navOpen, setNavOpen] = useState(false);
  useWorldViewport();

  useEffect(() => {
    const sync = () => setHash(window.location.hash.replace("#", ""));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

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

  const goAsk = (event) => {
    const target = document.getElementById("ask");
    if (!target || pathname !== "/") return;
    event.preventDefault();
    window.history.replaceState(null, "", "/#ask");
    setHash("ask");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goAbout = (event) => {
    const target = document.getElementById("world-about");
    if (!target || pathname !== "/") return;
    event.preventDefault();
    window.history.replaceState(null, "", "/#world-about");
    setHash("world-about");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleTheme = () => {
    setTheme(toggleWorldTheme());
  };

  return (
    <>
      <header className={`wd-bar${navOpen ? " is-nav-open" : ""}`} suppressHydrationWarning>
        <Link
          href="/"
          className="wd-brand"
          onClick={(event) => {
            if (pathname !== "/") return;
            event.preventDefault();
            window.history.replaceState(null, "", "/");
            setHash("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Mansi
        </Link>
        <nav className="wd-nav" aria-label="System">
          <NavLinks current={current} idPrefix="bar" onNavigate={closeNavSoon} pathname={pathname} onAsk={goAsk} onAbout={goAbout} />
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
        <NavLinks current={current} idPrefix="sheet" onNavigate={closeNavSoon} pathname={pathname} onAsk={goAsk} onAbout={goAbout} />
      </nav>
      <ResumeDock />
    </>
  );
}

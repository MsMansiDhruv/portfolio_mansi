"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORLD_NAV } from "@/lib/data/data-world";
import { writeWorldTheme } from "@/lib/world-theme";
import { useWorldTheme } from "@/lib/use-world-theme";
import "@/styles/mansi-world-of-data.css";

const HREF = {
  world: "/",
  work: "/projects",
  ai: "/#world-ai",
  about: "/credentials",
  contact: "/contact",
};

function navIdFromPath(pathname) {
  if (pathname === "/") return "world";
  if (pathname?.startsWith("/projects")) return "work";
  if (pathname?.startsWith("/tools/ai-lab")) return "ai";
  if (pathname?.startsWith("/credentials") || pathname?.startsWith("/certification")) return "about";
  if (pathname?.startsWith("/contact")) return "contact";
  return "";
}

export default function WorldPageNav({ active }) {
  const pathname = usePathname();
  const current = active || navIdFromPath(pathname);
  const [theme, setTheme] = useWorldTheme();
  const [navOpen, setNavOpen] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "night" ? "day" : "night";
      writeWorldTheme(next);
      return next;
    });
  };

  return (
    <header className="wd-bar">
      <Link href="/" className="wd-brand">
        Mansi
      </Link>
      <nav className={`wd-nav${navOpen ? " is-open" : ""}`} aria-label="System">
        {WORLD_NAV.map((item) => (
          <Link
            key={item.id}
            href={HREF[item.id] || "/"}
            className={`wd-nav__item${current === item.id ? " is-active" : ""}`}
            aria-current={current === item.id ? "page" : undefined}
            onClick={() => setNavOpen(false)}
          >
            <span className="wd-nav__label">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="wd-bar__end">
        <button
          type="button"
          className="wd-nav-toggle"
          aria-expanded={navOpen}
          aria-label="Open navigation"
          onClick={() => setNavOpen((v) => !v)}
        >
          Menu
        </button>
        <button
          type="button"
          className="wd-theme"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "night" ? "day" : "night"} mode`}
          suppressHydrationWarning
        >
          <span className="wd-theme__pip" />
          <span suppressHydrationWarning>{theme === "night" ? "Night" : "Day"}</span>
        </button>
      </div>
    </header>
  );
}

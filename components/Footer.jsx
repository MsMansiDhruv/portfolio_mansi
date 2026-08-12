"use client";

import Link from "next/link";
import { Mail, Github, Linkedin, ExternalLink } from "lucide-react";

export default function Footer({ cinematic = false }) {
  const year = new Date().getFullYear();
  const dark = cinematic;

  return (
    <footer
      className={
        dark
          ? "mt-auto w-full border-t border-white/10 bg-[var(--kairo-ink)] text-[var(--kairo-paper)]"
          : "mt-auto w-full border-t border-slate-200/90 bg-[#faf9f6] dark:border-slate-800 dark:bg-slate-950"
      }
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className={dark ? "text-base font-semibold" : "text-base font-semibold text-slate-950 dark:text-white"}>
              Mansi Dhruv
            </p>
            <p className={dark ? "mt-1 text-sm text-[var(--kairo-muted)]" : "mt-1 text-sm text-slate-600 dark:text-slate-400"}>
              Lead Data Engineer · Solution Architect
            </p>
          </div>
          <nav
            aria-label="Footer"
            className={
              dark
                ? "flex flex-col gap-2 text-sm text-[var(--kairo-muted)] sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2"
                : "flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2"
            }
          >
            {[
              { href: "/projects", label: "Work" },
              { href: "/blog", label: "Notes" },
              { href: "/credentials", label: "Journey" },
              { href: "/tools/ai-lab", label: "Lab" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  dark
                    ? "min-h-[44px] inline-flex items-center transition-colors hover:text-[var(--kairo-cyan)]"
                    : "min-h-[44px] inline-flex items-center transition-colors hover:text-teal-800 dark:hover:text-teal-400"
                }
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={
                dark
                  ? "inline-flex min-h-[44px] items-center gap-1 transition-colors hover:text-[var(--kairo-cyan)]"
                  : "inline-flex min-h-[44px] items-center gap-1 transition-colors hover:text-teal-800 dark:hover:text-teal-400"
              }
            >
              Resume <ExternalLink size={12} />
            </a>
          </nav>
          <div className="flex items-center gap-2">
            {[
              { href: "https://github.com/MsMansiDhruv", label: "GitHub", icon: Github },
              { href: "https://www.linkedin.com/in/mansidhruv/", label: "LinkedIn", icon: Linkedin },
              { href: "mailto:mansi.p.dhruv@gmail.com", label: "Email", icon: Mail },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className={
                  dark
                    ? "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-[var(--kairo-muted)] hover:bg-white/5 hover:text-[var(--kairo-cyan)]"
                    : "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-200/60 hover:text-teal-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-teal-400"
                }
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className={dark ? "border-t border-white/10" : "border-t border-slate-200/80 dark:border-slate-800"}>
        <p
          className={
            dark
              ? "max-w-7xl mx-auto px-4 py-4 text-xs text-[var(--kairo-muted)] sm:px-6 lg:px-8"
              : "max-w-7xl mx-auto px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-8"
          }
        >
          © {year} Mansi Dhruv
        </p>
      </div>
    </footer>
  );
}

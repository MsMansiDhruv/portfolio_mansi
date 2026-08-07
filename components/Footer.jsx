"use client";

import Link from "next/link";
import { Mail, Github, Linkedin, ExternalLink } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-slate-200/90 bg-[#faf9f6] dark:border-slate-800 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-base font-semibold text-slate-950 dark:text-white">Mansi Dhruv</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Lead Data Engineer · Solution Architect</p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            <Link href="/projects" className="min-h-[44px] inline-flex items-center transition-colors hover:text-teal-800 dark:hover:text-teal-400">
              Projects
            </Link>
            <Link href="/blog" className="min-h-[44px] inline-flex items-center transition-colors hover:text-teal-800 dark:hover:text-teal-400">
              Writing
            </Link>
            <Link href="/credentials" className="min-h-[44px] inline-flex items-center transition-colors hover:text-teal-800 dark:hover:text-teal-400">
              About
            </Link>
            <Link href="/tools/ai-lab" className="min-h-[44px] inline-flex items-center transition-colors hover:text-teal-800 dark:hover:text-teal-400">
              AI Lab
            </Link>
            <Link href="/contact" className="min-h-[44px] inline-flex items-center transition-colors hover:text-teal-800 dark:hover:text-teal-400">
              Contact
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1 transition-colors hover:text-teal-800 dark:hover:text-teal-400"
            >
              Resume <ExternalLink size={12} />
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="https://github.com/MsMansiDhruv" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-200/60 hover:text-teal-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-teal-400" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/mansidhruv/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-200/60 hover:text-teal-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-teal-400" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="mailto:mansi.p.dhruv@gmail.com" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-200/60 hover:text-teal-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-teal-400" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200/80 dark:border-slate-800">
        <p className="max-w-7xl mx-auto px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-8">© {year} Mansi Dhruv</p>
      </div>
    </footer>
  );
}

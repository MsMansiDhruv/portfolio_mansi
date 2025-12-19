"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
  }, []);

  return (
    <footer
      className="
        relative
        w-full
        bg-footer
        backdrop-blur-sm
        text-footer
      "
      style={{
        boxShadow: `
          inset 0 1px 0 rgba(46, 196, 182, 0.45),
          inset 0 -1px 0 rgba(46, 196, 182, 0.45)
        `,
      }}
    >
      {/* MAIN */}
      <div className="w-full py-4">
        <div className="mx-auto md:w-[1680px] px-6">
          <div className="mt-4 flex flex-col md:flex-row items-start justify-between gap-16">

            {/* Branding */}
            <div className="min-w-[260px]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md flex items-center justify-center font-bold logo-bg text-black dark:text-white">
                  MD
                </div>

                <div>
                  <div className="text-base font-semibold tracking-wide text-footer-heading">
                    Mansi Dhruv
                  </div>

                  <div className="mt-1 text-xs text-footer-sub">
                    Lead Data Engineer · Solution Architect
                  </div>
                  <div className="mt-1 text-xs text-footer-sub">
                    Cloud · Data Platforms · ML Infrastructure
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              className="hidden md:block h-24 w-px"
              style={{ background: "rgba(46, 196, 182, 0.35)" }}
            />

            {/* Navigation */}
            <div className="min-w-[180px]">
              <div className="font-medium text-footer-heading mb-2">Navigation</div>
              <ul className="space-y-1 text-xs text-footer-sub">
                <li><Link href="/" className="hover:text-primary">Home</Link></li>
                <li><Link href="/projects" className="hover:text-primary">Projects</Link></li>
                <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                <li><Link href="/tools" className="hover:text-primary">Community Tools</Link></li>
              </ul>
            </div>

            <div
              className="hidden md:block h-24 w-px"
              style={{ background: "rgba(46, 196, 182, 0.35)" }}
            />

            {/* Writing */}
            <div className="min-w-[160px]">
              <div className="font-medium text-footer-heading mb-2">Writing</div>
              <ul className="space-y-1 text-xs text-footer-sub">
                <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                <li><Link href="/notebook" className="hover:text-primary">Notebook</Link></li>
                <li>
                  <a
                    href="https://medium.com/@mansi.p.dhruv"
                    className="hover:text-primary"
                  >
                    Medium
                  </a>
                </li>
              </ul>
            </div>

            <div
              className="hidden md:block h-24 w-px"
              style={{ background: "rgba(46, 196, 182, 0.35)" }}
            />

            {/* Community */}
            <div className="min-w-[160px]">
              <div className="font-medium text-footer-heading mb-2">Community</div>
              <ul className="space-y-1 text-xs text-footer-sub">
                <li><Link href="/tools" className="hover:text-primary">Tools</Link></li>
                <li>
                  <a href="https://github.com/MsMansiDhruv" className="hover:text-primary">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/mansidhruv/" className="hover:text-primary">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            <div
              className="hidden md:block h-24 w-px"
              style={{ background: "rgba(46, 196, 182, 0.35)" }}
            />

            {/* Contact */}
            <div className="min-w-[180px]">
              <div className="font-medium text-footer-heading mb-2">Contact</div>
              <ul className="space-y-1 text-xs text-footer-sub">
                <li>
                  <a href="mailto:mansi.p.dhruv@gmail.com" className="hover:text-primary">
                    Email
                  </a>
                </li>
                <li>India · Canada</li>
                <li>
                  <a href="/resume.pdf" className="hover:text-primary">
                    Resume
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="w-full py-2">
        <div className="mx-auto md:w-[1680px] px-6 flex flex-col md:flex-row justify-between text-xs text-footer-sub">
          <span>© {year} Mansi Dhruv</span>
          <span>Built with care · All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}

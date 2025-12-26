"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="
        w-full
        bg-footer
        backdrop-blur-sm
        text-footer
        border-t border-primary/30
      "
    >
      {/* MAIN */}
      <div
        className="w-full py-10"
        style={{
          paddingLeft: "clamp(24px, 6vw, 120px)",
          paddingRight: "clamp(24px, 6vw, 120px)",
        }}
      >
        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT — BRANDING */}
          <div className="lg:w-[320px] shrink-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md flex items-center justify-center font-bold logo-bg text-black dark:text-white">
                MD
              </div>

              <div>
                <div className="text-sm font-semibold text-footer-heading">
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

          {/* RIGHT — LINKS */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-10">

            {/* Navigation */}
            <div>
              <div className="text-sm font-medium text-footer-heading mb-2">
                Navigation
              </div>
              <ul className="space-y-1 text-xs text-footer-sub">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/projects">Projects</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/tools">Community Tools</Link></li>
              </ul>
            </div>

            {/* Writing */}
            <div>
              <div className="text-sm font-medium text-footer-heading mb-2">
                Writing
              </div>
              <ul className="space-y-1 text-xs text-footer-sub">
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/notebook">Notebook</Link></li>
                <li>
                  <a href="https://medium.com/@mansi.p.dhruv">Medium</a>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <div className="text-sm font-medium text-footer-heading mb-2">
                Community
              </div>
              <ul className="space-y-1 text-xs text-footer-sub">
                <li><Link href="/tools">Tools</Link></li>
                <li>
                  <a href="https://github.com/MsMansiDhruv">GitHub</a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/mansidhruv/">LinkedIn</a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div className="text-sm font-medium text-footer-heading mb-2">
                Contact
              </div>
              <ul className="space-y-1 text-xs text-footer-sub">
                <li>
                  <a href="mailto:mansi.p.dhruv@gmail.com">Email</a>
                </li>
                <li>India · Canada</li>
                <li>
                  <a href="/resume.pdf">Resume</a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div
        className="w-full py-4 text-xs text-footer-sub flex flex-col sm:flex-row justify-between gap-2"
        style={{
          paddingLeft: "clamp(24px, 6vw, 120px)",
          paddingRight: "clamp(24px, 6vw, 120px)",
        }}
      >
        <span>© {year} Mansi Dhruv</span>
        <span>Built with care · All rights reserved</span>
      </div>
    </footer>
  );
}

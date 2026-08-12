"use client";

import Link from "next/link";
import SilhouetteCharacter from "@/components/anime-cinema/SilhouetteCharacter";
import "@/styles/mansi-experience.css";

export default function NotFound() {
  return (
    <div className="mx-root flex min-h-screen flex-col items-center justify-center px-6 text-center" data-theme="dark">
      <div className="mx-grain" aria-hidden />
      <div className="relative z-10 max-w-md">
        <div className="mx-auto mb-10 h-40 w-24 opacity-50">
          <SilhouetteCharacter pose="standing" facing="right" rim="warm" />
        </div>
        <svg className="mx-auto mb-8 w-48 opacity-40" viewBox="0 0 200 60" aria-hidden>
          <path d="M 20 50 L 100 30 M 100 30 L 180 45" fill="none" stroke="var(--mx-vermilion)" strokeWidth="1" />
          <path d="M 100 30 L 70 15 M 100 30 L 130 12" fill="none" stroke="var(--mx-vermilion)" strokeWidth="0.6" opacity="0.5" />
        </svg>
        <h1 className="mx-statement text-3xl sm:text-4xl">We took the wrong path.</h1>
        <Link
          href="/"
          className="mx-mono mt-10 inline-block border-b border-[var(--mx-vermilion)] pb-1 text-[var(--mx-vermilion)]"
        >
          Return to my world
        </Link>
      </div>
    </div>
  );
}

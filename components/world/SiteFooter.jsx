"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="wd-site-foot" aria-label="Site">
      <div className="wd-site-foot__inner">
        <Link href="/" className="wd-site-foot__brand">
          Mansi
        </Link>
        <p className="wd-site-foot__copy">© {year} Mansi Dhruv. All rights reserved.</p>
        <p className="wd-site-foot__note">
          <span className="wd-site-foot__pip" aria-hidden />
          Created with curiosity
          <Heart className="wd-site-foot__heart" size={13} strokeWidth={1.8} aria-hidden />
        </p>
      </div>
    </footer>
  );
}

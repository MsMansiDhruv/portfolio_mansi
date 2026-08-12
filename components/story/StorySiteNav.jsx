"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STORY_SITE_NAV } from "@/lib/data/anime-story";
import { SilhouetteEmblem } from "@/components/anime-cinema/SilhouetteCharacter";
import { cn } from "@/lib/cn";

export default function StorySiteNav({ className }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) return pathname === href.split("#")[0];
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className={cn("story-site-nav", className)}>
      {STORY_SITE_NAV.map((item) => (
        <Link key={item.id} href={item.href} className={isActive(item.href) ? "is-active" : undefined}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function StorySiteBrand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <SilhouetteEmblem className="h-5 w-5 text-[var(--story-cyan)] opacity-70" />
      <span className="story-mono text-[var(--story-grey)]">The story</span>
    </Link>
  );
}

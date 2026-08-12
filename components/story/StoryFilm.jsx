"use client";

import { cn } from "@/lib/cn";
import StoryAmbient from "./StoryAmbient";

export default function StoryFilm({ mood = "cool", className, children }) {
  return (
    <div className={cn("story-page relative min-h-screen", className)}>
      <StoryAmbient mood={mood} />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

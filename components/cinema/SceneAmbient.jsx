"use client";

import StoryAmbient from "@/components/story/StoryAmbient";

export default function SceneAmbient({ variant = "default" }) {
  const mood =
    variant === "warm"
      ? "warm"
      : variant === "lab"
        ? "present"
        : variant === "blueprint" || variant === "work"
          ? "morning"
          : "cool";
  return <StoryAmbient mood={mood} />;
}

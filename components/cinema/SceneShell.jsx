"use client";

import StoryFilm from "./StoryFilm";

/** Bridge for pages still importing SceneShell */
export default function SceneShell({ scene = "default", className, children }) {
  const mood =
    scene === "warm" ? "warm" : scene === "lab" ? "present" : scene === "work" ? "morning" : "cool";
  return (
    <StoryFilm mood={mood} className={className}>
      {children}
    </StoryFilm>
  );
}

"use client";

import { EXHIBITION_EXHIBITS } from "@/lib/data/exhibition-exhibits";
import ProjectExhibit from "./ProjectExhibit";

export default function ExhibitionHall({
  theme,
  activeSlug,
  hoverSlug,
  onSelectExhibit,
  onHoverExhibit,
  cursorRef,
}) {
  return (
    <group>
      {EXHIBITION_EXHIBITS.map((ex) => (
        <ProjectExhibit
          key={ex.slug}
          exhibit={ex}
          theme={theme}
          hovered={hoverSlug === ex.slug}
          focused={activeSlug === ex.slug}
          onSelect={onSelectExhibit}
          onHover={onHoverExhibit}
          cursorRef={cursorRef}
        />
      ))}
    </group>
  );
}

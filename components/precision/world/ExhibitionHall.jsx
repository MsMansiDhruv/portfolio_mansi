"use client";

import { EXHIBITION_EXHIBITS } from "@/lib/data/exhibition-exhibits";
import ProjectExhibit from "./ProjectExhibit";

export default function ExhibitionHall({
  theme,
  activeSlug,
  nearSlug,
  onSelectExhibit,
  cursorRef,
}) {
  return (
    <group>
      {EXHIBITION_EXHIBITS.map((ex) => (
        <ProjectExhibit
          key={ex.slug}
          exhibit={ex}
          theme={theme}
          active={nearSlug === ex.slug}
          focused={activeSlug === ex.slug}
          onSelect={onSelectExhibit}
          cursorRef={cursorRef}
        />
      ))}
    </group>
  );
}

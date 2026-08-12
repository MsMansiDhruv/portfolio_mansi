"use client";

import { Suspense, useRef } from "react";
import Architecture from "./Architecture";
import CameraRig from "./CameraRig";
import CursorBridge from "./CursorBridge";
import DataField from "./DataField";
import ExhibitionHall from "./ExhibitionHall";
import MansiFigure from "./MansiFigure";
import WorldLighting from "./WorldLighting";
import Convergence from "./Convergence";

export default function PrecisionWorld({
  theme,
  progressRef,
  exhibitRef,
  activeSlug,
  nearSlug,
  onSelectExhibit,
  activeExhibit,
}) {
  const cursorRef = useRef({ x: 0, y: 1.25, z: 12 });

  return (
    <>
      <WorldLighting theme={theme} />
      <CameraRig progressRef={progressRef} exhibitRef={exhibitRef} />
      <CursorBridge cursorRef={cursorRef} />
      <Architecture theme={theme} />

      <Suspense fallback={null}>
        <DataField
          progressRef={progressRef}
          theme={theme}
          cursorRef={cursorRef}
          activeSlug={activeSlug}
        />
      </Suspense>

      <Suspense fallback={null}>
        <MansiFigure
          theme={theme}
          progressRef={progressRef}
          activeSlug={activeSlug}
        />
      </Suspense>

      <Suspense fallback={null}>
        <Convergence theme={theme} progressRef={progressRef} />
      </Suspense>

      <Suspense fallback={null}>
        <ExhibitionHall
          theme={theme}
          activeSlug={activeSlug}
          nearSlug={nearSlug}
          onSelectExhibit={onSelectExhibit}
          cursorRef={cursorRef}
          activeExhibit={activeExhibit}
        />
      </Suspense>
    </>
  );
}

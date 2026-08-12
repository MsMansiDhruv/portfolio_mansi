"use client";

import { Suspense, useRef } from "react";
import Architecture from "./Architecture";
import CameraRig from "./CameraRig";
import CursorBridge from "./CursorBridge";
import DataField from "./DataField";
import ExhibitionHall from "./ExhibitionHall";
import MansiFigure from "./MansiFigure";
import WorldLighting from "./WorldLighting";
import WorldControls from "./WorldControls";
import Convergence from "./Convergence";

export default function PrecisionWorld({
  theme,
  cameraTargetRef,
  lookOffsetRef,
  interactionRef,
  activeSlug,
  hoverSlug,
  onSelectExhibit,
  onHoverExhibit,
  controlsEnabled,
}) {
  const cursorRef = useRef({ x: 0, y: 1.25, z: 10 });

  return (
    <>
      <WorldLighting theme={theme} />
      <CameraRig cameraTargetRef={cameraTargetRef} lookOffsetRef={lookOffsetRef} />
      <WorldControls
        cameraTargetRef={cameraTargetRef}
        lookOffsetRef={lookOffsetRef}
        enabled={controlsEnabled}
      />
      <CursorBridge cursorRef={cursorRef} />
      <Architecture theme={theme} />

      <Suspense fallback={null}>
        <DataField
          theme={theme}
          cursorRef={cursorRef}
          interactionRef={interactionRef}
        />
      </Suspense>

      <Suspense fallback={null}>
        <MansiFigure
          theme={theme}
          interactionRef={interactionRef}
          activeSlug={activeSlug}
        />
      </Suspense>

      <Suspense fallback={null}>
        <Convergence theme={theme} interactionRef={interactionRef} />
      </Suspense>

      <Suspense fallback={null}>
        <ExhibitionHall
          theme={theme}
          activeSlug={activeSlug}
          hoverSlug={hoverSlug}
          onSelectExhibit={onSelectExhibit}
          onHoverExhibit={onHoverExhibit}
          cursorRef={cursorRef}
        />
      </Suspense>
    </>
  );
}

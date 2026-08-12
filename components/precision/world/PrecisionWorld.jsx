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
import AiLabWorld from "./AiLabWorld";
import ExperienceWorld from "./ExperienceWorld";
import AboutWorld from "./AboutWorld";
import ContactWorld from "./ContactWorld";

/**
 * Single coherent world. Distant zones mount only when approached.
 */
export default function PrecisionWorld({
  theme,
  cameraTargetRef,
  lookOffsetRef,
  interactionRef,
  activeSlug,
  hoverSlug,
  viewId,
  onSelectExhibit,
  onHoverExhibit,
  controlsEnabled,
  reducedMotion = false,
}) {
  const cursorRef = useRef({
    x: 0,
    y: 1.25,
    z: 10,
    vx: 0,
    vy: 0,
    vz: 0,
    active: false,
  });

  const showWork =
    viewId === "work" || viewId === "exhibit" || !!activeSlug || !!hoverSlug;
  const showAiLab = viewId === "ai-lab";
  const showExperience = viewId === "experience";
  const showAbout = viewId === "about";
  const showContact = viewId === "contact";

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
          reducedMotion={reducedMotion}
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

      {showWork ? (
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
      ) : null}

      {showAiLab ? (
        <Suspense fallback={null}>
          <AiLabWorld theme={theme} activeView={viewId} cursorRef={cursorRef} />
        </Suspense>
      ) : null}

      {showExperience ? (
        <Suspense fallback={null}>
          <ExperienceWorld theme={theme} activeView={viewId} />
        </Suspense>
      ) : null}

      {showAbout ? (
        <Suspense fallback={null}>
          <AboutWorld theme={theme} activeView={viewId} />
        </Suspense>
      ) : null}

      {showContact ? (
        <Suspense fallback={null}>
          <ContactWorld theme={theme} activeView={viewId} />
        </Suspense>
      ) : null}
    </>
  );
}

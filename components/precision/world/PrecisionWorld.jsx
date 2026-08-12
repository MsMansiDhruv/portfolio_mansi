"use client";

import { Suspense } from "react";
import Architecture from "./Architecture";
import CameraRig from "./CameraRig";
import Convergence from "./Convergence";
import EnvironmentalPlates from "./EnvironmentalPlates";
import ExhibitionHall from "./ExhibitionHall";
import MansiFigure from "./MansiFigure";
import WorldLighting from "./WorldLighting";

export default function PrecisionWorld({
  theme,
  progressRef,
  exhibitRef,
  activeSlug,
  nearSlug,
  onSelectExhibit,
}) {
  return (
    <>
      <WorldLighting theme={theme} />
      <CameraRig progressRef={progressRef} exhibitRef={exhibitRef} />
      <Architecture theme={theme} />
      <Suspense fallback={null}>
        <MansiFigure theme={theme} progressRef={progressRef} />
      </Suspense>

      <Suspense fallback={null}>
        <EnvironmentalPlates theme={theme} />
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
        />
      </Suspense>
    </>
  );
}

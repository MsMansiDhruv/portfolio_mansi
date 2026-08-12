"use client";

import { Suspense } from "react";
import Architecture from "./Architecture";
import CameraRig from "./CameraRig";
import Convergence from "./Convergence";
import EnvironmentalPlates from "./EnvironmentalPlates";
import MansiFigure from "./MansiFigure";
import WorkInstallation from "./WorkInstallation";
import WorldLighting from "./WorldLighting";

export default function PrecisionWorld({ theme, progressRef }) {
  return (
    <>
      <WorldLighting theme={theme} />
      <CameraRig progressRef={progressRef} />
      {/* Architecture has no async assets — always present */}
      <Architecture theme={theme} />
      <MansiFigure theme={theme} progressRef={progressRef} />

      <Suspense fallback={null}>
        <EnvironmentalPlates theme={theme} />
      </Suspense>
      <Suspense fallback={null}>
        <Convergence theme={theme} progressRef={progressRef} />
      </Suspense>
      <Suspense fallback={null}>
        <WorkInstallation theme={theme} progressRef={progressRef} />
      </Suspense>
    </>
  );
}

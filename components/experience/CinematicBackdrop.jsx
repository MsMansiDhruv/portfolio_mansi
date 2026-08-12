"use client";

import { windowOpacity } from "@/components/cinema/scroll/useScrollProgress";
import { CINEMATIC_BACKDROPS } from "@/lib/data/mansi-experience";

const VIDEO_RE = /\.(mp4|webm)$/i;

/**
 * Cinematic environment plates behind the semi-transparent WebGL scene.
 * Layers crossfade as the camera travels between worlds; each plate drifts
 * slowly with scroll so the environment never feels like a static poster.
 */
export default function CinematicBackdrop({ progress }) {
  return (
    <div className="mx-backdrop" aria-hidden>
      {CINEMATIC_BACKDROPS.map((plate) => {
        const opacity = windowOpacity(progress, plate.window[0], plate.window[1], 0.05);
        if (opacity <= 0.01) return null;

        const span = Math.max(1e-6, plate.window[1] - plate.window[0]);
        const local = Math.min(1, Math.max(0, (progress - plate.window[0]) / span));
        const drift = `scale(${(1.08 - local * 0.05).toFixed(4)}) translateY(${(local * -1.6).toFixed(2)}%)`;

        return (
          <div key={plate.id} className="mx-backdrop-layer" style={{ opacity: opacity * plate.opacity }}>
            {VIDEO_RE.test(plate.src) ? (
              <video src={plate.src} poster={plate.poster} autoPlay muted loop playsInline style={{ transform: drift }} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={plate.src} alt="" draggable={false} style={{ transform: drift }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

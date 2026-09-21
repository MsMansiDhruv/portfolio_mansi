"use client";

import { useId } from "react";

/** Custom 3D lattice - teal/orange planes, not a project diagram. */
export default function DepthField({ variant = "hero" }) {
  const uid = useId().replace(/:/g, "");
  return (
    <div className={`wd-depth wd-depth--${variant}`} aria-hidden>
      <div className="wd-depth__space">
        <i className="wd-depth__plane wd-depth__plane--a" />
        <i className="wd-depth__plane wd-depth__plane--b" />
        <i className="wd-depth__plane wd-depth__plane--c" />
        <svg className="wd-depth__svg" viewBox="0 0 420 320" fill="none">
          <defs>
            <linearGradient id={`wd-depth-rail-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#4ade80" stopOpacity="0.15" />
              <stop offset="0.55" stopColor="#4ade80" />
              <stop offset="1" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <g className="wd-depth__grid">
            <path d="M40 240 L210 160 L380 240 L210 320 Z" />
            <path d="M70 200 L210 130 L350 200 L210 270 Z" />
            <path d="M110 164 L210 108 L310 164 L210 220 Z" />
          </g>
          <g className="wd-depth__rails">
            <path d={`M90 188 C140 120, 210 90, 330 118`} stroke={`url(#wd-depth-rail-${uid})`} />
            <path d="M80 220 C160 170, 250 150, 350 186" stroke={`url(#wd-depth-rail-${uid})`} />
          </g>
          <g className="wd-depth__nodes">
            <circle cx="92" cy="188" r="5" className="is-teal" />
            <circle cx="210" cy="128" r="6" className="is-orange" />
            <circle cx="328" cy="118" r="5" className="is-teal" />
            <circle cx="348" cy="186" r="4" className="is-orange" />
          </g>
        </svg>
        <span className="wd-depth__orb wd-depth__orb--teal" />
        <span className="wd-depth__orb wd-depth__orb--orange" />
      </div>
    </div>
  );
}

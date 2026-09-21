"use client";

import { useEffect, useRef } from "react";

const HERO =
  "M 24 168 C 90 40, 170 40, 236 132 S 360 250, 430 118 S 560 20, 640 152 S 720 260, 776 96";
const HERO_B =
  "M 24 150 C 110 70, 190 24, 250 148 S 348 240, 448 96 S 572 40, 650 168 S 734 240, 776 120";
const SIDE =
  "M 18 210 C 80 80, 150 70, 210 150 S 300 260, 370 110 S 460 30, 520 170";
const SIDE_B =
  "M 18 190 C 96 110, 140 40, 228 168 S 318 248, 390 88 S 470 48, 520 186";

export default function DrawField({ variant = "hero" }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let ctx;
    let killed = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapMod, stMod]) => {
      if (killed) return;
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const paths = root.querySelectorAll("path");
        const morphTo = variant === "side" ? SIDE_B : HERO_B;
        paths.forEach((path, i) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 85%",
              end: "top 35%",
              scrub: 0.9,
            },
            delay: i * 0.04,
          });
          gsap.to(path, {
            attr: { d: morphTo },
            ease: "none",
            scrollTrigger: {
              trigger: root.closest(".wd-archive") || root,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.2,
            },
          });
        });
        gsap.to(root.querySelectorAll("circle"), {
          yPercent: (index) => (index % 2 ? -18 : 14),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          },
        });
      }, root);
    });
    return () => {
      killed = true;
      ctx?.revert();
    };
  }, [variant]);

  const d = variant === "side" ? SIDE : HERO;

  return (
    <div className={`wd-draw wd-draw--${variant}`} ref={rootRef} aria-hidden>
      <svg viewBox="0 0 800 280" className="wd-draw__svg" fill="none">
        <path className="wd-draw__glow" d={d} />
        <path className="wd-draw__line" d={d} />
        <circle className="wd-draw__node is-teal" cx="236" cy="132" r="6" />
        <circle className="wd-draw__node is-orange" cx="430" cy="118" r="7" />
        <circle className="wd-draw__node is-teal" cx="640" cy="152" r="6" />
      </svg>
    </div>
  );
}

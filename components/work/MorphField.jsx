"use client";

import { useEffect, useRef } from "react";

/* Same command counts so GSAP attr.d morphs (cheatsheet MorphSVG pattern). */
const FRAME = {
  a: "M 720 80 L 1120 80 L 1120 460 L 720 460 Z",
  b: "M 640 40 L 1180 120 L 1120 520 L 680 430 Z",
};
const INNER = {
  a: "M 780 140 L 1060 140 L 1060 400 L 780 400 Z",
  b: "M 730 110 L 1100 170 L 1060 450 L 760 380 Z",
};
const HEX = {
  a: "M 840 220 L 940 170 L 1040 220 L 1040 320 L 940 370 L 840 320 Z",
  b: "M 800 200 L 940 130 L 1080 210 L 1060 340 L 920 400 L 790 310 Z",
};
const SLAB = {
  a: "M 560 500 L 1180 500 L 1180 620 L 560 620 Z",
  b: "M 500 560 L 1220 480 L 1220 610 L 500 690 Z",
};
const RAIL = {
  a: "M 560 720 L 1180 720",
  b: "M 480 780 L 1240 640",
};
const RAIL2 = {
  a: "M 560 755 L 1180 755",
  b: "M 460 820 L 1260 670",
};

export default function MorphField() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let ctx;
    let killed = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapMod, stMod]) => {
      if (killed) return;
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      gsap.config({ force3D: true, nullTargetWarn: false });
      gsap.defaults({ ease: "none" });

      ctx = gsap.context(() => {
        const host = root.closest(".wd-archive") || root;
        const q = gsap.utils.selector(root);

        const morph = gsap.timeline();
        morph
          .to("#wd-morph-frame", { attr: { d: FRAME.b }, duration: 1 }, 0)
          .to("#wd-morph-inner", { attr: { d: INNER.b }, duration: 1 }, 0)
          .to("#wd-morph-hex", { attr: { d: HEX.b }, duration: 1 }, 0)
          .to("#wd-morph-slab", { attr: { d: SLAB.b }, duration: 1 }, 0)
          .to("#wd-morph-rail", { attr: { d: RAIL.b }, duration: 1 }, 0)
          .to("#wd-morph-rail2", { attr: { d: RAIL2.b }, duration: 1 }, 0);

        const depth = gsap.timeline();
        depth
          .to(q(".wd-morph__l1"), { y: 28, force3D: true, duration: 1 }, 0)
          .to(q(".wd-morph__l2"), { y: 72, x: 20, force3D: true, duration: 1 }, 0)
          .to(q(".wd-morph__l3"), { y: 120, x: -14, force3D: true, duration: 1 }, 0)
          .to(q(".wd-morph__l4"), { y: 188, force3D: true, duration: 1 }, 0);

        gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: host,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        })
          .add(morph, 0)
          .add(depth, 0);
      }, root);
    });

    return () => {
      killed = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="wd-morph" ref={rootRef} aria-hidden>
      <svg className="wd-morph__svg" viewBox="0 0 1440 900" preserveAspectRatio="xMaxYMid slice">
        <g className="wd-morph__l1">
          <path id="wd-morph-slab" className="wd-morph__stroke is-soft" d={SLAB.a} />
        </g>
        <g className="wd-morph__l2">
          <path id="wd-morph-frame" className="wd-morph__stroke" d={FRAME.a} />
          <path id="wd-morph-inner" className="wd-morph__stroke is-soft" d={INNER.a} />
        </g>
        <g className="wd-morph__l3">
          <path id="wd-morph-hex" className="wd-morph__stroke is-hot" d={HEX.a} />
        </g>
        <g className="wd-morph__l4">
          <path id="wd-morph-rail" className="wd-morph__stroke" d={RAIL.a} />
          <path id="wd-morph-rail2" className="wd-morph__stroke is-hot" d={RAIL2.a} />
        </g>
      </svg>
    </div>
  );
}

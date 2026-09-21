"use client";

import { useEffect, useRef } from "react";

const LANES = [
  {
    id: "modernize",
    label: "Modernize",
    messy: "M 40 48 C 130 8 210 86 300 28 C 410 0 520 78 640 36 C 760 4 880 72 1088 44",
    clean: "M 40 56 C 180 56 360 56 540 56 C 720 56 900 56 1088 56",
    y: 56,
  },
  {
    id: "allocate",
    label: "Allocate",
    messy: "M 40 118 C 120 158 230 86 330 148 C 430 188 540 102 650 138 C 780 176 900 114 1088 126",
    clean: "M 40 118 C 180 118 360 118 540 118 C 720 118 900 118 1088 118",
    y: 118,
  },
  {
    id: "intel",
    label: "Intelligence",
    messy: "M 40 188 C 150 222 250 158 360 206 C 470 242 580 164 700 198 C 820 230 940 176 1088 190",
    clean: "M 40 180 C 180 180 360 180 540 180 C 720 180 900 180 1088 180",
    y: 180,
  },
  {
    id: "workload",
    label: "Workload",
    messy: "M 40 250 C 140 282 230 222 350 264 C 470 300 590 232 720 268 C 850 298 980 246 1088 256",
    clean: "M 40 242 C 180 242 360 242 540 242 C 720 242 900 242 1088 242",
    y: 242,
  },
];

export default function WorkStory({ opening }) {
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
      gsap.config({ force3D: true, nullTargetWarn: false });

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        const paths = gsap.utils.toArray(".wd-story__lane", root);
        const nodes = gsap.utils.toArray(".wd-story__node", root);
        const names = gsap.utils.toArray(".wd-story__name", root);
        const phases = gsap.utils.toArray(".wd-story__phase", root);
        const join = root.querySelector(".wd-story__join");
        const spine = root.querySelector(".wd-story__spine");

        gsap.set([nodes, names, phases, join, spine], { autoAlpha: 0 });
        gsap.set(names, { x: 10 });
        gsap.set(phases[0], { autoAlpha: 1 });

        const build = () => {
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top 80px",
              end: "+=95%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.to(phases[0], { autoAlpha: 1, duration: 0.2 }, 0);

          LANES.forEach((lane, i) => {
            tl.to(paths[i], { attr: { d: lane.clean }, duration: 1.2 }, 0.35);
          });
          tl.to(phases[0], { autoAlpha: 0, duration: 0.25 }, 0.9);
          tl.to(phases[1], { autoAlpha: 1, duration: 0.25 }, 0.95);

          tl.to(nodes, { autoAlpha: 1, stagger: 0.06, duration: 0.4 }, 1.55);
          tl.to(names, { autoAlpha: 1, x: 0, stagger: 0.06, duration: 0.4 }, 1.6);
          tl.to(phases[1], { autoAlpha: 0, duration: 0.25 }, 1.65);
          tl.to(phases[2], { autoAlpha: 1, duration: 0.25 }, 1.7);

          tl.to(join, { autoAlpha: 1, duration: 0.4 }, 2.2);
          tl.fromTo(
            spine,
            { autoAlpha: 0, scaleX: 0 },
            { autoAlpha: 1, scaleX: 1, transformOrigin: "left center", duration: 0.5 },
            2.25
          );
          tl.to(phases[2], { autoAlpha: 0, duration: 0.25 }, 2.3);
          tl.to(phases[3], { autoAlpha: 1, duration: 0.25 }, 2.35);
          return tl;
        };

        mm.add("(prefers-reduced-motion: reduce)", () => {
          LANES.forEach((lane, i) => gsap.set(paths[i], { attr: { d: lane.clean } }));
          gsap.set([nodes, names, join, spine, phases[3]], { autoAlpha: 1 });
        });

        mm.add("(prefers-reduced-motion: no-preference)", () => build());

        const art = root.querySelector(".wd-story__art");
        const onMove = (e) => {
          const r = root.getBoundingClientRect();
          const nx = ((e.clientX - r.left) / Math.max(r.width, 1) - 0.5) * 10;
          gsap.to(art, { x: nx, duration: 0.8, ease: "power3.out", overwrite: "auto" });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        root._onMove = onMove;
      }, root);
    });

    return () => {
      killed = true;
      if (root._onMove) window.removeEventListener("pointermove", root._onMove);
      ctx?.revert();
    };
  }, []);

  return (
    <section className="wd-story" ref={rootRef}>
      <div className="wd-story__stage">
        <header className="wd-story__head">
          <p className="wd-scroll-kicker">Work</p>
            <h1 className="wd-page-title">Four systems.</h1>
          <p className="wd-page-lead">{opening?.lines?.[0]}</p>
          <div className="wd-story__phases">
            <p className="wd-story__phase">Scattered sources. Scripts, feeds, warehouses doing two jobs.</p>
            <p className="wd-story__phase">Four production paths. Each a separate system with a separate cost.</p>
            <p className="wd-story__phase">Each path is a node: modernize, allocate, collect, split workload.</p>
            <p className="wd-story__phase">Same discipline. Different machines. The catalogue below is those four paths.</p>
          </div>
        </header>

        <svg className="wd-story__art" viewBox="0 0 1200 300" fill="none" aria-hidden>
          {LANES.map((lane) => (
            <path key={lane.id} className="wd-story__lane" d={lane.messy} />
          ))}
          {LANES.map((lane) => (
            <g key={`${lane.id}-node`} className="wd-story__mark" transform={`translate(1088 ${lane.y})`}>
              <circle className="wd-story__node" r="5.5" />
              <text className="wd-story__name" x="14" y="4">
                {lane.label}
              </text>
            </g>
          ))}
          <path className="wd-story__join" d="M 1088 56 V 242" />
          <path className="wd-story__spine" d="M 1088 149 H 1148" />
        </svg>
      </div>
    </section>
  );
}

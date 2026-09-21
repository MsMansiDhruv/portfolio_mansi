"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

function scatterBits(count = 5) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    x: 4 + Math.random() * 22,
    y: 8 + Math.random() * 82,
    s: 2 + Math.random() * 3.2,
    d: 10 + Math.random() * 12,
    delay: Math.random() * 4,
    pop: Math.random() > 0.55,
  }));
}

export default function FieldSpirals({ revealAfter = null }) {
  const wrapRef = useRef(null);
  const lenis = useLenis();
  const [bits, setBits] = useState([]);

  useEffect(() => {
    setBits(scatterBits(5));
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    if (!revealAfter) {
      wrap.style.clipPath = "none";
      wrap.style.opacity = "1";
      return undefined;
    }

    wrap.style.clipPath = "inset(100% 0 0 0)";
    wrap.style.opacity = "1";

    let killed = false;
    let ctx;
    let offScroll;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapMod, stMod]) => {
      if (killed) return;
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const gate = document.querySelector(revealAfter);
        if (!gate) {
          gsap.set(wrap, { clipPath: "none" });
          return;
        }

        if (lenis) {
          const onScroll = () => ScrollTrigger.update();
          lenis.on("scroll", onScroll);
          offScroll = () => lenis.off("scroll", onScroll);
        }

        gsap.set(wrap, { clipPath: "inset(100% 0 0 0)" });
        gsap.to(wrap, {
          clipPath: "inset(0% 0 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: gate,
            start: "top bottom",
            end: "top top",
            scrub: 0.45,
          },
        });
      });
    });

    return () => {
      killed = true;
      offScroll?.();
      ctx?.revert();
    };
  }, [lenis, revealAfter]);

  return (
    <div ref={wrapRef} className="wd-field-spirals" aria-hidden>
      <div className="wd-field-spirals__bits">
        {bits.map((bit) => (
          <i
            key={bit.id}
            className={`wd-field-spirals__bit${bit.pop ? " is-pop" : ""}`}
            style={{
              left: `${bit.x}%`,
              top: `${bit.y}%`,
              width: bit.s,
              height: bit.s,
              animationDuration: `${bit.d}s`,
              animationDelay: `${bit.delay}s`,
            }}
          />
        ))}
      </div>
      <svg className="wd-field-spirals__orbit wd-field-spirals__orbit--east" viewBox="0 0 420 420">
        <circle className="wd-field-spirals__ring is-slow" cx="210" cy="210" r="188" />
        <circle className="wd-field-spirals__ring is-mid" cx="210" cy="210" r="148" />
        <circle className="wd-field-spirals__ring is-fast" cx="210" cy="210" r="108" />
        <g className="wd-field-spirals__pkt is-slow">
          <circle cx="210" cy="22" r="5" />
          <circle cx="398" cy="210" r="4" className="is-pop" />
        </g>
        <g className="wd-field-spirals__pkt is-mid">
          <circle cx="210" cy="62" r="4.5" className="is-pop" />
          <circle cx="62" cy="210" r="3.5" />
        </g>
      </svg>
      <svg className="wd-field-spirals__orbit wd-field-spirals__orbit--west" viewBox="0 0 420 420">
        <circle className="wd-field-spirals__ring is-mid" cx="210" cy="210" r="160" />
        <circle className="wd-field-spirals__ring is-slow is-rev" cx="210" cy="210" r="118" />
        <circle className="wd-field-spirals__ring is-fast" cx="210" cy="210" r="78" />
        <g className="wd-field-spirals__pkt is-fast">
          <circle cx="210" cy="50" r="4" />
          <circle cx="360" cy="210" r="3.5" className="is-pop" />
          <circle cx="90" cy="310" r="3" />
        </g>
        <g className="wd-field-spirals__pkt is-mid">
          <circle cx="48" cy="210" r="4" className="is-pop" />
          <circle cx="210" cy="372" r="3.2" />
        </g>
      </svg>
    </div>
  );
}

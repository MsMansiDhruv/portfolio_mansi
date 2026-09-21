"use client";

import { useEffect } from "react";

export function useStudioMotion(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    let ctx;
    let killed = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        });
      },
      { threshold: 0.12, rootMargin: "60px 0px" }
    );
    root.querySelectorAll("[data-rise]").forEach((node) => io.observe(node));

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapMod, stMod]) => {
      if (killed) return;
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const path = root.querySelector(".wd-studio-draw path");
        if (path && path.getTotalLength && !reduce) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: path, start: "top 92%", end: "top 48%", scrub: 0.9 },
          });
        }

        if (reduce) return;

        const rises = gsap.utils.toArray("[data-rise]");
        rises.forEach((node, index) => {
          gsap.fromTo(
            node,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: index * 0.08,
              ease: "power3.out",
              overwrite: "auto",
            }
          );
        });

        const fields = gsap.utils.toArray(".wd-contact-form label");
        if (fields.length) {
          gsap.fromTo(
            fields,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.08,
              delay: 0.22,
              ease: "power2.out",
            }
          );
        }

        const submit = root.querySelector(".wd-contact-submit");
        if (submit) {
          gsap.fromTo(
            submit,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, delay: 0.48, ease: "power2.out" }
          );
        }
      }, root);
      ScrollTrigger.refresh();
    });
    return () => {
      killed = true;
      io.disconnect();
      ctx?.revert();
    };
  }, [ref]);
}

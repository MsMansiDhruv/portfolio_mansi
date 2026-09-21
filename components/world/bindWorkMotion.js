function hoverHot(node) {
  const enter = () => node.classList.add("is-hot");
  const leave = () => node.classList.remove("is-hot");
  node.addEventListener("pointerenter", enter);
  node.addEventListener("pointerleave", leave);
}

export function bindArchiveMotion(gsap, ScrollTrigger, root) {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: reduce)", () => {});

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const copy = root.querySelector(".wd-archive__copy");
    if (copy) {
      gsap.fromTo(
        copy,
        { y: 48, scale: 1.06 },
        {
          y: 0,
          scale: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: { trigger: copy, start: "top 88%", end: "top 42%", scrub: 0.85 },
        }
      );
    }

    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => root.style.setProperty("--wd-tunnel", String(self.progress)),
    });

    const rule = root.querySelector(".wd-archive__rule");
    if (rule) {
      gsap.fromTo(
        rule,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: { trigger: rule, start: "top 88%", end: "top 62%", scrub: 0.7 },
        }
      );
    }

    const tiles = gsap.utils.toArray(".wd-archive__card", root);
    tiles.forEach((tile, i) => {
      gsap.fromTo(
        tile,
        { y: 72, scale: 0.94, x: i % 2 ? 28 : -28 },
        {
          y: 0,
          scale: 1,
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: tile,
            start: "top 94%",
            end: "top 58%",
            scrub: 0.95,
          },
        }
      );
      hoverHot(tile.querySelector(".wd-archive__face") || tile);
      void i;
    });

    ScrollTrigger.batch(gsap.utils.toArray(".wd-archive__row", root), {
      start: "top 92%",
      interval: 0.1,
      batchMax: 6,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { y: 18 },
          { y: 0, duration: 0.55, stagger: 0.05, ease: "power2.out", overwrite: "auto", clearProps: "transform" }
        ),
    });
  });
}

export function bindCaseMotion(gsap, ScrollTrigger, root) {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: reduce)", () => {});

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const intro = root.querySelectorAll(".wd-case__intro > *");
    if (intro.length) {
      gsap.timeline().from(intro, {
        y: 24,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "transform",
      });
    }

    const graph = root.querySelector(".wd-case__graph-face");
    if (graph) {
      gsap.from(graph, { y: 18, duration: 0.8, ease: "power3.out", clearProps: "transform" });
    }

    const bar = root.querySelector(".wd-case__progress span");
    if (bar) {
      gsap.fromTo(
        bar,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.35 },
        }
      );
    }

    ScrollTrigger.batch(gsap.utils.toArray(".wd-case__chapter", root), {
      start: "top 86%",
      interval: 0.18,
      batchMax: 1,
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { y: 28 },
          { y: 0, duration: 0.7, ease: "power3.out", overwrite: "auto", clearProps: "transform" }
        );
        batch.forEach((el) => el.classList.add("is-in"));
      },
      onLeaveBack: (batch) => batch.forEach((el) => el.classList.remove("is-in")),
    });

    ScrollTrigger.batch(
      gsap.utils.toArray(".wd-case__decision, .wd-case__stack > div, .wd-case__layer", root),
      {
        start: "top 90%",
        interval: 0.1,
        batchMax: 4,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 16 },
            { y: 0, duration: 0.65, stagger: 0.08, ease: "power2.out", overwrite: "auto", clearProps: "transform" }
          ),
      }
    );
  });
}

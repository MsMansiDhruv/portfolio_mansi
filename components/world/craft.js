"use client";

export function tiltFace(node, event) {
  if (!node) return;
  const box = node.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width - 0.5;
  const y = (event.clientY - box.top) / box.height - 0.5;
  node.style.setProperty("--tilt-x", `${(y * -10).toFixed(2)}deg`);
  node.style.setProperty("--tilt-y", `${(x * 12).toFixed(2)}deg`);
  node.style.setProperty("--spot-x", `${((x + 0.5) * 100).toFixed(1)}%`);
  node.style.setProperty("--spot-y", `${((y + 0.5) * 100).toFixed(1)}%`);
}

export function untiltFace(node) {
  if (!node) return;
  node.style.setProperty("--tilt-x", "0deg");
  node.style.setProperty("--tilt-y", "0deg");
}

export function bindCraft(gsap, ScrollTrigger, root) {
  if (!root) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  gsap.utils.toArray(".wd-pop", root).forEach((card) => {
    if (card.classList.contains("wd-pop--reel")) return;
    const img = card.querySelector(".wd-pop__visual img");
    const copy = card.querySelector(".wd-pop__copy");
    gsap.fromTo(
      card,
      { y: 72, rotateX: 9, scale: 0.97 },
      {
        y: 0,
        rotateX: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 92%",
          end: "top 48%",
          scrub: 0.85,
        },
      }
    );
    if (img) {
      gsap.fromTo(
        img,
        { yPercent: -12, scale: 1.14 },
        {
          yPercent: 8,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }
    if (copy) {
      gsap.fromTo(
        copy.children,
        { y: 28, opacity: 0.2 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 42%",
            scrub: 0.6,
          },
        }
      );
    }
  });

  gsap.utils.toArray(".wd-im, .wd-operate, .wd-about--me").forEach((block) => {
    gsap.fromTo(
      block,
      { y: 48, opacity: 0.35 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: block,
          start: "top 88%",
          end: "top 55%",
          scrub: 0.7,
        },
      }
    );
  });

  const eras = root.querySelectorAll(".wd-about__eras li");
  if (eras.length) {
    gsap.fromTo(
      eras,
      { x: 40, opacity: 0.2 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: root.querySelector(".wd-about__eras"),
          start: "top 90%",
          end: "top 55%",
          scrub: 0.8,
        },
      }
    );
  }

  const portrait = root.querySelector(".wd-about__hero img:first-child");
  if (portrait) {
    gsap.to(portrait, {
      y: 14,
      rotateZ: 1.2,
      duration: 4.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  }
  const mark = root.querySelector(".wd-about__mark");
  if (mark) {
    gsap.to(mark, {
      y: -18,
      x: 8,
      duration: 3.4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  }
}

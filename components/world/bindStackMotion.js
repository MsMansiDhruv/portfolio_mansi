export function bindStackMotion(gsap, ScrollTrigger, root, onLayer) {
  const sections = gsap.utils.toArray("[data-world-layer]", root);

  sections.forEach((section, index) => {
    const id = section.dataset.worldLayer;
    const next = sections[index + 1];
    ScrollTrigger.create({
      trigger: section,
      start: "top 55%",
      endTrigger: next || section,
      end: next ? "top 55%" : "bottom bottom",
      onEnter: () => onLayer?.(id),
      onEnterBack: () => onLayer?.(id),
    });
  });
}

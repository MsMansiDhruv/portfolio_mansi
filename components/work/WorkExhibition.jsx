"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import WorldPageNav from "@/components/world/WorldPageNav";
import SiteFooter from "@/components/world/SiteFooter";
import FieldSpirals from "@/components/world/FieldSpirals";
import { useGsapLenis } from "@/components/world/useGsapLenis";
import { WORK_OPENING, WORK_INSTALLATIONS, WORK_SECONDARY, WORK_EXPERIMENTS } from "@/lib/data/work-catalog";
import { useWorldTheme } from "@/lib/use-world-theme";
import "@/app/globals.css";
import "@/styles/mansi-world-of-data.css";
import "@/styles/mansi-work.css";

function SerpentCard({ item, featured, index }) {
  const side = index % 2 === 0 ? "west" : "east";
  const techLine = item.tech?.slice(0, featured ? 4 : 3).join("  ·  ");

  return (
    <article
      className={`wd-serpent__item${featured ? " is-featured" : ""}`}
      data-side={side}
      data-step={item.number}
    >
      <Link href={`/projects/${item.slug}`} className="wd-serpent__card">
        <span className="wd-serpent__num">{item.number}</span>
        <em className="wd-serpent__line">{item.category}</em>
        <strong>{item.cardTitle || item.title}</strong>
        {item.problem ? <span className="wd-serpent__blurb wd-serpent__line">{item.problem}</span> : null}
        {techLine ? <span className="wd-serpent__tech wd-serpent__line">{techLine}</span> : null}
      </Link>
    </article>
  );
}

function SerpentSection({ kicker, title, hint, items, featured, boardClass }) {
  return (
    <section className={`wd-serpent ${boardClass}`} aria-label={title}>
      <header className="wd-serpent__head wd-fade">
        <p className="wd-scroll-kicker">{kicker}</p>
        <h2>{title}</h2>
        {hint ? <span>{hint}</span> : null}
      </header>
      <div className="wd-serpent__board">
        <svg className="wd-serpent__svg" aria-hidden>
          <path className="wd-serpent__path-track" />
          <path className="wd-serpent__path" />
        </svg>
        {items.map((item, index) => (
          <SerpentCard key={item.slug} item={item} featured={featured} index={index} />
        ))}
      </div>
    </section>
  );
}

function boxOnBoard(el, board) {
  const er = el.getBoundingClientRect();
  const br = board.getBoundingClientRect();
  return {
    left: er.left - br.left,
    top: er.top - br.top,
    width: er.width,
    height: er.height,
  };
}

function nodeOnCard(box, west, deep) {
  const pad = deep ? Math.min(80, box.width * 0.5) : 2;
  return {
    x: west ? box.left + box.width - pad : box.left + pad,
    y: box.top + box.height * 0.5,
  };
}

function snakePath(section) {
  const board = section.querySelector(".wd-serpent__board");
  const svg = section.querySelector(".wd-serpent__svg");
  const paths = section.querySelectorAll(".wd-serpent__path-track, .wd-serpent__path");
  const items = [...section.querySelectorAll(".wd-serpent__item")];
  if (!board || !svg || items.length < 2) return "";

  const w = board.offsetWidth;
  const h = board.offsetHeight;
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.style.width = `${w}px`;
  svg.style.height = `${h}px`;

  const pts = items.map((el, index) => {
    const face = el.querySelector(".wd-serpent__card") || el;
    const box = boxOnBoard(face, board);
    const west = el.dataset.side === "west";
    const deep = index === 0 || index === items.length - 1;
    return nodeOnCard(box, west, deep);
  });

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i += 1) {
    const a = pts[i - 1];
    const b = pts[i];
    const cx = (a.x + b.x) / 2;
    d += ` C ${cx} ${a.y}, ${cx} ${b.y}, ${b.x} ${b.y}`;
  }

  paths.forEach((path) => {
    path.setAttribute("d", d);
  });
  return d;
}

export default function WorkExhibition() {
  const [theme] = useWorldTheme();
  const rootRef = useRef(null);
  const more = [...WORK_EXPERIMENTS, ...WORK_SECONDARY];

  const setup = useCallback((gsap, ScrollTrigger, root) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = gsap.utils.toArray(".wd-archive__hero .wd-fade", root);
    const cards = gsap.utils.toArray(".wd-serpent__item", root);
    const sections = gsap.utils.toArray(".wd-serpent", root);

    const paintSnakes = () => {
      sections.forEach((section) => {
        snakePath(section);
        const path = section.querySelector(".wd-serpent__path");
        if (!path?.getTotalLength) return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length });
      });
    };
    paintSnakes();
    ScrollTrigger.addEventListener("refreshInit", paintSnakes);
    ScrollTrigger.addEventListener("refresh", paintSnakes);

    if (reduce) {
      gsap.set([hero, cards], { opacity: 1, x: 0, y: 0, clearProps: "transform" });
      return;
    }

    gsap.fromTo(
      hero,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.95, stagger: 0.1, ease: "power3.out" }
    );

    Promise.resolve(import("gsap/SplitText")).then((mod) => {
      const Split = mod.SplitText;
      gsap.registerPlugin(Split);

      cards.forEach((card) => {
        const fromX = card.dataset.side === "east" ? 48 : -48;
        const num = card.querySelector(".wd-serpent__num");
        const lines = card.querySelectorAll(".wd-serpent__line");
        const title = card.querySelector("strong");
        let words = title ? [title] : [];
        if (title) {
          const split = Split.create(title, { type: "words,lines", mask: "lines" });
          words = split.words;
        }

        const face = card.querySelector(".wd-serpent__card");
        const tl = gsap.timeline({ paused: true });
        tl.fromTo(face, { opacity: 0, x: fromX }, { opacity: 1, x: 0, duration: 0.75, ease: "power3.out" }, 0)
          .fromTo(num, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05)
          .fromTo(
            words,
            { opacity: 0, yPercent: 110 },
            { opacity: 1, yPercent: 0, duration: 0.8, stagger: 0.055, ease: "power3.out" },
            0.08
          )
          .fromTo(
            lines,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" },
            0.18
          );

        ScrollTrigger.create({
          trigger: card,
          start: "top 86%",
          onEnter: () => tl.play(),
          onEnterBack: () => tl.play(),
        });

        if (card.getBoundingClientRect().top < window.innerHeight * 0.9) tl.play();
      });

      sections.forEach((section) => {
        const path = section.querySelector(".wd-serpent__path");
        const board = section.querySelector(".wd-serpent__board");
        const last = section.querySelector(".wd-serpent__item:last-of-type");
        if (!path || !board) return;
        const length = path.getTotalLength?.() || 0;
        if (!length) return;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: board,
            start: "top 78%",
            end: () => `+=${Math.max(board.offsetHeight - window.innerHeight * 0.25, 240)}`,
            scrub: 0.7,
            onLeave: () => gsap.set(path, { strokeDashoffset: 0 }),
            onEnterBack: () => {},
          },
        });
        if (last) {
          ScrollTrigger.create({
            trigger: last,
            start: "top 70%",
            onEnter: () => gsap.set(path, { strokeDashoffset: 0 }),
          });
        }
      });

      ScrollTrigger.refresh();
    });
  }, []);

  useLayoutEffect(() => {
    document.documentElement.classList.remove("wd-smoother-page");
    document.documentElement.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow");
  }, []);

  useGsapLenis(rootRef, setup);

  return (
    <div
      ref={rootRef}
      className="wd-root wd-page wd-page--work wd-archive is-ready dark"
      data-theme={theme}
      suppressHydrationWarning
    >
      <WorldPageNav active="work" />
      <FieldSpirals />
      <main className="wd-page-main wd-archive__stage">
        <section className="wd-archive__hero">
          <p className="wd-scroll-kicker wd-fade">Work</p>
          <h1 className="wd-page-title wd-archive__title wd-fade">Selected systems.</h1>
          <p className="wd-page-lead wd-fade">{WORK_OPENING.lines[0]}</p>
        </section>

        <SerpentSection
          kicker="01"
          title="Featured"
          hint="Follow the green path. Left, then right."
          items={WORK_INSTALLATIONS}
          featured
          boardClass="wd-serpent--featured"
        />

        {more.length ? (
          <SerpentSection
            kicker="02"
            title="More"
            hint="Same snake. Smaller pieces."
            items={more}
            featured={false}
            boardClass="wd-serpent--more"
          />
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}

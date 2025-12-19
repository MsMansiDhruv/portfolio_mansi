// components/FullWidthTestimonialsMarquee.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";

const ACCENT = "var(--color-accent)";
const STORAGE_KEY = "mansi_full_testimonials_v1";
const THEME_KEYS = ["theme", "color-mode", "site-theme", "mode"];
const BASE_SPEED = 36; // px per second

const DEFAULT_TESTIMONIALS = [
  { id: "rec-madhavi", name: "Madhavi Solanki", title: "Colleague @ Cyphertree", text: "I had the pleasure of working with Mansi Dhruv at Cyphertree — she’s collaborative, deliberate, and always focused on delivering business value.", sourceUrl: "#" },
  { id: "rec-vinit", name: "Vinit Kumar", title: "Interviewer / Colleague", text: "Mansi is a capable Software Engineer who knows her stack well and can think creatively when required. Her attitude to learn is best-in-class.", sourceUrl: "#" },
  { id: "rec-vishal", name: "Vishal Chandale", title: "Colleague @ SG Analytics", text: "Mansi has strong backend skills and UI experience. Helpful teammate and very dependable.", sourceUrl: "#" },
  { id: "rec-mrinmoy", name: "Mrinmoy Sarkar", title: "Colleague @ SG Analytics", text: "Her practical, no-nonsense approach to problems made working together very productive. Highly recommended.", sourceUrl: "#" },
];

function safeParse(raw) { try { return JSON.parse(raw); } catch { return null; } }
function initials(name = "") {
  if (!name) return "M";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
  return (parts[0][0] + (parts[1][0] || "")).toUpperCase();
}

function readStoredThemeValue() {
  try {
    for (const k of THEME_KEYS) {
      const v = localStorage.getItem(k);
      if (!v) continue;
      const lower = String(v).trim().toLowerCase();
      if (["dark","light","auto","system"].includes(lower)) return lower;
    }
  } catch {}
  return null;
}
function computeEffectiveThemeFromStorageOrHtml() {
  const stored = readStoredThemeValue();
  if (stored === "dark" || stored === "light") return stored;
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) return "dark";
  return "light";
}

/* tweak this constant if you want cards narrower/wider */
const CARD_WIDTH = "min(72vw,620px)";

function Card({ t, onEnter, onLeave, onTouchStart, onTouchEnd }) {
  return (
    <article
      className="tw-card"
      aria-label={`Recommendation by ${t.name}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        cursor: "default",
        flex: "0 0 auto",
        width: CARD_WIDTH,
        maxWidth: 620,
        minWidth: 300,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="tw-card-inner rounded-2xl" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <div>
          <div className="flex items-start gap-3">
            <div className="tw-badge w-11 h-11 rounded-full flex items-center justify-center font-semibold">{initials(t.name)}</div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: "var(--card-title)" }}>{t.name}</div>
              <div className="text-xs mt-0.5 truncate" style={{ color: "var(--card-sub)" }}>{t.title}</div>
            </div>
          </div>

          <blockquote className="mt-2 text-sm leading-relaxed" style={{ color: "var(--card-body)", fontStyle: "italic", whiteSpace: "normal" }}>
            “{t.text}”
          </blockquote>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {/* <a className="text-sm font-medium" style={{ color: ACCENT }} href={t.sourceUrl || "#"} target="_blank" rel="noreferrer">View source →</a> */}
          {/* <div className="text-xs" style={{ color: "var(--card-sub)" }}>LinkedIn</div> */}
        </div>
      </div>
    </article>
  );
}

export default function FullWidthTestimonialsMarquee({ initial = null, speed = BASE_SPEED }) {
  const [items, setItems] = useState([]);
  const [theme, setTheme] = useState(() => (typeof document !== "undefined" ? computeEffectiveThemeFromStorageOrHtml() : "light"));
  const wrapRef = useRef(null);
  const scrollerRef = useRef(null);
  const rafRef = useRef(null);

  const [isPaused, setIsPausedState] = useState(false);
  const pausedRef = useRef(false);
  function setPaused(val) { pausedRef.current = Boolean(val); setIsPausedState(Boolean(val)); }

  // Ensure we always use the same storage key
  // On mount: if there's no valid array stored, seed it with DEFAULT_TESTIMONIALS
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = safeParse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        // seed storage with defaults (do not overwrite if something valid already exists)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TESTIMONIALS));
        setItems(DEFAULT_TESTIMONIALS);
      } else {
        setItems(parsed);
      }
    } catch (e) {
      // fallback: use initial or defaults
      if (Array.isArray(initial) && initial.length) setItems(initial);
      else setItems(DEFAULT_TESTIMONIALS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  // persist items whenever they change (keeps storage & summary in sync)
  useEffect(() => {
    try {
      if (Array.isArray(items) && items.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
    } catch (e) {
      console.warn("Failed to persist testimonials:", e);
    }
  }, [items]);

  useEffect(() => {
    function recompute() { setTheme(computeEffectiveThemeFromStorageOrHtml()); }
    const onStorage = (e) => { if (!e.key) return; if (THEME_KEYS.includes(e.key) || e.key === STORAGE_KEY) {
      // if testimonials changed in another tab, resync items
      if (e.key === STORAGE_KEY) {
        try {
          const p = safeParse(localStorage.getItem(STORAGE_KEY));
          if (Array.isArray(p)) setItems(p);
        } catch {}
      }
      recompute();
    } };
    window.addEventListener("storage", onStorage);
    const obs = new MutationObserver(recompute);
    if (typeof document !== "undefined") obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    recompute();
    return () => { window.removeEventListener("storage", onStorage); obs.disconnect(); };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || items.length === 0) return;
    let last = performance.now();
    let cancelled = false;

    function step(now) {
      if (cancelled) return;
      const dt = now - last;
      last = now;
      if (!pausedRef.current) {
        const delta = (speed * dt) / 1000;
        scroller.scrollLeft += delta;
        const half = scroller.scrollWidth / 2;
        if (scroller.scrollLeft >= half) scroller.scrollLeft = scroller.scrollLeft - half;
      }
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => { cancelled = true; if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; };
  }, [items, speed]);

  function handlePointerEnter() { setPaused(true); }
  function handlePointerLeave() { setPaused(false); }
  function handleTouchStart() { setPaused(true); }
  function handleTouchEnd() { setPaused(false); }

  useEffect(() => {
    const onPointerUp = () => setPaused(false);
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    return () => window.removeEventListener("pointerup", onPointerUp);
  }, []);

  // ensure scroller has a slight nudge so it's never exactly 0
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    function ensure() { if (scroller.scrollLeft === 0) scroller.scrollLeft = 1; }
    window.addEventListener("resize", ensure);
    ensure();
    return () => window.removeEventListener("resize", ensure);
  }, []);

  if (!items || items.length === 0) return null;

  const scopedCss = `
    .fw-marquee { --accent: ${ACCENT}; }

    .fw-marquee[data-theme="light"] {
      --card-bg: #ffffff;
      --card-title: #0f172a;
      --card-body: #334155;
      --card-sub: #6b7280;
      --card-border: rgba(46,196,182,0.12);
      --card-shadow: 0 8px 20px rgba(2,6,23,0.04);
      --badge-bg: #f1f5f9;
      --badge-fg: #0f172a;
      --mask-start: rgba(46,196,182,0.12);
      --mask-end: rgba(46,196,182,0);
    }
    .fw-marquee[data-theme="dark"] {
      --card-bg: rgba(17,20,24,0.72);
      --card-title: #e6eef0;
      --card-body: #cbd5e1;
      --card-sub: #94a3b8;
      --card-border: rgba(46,196,182,0.12);
      --card-shadow: 0 10px 30px rgba(2,6,23,0.18);
      --badge-bg: rgba(148,163,184,0.06);
      --badge-fg: #dbeafe;
      --mask-start: rgba(46,196,182,0.12);
      --mask-end: rgba(46,196,182,0);
    }

    .fw-marquee .tw-card-inner {
      background: var(--card-bg);
      color: var(--card-body);
      border-radius: 10px;
      border: 1px solid var(--card-border);
      box-shadow: var(--card-shadow);
      transition: box-shadow .18s ease, border-color .18s ease, transform .18s ease;
      padding: 10px;
    }
    .fw-marquee .tw-card:hover .tw-card-inner,
    .fw-marquee .tw-card:focus-within .tw-card-inner {
      border-color: rgba(46,196,182,0.32);
      box-shadow: 0 14px 40px rgba(46,196,182,0.10);
      transform: translateY(-4px);
    }
    .fw-marquee .tw-badge {
      background: var(--badge-bg);
      color: var(--badge-fg);
      font-size: 0.95rem;
    }

    .fw-marquee .no-scrollbar::-webkit-scrollbar { display: none !important; height: 0; width: 0; }
    .fw-marquee .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .fw-marquee .mask-left { background: linear-gradient(90deg, var(--mask-start), var(--mask-end)); }
    .fw-marquee .mask-right { background: linear-gradient(270deg, var(--mask-start), var(--mask-end)); }
  `;

  const double = [...items, ...items];

  return (
    <section aria-label="Testimonials" className="py-4 fw-marquee" data-theme={theme}>
      <style dangerouslySetInnerHTML={{ __html: scopedCss }} />

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: ACCENT }}>What people say</h2>
            <p className="text-sm text-slate-700 dark:text-slate-400 mt-1 max-w-2xl">Recommendations from colleagues & mentors.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span>{items.length} testimonials | </span>
            <span className="text-xs text-slate-400">{pausedRef.current ? "Paused" : "Live"}</span>
          </div>
        </div>
      </div>

      <div ref={wrapRef} className="mx-auto max-w-6xl px-4 relative" style={{ overflow: "hidden" }}>
        <div
          ref={scrollerRef}
          tabIndex={0}
          className="no-scrollbar"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            display: "flex",
            gap: 12,
            alignItems: "stretch",
            overflowX: "auto",
            overflowY: "hidden",
            padding: "4px 8px",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "auto",
            whiteSpace: "nowrap",
          }}
        >
          {double.map((t, i) => (
            <div key={`${t.id}-${i}`} style={{ flex: "0 0 auto", display: "flex", justifyContent: "center", alignItems: "stretch" }}>
              <Card
                t={t}
                onEnter={handlePointerEnter}
                onLeave={handlePointerLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              />
            </div>
          ))}
        </div>

        <div aria-hidden className="mask-left" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 48, pointerEvents: "none", zIndex: 20 }} />
        <div aria-hidden className="mask-right" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 48, pointerEvents: "none", zIndex: 20 }} />
      </div>
    </section>
  );
}

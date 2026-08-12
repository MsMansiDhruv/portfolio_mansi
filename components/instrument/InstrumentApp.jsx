"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "@/styles/mansi-instrument.css";
import { INSTRUMENT_NAV, INSTRUMENT_HERO, INSTRUMENT_PROJECTS } from "@/lib/data/instrument";
import { ABOUT_ME, CAREER_TIMELINE, CURRENT_ROLE, getAboutHeroLine } from "@/lib/data/career";
import { SOCIAL_LINKS } from "@/lib/data/social-links";
import { HOW_I_THINK, IDENTITY_HERO } from "@/lib/data/identity";
import { viewCamera } from "./CameraRig";
import InstrumentCanvas from "./InstrumentCanvas";

const THEME_KEY = "mansi-instrument-theme";

function MagneticNav({ theme, view, onTravel, onHome, onToggleTheme }) {
  const wrap = useRef(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return undefined;
    const buttons = [...el.querySelectorAll("[data-magnetic]")];
    const onMove = (e) => {
      buttons.forEach((btn) => {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < 80) {
          const f = (1 - dist / 80) * 6;
          btn.style.transform = `translate(${(dx / 80) * f}px, ${(dy / 80) * f}px)`;
        } else {
          btn.style.transform = "";
        }
      });
    };
    const reset = () => buttons.forEach((b) => (b.style.transform = ""));
    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <nav className="mi-nav" ref={wrap} aria-label="Mansi">
      <button type="button" className="mi-brand" data-magnetic onClick={onHome}>
        Mansi
      </button>
      <div className="mi-nav-links">
        {INSTRUMENT_NAV.map((link) => (
          <button
            key={link.id}
            type="button"
            data-magnetic
            className={`mi-nav-btn${view === link.id || (view === "project" && link.id === "work") ? " is-active" : ""}`}
            onClick={() => onTravel(link)}
          >
            {link.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="mi-theme"
        data-magnetic
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === "night" ? "day" : "night"} mode`}
      >
        <span className="mi-theme__pip" />
        <span suppressHydrationWarning>{theme === "night" ? "Night" : "Day"}</span>
      </button>
    </nav>
  );
}

export default function InstrumentApp() {
  const [theme, setTheme] = useState("night");
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("home");
  const [hover, setHover] = useState(null);
  const [active, setActive] = useState(null);
  const [chip, setChip] = useState({ x: 0, y: 0 });
  const [hot, setHot] = useState(false);

  const cameraTargetRef = useRef({
    position: [0.15, 1.55, 7.2],
    lookAt: [0, 0.05, 0],
    fov: 40,
    mode: "stream",
    token: 1,
    mid: null,
    arrived: true,
  });
  const cursorRef = useRef({
    x: 0,
    y: 0,
    z: 2,
    vx: 0,
    vy: 0,
    vz: 0,
    active: false,
  });
  const stateRef = useRef({
    view: "home",
    hoverSlug: null,
    activeSlug: null,
    reveal: 0,
    travelPulse: 0,
    scroll: 0,
    hoverX: 0,
    hoverZ: 0,
  });

  useEffect(() => {
    try {
      const s = localStorage.getItem(THEME_KEY);
      if (s === "day" || s === "night") setTheme(s);
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setReady(true), 480);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("mi-active");
    document.body.classList.add("mi-custom-cursor");
    return () => {
      document.documentElement.classList.remove("mi-active");
      document.body.classList.remove("mi-custom-cursor");
    };
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      const cur = document.querySelector(".mi-cursor");
      if (cur) cur.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      setChip({ x: e.clientX, y: e.clientY });
      const interactive = e.target?.closest?.("button, a, [data-magnetic]");
      setHot(!!interactive || !!hover);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [hover]);

  useEffect(() => {
    const onWheel = (e) => {
      if (view !== "home") return;
      stateRef.current.scroll = Math.min(
        1,
        Math.max(0, (stateRef.current.scroll || 0) + e.deltaY * 0.0006)
      );
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [view]);

  useEffect(() => {
    stateRef.current.view = view;
    stateRef.current.hoverSlug = hover?.slug || null;
    stateRef.current.activeSlug = active?.slug || null;
    if (hover) {
      stateRef.current.hoverX = hover.node[0];
      stateRef.current.hoverZ = hover.node[2];
    }
  }, [view, hover, active]);

  const travel = useCallback((id, project = null) => {
    const cam = viewCamera(id, project?.node);
    const from = cameraTargetRef.current || {};
    const fromPos = from.position || [0.15, 1.55, 7.2];
    const fromLook = from.lookAt || [0, 0.05, 0];
    const mid = {
      position: [
        (fromPos[0] + cam.position[0]) * 0.5,
        Math.max(fromPos[1], cam.position[1]) + 0.12,
        (fromPos[2] + cam.position[2]) * 0.5,
      ],
      lookAt: [
        (fromLook[0] + cam.lookAt[0]) * 0.5,
        (fromLook[1] + cam.lookAt[1]) * 0.5,
        (fromLook[2] + cam.lookAt[2]) * 0.5,
      ],
    };
    cameraTargetRef.current = {
      position: [...cam.position],
      lookAt: [...cam.lookAt],
      fov: cam.fov,
      mode: id === "project" ? "enter" : "stream",
      token: Date.now(),
      mid,
      arrived: false,
    };
    stateRef.current.travelPulse = 1;
    stateRef.current.view = id;
    setView(id === "project" ? "project" : id);
  }, []);

  const onTravel = useCallback(
    (link) => {
      if (link.href) {
        travel("work");
        window.setTimeout(() => {
          window.location.href = link.href;
        }, 420);
        return;
      }
      setActive(null);
      travel(link.id);
    },
    [travel]
  );

  const onHome = useCallback(() => {
    setActive(null);
    setHover(null);
    travel("home");
  }, [travel]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "night" ? "day" : "night";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const onSelectProject = useCallback(
    (project) => {
      if (!project) return;
      setActive(project);
      setHover(null);
      travel("project", project);
    },
    [travel]
  );

  const onReturnWork = useCallback(() => {
    setActive(null);
    travel("work");
  }, [travel]);

  return (
    <div
      className={`mi-root${ready ? " is-ready" : ""}`}
      data-theme={theme}
    >
      <div className={`mi-loader${ready ? " is-done" : ""}`} aria-hidden>
        <span className="mi-loader__mark">Initializing</span>
      </div>

      <MagneticNav
        theme={theme}
        view={view === "project" ? "work" : view}
        onTravel={onTravel}
        onHome={onHome}
        onToggleTheme={toggleTheme}
      />

      <div className={`mi-cursor${hot ? " is-hot" : ""}`} aria-hidden />

      <InstrumentCanvas
        themeId={theme}
        cameraTargetRef={cameraTargetRef}
        cursorRef={cursorRef}
        stateRef={stateRef}
        projects={INSTRUMENT_PROJECTS}
        hoverSlug={hover?.slug || null}
        activeSlug={active?.slug || null}
        view={view}
        onHoverProject={setHover}
        onSelectProject={onSelectProject}
      />

      <div className="mi-hud" aria-hidden={view !== "home"}>
        <div className="mi-meta mi-meta--tl">MANSI · DATA SYSTEM</div>
        <div className="mi-meta mi-meta--br">
          {theme === "day" ? "DAY · CLARITY" : "NIGHT · FOCUS"}
        </div>
        {view === "home" && (
          <div className="mi-hero">
            <h1 className="mi-hero__name">{INSTRUMENT_HERO.name}</h1>
            <p className="mi-hero__role">{INSTRUMENT_HERO.role}</p>
            <p className="mi-hero__statement">{INSTRUMENT_HERO.statement}</p>
          </div>
        )}
        {view === "home" && (
          <p className="mi-hint">Move through the field · Explore WORK</p>
        )}
      </div>

      <div
        className={`mi-hover-chip${hover && !active ? " is-on" : ""}`}
        style={{ left: chip.x, top: chip.y }}
      >
        {hover && (
          <>
            <p className="mi-hover-chip__id">PROJECT {hover.index}</p>
            <p className="mi-hover-chip__title">{hover.title}</p>
            <p className="mi-hover-chip__cat">{hover.category}</p>
          </>
        )}
      </div>

      {/* Work index hint */}
      <aside
        className={`mi-panel mi-panel--work${view === "work" && !active ? " is-open" : ""}`}
        aria-hidden={!(view === "work" && !active)}
      >
        <p className="mi-kicker">WORK</p>
        <h2>Selected systems</h2>
        <p>
          Hover a node to wake its data. Enter to travel into the architecture.
        </p>
        <ul>
          {INSTRUMENT_PROJECTS.map((p) => (
            <li key={p.slug}>
              <button
                type="button"
                className="mi-btn"
                style={{ marginTop: "0.45rem", width: "100%", textAlign: "left" }}
                onClick={() => onSelectProject(p)}
              >
                {p.index} — {p.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Project detail — real content only */}
      <aside
        className={`mi-panel mi-panel--project${active ? " is-open" : ""}`}
        aria-hidden={!active}
      >
        {active && (
          <>
            <p className="mi-kicker">
              PROJECT {active.index} · {active.role}
            </p>
            <h2>{active.title}</h2>
            <p>{active.summary}</p>
            {active.problem && (
              <>
                <h3>Problem</h3>
                <p>{active.problem}</p>
              </>
            )}
            {active.architecture?.length > 0 && (
              <>
                <h3>Architecture</h3>
                <ul>
                  {active.architecture.map((layer) => (
                    <li key={layer}>{layer}</li>
                  ))}
                </ul>
              </>
            )}
            {active.decisions?.length > 0 && (
              <>
                <h3>Decisions</h3>
                <ul>
                  {active.decisions.map((d, i) => (
                    <li key={i}>
                      {typeof d === "string" ? d : d.decision}
                      {d?.why ? ` — ${d.why}` : ""}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {active.tech?.length > 0 && (
              <>
                <h3>Technology</h3>
                <p className="mi-tech">{active.tech.join(" · ")}</p>
              </>
            )}
            {active.outcomes?.length > 0 && (
              <>
                <h3>Result</h3>
                <ul>
                  {active.outcomes.slice(0, 3).map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </>
            )}
            {active.learning && (
              <>
                <h3>Learning</h3>
                <p>{active.learning}</p>
              </>
            )}
            <div className="mi-actions">
              <button type="button" className="mi-btn" onClick={onReturnWork}>
                Return to work
              </button>
              <a className="mi-btn mi-btn--solid" href={`/projects/${active.slug}`}>
                Full case study
              </a>
            </div>
          </>
        )}
      </aside>

      {/* Experience */}
      <aside
        className={`mi-panel mi-panel--section${view === "experience" ? " is-open" : ""}`}
        aria-hidden={view !== "experience"}
      >
        <p className="mi-kicker">EXPERIENCE</p>
        <h2>{CURRENT_ROLE}</h2>
        <p>{getAboutHeroLine()}</p>
        {CAREER_TIMELINE.map((item) => (
          <div key={item.id}>
            <h3>
              {item.year} · {item.title}
            </h3>
            <p>{item.desc}</p>
            {item.focus && <p className="mi-tech">{item.focus}</p>}
          </div>
        ))}
      </aside>

      {/* About */}
      <aside
        className={`mi-panel mi-panel--section${view === "about" ? " is-open" : ""}`}
        aria-hidden={view !== "about"}
      >
        <p className="mi-kicker">ABOUT</p>
        <h2>{IDENTITY_HERO.name}</h2>
        <p>{IDENTITY_HERO.humanLine}</p>
        {ABOUT_ME.map((para) => (
          <p key={para}>{para}</p>
        ))}
        <h3>How I think</h3>
        <ul>
          {HOW_I_THINK.slice(0, 4).map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </aside>

      {/* Contact */}
      <aside
        className={`mi-panel mi-panel--section${view === "contact" ? " is-open" : ""}`}
        aria-hidden={view !== "contact"}
      >
        <p className="mi-kicker">CONTACT</p>
        <h2>Let&apos;s talk systems</h2>
        <p>
          For roles, collaborations, or architecture conversations — reach out
          directly.
        </p>
        <div className="mi-actions">
          {SOCIAL_LINKS.email && (
            <a className="mi-btn mi-btn--solid" href={`mailto:${SOCIAL_LINKS.email}`}>
              Email
            </a>
          )}
          {SOCIAL_LINKS.linkedin && (
            <a className="mi-btn" href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {SOCIAL_LINKS.github && (
            <a className="mi-btn" href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          <a className="mi-btn" href="/contact">
            Contact form
          </a>
        </div>
      </aside>
    </div>
  );
}

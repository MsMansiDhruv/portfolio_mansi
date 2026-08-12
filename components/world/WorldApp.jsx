"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "@/styles/mansi-world-of-data.css";
import {
  WORLD_NAV,
  WORLD_HERO,
  WORLD_PROJECTS,
} from "@/lib/data/data-world";
import {
  ABOUT_ME,
  CAREER_TIMELINE,
  CURRENT_ROLE,
  getAboutHeroLine,
} from "@/lib/data/career";
import { SOCIAL_LINKS } from "@/lib/data/social-links";
import { HOW_I_THINK, IDENTITY_HERO } from "@/lib/data/identity";
import WorldCanvas from "./WorldCanvas";
import { viewOf } from "./CameraRig";

const THEME_KEY = "mansi-world-theme";

function MagNav({ theme, view, onTravel, onHome, onToggle }) {
  const wrap = useRef(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return undefined;
    const nodes = [...el.querySelectorAll("[data-mag]")];
    const move = (e) => {
      nodes.forEach((btn) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        if (d < 72) {
          const f = (1 - d / 72) * 5;
          btn.style.transform = `translate(${(dx / 72) * f}px, ${(dy / 72) * f}px)`;
        } else btn.style.transform = "";
      });
    };
    const reset = () => nodes.forEach((n) => (n.style.transform = ""));
    window.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <nav className="wd-nav" ref={wrap} aria-label="Mansi">
      <button type="button" className="wd-brand" data-mag onClick={onHome}>
        Mansi
      </button>
      <div className="wd-links">
        {WORLD_NAV.map((link) => (
          <button
            key={link.id}
            type="button"
            data-mag
            className={`wd-link${view === link.id || (view === "project" && link.id === "work") ? " is-on" : ""}`}
            onClick={() => onTravel(link)}
          >
            {link.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="wd-theme"
        data-mag
        onClick={onToggle}
        aria-label={`Switch to ${theme === "night" ? "day" : "night"} mode`}
      >
        <span className="wd-theme__pip" />
        <span suppressHydrationWarning>{theme === "night" ? "Night" : "Day"}</span>
      </button>
    </nav>
  );
}

export default function WorldApp() {
  const [theme, setTheme] = useState("night");
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("home");
  const [techHover, setTechHover] = useState(null);
  const [projectHover, setProjectHover] = useState(null);
  const [active, setActive] = useState(null);
  const [chip, setChip] = useState({ x: 0, y: 0 });
  const [hot, setHot] = useState(false);
  const [coords, setCoords] = useState("00.00 · 00.00");

  const cameraTargetRef = useRef({
    position: [0, 0.35, 7.2],
    lookAt: [0, 0, 0],
    fov: 42,
    mode: "stream",
    token: 1,
    mid: null,
  });
  const cursorRef = useRef({
    nx: 0,
    ny: 0,
    vx: 0,
    vy: 0,
    x: 0,
    y: 0,
    z: 0,
    active: false,
  });
  const stateRef = useRef({
    view: "home",
    globeEnergy: 0.15,
    globeRotY: 0,
  });

  useEffect(() => {
    try {
      const s = localStorage.getItem(THEME_KEY);
      if (s === "day" || s === "night") setTheme(s);
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setReady(true), 520);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("wd-active");
    document.body.classList.add("wd-cursor-on");
    return () => {
      document.documentElement.classList.remove("wd-active");
      document.body.classList.remove("wd-cursor-on");
    };
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      const c = document.querySelector(".wd-cursor");
      if (c) c.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      setChip({ x: e.clientX, y: e.clientY });
      setHot(!!e.target?.closest?.("button, a, [data-mag]"));
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const e = stateRef.current.globeEnergy || 0;
      const y = stateRef.current.globeRotY || 0;
      setCoords(
        `${(e * 90).toFixed(2)} · ${(((y % (Math.PI * 2)) / (Math.PI * 2)) * 360).toFixed(1)}°`
      );
    }, 120);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    stateRef.current.view = view;
  }, [view]);

  const travel = useCallback((id, project = null) => {
    const cam = viewOf(id, project);
    const from = cameraTargetRef.current || {};
    const fromPos = from.position || [0, 0.35, 7.2];
    const fromLook = from.lookAt || [0, 0, 0];
    cameraTargetRef.current = {
      position: [...cam.position],
      lookAt: [...cam.lookAt],
      fov: cam.fov,
      mode: id === "project" ? "enter" : "stream",
      token: Date.now(),
      mid: {
        position: [
          (fromPos[0] + cam.position[0]) * 0.5,
          Math.max(fromPos[1], cam.position[1]) + 0.2,
          (fromPos[2] + cam.position[2]) * 0.5,
        ],
        lookAt: [
          (fromLook[0] + cam.lookAt[0]) * 0.5,
          (fromLook[1] + cam.lookAt[1]) * 0.5,
          (fromLook[2] + cam.lookAt[2]) * 0.5,
        ],
      },
    };
    setView(id === "project" ? "project" : id);
  }, []);

  const onTravel = useCallback(
    (link) => {
      if (link.href) {
        travel("ai-lab");
        window.setTimeout(() => {
          window.location.href = link.href;
        }, 500);
        return;
      }
      setActive(null);
      setProjectHover(null);
      travel(link.id);
    },
    [travel]
  );

  const onHome = useCallback(() => {
    setActive(null);
    setProjectHover(null);
    setTechHover(null);
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
      setProjectHover(null);
      travel("project", project);
    },
    [travel]
  );

  return (
    <div className={`wd-root${ready ? " is-ready" : ""}`} data-theme={theme}>
      <div className={`wd-loader${ready ? " is-done" : ""}`} aria-hidden>
        <span className="wd-loader__mark">Entering data world</span>
      </div>

      <MagNav
        theme={theme}
        view={view === "project" ? "work" : view}
        onTravel={onTravel}
        onHome={onHome}
        onToggle={toggleTheme}
      />

      <div className={`wd-cursor${hot || techHover || projectHover ? " is-hot" : ""}`} aria-hidden />

      <WorldCanvas
        themeId={theme}
        cameraTargetRef={cameraTargetRef}
        cursorRef={cursorRef}
        stateRef={stateRef}
        projects={WORLD_PROJECTS}
        view={view}
        techHover={techHover?.id || null}
        projectHover={projectHover}
        activeSlug={active?.slug || null}
        onTechHover={setTechHover}
        onProjectHover={setProjectHover}
        onProjectSelect={onSelectProject}
      />

      <div className="wd-hud">
        <div className="wd-meta wd-meta--tl">WORLD OF DATA</div>
        <div className="wd-meta wd-meta--br">
          {theme === "day" ? "DAY · CLARITY" : "NIGHT · DEEP COMPUTE"}
        </div>
        <div className="wd-coords">{coords}</div>

        {view === "home" && (
          <div className="wd-hero">
            <h1>{WORLD_HERO.name}</h1>
            <p className="wd-hero__role">{WORLD_HERO.role}</p>
            <p className="wd-hero__line">{WORLD_HERO.line}</p>
          </div>
        )}
        {view === "home" && (
          <p className="wd-hint">Explore the globe · Discover systems · Enter WORK</p>
        )}
      </div>

      <div
        className={`wd-chip${(techHover || projectHover) && !active ? " is-on" : ""}`}
        style={{ left: chip.x, top: chip.y }}
      >
        {techHover && (
          <>
            <p className="wd-chip__id">{techHover.kind.toUpperCase()}</p>
            <p className="wd-chip__t">{techHover.label}</p>
            <p className="wd-chip__c">Connected infrastructure</p>
          </>
        )}
        {projectHover && !techHover && (
          <>
            <p className="wd-chip__id">PROJECT {projectHover.index}</p>
            <p className="wd-chip__t">{projectHover.title}</p>
            <p className="wd-chip__c">{projectHover.category}</p>
          </>
        )}
      </div>

      {/* WORK index */}
      <aside
        className={`wd-panel wd-panel--side${view === "work" && !active ? " is-open" : ""}`}
        aria-hidden={!(view === "work" && !active)}
      >
        <p className="wd-kicker">WORK</p>
        <h2>Systems in the constellation</h2>
        <p>Hover a node to wake its paths. Enter to travel into the architecture.</p>
        {WORLD_PROJECTS.map((p) => (
          <button
            key={p.slug}
            type="button"
            className="wd-btn"
            style={{ display: "block", width: "100%", marginTop: "0.5rem", textAlign: "left" }}
            onClick={() => onSelectProject(p)}
          >
            {p.index} — {p.title}
          </button>
        ))}
      </aside>

      {/* Project detail */}
      <aside
        className={`wd-panel wd-panel--side${active ? " is-open" : ""}`}
        aria-hidden={!active}
      >
        {active && (
          <>
            <p className="wd-kicker">
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
                <p className="wd-tech">{active.tech.join(" · ")}</p>
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
            <div className="wd-actions">
              <button
                type="button"
                className="wd-btn"
                onClick={() => {
                  setActive(null);
                  travel("work");
                }}
              >
                Return to work
              </button>
              <a className="wd-btn wd-btn--fill" href={`/projects/${active.slug}`}>
                Full case study
              </a>
            </div>
          </>
        )}
      </aside>

      <aside
        className={`wd-panel wd-panel--main${view === "experience" ? " is-open" : ""}`}
        aria-hidden={view !== "experience"}
      >
        <p className="wd-kicker">EXPERIENCE</p>
        <h2>{CURRENT_ROLE}</h2>
        <p>{getAboutHeroLine()}</p>
        {CAREER_TIMELINE.map((item) => (
          <div key={item.id}>
            <h3>
              {item.year} · {item.title}
            </h3>
            <p>{item.desc}</p>
            {item.focus && <p className="wd-tech">{item.focus}</p>}
          </div>
        ))}
      </aside>

      <aside
        className={`wd-panel wd-panel--main${view === "about" ? " is-open" : ""}`}
        aria-hidden={view !== "about"}
      >
        <p className="wd-kicker">ABOUT</p>
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

      <aside
        className={`wd-panel wd-panel--main${view === "contact" ? " is-open" : ""}`}
        aria-hidden={view !== "contact"}
      >
        <p className="wd-kicker">CONTACT</p>
        <h2>Let&apos;s talk systems</h2>
        <p>
          For roles, collaborations, or architecture conversations — reach out
          directly.
        </p>
        <div className="wd-actions">
          {SOCIAL_LINKS.email && (
            <a className="wd-btn wd-btn--fill" href={`mailto:${SOCIAL_LINKS.email}`}>
              Email
            </a>
          )}
          {SOCIAL_LINKS.linkedin && (
            <a className="wd-btn" href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {SOCIAL_LINKS.github && (
            <a className="wd-btn" href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          <a className="wd-btn" href="/contact">
            Contact form
          </a>
        </div>
      </aside>
    </div>
  );
}

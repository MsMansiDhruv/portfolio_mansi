"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/mansi-precision.css";
import { WORLD_VIEWS } from "@/lib/data/precision";
import { CHARACTER } from "@/lib/data/identity";
import PrecisionNav from "./PrecisionNav";
import PrecisionLoader from "./PrecisionLoader";
import PrecisionWorldCanvas from "./PrecisionWorldCanvas";
import PrecisionOverlay from "./PrecisionOverlay";
import ExhibitionPanel from "./ExhibitionPanel";

const THEME_KEY = "mansi-precision-theme";

function preload(urls) {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        })
    )
  );
}

function viewOf(id) {
  return WORLD_VIEWS[id] || WORLD_VIEWS.home;
}

/**
 * Interactive data world — observe, hover, enter, travel, return.
 * No scroll-driven slideshow. One persistent Three.js scene.
 */
export default function PrecisionPrototype() {
  const router = useRouter();
  const [theme, setTheme] = useState("night");
  const [ready, setReady] = useState(false);
  const [activeExhibit, setActiveExhibit] = useState(null);
  const [hoverSlug, setHoverSlug] = useState(null);
  const [phase, setPhase] = useState("immerse"); // immerse | read
  const [viewId, setViewId] = useState("home");

  const cameraTargetRef = useRef({
    ...viewOf("home"),
    mode: "hall",
    token: 1,
    mid: null,
    arrived: true,
  });
  const lookOffsetRef = useRef({ yaw: 0, pitch: 0 });
  const interactionRef = useRef({
    hoverSlug: null,
    activeSlug: null,
    energy: 0.25,
    reveal: 0,
    viewId: "home",
    travelPulse: 0,
  });
  const pendingRouteRef = useRef(null);
  const hallSnapshotRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "day" || saved === "night") setTheme(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Character only — never preload multi-MB cinematic plates on boot
      await preload([CHARACTER.src]);
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("mp-precision-active");
    document.body.classList.add("mp-cinematic-cursor", "mp-world-lock");
    document.body.style.overflow = "hidden";

    const onMove = (e) => {
      const el = document.querySelector(".mp-cursor");
      if (el) el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    window.addEventListener("pointermove", onMove);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("mp-precision-active");
      document.body.classList.remove("mp-cinematic-cursor", "mp-world-lock");
      document.body.style.overflow = "";
    };
  }, []);

  // Sync interaction ref for R3F systems
  useEffect(() => {
    interactionRef.current.hoverSlug = hoverSlug;
    interactionRef.current.activeSlug = activeExhibit?.slug || null;
    interactionRef.current.viewId = viewId;
  }, [hoverSlug, activeExhibit, viewId]);

  // After entering, reveal editorial once the visual pipeline has been felt
  useEffect(() => {
    if (!activeExhibit || phase !== "immerse") return undefined;
    const t = setTimeout(() => setPhase("read"), 4200);
    return () => clearTimeout(t);
  }, [activeExhibit, phase]);

  // Soft route after camera arrives — poll only while a route is pending
  useEffect(() => {
    let raf;
    let alive = true;
    const loop = () => {
      if (!alive) return;
      const pending = pendingRouteRef.current;
      if (!pending) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const cam = cameraTargetRef.current;
      if (cam?.arrived && cam.viewId === pending.view) {
        const href = pending.href;
        pendingRouteRef.current = null;
        router.push(href);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [router]);

  const travelToView = useCallback((id, opts = {}) => {
    const v = viewOf(id);
    const from = cameraTargetRef.current;
    setViewId(id);
    if (opts.href) {
      pendingRouteRef.current = { href: opts.href, view: id };
    } else {
      pendingRouteRef.current = null;
    }
    lookOffsetRef.current = { yaw: 0, pitch: 0 };

    // Stream mid-point — travel along the system axis, never teleport
    const mid = {
      position: [
        (from.position[0] + v.position[0]) * 0.5,
        Math.max(from.position[1], v.position[1]) + 0.15,
        (from.position[2] + v.position[2]) * 0.5,
      ],
      lookAt: [
        (from.lookAt[0] + v.lookAt[0]) * 0.5,
        (from.lookAt[1] + v.lookAt[1]) * 0.5 + 0.05,
        (from.lookAt[2] + v.lookAt[2]) * 0.5,
      ],
    };

    cameraTargetRef.current = {
      position: [...v.position],
      lookAt: [...v.lookAt],
      fov: v.fov,
      mode: "stream",
      token: Date.now(),
      mid,
      viewId: id,
      arrived: false,
    };
    interactionRef.current.viewId = id;
    interactionRef.current.travelPulse = 1;
  }, []);

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

  const onTravel = useCallback(
    (link) => {
      if (!link) return;
      if (activeExhibit) {
        // Exit exhibit first into hall, then travel
        setActiveExhibit(null);
        setPhase("immerse");
      }
      travelToView(link.view || link.id, { href: link.href || null });
    },
    [activeExhibit, travelToView]
  );

  const onHoverExhibit = useCallback((slug) => {
    setHoverSlug(slug);
  }, []);

  const onEnter = useCallback((exhibit) => {
    if (!exhibit) return;
    if (activeExhibit?.slug === exhibit.slug) return;

    hallSnapshotRef.current = {
      position: [...cameraTargetRef.current.position],
      lookAt: [...cameraTargetRef.current.lookAt],
      fov: cameraTargetRef.current.fov,
      viewId,
    };

    const mid = {
      position: [
        exhibit.position[0] * 0.4,
        1.65,
        exhibit.position[2] + 2.8,
      ],
      lookAt: [
        exhibit.position[0],
        1.4,
        exhibit.position[2] + 0.4,
      ],
    };

    cameraTargetRef.current = {
      position: [...exhibit.roomCam],
      lookAt: [...exhibit.roomLook],
      fov: 32,
      mode: "enter",
      token: Date.now(),
      mid,
      viewId: "exhibit",
      arrived: false,
    };
    lookOffsetRef.current = { yaw: 0, pitch: 0 };
    setActiveExhibit(exhibit);
    setPhase("immerse");
    setHoverSlug(null);
    setViewId("work");
    interactionRef.current.travelPulse = 1;
    interactionRef.current.viewId = "work";
  }, [activeExhibit, viewId]);

  const onReturn = useCallback(() => {
    if (!activeExhibit) return;
    const snap = hallSnapshotRef.current || viewOf("work");
    const mid = {
      position: [
        activeExhibit.position[0] * 0.35,
        1.7,
        activeExhibit.position[2] + 2.4,
      ],
      lookAt: [
        activeExhibit.position[0],
        1.4,
        activeExhibit.position[2],
      ],
    };

    cameraTargetRef.current = {
      position: [...snap.position],
      lookAt: [...snap.lookAt],
      fov: snap.fov || 36,
      mode: "exit",
      token: Date.now(),
      mid,
      reverseFrom: {
        position: [...activeExhibit.roomCam],
        lookAt: [...activeExhibit.roomLook],
        fov: 32,
      },
      viewId: snap.viewId || "work",
      arrived: false,
    };
    setActiveExhibit(null);
    setPhase("immerse");
    setViewId(snap.viewId || "work");
  }, [activeExhibit]);

  const onRead = useCallback(() => setPhase("read"), []);

  return (
    <div className="mp-root mp-root--interactive" data-theme={theme}>
      <PrecisionLoader ready={ready} />
      <PrecisionNav
        theme={theme}
        onToggleTheme={toggleTheme}
        activeView={activeExhibit ? "work" : viewId}
        onTravel={onTravel}
        onHome={() => {
          if (activeExhibit) onReturn();
          else travelToView("home");
        }}
      />

      <div className="mp-cursor" aria-hidden />

      <PrecisionWorldCanvas
        theme={theme}
        cameraTargetRef={cameraTargetRef}
        lookOffsetRef={lookOffsetRef}
        interactionRef={interactionRef}
        activeSlug={activeExhibit?.slug || null}
        hoverSlug={hoverSlug}
        viewId={viewId}
        onSelectExhibit={onEnter}
        onHoverExhibit={onHoverExhibit}
        controlsEnabled={!activeExhibit}
      />

      <PrecisionOverlay
        theme={theme}
        exhibitActive={!!activeExhibit}
        energyRef={interactionRef}
        hoverSlug={hoverSlug}
        viewId={viewId}
      />

      <ExhibitionPanel
        theme={theme}
        activeExhibit={activeExhibit}
        phase={phase}
        onRead={onRead}
        onReturn={onReturn}
      />
    </div>
  );
}

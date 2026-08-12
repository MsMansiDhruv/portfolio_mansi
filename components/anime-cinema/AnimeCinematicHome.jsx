"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useScrollProgress } from "@/components/cinema/scroll/useScrollProgress";
import AnimeVisual from "./AnimeVisual";
import AnimeOverlay from "./AnimeOverlay";
import AnimeNav from "./AnimeNav";
import AnimeFallback from "./AnimeFallback";
import StoryCursor from "@/components/world/StoryCursor";
import "@/styles/cinema-scroll.css";
import "@/styles/anime-cinema.css";
import "@/styles/mansi-world.css";

export default function AnimeCinematicHome() {
  const reduced = useReducedMotion();
  const trackRef = useRef(null);
  const progress = useScrollProgress(trackRef);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (reduced || mobile) {
    return <AnimeFallback />;
  }

  return (
    <div className="anime-cinema-root mansi-world story-page">
      <StoryCursor />
      <AnimeNav progress={progress} />

      <div ref={trackRef} className="anime-cinema-track">
        <div className="cinema-scroll-fixed">
          <AnimeVisual progress={progress} />
        </div>
      </div>

      <div className="cinema-vignette" aria-hidden />
      <div className="cinema-grain" aria-hidden />

      <div className="cinema-progress-rail" aria-hidden>
        <div className="cinema-progress-rail-fill" style={{ height: `${progress * 100}%` }} />
      </div>

      <AnimeOverlay progress={progress} />
    </div>
  );
}

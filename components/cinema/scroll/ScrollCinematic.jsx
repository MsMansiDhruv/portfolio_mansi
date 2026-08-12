"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import StoryFilm from "@/components/story/StoryFilm";
import OpeningScene from "@/components/story/OpeningScene";
import StoryJourney from "@/components/story/StoryJourney";
import SystemsScene from "@/components/story/SystemsScene";
import EpisodePreview from "@/components/story/EpisodePreview";
import VoicesScene from "@/components/story/VoicesScene";
import WorkshopScene from "@/components/story/WorkshopScene";
import { useScrollProgress } from "./useScrollProgress";
import ScrollNarrativeOverlay from "./ScrollNarrativeOverlay";
import ScrollCinematicVisual from "./ScrollCinematicVisual";
import "@/styles/cinema-scroll.css";

function ReducedMotionStory() {
  return (
    <StoryFilm mood="cool">
      <OpeningScene />
      <StoryJourney />
      <SystemsScene />
      <EpisodePreview limit={2} />
      <VoicesScene limit={2} />
      <WorkshopScene />
    </StoryFilm>
  );
}

export default function ScrollCinematic() {
  const reduced = useReducedMotion();
  const trackRef = useRef(null);
  const progress = useScrollProgress(trackRef);

  if (reduced) {
    return <ReducedMotionStory />;
  }

  return (
    <div className="cinema-scroll-root story-page">
      <div ref={trackRef} className="cinema-scroll-track">
        <div className="cinema-scroll-fixed">
          <ScrollCinematicVisual progress={progress} />
        </div>
      </div>

      <div className="cinema-vignette" aria-hidden />
      <div className="cinema-grain" aria-hidden />

      <div className="cinema-progress-rail" aria-hidden>
        <div className="cinema-progress-rail-fill" style={{ height: `${progress * 100}%` }} />
      </div>

      <ScrollNarrativeOverlay progress={progress} />
    </div>
  );
}

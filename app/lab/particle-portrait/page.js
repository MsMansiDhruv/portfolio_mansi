"use client";

import { useEffect } from "react";
import ParticlePortraitApp from "@/components/particle-portrait/ParticlePortraitApp";
import "@/styles/particle-portrait.css";

/**
 * Isolated visual test - particle portrait only.
 * No navigation, typography, panels, or site chrome.
 */
export default function ParticlePortraitPage() {
  useEffect(() => {
    document.documentElement.classList.add("pp-lab");
    return () => document.documentElement.classList.remove("pp-lab");
  }, []);

  return <ParticlePortraitApp />;
}

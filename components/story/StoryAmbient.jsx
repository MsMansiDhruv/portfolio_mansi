"use client";

export default function StoryAmbient({ mood = "cool" }) {
  const lightClass =
    mood === "warm"
      ? "story-light-warm"
      : mood === "morning"
        ? "story-light-morning"
        : mood === "present"
          ? "story-light-present"
          : "story-light-cool";

  return (
    <div className={`pointer-events-none fixed inset-0 z-0 ${lightClass}`} aria-hidden>
      <div className="story-grain" />
      <div className="story-vignette absolute inset-0" />
    </div>
  );
}

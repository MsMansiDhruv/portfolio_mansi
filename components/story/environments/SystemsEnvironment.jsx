"use client";

/** Subtle system nodes — engineering chapter */
export default function SystemsEnvironment({ className = "" }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-[0.1] ${className}`}
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <line x1="100" y1="300" x2="300" y2="200" stroke="var(--story-cyan)" strokeWidth="0.5" />
      <line x1="300" y1="200" x2="500" y2="280" stroke="var(--story-cyan)" strokeWidth="0.5" />
      <line x1="500" y1="280" x2="700" y2="220" stroke="var(--story-cyan)" strokeWidth="0.5" />
      <circle cx="100" cy="300" r="4" fill="var(--story-cyan)" opacity="0.4" />
      <circle cx="300" cy="200" r="4" fill="var(--story-cyan)" opacity="0.5" />
      <circle cx="500" cy="280" r="4" fill="var(--story-cyan)" opacity="0.5" />
      <circle cx="700" cy="220" r="4" fill="var(--story-cyan)" opacity="0.4" />
    </svg>
  );
}

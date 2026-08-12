"use client";

/** Quiet desk environment — late night, learning */
export default function DeskEnvironment({ className = "" }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] ${className}`}
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect x="120" y="380" width="560" height="8" fill="var(--story-indigo)" rx="1" />
      <rect x="200" y="320" width="280" height="160" fill="none" stroke="var(--story-cyan)" strokeWidth="0.75" opacity="0.5" />
      <line x1="240" y1="360" x2="440" y2="360" stroke="var(--story-cyan)" strokeWidth="0.5" opacity="0.35" />
      <line x1="240" y1="380" x2="400" y2="380" stroke="var(--story-cyan)" strokeWidth="0.5" opacity="0.25" />
      <rect x="480" y="340" width="48" height="64" fill="none" stroke="var(--story-grey)" strokeWidth="0.5" />
      <circle cx="504" cy="420" r="24" fill="var(--story-amber)" opacity="0.08" />
    </svg>
  );
}

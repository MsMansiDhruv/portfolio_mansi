"use client";

/**
 * Original cinematic silhouette — no photograph, no face.
 * Recognizable hair + posture; identity through composition, not likeness.
 */

const POSES = {
  standing: (
    <g>
      <path d="M48 28c0-8 6-14 14-14s14 6 14 14c0 4-1 7-3 10 2 1 4 4 4 8v6h-4v-6c0-2-1-4-3-5-2 1-5 1-8 0-2 1-3 3-3 5v6h-4v-6c0-4 2-7 4-8-2-3-3-6-3-10z" fill="currentColor" />
      <path d="M38 38c-2-12 4-22 14-24 8-2 16 2 20 10 2 4 2 10 0 14-6-4-14-6-22-4-4 1-8 3-12 4z" fill="currentColor" opacity="0.95" />
      <path d="M34 42c-8 2-12 10-10 18 1 4 4 8 8 10l-2 42h-6l-2-38c-6-2-10-8-10-16 0-10 8-18 18-18 2 0 4 0 6 2z" fill="currentColor" />
      <path d="M66 42c8 2 12 10 10 18-1 4-4 8-8 10l2 42h6l2-38c6-2 10-8 10-16 0-10-8-18-18-18-2 0-4 0-6 2z" fill="currentColor" />
      <path d="M44 118h16v58h-8v-50h-8v50h-8v-58h8z" fill="currentColor" />
    </g>
  ),
  walking: (
    <g transform="rotate(-4 50 90)">
      <path d="M48 28c0-8 6-14 14-14s14 6 14 14c0 4-1 7-3 10 2 1 4 4 4 8v6h-4v-6c0-2-1-4-3-5-2 1-5 1-8 0-2 1-3 3-3 5v6h-4v-6c0-4 2-7 4-8-2-3-3-6-3-10z" fill="currentColor" />
      <path d="M38 38c-2-12 4-22 14-24 8-2 16 2 20 10 2 4 2 10 0 14-6-4-14-6-22-4-4 1-8 3-12 4z" fill="currentColor" />
      <path d="M36 44c-6 0-12 6-12 14 0 6 4 12 10 14l-4 44h-6l2-40c-4-2-6-6-6-10 0-4 2-8 6-10 2-1 6-2 10-2z" fill="currentColor" />
      <path d="M64 44c6 2 10 8 10 16 0 4-2 8-6 10l4 40h6l-2-44c6-2 10-8 10-16 0-8-6-14-14-14-2 0-4 1-6 2z" fill="currentColor" />
      <path d="M42 118l6 58h-6l-4-50 8-8z M58 118l-6 58h6l4-50-8-8z" fill="currentColor" />
    </g>
  ),
  sitting: (
    <g transform="translate(0 24) scale(0.92)">
      <path d="M48 28c0-8 6-14 14-14s14 6 14 14c0 4-1 7-3 10 2 1 4 4 4 8v6h-4v-6c0-2-1-4-3-5-2 1-5 1-8 0-2 1-3 3-3 5v6h-4v-6c0-4 2-7 4-8-2-3-3-6-3-10z" fill="currentColor" />
      <path d="M38 38c-2-12 4-22 14-24 8-2 16 2 20 10 2 4 2 10 0 14-6-4-14-6-22-4-4 1-8 3-12 4z" fill="currentColor" />
      <path d="M34 48c-8 0-14 6-14 14v20h56V62c0-8-6-14-14-14H34z" fill="currentColor" />
      <path d="M30 82h40v8H30z" fill="currentColor" opacity="0.8" />
      <path d="M36 90v36h8V98h16v28h8V90H36z" fill="currentColor" />
    </g>
  ),
  back: (
    <g>
      <ellipse cx="50" cy="32" rx="16" ry="18" fill="currentColor" />
      <path d="M32 34c-4 8-4 18 0 28 2 6 6 10 10 12v88h-8V76c-4-2-8-8-8-16 0-12 2-22 6-26z" fill="currentColor" />
      <path d="M68 34c4 8 4 18 0 28-2 6-6 10-10 12v88h8V76c4-2 8-8 8-16 0-12-2-22-6-26z" fill="currentColor" />
      <path d="M38 38c0-14 6-24 12-28 6-4 14-4 20 0 6 4 12 14 12 28 0 8-4 16-10 20-8 6-16 8-24 8s-16-2-24-8c-6-4-10-12-10-20z" fill="currentColor" opacity="0.9" />
    </g>
  ),
};

export default function SilhouetteCharacter({
  pose = "standing",
  facing = "right",
  className = "",
  style,
  rim = "cyan",
}) {
  const flip = facing === "left" ? -1 : 1;
  const rimColor =
    rim === "gold"
      ? "rgba(201,169,98,0.35)"
      : rim === "warm"
        ? "rgba(232,228,220,0.25)"
        : "rgba(94,184,196,0.2)";

  return (
    <svg
      viewBox="0 0 100 180"
      className={`silhouette-character ${className}`}
      style={{
        filter: `drop-shadow(0 0 12px ${rimColor}) drop-shadow(0 -8px 24px ${rimColor})`,
        transform: `scaleX(${flip})`,
        ...style,
      }}
      aria-hidden
    >
      {POSES[pose] ?? POSES.standing}
    </svg>
  );
}

export function SilhouetteEmblem({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 4c2 0 4 1 5 3 1 2 1 4 0 6-1 1-2 2-3 2v9H8V15c-1 0-2-1-3-2-1-2-1-4 0-6 1-2 3-3 5-3z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

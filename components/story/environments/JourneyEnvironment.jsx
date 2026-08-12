"use client";

/** Road / journey line — career growth */
export default function JourneyEnvironment({ progress = 0, className = "" }) {
  const dash = 800 * (1 - progress);

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-[0.15] ${className}`}
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <path
        d="M 40 280 Q 200 240 400 260 T 760 220"
        fill="none"
        stroke="var(--story-ivory)"
        strokeWidth="1"
        strokeDasharray="800"
        strokeDashoffset={dash}
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      {[160, 320, 480, 640].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={260 - i * 8}
          r="3"
          fill="var(--story-cyan)"
          opacity={progress > (i + 1) * 0.18 ? 0.6 : 0.15}
        />
      ))}
    </svg>
  );
}

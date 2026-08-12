"use client";

/**
 * Recurring motif — a vermilion thread: spark → path → connections → constellation.
 */

export default function StoryMotif({ progress = 0, variant = "scroll", className = "" }) {
  const p = Math.max(0, Math.min(1, progress));

  if (variant === "ambient") {
    return (
      <svg
        className={`pointer-events-none absolute right-[8%] top-[20%] h-[40vh] w-[20vw] opacity-20 ${className}`}
        viewBox="0 0 200 400"
        aria-hidden
      >
        <path
          d="M 100 380 Q 120 300 80 220 T 100 40"
          fill="none"
          stroke="var(--mw-vermilion, #c45c5c)"
          strokeWidth="1"
          className="mansi-thread-glow"
        />
        <circle cx="100" cy="40" r="3" fill="var(--mw-vermilion, #c45c5c)" />
      </svg>
    );
  }

  const sparkOpacity = p < 0.08 ? 0.3 + p * 5 : 1;
  const pathLen = 600;
  const pathOffset = pathLen * (1 - Math.min(1, p * 1.4));

  const branchOpacity = Math.max(0, (p - 0.45) / 0.35);
  const constellationOpacity = Math.max(0, (p - 0.75) / 0.25);

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* Main thread — character's path */}
      <path
        d="M 120 720 Q 200 600 280 520 T 420 380 T 560 280 T 720 200 T 900 120 T 1050 80"
        fill="none"
        stroke="var(--mw-vermilion, #c45c5c)"
        strokeWidth={1 + p * 0.5}
        strokeOpacity={0.25 + p * 0.55}
        strokeDasharray={pathLen}
        strokeDashoffset={pathOffset}
        className="mansi-thread-glow"
      />

      {/* Spark at origin */}
      <circle
        cx="120"
        cy="720"
        r={2 + p * 3}
        fill="var(--mw-vermilion, #c45c5c)"
        opacity={sparkOpacity * (0.4 + p * 0.5)}
      />

      {/* Branches — connection */}
      <g opacity={branchOpacity * 0.6}>
        <path d="M 420 380 L 380 320" stroke="var(--mw-vermilion)" strokeWidth="0.75" fill="none" opacity="0.5" />
        <path d="M 560 280 L 620 240" stroke="var(--mw-vermilion)" strokeWidth="0.75" fill="none" opacity="0.5" />
        <path d="M 720 200 L 680 160" stroke="var(--mw-vermilion)" strokeWidth="0.75" fill="none" opacity="0.5" />
        <circle cx="380" cy="320" r="2" fill="var(--mw-vermilion)" />
        <circle cx="620" cy="240" r="2" fill="var(--mw-vermilion)" />
        <circle cx="680" cy="160" r="2" fill="var(--mw-vermilion)" />
      </g>

      {/* Constellation — end */}
      <g opacity={constellationOpacity * 0.7}>
        {[
          [900, 120],
          [950, 90],
          [980, 130],
          [1020, 70],
          [1050, 80],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.5" fill="var(--mw-amber, #c9a962)" opacity="0.8" />
        ))}
        <path
          d="M 900 120 L 950 90 L 980 130 L 1020 70 L 1050 80"
          fill="none"
          stroke="var(--mw-amber)"
          strokeWidth="0.5"
          opacity="0.4"
        />
      </g>
    </svg>
  );
}

"use client";

/** Custom exhibition glyphs — Quiet Instrument identity */
export default function InstallationGlyph({ type = "mark", className = "" }) {
  const common = {
    className,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.25",
    "aria-hidden": true,
  };

  if (type === "layers") {
    return (
      <svg {...common}>
        <path d="M6 20 L16 24 L26 20" />
        <path d="M6 15 L16 19 L26 15" />
        <path d="M6 10 L16 14 L26 10" />
      </svg>
    );
  }
  if (type === "fork") {
    return (
      <svg {...common}>
        <path d="M8 8 L8 14 L16 18 L16 26" />
        <path d="M24 8 L24 14 L16 18" />
      </svg>
    );
  }
  if (type === "sieve") {
    return (
      <svg {...common}>
        <circle cx="16" cy="14" r="8" />
        <path d="M12 22 L10 26 M16 23 L16 27 M20 22 L22 26" />
      </svg>
    );
  }
  if (type === "split") {
    return (
      <svg {...common}>
        <rect x="5" y="8" width="9" height="16" />
        <rect x="18" y="11" width="9" height="13" />
      </svg>
    );
  }
  if (type === "gauge") {
    return (
      <svg {...common}>
        <path d="M8 22 A10 10 0 0 1 24 22" />
        <path d="M16 22 L22 14" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="16" cy="16" r="9" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  );
}

// components/FlipCard.jsx
import { useState, useRef, useEffect } from "react";

export default function FlipCard({ frontTitle, frontSubtitle, backContent, isDay }) {
  const [flipped, setFlipped] = useState(false);
  const contentRef = useRef(null);
  const innerRef = useRef(null);
  const [maxH, setMaxH] = useState("0px");

  useEffect(() => {
    // compute a safe max-height for the back content (for smooth open transition)
    if (!contentRef.current) return;
    // measure height (including margin)
    const el = contentRef.current;
    // give a small grace when measured so animation doesn't clip
    const measured = el.scrollHeight + 24;
    setMaxH(`${measured}px`);
  }, [backContent]);

  // toggle flip
  function toggle(e) {
    e && e.preventDefault();
    setFlipped(f => !f);
  }

  // keyboard accessibility
  function onKey(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped(f => !f);
    }
  }

  // theme colors
  const accent = isDay ? "#0f766e" : "#2ec4b6";
  const bg = isDay ? "bg-white/80" : "bg-slate-900/60";
  const border = isDay ? "border-slate-200" : "border-slate-700";
  const titleColor = isDay ? "text-slate-900" : "text-slate-100";
  const subtitleColor = isDay ? "text-slate-600" : "text-slate-300";

  return (
    <div className={`relative rounded-xl p-4 border ${bg} ${border} shadow-sm transform transition-all duration-300`}
         style={{ perspective: 1200 }}>
      <div
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={onKey}
        className="relative overflow-hidden"
        aria-pressed={flipped}
        aria-expanded={flipped}
      >
        {/* Front side */}
        <div className={`pointer-events-none transition-transform duration-500 ease-in-out ${flipped ? "translate-y-0 opacity-0 scale-98" : "translate-y-0 opacity-100"}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className={`font-semibold ${titleColor}`}>{frontTitle}</h4>
              <p className={`mt-2 text-sm ${subtitleColor}`}>{frontSubtitle}</p>
            </div>

            <div className={`ml-2 h-9 w-9 rounded-md flex items-center justify-center`} style={{ background: isDay ? "rgba(15,118,110,0.08)" : "rgba(4,32,20,0.18)" }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: accent }} />
            </div>
          </div>
        </div>

        {/* Back side (collapsible area) */}
        <div
          ref={innerRef}
          className={`mt-3 transition-all duration-420 ease-in-out ${flipped ? "opacity-100" : "opacity-0"}`}
          style={{
            maxHeight: flipped ? maxH : 0,
            overflow: "hidden",
            willChange: "max-height, opacity, transform"
          }}
        >
          <div ref={contentRef} className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {backContent}
          </div>
        </div>
      </div>

      {/* subtle hover / focus affordance */}
      <style jsx>{`
        .shadow-sm { box-shadow: 0 4px 18px rgba(11,15,17,0.03); }
        div[role="button"]:hover { transform: translateY(-4px); }
      `}</style>
    </div>
  );
}

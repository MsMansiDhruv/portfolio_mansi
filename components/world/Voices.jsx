"use client";

import { useEffect, useState } from "react";
import { RECOMMENDATIONS } from "@/lib/data/recommendations";
import Marked from "./Marked";

const VOICES = RECOMMENDATIONS.filter((r) => r.text).slice(0, 4).map((r) => ({
  id: r.id,
  text: r.text.split("\n")[0].replace(/\s+/g, " ").trim(),
  name: r.name,
  role: [r.designation?.split("|")[0]?.trim(), r.company].filter(Boolean).join(" · "),
}));

export default function Voices() {
  const [i, setI] = useState(0);
  const voice = VOICES[i];

  useEffect(() => {
    if (VOICES.length < 2) return undefined;
    const id = window.setInterval(() => setI((n) => (n + 1) % VOICES.length), 9000);
    return () => window.clearInterval(id);
  }, []);

  if (!voice) return null;

  return (
    <div className="wd-voices">
      <p className="wd-voices__kicker">05 — What others experienced</p>
      <blockquote key={voice.id}>
        <p>
          “<Marked text={voice.text} />”
        </p>
        <footer>
          <cite>{voice.name}</cite>
          {voice.role ? <span>{voice.role}</span> : null}
        </footer>
      </blockquote>
      {VOICES.length > 1 ? (
        <div className="wd-voices__nav">
          {VOICES.map((item, n) => (
            <button
              key={item.id}
              type="button"
              className={n === i ? "is-on" : ""}
              aria-label={`Quote ${n + 1}`}
              onClick={() => setI(n)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

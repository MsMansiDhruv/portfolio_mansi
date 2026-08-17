"use client";

import { useEffect, useState } from "react";
import { EXPERIENCE_CHAMBERS } from "@/lib/data/mansi-experience";

function responseSections(data) {
  if (!Array.isArray(data?.sections)) return [];
  const seen = new Set();
  return data.sections.filter((section) => {
    if (!section?.heading && !section?.body && !section?.bullets?.length) return false;
    const key = `${section.heading || ""}|${section.body || ""}|${(section.bullets || []).join("|")}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const MODE_SHORT_LABELS = {
  ask: "ASK MANSI",
  architecture: "ARCHITECTURE",
  pipeline: "PIPELINE",
  sql: "SQL",
  cloud: "COST",
  interview: "INTERVIEW",
};

/** Homepage AI Lab: an in-world reasoning console, not a reduced chatbot. */
export default function AiModeSurface({ modeId, onClose, onModeChange, onBusyChange }) {
  const chamber = EXPERIENCE_CHAMBERS.find((item) => item.id === modeId);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!chamber) return null;

  const sections = responseSections(result);
  const fallbackText =
    result?.answer || result?.reply || result?.message || result?.content || result?.text || result?.summary || "";
  const responseText = result?.summary || fallbackText;

  useEffect(() => () => onBusyChange?.(false), [onBusyChange]);

  const send = async () => {
    const question = input.trim();
    if (!question || busy) return;
    setBusy(true);
    onBusyChange?.(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/ai-lab/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: chamber.id, question, density: "detailed", stream: false }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setResult(data);
    } catch (caught) {
      setError(caught?.message || "Something went wrong.");
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  };

  return (
    <aside className="wd-ai-surface" aria-label={`${chamber.label} reasoning console`}>
      <header className="wd-ai-surface__head">
        <div>
          <p className="wd-ai-surface__code">AI REASONING / {chamber.label}</p>
          <p className="wd-ai-surface__hint">{chamber.hint}</p>
        </div>
        <span className="wd-ai-surface__status"><i /> LIVE CONTEXT</span>
      </header>

      <div className="wd-ai-surface__modes" aria-label="Choose an AI Lab mode">
        {EXPERIENCE_CHAMBERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === chamber.id ? "is-active" : ""}
            onClick={() => onModeChange?.(item.id)}
          >
            {MODE_SHORT_LABELS[item.id] || item.label}
          </button>
        ))}
      </div>

      <div className="wd-ai-surface__signal" aria-hidden>
        <span>INPUT</span><i /><span>REASON</span><i /><span>GROUND</span><i /><span>ANSWER</span>
      </div>

      <div className="wd-ai-surface__composer">
        <textarea
          className="wd-ai-surface__input"
          rows={3}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
          placeholder="Ask a real system question…"
          disabled={busy}
        />
        <div className="wd-ai-surface__actions">
          <button type="button" onClick={send} disabled={busy || !input.trim()}>
            {busy ? "Resolving…" : "Submit"}
          </button>
          <button type="button" onClick={onClose}>Back to field</button>
        </div>
      </div>

      {error && <p className="wd-ai-surface__error">{error}</p>}
      {(sections.length > 0 || fallbackText) && (
        <div className="wd-ai-surface__response" aria-live="polite">
          {result?.title && <p className="wd-ai-surface__response-title">{result.title}</p>}
          {responseText && sections.length === 0 && <p className="wd-ai-surface__summary">{responseText}</p>}
          {sections.length > 0 ? (
            <div className="wd-ai-surface__sections">
              {sections.map((section, index) => (
                <section key={`${section.heading}-${index}`}>
                  {section.heading && <p>{String(index + 1).padStart(2, "0")} / {section.heading}</p>}
                  {section.body && <span>{section.body}</span>}
                  {Array.isArray(section.bullets) && section.bullets.length > 0 && (
                    <ul>{section.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}>{bullet}</li>)}</ul>
                  )}
                </section>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </aside>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  ask: "ASK",
  architecture: "ARCH",
  pipeline: "PIPE",
  sql: "SQL",
  cloud: "COST",
  interview: "INT",
};

/** Homepage AI Lab: an in-world reasoning console, not a reduced chatbot. */
export default function AiModeSurface({ modeId, onClose, onModeChange, onBusyChange }) {
  const chamber = EXPERIENCE_CHAMBERS.find((item) => item.id === modeId);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const swipe = useRef({ y: 0, active: false });

  const requestClose = useCallback(() => {
    if (typeof window !== "undefined" && window.history.state?.wdAi) {
      window.history.back();
      return;
    }
    onClose?.();
  }, [onClose]);

  useEffect(() => () => onBusyChange?.(false), [onBusyChange]);

  useEffect(() => {
    window.history.pushState({ wdAi: true }, "");
    const onPop = () => {
      onClose?.();
    };
    const onKey = (event) => {
      if (event.key === "Escape") requestClose();
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, requestClose]);

  if (!chamber) return null;

  const sections = responseSections(result);
  const fallbackText =
    result?.answer || result?.reply || result?.message || result?.content || result?.text || result?.summary || "";
  const responseText = result?.summary || fallbackText;

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

  const onHandleStart = (event) => {
    const point = event.touches?.[0];
    if (!point) return;
    swipe.current = { y: point.clientY, active: true };
  };

  const onHandleMove = (event) => {
    if (!swipe.current.active) return;
    const point = event.touches?.[0];
    if (!point) return;
    if (point.clientY - swipe.current.y > 72) {
      swipe.current.active = false;
      requestClose();
    }
  };

  return (
    <div className="wd-ai-layer">
      <button type="button" className="wd-ai-scrim" aria-label="Close Ask Mansi" onClick={requestClose} />
      <aside
        className="wd-ai-surface"
        aria-label={`${chamber.label} reasoning console`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="wd-ai-surface__grab"
          onTouchStart={onHandleStart}
          onTouchMove={onHandleMove}
          aria-hidden
        />
        <header className="wd-ai-surface__head">
          <button type="button" className="wd-ai-surface__back" onClick={requestClose} aria-label="Back">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.5 5.5 8.5 12l7 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="wd-ai-surface__titles">
            <p className="wd-ai-surface__code">AI LAB</p>
            <p className="wd-ai-surface__hint">{chamber.hint}</p>
          </div>
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

        <div className="wd-ai-surface__composer">
          <textarea
            className="wd-ai-surface__input"
            rows={3}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && event.nativeEvent?.isComposing !== true) {
                event.preventDefault();
                send();
              }
            }}
            placeholder="Ask a real system question…"
            disabled={busy}
            enterKeyHint="send"
          />
          <div className="wd-ai-surface__actions">
            <button type="button" className="wd-ai-surface__send" onClick={send} disabled={busy || !input.trim()}>
              {busy ? "…" : "Send"}
            </button>
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
    </div>
  );
}

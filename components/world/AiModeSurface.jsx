"use client";

import { useState } from "react";
import { EXPERIENCE_CHAMBERS } from "@/lib/data/mansi-experience";

/**
 * Prompt surface that emerges from the semantic field — stays in-world.
 */
export default function AiModeSurface({ modeId, onClose }) {
  const chamber = EXPERIENCE_CHAMBERS.find((c) => c.id === modeId);
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!chamber) return null;

  const send = async () => {
    const q = input.trim();
    if (!q || busy) return;
    setBusy(true);
    setError("");
    setReply("");
    try {
      const res = await fetch("/api/ai-lab/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: chamber.id, question: q, density: "concise" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setReply(
        data?.answer || data?.reply || data?.message || data?.content || "No response."
      );
    } catch (e) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className="wd-ai-surface" aria-label={chamber.label}>
      <p className="wd-ai-surface__code">{chamber.label}</p>
      <p className="wd-ai-surface__hint">{chamber.hint}</p>
      <textarea
        className="wd-ai-surface__input"
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask from inside the field…"
        disabled={busy}
      />
      <div className="wd-ai-surface__actions">
        <button type="button" onClick={send} disabled={busy || !input.trim()}>
          {busy ? "Thinking…" : "Send"}
        </button>
        <button type="button" onClick={onClose}>
          Return to field
        </button>
      </div>
      {error && <p className="wd-ai-surface__error">{error}</p>}
      {reply && <div className="wd-ai-surface__reply">{reply}</div>}
    </aside>
  );
}

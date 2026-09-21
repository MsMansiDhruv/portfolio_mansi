"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "lenis/react";
import {
  Cloud,
  Cpu,
  Database,
  GitBranch,
  MessageSquare,
  ShieldCheck,
  Workflow,
  X,
} from "lucide-react";
import Marked from "./Marked";
import LatticeLoader from "./LatticeLoader";
import { useGsapPress } from "./useGsapPress";
import { useGsapRise } from "./useGsapRise";

const STARTERS = {
  ask: ["What makes a data system good?", "When is complexity justified?"],
  architecture: ["How do you split OLTP from OLAP?", "Where do you put the contract?"],
  pipeline: ["What happens when ingest lies?", "How do you replay a day?"],
  sql: ["What do you optimize first?", "When is a join the wrong fix?"],
};

const LOCAL = {
  ask: "It should make the next decision easier. Architecture earns every extra moving part.",
  architecture: "Start from the path the data actually takes. Separate workloads when one engine is lying about cost.",
  pipeline: "Ingest, trust, transform, serve. If the contract is wrong at ingest, every dashboard is theatre.",
  sql: "Correctness first. Then the join path. Speed without trust is noise.",
};

const LANES = [
  {
    id: "ask",
    Icon: MessageSquare,
    label: "Ask",
    short: "Ask",
    line: "General questions",
    station: "console",
  },
  {
    id: "architecture",
    Icon: GitBranch,
    label: "Architecture",
    short: "Arch",
    line: "System design & trade-offs",
    station: "contract",
  },
  {
    id: "pipeline",
    Icon: Workflow,
    label: "Pipeline",
    short: "Pipe",
    line: "ETL, orchestration, data flow",
    station: "spark",
  },
  {
    id: "sql",
    Icon: Database,
    label: "SQL",
    short: "SQL",
    line: "Data modeling & optimization",
    station: "serve",
  },
];

const STATIONS = [
  { id: "land", Icon: Cloud, label: "Land", tech: "S3 · CDC · files", hint: "named once" },
  { id: "contract", Icon: ShieldCheck, label: "Contract", tech: "schema · PII", hint: "fail loud" },
  { id: "spark", Icon: Cpu, label: "Spark", tech: "Databricks · PySpark", hint: "replay a day" },
  { id: "serve", Icon: Database, label: "Serve", tech: "SQL · Delta", hint: "defend the grain" },
  { id: "console", Icon: MessageSquare, label: "Console", tech: "this lane", hint: "ask here" },
];

function replyText(data) {
  if (!data) return "";
  if (typeof data.summary === "string" && data.summary.trim()) return data.summary;
  if (typeof data.answer === "string") return data.answer;
  if (data.sections?.[0]?.body) return data.sections[0].body;
  return data.error || "";
}

const MODE_TO_STATION = {
  ask: "console",
  architecture: "contract",
  pipeline: "spark",
  sql: "serve",
};

export default function AskMansi() {
  const rootRef = useRef(null);
  const fieldRef = useRef(null);
  const listRef = useRef(null);
  const lenis = useLenis();
  useGsapPress(rootRef);
  useGsapRise(rootRef);
  const [mode, setMode] = useState("ask");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [think, setThink] = useState("working");
  const [locked, setLocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lines, setLines] = useState([
    { who: "ai", text: "The pipe ends here. Pick a lane, then ask like a design review." },
  ]);

  const station = MODE_TO_STATION[mode] || "console";
  const active = LANES.find((item) => item.id === mode);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return undefined;

    const sync = () => {
      const nested = el.scrollHeight > el.clientHeight + 4;
      if (nested) el.setAttribute("data-lenis-prevent", "");
      else el.removeAttribute("data-lenis-prevent");
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [lines, busy]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const nodes = [...root.querySelectorAll("[data-rise]")];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        });
      },
      { threshold: 0, rootMargin: "80px 0px 80px 0px" }
    );
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!locked) return undefined;
    const html = document.documentElement;
    html.classList.add("wd-ai-lock");
    lenis?.stop();
    const onKey = (event) => {
      if (event.key === "Escape") setLocked(false);
    };
    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => {
      document.getElementById("wd-ask-input")?.focus();
    }, 30);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
      html.classList.remove("wd-ai-lock");
      lenis?.start();
      lenis?.resize?.();
      window.requestAnimationFrame(() => {
        const ask = document.getElementById("ask");
        if (ask && lenis) lenis.scrollTo(ask, { offset: -80, immediate: true });
        window.dispatchEvent(new Event("resize"));
      });
    };
  }, [locked, lenis]);

  const closeChat = () => setLocked(false);

  const onMove = (event) => {
    const box = fieldRef.current?.getBoundingClientRect();
    if (!box) return;
    const nx = (event.clientX - box.left) / box.width;
    const ny = (event.clientY - box.top) / box.height;
    fieldRef.current.style.setProperty("--mx", `${(nx * 100).toFixed(1)}%`);
    fieldRef.current.style.setProperty("--my", `${(ny * 100).toFixed(1)}%`);
  };

  const push = (who, text) => {
    setLines((prev) => [...prev, { who, text }]);
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const setLane = (id) => {
    if (mode === id) return;
    const lane = LANES.find((item) => item.id === id);
    setMode(id);
    if (lane) {
      setLines([{ who: "ai", text: `${lane.label} lane. ${lane.line}` }]);
    }
  };

  const send = async (preset) => {
    const question = String(preset || input).trim();
    if (!question || busy) return;
    setInput("");
    push("you", question);
    setThink("working");
    setBusy(true);
    try {
      const res = await fetch("/api/ai-lab/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, question, density: "concise", stream: false }),
      });
      const data = await res.json().catch(() => ({}));
      push("ai", replyText(data) || LOCAL[mode] || LOCAL.ask);
      setThink("done");
    } catch {
      push("ai", LOCAL[mode] || LOCAL.ask);
      setThink("error");
    } finally {
      window.setTimeout(() => setBusy(false), 900);
    }
  };

  const chatFrame = (
    <div className="wd-im__frame">
      <aside className="wd-im__people" role="tablist" aria-label="Ask lanes">
        {LANES.map((item) => {
          const Icon = item.Icon;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              aria-label={item.label}
              className={mode === item.id ? "is-on" : ""}
              onClick={() => setLane(item.id)}
            >
              <span className="wd-im__face" aria-hidden>
                <Icon strokeWidth={1.6} />
              </span>
              <span>
                <strong className="wd-im__lane" data-short={item.short}>{item.label}</strong>
                <em>{item.line}</em>
              </span>
            </button>
          );
        })}
      </aside>

      <div
        ref={fieldRef}
        className={`wd-ask__shell wd-im__stage${busy ? " is-busy" : ""}`}
        onMouseMove={onMove}
      >
        <header className="wd-im__status">
          <img src="/lab/mansi-face.png" alt="" />
          <div>
            <strong>Mansi</strong>
            <span>{busy ? "typing…" : `online · ${active?.label || "Ask"}`}</span>
          </div>
          {locked ? (
            <button type="button" className="wd-ask__cancel" onClick={closeChat}>
              <X size={16} strokeWidth={2} aria-hidden />
              Cancel
            </button>
          ) : null}
        </header>
        <div className="wd-ask__thread wd-im__thread" ref={listRef}>
          {lines.map((line, n) => (
            <div key={`${line.who}-${n}`} className={`wd-ask__bubble wd-ask__bubble--${line.who}`}>
              {line.who === "ai" ? <img src="/lab/mansi-face.png" alt="" /> : <span className="wd-im__you">You</span>}
              <div>
                <span>{line.who === "you" ? "You" : "Mansi"}</span>
                <p>{line.who === "ai" ? <Marked text={line.text} /> : line.text}</p>
              </div>
            </div>
          ))}
          {busy ? (
            <div className="wd-ask__bubble wd-ask__bubble--ai">
              <img src="/lab/mansi-face.png" alt="" />
              <div>
                <span>Mansi</span>
                <LatticeLoader
                  status={think}
                  label="Thinking"
                  doneLabel="Done in"
                  errorLabel="Failed after"
                  pattern="orbit"
                  grid={3}
                  shape="round"
                  color="var(--wd-accent)"
                  doneColor="#1cd6ac"
                  errorColor="#f97316"
                  cellSize={6}
                  gap={2}
                  fontSize={14}
                  step={90}
                  idleOpacity={0.18}
                  glow={false}
                  glowColor="var(--wd-accent)"
                  showTimer
                />
              </div>
            </div>
          ) : null}
        </div>
        <form
          className="wd-ask__bar"
          data-lenis-prevent
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <label className="wd-ask__os" htmlFor="wd-ask-input">
            Ask Mansi
          </label>
          <textarea
            id="wd-ask-input"
            rows={2}
            value={input}
            placeholder="Ask your question…"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
          />
          <div className="wd-ask__bar-row">
            <div className="wd-ask__chips">
              {STARTERS[mode].map((item) => (
                <button key={item} type="button" onClick={() => send(item)}>
                  {item.replace(/\?$/, "")}
                </button>
              ))}
            </div>
            <button type="submit" className="wd-ask__send" data-gsap-btn disabled={busy || !input.trim()}>
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className={`wd-ask wd-im${locked ? " is-locked" : ""}`} ref={rootRef} data-busy={busy ? "on" : "off"} data-mode={mode} data-station={station}>
      <header className="wd-im__head">
        <div>
          <p className="wd-ask__kicker" data-rise-text>Ask</p>
          <h2 data-rise-text>Explore my experience through a conversation.</h2>
          <p className="wd-ask__lead" data-rise-text>Talk with a model trained on this portfolio.</p>
        </div>
        <p className="wd-ask__powered" data-rise-text>Powered by AI · Trained on my portfolio</p>
      </header>

      <ol className="wd-pipe wd-pipe--slim" aria-label="Data pipeline">
        {STATIONS.map((item, i) => {
          const Icon = item.Icon;
          const on = item.id === station;
          return (
            <li key={item.id} className={on ? "is-on" : ""}>
              {i > 0 ? (
                <span className="wd-pipe__track" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  const map = { land: "pipeline", contract: "architecture", spark: "pipeline", serve: "sql", console: "ask" };
                  setLane(map[item.id] || "ask");
                }}
              >
                <span className="wd-pipe__icon">
                  <Icon strokeWidth={1.7} aria-hidden />
                </span>
                <strong>{item.label}</strong>
              </button>
            </li>
          );
        })}
      </ol>

      {chatFrame}
      {locked && mounted
        ? createPortal(
            <button type="button" className="wd-ask-overlay__scrim" aria-label="Close chat" onClick={closeChat} />,
            document.body
          )
        : null}
    </div>
  );
}

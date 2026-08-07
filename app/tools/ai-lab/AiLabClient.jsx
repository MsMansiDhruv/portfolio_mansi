"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Cloud,
  Code2,
  Copy,
  Cpu,
  Database,
  Gauge,
  GitBranch,
  Lock,
  MessageSquareText,
  Mic,
  MoonStar,
  Play,
  Search,
  ServerCog,
  Sparkles,
  TerminalSquare,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Metric, MetricGrid, Pipeline } from "@/components/design-system-v2";
import { cn } from "@/lib/cn";
import { formatResponseSections, generateResponse } from "./engine";

const MODES = [
  {
    id: "architecture",
    label: "Architecture Expert",
    shortLabel: "Architecture",
    icon: ServerCog,
    accent: "teal",
    welcome: "Designing scalable data platforms, one decision at a time.",
    placeholder: "Design a data platform for retail.",
    examples: ["Design a data platform for retail.", "Review Kafka → Spark → S3", "Lakehouse vs warehouse", "Streaming architecture for IoT."],
  },
  {
    id: "pipeline",
    label: "Pipeline Reviewer",
    shortLabel: "Pipeline",
    icon: GitBranch,
    accent: "slate",
    welcome: "Paste the architecture and I’ll review reliability, scale, and cost.",
    placeholder: "Paste an architecture or pipeline description.",
    examples: ["Review Kafka → Spark → S3 → Power BI", "Find reliability gaps in this chain.", "Where should data quality happen?"],
  },
  {
    id: "sql",
    label: "SQL Optimizer",
    shortLabel: "SQL",
    icon: TerminalSquare,
    accent: "emerald",
    welcome: "I’ll optimize SQL for readability, performance, and execution cost.",
    placeholder: "Paste SQL here.",
    examples: ["Optimize this query with 4 joins.", "Why is this join slow?", "Rewrite this SQL for less scan."],
  },
  {
    id: "interview",
    label: "Interview Coach",
    shortLabel: "Interview",
    icon: Mic,
    accent: "violet",
    welcome: "Practice system design, leadership, and behavioral answers with targeted feedback.",
    placeholder: "Ask an interview question.",
    examples: ["Tell me about a difficult technical decision.", "Tell me about a production incident.", "Why should we hire you?"],
  },
  {
    id: "ask",
    label: "Ask Mansi",
    shortLabel: "Mansi",
    icon: MessageSquareText,
    accent: "amber",
    welcome: "Ask about my work, philosophy, and the kinds of systems I like to build.",
    placeholder: "Ask about projects, mentoring, Databricks, or architecture.",
    examples: ["What projects has Mansi worked on?", "What architecture decisions have you made?", "How do you mentor engineers?"],
  },
  {
    id: "cloud",
    label: "Cloud Cost Advisor",
    shortLabel: "Cost",
    icon: Cloud,
    accent: "sky",
    welcome: "Estimate the drivers behind cloud cost and identify practical savings.",
    placeholder: "Describe an architecture or cost concern.",
    examples: ["My AWS bill is high in SageMaker.", "Optimize SageMaker costs.", "Reduce Databricks spend."],
  },
];

const INSPECTOR = {
  architecture: {
    title: "Reference Architectures",
    bullets: ["Lakehouse layers", "Streaming fan-out", "Governance checkpoints", "Serving layer patterns"],
  },
  pipeline: {
    title: "Review Checklist",
    bullets: ["Failure domains", "Backfill strategy", "Observability", "SLA / freshness", "Recovery playbook"],
  },
  sql: {
    title: "Optimization Tips",
    bullets: ["Filter early", "Reduce shuffles", "Avoid SELECT *", "Pre-aggregate when possible"],
  },
  interview: {
    title: "Evaluation Rubric",
    bullets: ["Clarity", "Trade-off awareness", "Business context", "Ownership", "Communication"],
  },
  ask: {
    title: "Quick Facts",
    bullets: ["Enterprise analytics", "Automation first", "Scalable foundations", "Business impact"],
  },
  cloud: {
    title: "Cost Checklist",
    bullets: ["Compute hours", "Storage tiering", "Orchestration overhead", "Data egress", "Idle clusters"],
  },
};

const PROMPT_TEMPLATES = {
  architecture: ["Design a data platform for retail.", "Review Kafka → Spark → S3", "Lakehouse vs warehouse", "Streaming architecture for IoT."],
  pipeline: ["Review Kafka → Spark → S3 → Power BI", "Find reliability gaps", "Where should data quality happen?"],
  sql: ["Optimize this query", "Why is this join slow?", "Rewrite this SQL"],
  interview: ["Tell me about a difficult technical decision.", "Tell me about a production incident.", "Why should we hire you?"],
  ask: ["What projects has Mansi worked on?", "Tell me about the AMC Datalake project.", "How do you mentor engineers?"],
  cloud: ["My AWS bill is high in SageMaker.", "Optimize SageMaker costs.", "Reduce Databricks spend."],
};

const ARCHITECTURE_STEPS = [
  "Sources",
  "Kafka",
  "Databricks",
  "Delta",
  "Gold Layer",
  "Power BI",
];

function MobileCollapsible({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-800 dark:text-slate-100"
      >
        <span>{title}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-500 transition", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-200 px-4 py-3 dark:border-slate-800"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function useCountUp(target, duration = 1100, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      setValue(Number((target * (1 - Math.pow(1 - progress, 3))).toFixed(decimals)));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target, duration, decimals]);
  return value;
}

function useStreaming(message, active) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) return undefined;
    let index = 0;
    setText("");
    const timer = window.setInterval(() => {
      index += 1;
      setText(message.slice(0, index));
      if (index >= message.length) window.clearInterval(timer);
    }, 14);
    return () => window.clearInterval(timer);
  }, [message, active]);
  return text;
}

function ModeIcon({ mode }) {
  const Icon = mode.icon;
  return <Icon className="h-4 w-4" />;
}

function CodeBlock({ code, language = "text", collapsed = false }) {
  const [open, setOpen] = useState(!collapsed);
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-950 text-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{language}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen((state) => !state)} className="rounded-lg px-2 py-1 text-xs text-slate-300 hover:bg-slate-900">
            {open ? "Collapse" : "Expand"}
          </button>
          <button onClick={handleCopy} className="rounded-lg px-2 py-1 text-xs text-slate-300 hover:bg-slate-900">
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.pre
            key="code"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-x-auto overflow-y-hidden p-4 text-sm leading-6"
          >
            <code className="whitespace-pre">{code}</code>
          </motion.pre>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ConversationMessage({ role, children, streaming = false }) {
  return (
    <div className={cn("flex gap-3", role === "user" ? "justify-end" : "justify-start")}>
      {role === "assistant" ? (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950">
          <Bot className="h-4 w-4" />
        </div>
      ) : null}
      <div className={cn("min-w-0 max-w-full rounded-3xl border px-4 py-3 sm:max-w-[80%]", role === "user" ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900")}>
        {children}
        {streaming ? <span className="ml-1 inline-block h-4 w-1 animate-pulse rounded bg-current align-middle" /> : null}
      </div>
      {role === "user" ? <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800" /> : null}
    </div>
  );
}

function ArchitectureDiagram({ active = 0 }) {
  return (
    <div className="space-y-3">
      {ARCHITECTURE_STEPS.map((step, index) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.04 }}
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm",
            index <= active ? "border-teal-200 bg-teal-50 text-slate-950 dark:border-teal-900 dark:bg-teal-950/40 dark:text-white" : "border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
          )}
        >
          {step}
          {index < ARCHITECTURE_STEPS.length - 1 ? <div className="mt-2 text-center text-slate-400">↓</div> : null}
        </motion.div>
      ))}
    </div>
  );
}

export default function AiLabPage() {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState(MODES[0].id);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [history, setHistory] = useState([]);
  const [modePromptIndex, setModePromptIndex] = useState(0);
  const [detailLevel, setDetailLevel] = useState("concise");
  const viewportRef = useRef(null);

  const currentMode = MODES.find((item) => item.id === mode) ?? MODES[0];
  const inspector = INSPECTOR[mode];
  const samples = PROMPT_TEMPLATES[mode];

  const latestAssistantMessage = [...messages].reverse().find((message) => message.role === "assistant");
  const animatedStreaming = useStreaming(streamingText, isStreaming && !reducedMotion);
  const streamingPreview = isStreaming ? animatedStreaming : latestAssistantMessage?.content;

  useEffect(() => {
    setMessages([]);
    setInput("");
    setSelectedPrompt(null);
    setModePromptIndex(0);
  }, [mode]);

  useEffect(() => {
    if (!history.length) return undefined;
    const last = history[0];
    setSelectedPrompt(last.prompt);
  }, [history]);

  const conversationRef = useRef({ recentQuestions: [], recentSubjects: [], currentEntities: [] });

  const submitPrompt = (promptText, followUpContext) => {
    const prompt = promptText.trim();
    if (!prompt) return;
    const response = generateResponse(mode, prompt, {
      conversation: conversationRef.current,
      followUp: followUpContext,
      density: detailLevel,
    });
    if (response.conversationState) {
      conversationRef.current = response.conversationState;
    }
    const assistantMessage = buildAssistantMessage(mode, prompt, response);

    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, role: "user", type: "text", content: prompt },
      { id: `${Date.now()}-assistant`, role: "assistant", type: "structured", content: assistantMessage },
    ]);
    setHistory((current) => [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, prompt }, ...current].slice(0, 8));
    setIsStreaming(true);
    setStreamingText(assistantMessage.summary || "Thinking through this…");
    window.setTimeout(() => setIsStreaming(false), 650);
    setInput("");
  };

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[90rem] min-w-0 flex-col px-5 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Link href="/" className="text-xs font-medium text-teal-700 hover:underline dark:text-teal-400">
              ← Portfolio
            </Link>
            <p className="mt-2 text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">AI Engineering Lab</p>
            <h1 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">Engineering workspace</h1>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              6 agents · Context-aware · Knowledge-grounded
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 text-sm text-slate-500 dark:text-slate-400 md:flex">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Knowledge-grounded reasoning
          </div>
        </div>

        <div className="-mx-1 overflow-x-auto pb-2 lg:hidden">
          <div className="flex min-w-min gap-2 px-1">
            {MODES.map((item) => {
              const selected = item.id === mode;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={cn(
                    "inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                    selected
                      ? "border-teal-600 bg-teal-600 text-white dark:border-teal-500 dark:bg-teal-600"
                      : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  )}
                >
                  <ModeIcon mode={item} />
                  {item.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)_minmax(220px,260px)]">
          <aside className="hidden min-w-0 lg:block lg:max-h-[calc(100dvh-9rem)] lg:overflow-y-auto rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Modes</p>
                <h2 className="mt-2 text-lg font-semibold">AI Modes</h2>
              </div>
              <MoonStar className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-4 space-y-2">
              {MODES.map((item, index) => {
                const selected = item.id === mode;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all",
                      selected
                        ? "border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/40"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                    )}
                  >
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", selected ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300")}>
                      <ModeIcon mode={item} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="truncate text-xs text-slate-500 dark:text-slate-400">{item.placeholder}</div>
                    </div>
                    {selected ? <ChevronRight className="h-4 w-4 text-teal-600 dark:text-teal-400" /> : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Examples</p>
              <div className="mt-3 space-y-2">
                {samples.map((sample, index) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setInput(sample);
                      setSelectedPrompt(sample);
                      setModePromptIndex(index);
                    }}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-2xl border px-3 py-2 text-left text-sm transition",
                      selectedPrompt === sample
                        ? "border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/40"
                        : "border-transparent bg-white hover:border-slate-200 dark:bg-slate-900 dark:hover:border-slate-800"
                    )}
                  >
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                    <span className="min-w-0 break-words">{sample}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex min-h-0 min-w-0 flex-col gap-4">
          <section className="flex min-h-[min(640px,calc(100dvh-11rem))] min-w-0 w-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:min-h-[min(720px,calc(100dvh-10rem))]">
            <div className="shrink-0 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    {currentMode.label}
                  </p>
                  <div className="inline-flex shrink-0 rounded-full border border-slate-200 bg-slate-50 p-0.5 text-xs dark:border-slate-800 dark:bg-slate-950">
                    <button
                      type="button"
                      onClick={() => setDetailLevel("concise")}
                      className={cn(
                        "min-h-[36px] rounded-full px-3 py-1",
                        detailLevel === "concise" ? "bg-white shadow-sm dark:bg-slate-900" : "text-slate-500"
                      )}
                    >
                      Concise
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailLevel("detailed")}
                      className={cn(
                        "min-h-[36px] rounded-full px-3 py-1",
                        detailLevel === "detailed" ? "bg-white shadow-sm dark:bg-slate-900" : "text-slate-500"
                      )}
                    >
                      Detailed
                    </button>
                  </div>
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {currentMode.welcome}
                </p>
              </div>
            </div>

            <div ref={viewportRef} className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 sm:px-6">
              <div className="w-full min-w-0">
              <AnimatePresence initial={false}>
                {messages.map((message) => {
                  const isLatestAssistant = message.role === "assistant" && latestAssistantMessage?.id === message.id;
                  const showThinking = isStreaming && isLatestAssistant;

                  if (message.role === "assistant" && message.type === "structured") {
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="mb-4 min-w-0"
                      >
                        <ConversationMessage role="assistant" streaming={showThinking}>
                          {showThinking ? (
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{streamingPreview}</p>
                          ) : (
                            <StructuredResponse mode={mode} data={message.content} onFollowUp={(item) => submitPrompt(item.label || item, item)} />
                          )}
                        </ConversationMessage>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="mb-4 min-w-0"
                    >
                      <ConversationMessage role={message.role}>{message.content}</ConversationMessage>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {messages.length === 0 ? (
                <EmptyState currentMode={currentMode} onUseSample={(sample) => setInput(sample)} onRunSample={submitPrompt} />
              ) : null}
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-slate-800">
              <div className="mb-3 hidden flex-wrap gap-2 sm:flex">
                {history.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setInput(item.prompt)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    {item.prompt}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  submitPrompt(input);
                }}
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
              >
                <div className="min-w-0 flex-1 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={currentMode.placeholder}
                    rows={2}
                    className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Future API ready</span>
                    <span>Shift+Enter for newline</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="inline-flex min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-full bg-teal-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:bg-teal-600 dark:hover:bg-teal-500"
                >
                  Send
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </section>

          <div className="space-y-3 lg:hidden">
            <MobileCollapsible title="Try an example">
              <div className="space-y-2">
                {samples.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => submitPrompt(sample)}
                    className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  >
                    <span className="min-w-0 break-words">{sample}</span>
                    <Play className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                  </button>
                ))}
              </div>
            </MobileCollapsible>
            <MobileCollapsible title="History">
              {history.length ? (
                <div className="space-y-2">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setInput(item.prompt)}
                      className="block w-full rounded-xl bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-300"
                    >
                      {item.prompt}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Prompt history will appear here.</p>
              )}
            </MobileCollapsible>
            <MobileCollapsible title={inspector.title}>
              <div className="space-y-2">
                {inspector.bullets.map((item) => (
                  <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </MobileCollapsible>
          </div>
          </div>

          <aside className="hidden min-w-0 lg:block lg:max-h-[calc(100dvh-9rem)] lg:overflow-y-auto rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{inspector.title}</p>
            <div className="mt-4 space-y-2">
              {inspector.bullets.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Helpful examples</p>
              <div className="mt-3 space-y-2">
                {samples.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => submitPrompt(sample)}
                    className="flex w-full items-center justify-between gap-2 rounded-2xl border border-transparent bg-white px-3 py-2 text-left text-sm transition hover:border-slate-200 dark:bg-slate-900 dark:hover:border-slate-800"
                  >
                    <span className="min-w-0 flex-1 break-words">{sample}</span>
                    <Play className="h-4 w-4 shrink-0 text-teal-500" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">History</p>
              <div className="mt-3 space-y-2">
                {history.length ? (
                  history.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setInput(item.prompt)}
                      className="block w-full rounded-2xl bg-white px-3 py-2 text-left text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    >
                      {item.prompt}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Prompt history will appear here.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function buildAssistantMessage(mode, prompt, response) {
  return {
    mode,
    intent: response.intent || response.primaryIntent,
    title: response.title || "Response",
    summary: response.summary,
    density: response.density || "concise",
    sections: formatResponseSections(response),
    followUps: response.followUps || [],
    sources: response.sources,
    code: response.code,
  };
}

function StructuredResponse({ mode, data, onFollowUp }) {
  const [showDetail, setShowDetail] = useState(false);
  const primary = (data.sections || []).filter((s) => s.tier !== "detail");
  const detail = (data.sections || []).filter((s) => s.tier === "detail");
  const visible = showDetail ? data.sections : primary.length ? primary : data.sections;
  const compact = (data.sections || []).length <= 4;

  return (
    <div className="min-w-0 space-y-3 break-words">
      <div className="text-base font-semibold text-slate-950 dark:text-white">{data.title}</div>
      {data.summary ? <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{data.summary}</p> : null}
      {data.code ? <CodeBlock language="sql" code={data.code} /> : null}
      <div className={cn("space-y-2", compact ? "" : "space-y-2")}>
        {visible.map((section, index) => (
          <SectionBlock key={`${section.heading}-${index}`} section={section} compact={compact} />
        ))}
      </div>
      {!showDetail && detail.length ? (
        <button
          type="button"
          onClick={() => setShowDetail(true)}
          className="text-sm font-medium text-teal-700 hover:text-teal-600 dark:text-teal-400"
        >
          Show deeper analysis ({detail.length} sections)
        </button>
      ) : null}
      {data.followUps?.length ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Would you like</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.followUps.map((item) => {
              const label = typeof item === "string" ? item : item.label;
              const payload = typeof item === "string" ? { label: item } : item;
              return (
                <button
                  key={`${label}-${payload.targetAction || ""}-${payload.targetSubject || ""}`}
                  type="button"
                  onClick={() => onFollowUp?.(payload)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SectionBlock({ section, compact }) {
  const [open, setOpen] = useState(section.tier !== "detail");
  const collapsible = section.tier === "detail";

  if (compact && !section.bullets?.length && section.body) {
    return <p className="break-words text-sm leading-relaxed text-slate-700 dark:text-slate-300">{section.body}</p>;
  }

  const body = (
    <>
      {section.body ? <p className="mt-1 break-words text-sm leading-relaxed text-slate-700 dark:text-slate-300">{section.body}</p> : null}
      {section.bullets?.length ? (
        <ul className="mt-1.5 space-y-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {section.bullets.map((bullet, bulletIndex) => (
            <li key={`${section.heading}-${bulletIndex}`} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              <span className="min-w-0 break-words">{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );

  if (collapsible) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80">
        <button
          type="button"
          onClick={() => setOpen((state) => !state)}
          className="flex min-h-[44px] w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{section.heading}</p>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition", open && "rotate-180")} />
        </button>
        {open ? <div className="border-t border-slate-200/80 px-3 pb-2.5 dark:border-slate-800">{body}</div> : null}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/80">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{section.heading}</p>
      {body}
    </div>
  );
}

function EmptyState({ currentMode, onUseSample, onRunSample }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/80 sm:p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Try an example</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Pick a starter prompt or type your own below.
      </p>
      <div className="mt-4 space-y-2">
        {currentMode.examples.slice(0, 4).map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => (onRunSample ? onRunSample(example) : onUseSample(example))}
            className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-slate-700 transition hover:border-teal-200 hover:bg-teal-50/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-900 dark:hover:bg-teal-950/30"
          >
            <span className="min-w-0 flex-1 break-words">{example}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
          </button>
        ))}
      </div>
    </div>
  );
}


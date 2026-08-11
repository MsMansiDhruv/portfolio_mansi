"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  ChevronDown,
  ChevronRight,
  Cloud,
  GitBranch,
  MessageSquareText,
  Mic,
  ServerCog,
  TerminalSquare,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { formatResponseSections, generateResponse } from "./engine";

const MODES = [
  {
    id: "ask",
    label: "Ask Mansi",
    shortLabel: "Mansi",
    icon: MessageSquareText,
    accent: "amber",
    welcome: "Ask about my work, decisions, lessons, and the systems I've helped build.",
    placeholder: "Why did you choose this architecture?",
    examples: [
      "Why did you choose this architecture?",
      "Tell me about a difficult engineering decision.",
      "What have you learned from production systems?",
    ],
  },
  {
    id: "architecture",
    label: "Architecture Expert",
    shortLabel: "Architecture",
    icon: ServerCog,
    accent: "teal",
    welcome: "Design and evaluate architectures — trade-offs, scale, reliability, and cost.",
    placeholder: "Design a scalable lakehouse architecture.",
    examples: [
      "Design a scalable lakehouse architecture.",
      "Redshift vs DynamoDB — when would you choose each?",
      "Review this architecture decision.",
    ],
  },
  {
    id: "pipeline",
    label: "Pipeline Reviewer",
    shortLabel: "Pipeline",
    icon: GitBranch,
    accent: "slate",
    welcome: "Paste a pipeline or architecture — I'll review production readiness, gaps, and risks.",
    placeholder: "Review my ETL pipeline.",
    examples: [
      "Review my ETL pipeline.",
      "What's missing from this production architecture?",
      "Rate this pipeline for production readiness.",
    ],
  },
  {
    id: "sql",
    label: "SQL Optimizer",
    shortLabel: "SQL",
    icon: TerminalSquare,
    accent: "emerald",
    welcome: "Diagnose SQL performance — bottlenecks, rewrites, and execution strategy.",
    placeholder: "Optimize this Spark SQL query.",
    examples: [
      "Optimize this Spark SQL query.",
      "Why is this query slow?",
      "Review this SQL execution strategy.",
    ],
  },
  {
    id: "cloud",
    label: "Cloud Cost Advisor",
    shortLabel: "Cost",
    icon: Cloud,
    accent: "sky",
    welcome: "Analyze cloud cost drivers and practical optimization paths.",
    placeholder: "Where is this AWS architecture wasting money?",
    examples: [
      "Where is this AWS architecture wasting money?",
      "Estimate the cost drivers in this pipeline.",
      "How would you reduce Redshift costs?",
    ],
  },
  {
    id: "interview",
    label: "Interview Coach",
    shortLabel: "Interview",
    icon: Mic,
    accent: "violet",
    welcome: "Practice senior data engineering interviews — one question at a time with structured feedback.",
    placeholder: "Interview me for a Lead Data Engineer role.",
    examples: [
      "Interview me for a Lead Data Engineer role.",
      "Ask me a Spark system-design question.",
      "Challenge me on AWS architecture.",
    ],
  },
];

const MODE_CONTEXT = {
  ask: {
    focus: "Personal engineering experience",
    evaluation: ["Experience", "Projects", "Leadership", "Lessons"],
    hints: ["Career narrative", "Project decisions", "Production lessons"],
  },
  architecture: {
    focus: "Architecture decisions & trade-offs",
    evaluation: ["Scalability", "Reliability", "Trade-offs", "Cost"],
    hints: ["Lakehouse layers", "Batch vs streaming", "Failure modes"],
  },
  pipeline: {
    focus: "Production readiness & operational gaps",
    evaluation: ["Correctness", "Reliability", "Observability", "Scalability"],
    hints: ["Retries & DLQ", "Data quality", "Monitoring"],
  },
  sql: {
    focus: "Query shape & execution cost",
    evaluation: ["Performance", "Query plan", "Joins", "Pruning"],
    hints: ["Filter early", "Shuffle cost", "Distribution keys"],
  },
  cloud: {
    focus: "Cloud economics & architecture cost",
    evaluation: ["Compute", "Storage", "Architecture", "Cost"],
    hints: ["Idle spend", "Tiering", "Workload fit"],
  },
  interview: {
    focus: "Senior interview reasoning & communication",
    evaluation: ["Technical depth", "Reasoning", "Communication", "Trade-offs"],
    hints: ["One question at a time", "STAR for behavioral", "System design depth"],
  },
};

function formatHistoryGroup(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  if (date >= startOfToday) return "Today";
  if (date >= startOfYesterday) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function groupHistoryItems(items) {
  const groups = [];
  for (const item of items) {
    const label = formatHistoryGroup(item.createdAt || Date.now());
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

function SidebarLabel({ children }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">{children}</p>
  );
}

function EvalChips({ items }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function HistoryList({ items, onSelect, compact = false }) {
  if (!items.length) {
    return <p className="text-xs text-slate-400 dark:text-slate-500">No prompts yet — start a conversation.</p>;
  }

  const groups = groupHistoryItems(items);

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.prompt)}
                title={item.prompt}
                className={cn(
                  "block w-full truncate rounded-md px-2 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/80",
                  compact ? "py-1" : ""
                )}
              >
                &ldquo;{item.prompt}&rdquo;
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LeftSidebar({ mode, modes, onModeSelect, history, onHistorySelect }) {
  return (
    <aside className="hidden min-w-0 lg:block lg:max-h-[calc(100dvh-9rem)] lg:w-[240px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-slate-200/80 lg:pr-4 dark:lg:border-slate-800/80">
      <SidebarLabel>AI Lab</SidebarLabel>
      <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">Modes</p>
      <nav className="mt-3 space-y-0.5" aria-label="AI modes">
        {modes.map((item) => {
          const selected = item.id === mode;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onModeSelect(item.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                selected
                  ? "bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200"
              )}
            >
              <ModeIcon mode={item} />
              <span className="min-w-0 truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {history.length ? (
        <>
          <div className="my-5 border-t border-slate-200/80 dark:border-slate-800/80" />
          <SidebarLabel>History</SidebarLabel>
          <div className="mt-3">
            <HistoryList items={history} onSelect={onHistorySelect} />
          </div>
        </>
      ) : null}
    </aside>
  );
}

function RightSidebar({ modeConfig, modeLabel, relatedProjects, followUps, onFollowUp, onHistorySelect, history }) {
  return (
    <aside className="hidden min-w-0 xl:block xl:w-[280px] xl:shrink-0 xl:max-h-[calc(100dvh-9rem)] xl:overflow-y-auto xl:border-l xl:border-slate-200/80 xl:pl-4 dark:xl:border-slate-800/80">
      <motion.div
        key={modeLabel}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-5"
      >
        <div>
          <SidebarLabel>Context</SidebarLabel>
          <p className="mt-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">{modeLabel}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{modeConfig.focus}</p>
        </div>

        <div>
          <SidebarLabel>Evaluates</SidebarLabel>
          <div className="mt-2">
            <EvalChips items={modeConfig.evaluation} />
          </div>
        </div>

        {modeConfig.hints?.length ? (
          <div>
            <SidebarLabel>Focus areas</SidebarLabel>
            <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              {modeConfig.hints.map((hint) => (
                <li key={hint} className="flex gap-2">
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {relatedProjects?.length ? (
          <div>
            <SidebarLabel>Related project</SidebarLabel>
            {relatedProjects.slice(0, 1).map((project) => (
              <div key={project.slug} className="mt-2">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{project.title}</p>
                {project.reason ? (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {project.reason}
                  </p>
                ) : null}
                <Link
                  href={project.href}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-600 dark:text-teal-400"
                >
                  View project
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        ) : null}

        {followUps?.length ? (
          <div>
            <SidebarLabel>Suggested follow-ups</SidebarLabel>
            <div className="mt-2 space-y-1">
              {followUps.slice(0, 4).map((item) => {
                const label = typeof item === "string" ? item : item.label;
                const payload = typeof item === "string" ? { label: item } : item;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onFollowUp?.(payload)}
                    title={label}
                    className="block w-full truncate rounded-md px-2 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/80"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {!relatedProjects?.length && !followUps?.length && history.length ? (
          <div>
            <SidebarLabel>Recent</SidebarLabel>
            <div className="mt-2">
              <HistoryList items={history.slice(0, 5)} onSelect={onHistorySelect} compact />
            </div>
          </div>
        ) : null}
      </motion.div>
    </aside>
  );
}

function MobileCollapsible({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200/80 dark:border-slate-800/80">
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 py-3 text-left text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"
      >
        <span>{title}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pb-3"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
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

export default function AiLabPage() {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState("ask");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [history, setHistory] = useState([]);
  const [detailLevel, setDetailLevel] = useState("concise");
  const viewportRef = useRef(null);

  const currentMode = MODES.find((item) => item.id === mode) ?? MODES[0];
  const modeContext = MODE_CONTEXT[mode] ?? MODE_CONTEXT.ask;

  const latestAssistantMessage = [...messages].reverse().find((message) => message.role === "assistant");
  const latestResponse = latestAssistantMessage?.content;
  const animatedStreaming = useStreaming(streamingText, isStreaming && !reducedMotion);
  const streamingPreview = isStreaming ? animatedStreaming : latestAssistantMessage?.content;

  const conversationRef = useRef({ recentQuestions: [], recentSubjects: [], currentEntities: [] });

  const handleModeSelect = (nextMode) => {
    setMode(nextMode);
    setMessages([]);
    setInput("");
  };

  const submitPrompt = async (promptText, followUpContext, options = {}) => {
    const prompt = promptText.trim();
    if (!prompt || isStreaming) return;

    const activeMode = options.modeOverride || mode;

    const userId = `${Date.now()}-user`;
    const assistantId = `${Date.now()}-assistant`;

    setMessages((current) => [
      ...current,
      { id: userId, role: "user", type: "text", content: prompt },
      { id: assistantId, role: "assistant", type: "structured", content: null, pending: true },
    ]);
    setHistory((current) =>
      [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, prompt, createdAt: Date.now() }, ...current].slice(
        0,
        12
      )
    );
    setIsStreaming(true);
    setStreamingText("Thinking through this…");
    setInput("");

    const recentHistory = messages
      .filter((message) => message.role === "user" || message.role === "assistant")
      .slice(-6)
      .map((message) => ({
        role: message.role,
        content:
          message.role === "assistant" && message.type === "structured"
            ? message.content?.summary || message.content?.title || "Previous assistant response"
            : String(message.content || ""),
      }));

    try {
      const response = await generateResponse(activeMode, prompt, {
        conversation: conversationRef.current,
        followUp: followUpContext,
        density: detailLevel,
        history: recentHistory,
        explicitModeChoice: options.explicitModeChoice,
        onStreamDelta: () => {
          setStreamingText("Composing answer…");
        },
      });

      if (response.conversationState) {
        conversationRef.current = response.conversationState;
      }

      const assistantMessage = buildAssistantMessage(activeMode, prompt, response);
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId ? { ...message, content: assistantMessage, pending: false } : message
        )
      );
    } catch (error) {
      const fallbackMessage = {
        mode,
        title: "Something went wrong",
        summary: error?.message || "I'm having trouble reaching the reasoning layer right now. Please try again.",
        density: detailLevel,
        sections: [],
        followUps: [{ label: "Try asking again" }],
        sources: undefined,
      };
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId ? { ...message, content: fallbackMessage, pending: false } : message
        )
      );
    } finally {
      setIsStreaming(false);
      setStreamingText("");
    }
  };

  const handleFollowUp = (item) => {
    if (item?.targetAction === "navigate" && String(item?.targetSubject || "").startsWith("/")) {
      window.location.href = item.targetSubject;
      return;
    }
    if (item?.targetAction === "mode-switch" && item?.targetMode) {
      const preservedQuestion = item.preservedQuestion || input;
      setMode(item.targetMode);
      submitPrompt(preservedQuestion, item, {
        modeOverride: item.targetMode,
        explicitModeChoice: true,
      });
      return;
    }
    submitPrompt(item.label || item, item);
  };

  const handleModeRedirect = (redirect) => {
    if (!redirect?.targetMode) return;
    setMode(redirect.targetMode);
    submitPrompt(redirect.preserveQuestion || input, {
      targetAction: "mode-switch",
      targetMode: redirect.targetMode,
      preservedQuestion: redirect.preserveQuestion,
    }, {
      modeOverride: redirect.targetMode,
      explicitModeChoice: true,
    });
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
                  onClick={() => handleModeSelect(item.id)}
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

        <div className="grid min-w-0 flex-1 grid-cols-1 gap-0 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_280px]">
          <LeftSidebar
            mode={mode}
            modes={MODES}
            onModeSelect={handleModeSelect}
            history={history}
            onHistorySelect={setInput}
          />

          <div className="flex min-h-0 min-w-0 flex-col lg:px-4 xl:px-5">
          <section className="flex min-h-[min(640px,calc(100dvh-11rem))] min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:min-h-[min(720px,calc(100dvh-10rem))]">
            <div className="shrink-0 border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{currentMode.label}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{currentMode.welcome}</p>
                </div>
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
                          {showThinking || !message.content ? (
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{streamingPreview || "Thinking through this…"}</p>
                          ) : (
                            <StructuredResponse
                              mode={mode}
                              data={message.content}
                              onFollowUp={handleFollowUp}
                              onModeRedirect={handleModeRedirect}
                            />
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
                <EmptyState currentMode={currentMode} onRunSample={submitPrompt} />
              ) : null}
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-slate-800">
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
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        submitPrompt(input);
                      }
                    }}
                    placeholder={currentMode.placeholder}
                    rows={2}
                    className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Enter to send</span>
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

          <div className="mt-3 space-y-1 border-t border-slate-200/80 pt-3 lg:hidden dark:border-slate-800/80">
            {messages.length === 0 ? (
              <MobileCollapsible title="Starter prompts" defaultOpen>
                <div className="space-y-1">
                  {currentMode.examples.map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => submitPrompt(sample)}
                      className="block w-full truncate rounded-md px-2 py-2 text-left text-xs text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/80"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </MobileCollapsible>
            ) : null}
            <MobileCollapsible title="Context">
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">{modeContext.focus}</p>
                <EvalChips items={modeContext.evaluation} />
              </div>
            </MobileCollapsible>
            {history.length ? (
              <MobileCollapsible title="History">
                <HistoryList items={history} onSelect={setInput} compact />
              </MobileCollapsible>
            ) : null}
          </div>
          </div>

          <RightSidebar
            modeConfig={modeContext}
            modeLabel={currentMode.label}
            relatedProjects={latestResponse?.relatedProjects}
            followUps={messages.length ? latestResponse?.followUps : null}
            onFollowUp={handleFollowUp}
            onHistorySelect={setInput}
            history={history}
          />
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
    relatedProjects: response.relatedProjects || [],
    siteLinks: response.siteLinks || [],
    modeRedirect: response.modeRedirect,
    sources: response.sources,
    code: response.code,
  };
}

function StructuredResponse({ mode, data, onFollowUp, onModeRedirect }) {
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
      {data.modeRedirect ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
          <p className="text-sm text-amber-950 dark:text-amber-100">
            {data.modeRedirect.reason || `Try ${data.modeRedirect.label} for a deeper analysis on this.`}
          </p>
          <button
            type="button"
            onClick={() => onModeRedirect?.(data.modeRedirect)}
            className="mt-2 inline-flex min-h-[36px] items-center rounded-full bg-amber-700 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            Switch to {data.modeRedirect.label}
          </button>
        </div>
      ) : null}
      {data.siteLinks?.length ? (
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-3 dark:border-teal-900/50 dark:bg-teal-950/30">
          <p className="text-[11px] uppercase tracking-[0.22em] text-teal-800/80 dark:text-teal-200/80">Next step</p>
          <div className="mt-2 space-y-2">
            {data.siteLinks.map((link) => (
              <div
                key={link.href}
                className={cn(
                  "rounded-xl border p-3",
                  link.primary
                    ? "border-teal-300 bg-white dark:border-teal-800 dark:bg-slate-900"
                    : "border-teal-100 bg-white/80 dark:border-teal-900/40 dark:bg-slate-900/80"
                )}
              >
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{link.title}</p>
                {link.reason ? <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{link.reason}</p> : null}
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "mt-2 inline-flex min-h-[36px] items-center gap-1 text-sm font-medium",
                      link.primary
                        ? "rounded-full bg-teal-700 px-4 py-1.5 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500"
                        : "text-teal-700 hover:text-teal-600 dark:text-teal-400"
                    )}
                  >
                    {link.label}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "mt-2 inline-flex min-h-[36px] items-center gap-1 text-sm font-medium",
                      link.primary
                        ? "rounded-full bg-teal-700 px-4 py-1.5 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500"
                        : "text-teal-700 hover:text-teal-600 dark:text-teal-400"
                    )}
                  >
                    {link.label}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {data.relatedProjects?.length ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Related project</p>
          <div className="mt-2 space-y-2">
            {data.relatedProjects.map((project) => (
              <div key={project.slug} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{project.title}</p>
                {project.reason ? <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{project.reason}</p> : null}
                <Link
                  href={project.href}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-600 dark:text-teal-400"
                >
                  View project
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {data.followUps?.length ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Would you like</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.followUps.map((item) => {
              const label = typeof item === "string" ? item : item.label;
              const payload = typeof item === "string" ? { label: item } : item;
              const isModeSwitch = payload.targetAction === "mode-switch";
              return (
                <button
                  key={`${label}-${payload.targetAction || ""}-${payload.targetSubject || ""}`}
                  type="button"
                  onClick={() => onFollowUp?.(payload)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition",
                    isModeSwitch
                      ? "border-amber-300 bg-amber-50 font-medium text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
                      : "border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  )}
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

function EmptyState({ currentMode, onRunSample }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="py-2"
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Starter prompts</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Pick one to begin, or type your own below.</p>
      <div className="mt-4 space-y-1">
        {currentMode.examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onRunSample?.(example)}
            className="flex min-h-[40px] w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
          >
            <span className="min-w-0 flex-1 break-words">{example}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}


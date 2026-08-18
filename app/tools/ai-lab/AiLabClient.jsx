"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useWorldTheme } from "@/lib/use-world-theme";
import WorldPageNav from "@/components/world/WorldPageNav";
import { formatResponseSections, generateResponse } from "./engine";
import "@/styles/mansi-world-of-data.css";

const MODES = [
  {
    id: "ask",
    label: "Ask Mansi",
    short: "ASK MANSI",
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
    short: "ARCHITECTURE",
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
    short: "PIPELINE",
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
    short: "SQL",
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
    short: "COST",
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
    short: "INTERVIEW",
    welcome: "Practice senior data engineering interviews — one question at a time with structured feedback.",
    placeholder: "Interview me for a Lead Data Engineer role.",
    examples: [
      "Interview me for a Lead Data Engineer role.",
      "Ask me a Spark system-design question.",
      "Challenge me on AWS architecture.",
    ],
  },
];

function buildAssistantMessage(mode, response) {
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

function CodeBlock({ code, language = "text" }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  };
  return (
    <div className="wd-lab__code">
      <div className="wd-lab__code-bar">
        <span>{language}</span>
        <button type="button" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SectionBlock({ section }) {
  if (!section.bullets?.length && section.body) {
    return (
      <section>
        {section.heading ? <p>{section.heading}</p> : null}
        <span>{section.body}</span>
      </section>
    );
  }
  return (
    <section>
      {section.heading ? <p>{section.heading}</p> : null}
      <div>
        {section.body ? <span>{section.body}</span> : null}
        {section.bullets?.length ? (
          <ul>
            {section.bullets.map((bullet, index) => (
              <li key={`${section.heading}-${index}`}>{bullet}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function StructuredResponse({ data, onFollowUp, onModeRedirect }) {
  const [showDetail, setShowDetail] = useState(false);
  const primary = (data.sections || []).filter((section) => section.tier !== "detail");
  const detail = (data.sections || []).filter((section) => section.tier === "detail");
  const visible = showDetail ? data.sections : primary.length ? primary : data.sections;

  return (
    <div className="wd-ai-surface__response">
      <p className="wd-ai-surface__response-title">{data.title}</p>
      {data.summary ? <p className="wd-ai-surface__summary">{data.summary}</p> : null}
      {data.code ? <CodeBlock language="sql" code={data.code} /> : null}
      {visible?.length ? (
        <div className="wd-ai-surface__sections">
          {visible.map((section, index) => (
            <SectionBlock key={`${section.heading}-${index}`} section={section} />
          ))}
        </div>
      ) : null}
      {!showDetail && detail.length ? (
        <button type="button" className="wd-lab__text-btn" onClick={() => setShowDetail(true)}>
          Show deeper analysis
        </button>
      ) : null}
      {data.modeRedirect ? (
        <div className="wd-lab__note">
          <p>{data.modeRedirect.reason || `Try ${data.modeRedirect.label} for a deeper look.`}</p>
          <button type="button" onClick={() => onModeRedirect?.(data.modeRedirect)}>
            Switch to {data.modeRedirect.label}
          </button>
        </div>
      ) : null}
      {data.siteLinks?.map((link) =>
        link.external ? (
          <a key={link.href} className="wd-inline-link" href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label || link.title}
          </a>
        ) : (
          <Link key={link.href} className="wd-inline-link" href={link.href}>
            {link.label || link.title}
          </Link>
        )
      )}
      {data.relatedProjects?.map((project) => (
        <Link key={project.slug} className="wd-inline-link" href={project.href}>
          {project.title} ↗
        </Link>
      ))}
      {data.followUps?.length ? (
        <div className="wd-lab__follow">
          {data.followUps.map((item) => {
            const label = typeof item === "string" ? item : item.label;
            const payload = typeof item === "string" ? { label: item } : item;
            return (
              <button key={label} type="button" onClick={() => onFollowUp?.(payload)}>
                {label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function AiLabClient() {
  const searchParams = useSearchParams();
  const [theme] = useWorldTheme();
  const [mode, setMode] = useState("ask");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [history, setHistory] = useState([]);
  const [detailLevel, setDetailLevel] = useState("concise");
  const conversationRef = useRef({ recentQuestions: [], recentSubjects: [], currentEntities: [] });

  const currentMode = MODES.find((item) => item.id === mode) ?? MODES[0];
  const latestAssistant = [...messages].reverse().find((message) => message.role === "assistant");

  useEffect(() => {
    const requested = searchParams.get("mode");
    if (requested && MODES.some((item) => item.id === requested)) setMode(requested);
    const seed = searchParams.get("q");
    if (seed) setInput(seed);
  }, [searchParams]);

  const handleModeSelect = (nextMode) => {
    setMode(nextMode);
    setMessages([]);
    setInput("");
  };

  const submitPrompt = async (promptText, followUpContext, options = {}) => {
    const prompt = String(promptText || "").trim();
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
      [{ id: `${Date.now()}`, prompt, createdAt: Date.now() }, ...current].slice(0, 12)
    );
    setIsStreaming(true);
    setStreamingText("Thinking through this…");
    setInput("");

    const recentHistory = messages.slice(-6).map((message) => ({
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
        onStreamDelta: () => setStreamingText("Composing answer…"),
      });
      if (response.conversationState) conversationRef.current = response.conversationState;
      const assistantMessage = buildAssistantMessage(activeMode, response);
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId ? { ...message, content: assistantMessage, pending: false } : message
        )
      );
    } catch (error) {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                pending: false,
                content: {
                  title: "Something went wrong",
                  summary: error?.message || "I could not reach the reasoning layer. Please try again.",
                  sections: [],
                  followUps: [{ label: "Try asking again" }],
                },
              }
            : message
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
      setMode(item.targetMode);
      submitPrompt(item.preservedQuestion || input, item, {
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
    <div className="wd-root wd-page wd-page--ai wd-page--copy is-ready" data-theme={theme} suppressHydrationWarning>
      <WorldPageNav active="ai" />
      <main className="wd-page-main">
        <header className="wd-page-hero">
          <p className="wd-scroll-kicker">AI LAB</p>
          <h1 className="wd-page-title">Ask Mansi</h1>
          <p className="wd-page-body">{currentMode.welcome}</p>
        </header>

        <div className="wd-lab">
          <div className="wd-ai-surface wd-lab__console" aria-label={`${currentMode.label} reasoning console`}>
            <header className="wd-ai-surface__head">
              <div>
                <p className="wd-ai-surface__code">AI REASONING / {currentMode.label.toUpperCase()}</p>
                <p className="wd-ai-surface__hint">Knowledge-grounded answers about the work — not a generic chatbot.</p>
              </div>
              <div className="wd-lab__density" role="group" aria-label="Answer length">
                <button type="button" className={detailLevel === "concise" ? "is-active" : ""} onClick={() => setDetailLevel("concise")}>
                  Concise
                </button>
                <button type="button" className={detailLevel === "detailed" ? "is-active" : ""} onClick={() => setDetailLevel("detailed")}>
                  Detailed
                </button>
              </div>
            </header>

            <div className="wd-ai-surface__modes" aria-label="Choose an AI Lab mode">
              {MODES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === mode ? "is-active" : ""}
                  onClick={() => handleModeSelect(item.id)}
                >
                  {item.short}
                </button>
              ))}
            </div>

            <div className="wd-ai-surface__signal" aria-hidden>
              <span>INPUT</span><i /><span>REASON</span><i /><span>GROUND</span><i /><span>ANSWER</span>
            </div>

            <div className="wd-lab__thread">
              {messages.map((message) => {
                const thinking = isStreaming && message.role === "assistant" && latestAssistant?.id === message.id;
                if (message.role === "user") {
                  return (
                    <p key={message.id} className="wd-lab__user">
                      {message.content}
                    </p>
                  );
                }
                if (thinking || !message.content) {
                  return (
                    <p key={message.id} className="wd-ai-surface__summary">
                      {streamingText || "Thinking through this…"}
                    </p>
                  );
                }
                return (
                  <StructuredResponse
                    key={message.id}
                    data={message.content}
                    onFollowUp={handleFollowUp}
                    onModeRedirect={handleModeRedirect}
                  />
                );
              })}

              {messages.length === 0 ? (
                <div className="wd-lab__starters">
                  <p className="wd-scroll-kicker">Starter prompts</p>
                  {currentMode.examples.map((example) => (
                    <button key={example} type="button" onClick={() => submitPrompt(example)}>
                      {example}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <form
              className="wd-ai-surface__composer"
              onSubmit={(event) => {
                event.preventDefault();
                submitPrompt(input);
              }}
            >
              <textarea
                className="wd-ai-surface__input"
                rows={3}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submitPrompt(input);
                  }
                }}
                placeholder={currentMode.placeholder}
                disabled={isStreaming}
              />
              <div className="wd-ai-surface__actions">
                <button type="submit" disabled={isStreaming || !input.trim()}>
                  {isStreaming ? "Resolving…" : "Submit"}
                </button>
                {history.length ? (
                  <button type="button" onClick={() => setInput(history[0].prompt)}>
                    Last prompt
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

const ACCENT = "var(--color-accent)";
const LINE_HEIGHT = 24;

/* ===================== SYNTAX HIGHLIGHT ===================== */
function highlightJson(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(
      /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?([eE][+-]?\d+)?/g,
      (m) => {
        if (/^"/.test(m)) {
          return /:$/.test(m)
            ? `<span class="text-slate-700 dark:text-slate-300">${m}</span>`
            : `<span class="text-emerald-600 dark:text-emerald-400">${m}</span>`;
        }
        if (/true|false/.test(m))
          return `<span class="text-amber-600 dark:text-amber-400">${m}</span>`;
        if (/null/.test(m))
          return `<span class="text-rose-500">${m}</span>`;
        return `<span class="text-cyan-600 dark:text-cyan-400">${m}</span>`;
      }
    );
}

/* ===================== JSON TREE ===================== */
function TreeNode({ name, value, depth = 0 }) {
  const [open, setOpen] = useState(true);
  const isObject = typeof value === "object" && value !== null;
  const isArray = Array.isArray(value);

  return (
    <div style={{ marginLeft: depth * 12 }}>
      <div
        className={`flex items-center gap-1 text-sm ${
          isObject ? "cursor-pointer" : ""
        }`}
        onClick={() => isObject && setOpen(!open)}
      >
        {isObject && (
          <span className="text-slate-400 text-xs">
            {open ? "▾" : "▸"}
          </span>
        )}
        <span className="text-slate-700 dark:text-slate-300">{name}</span>

        {!isObject && (
          <span className="ml-1 text-emerald-600 dark:text-emerald-400">
            {JSON.stringify(value)}
          </span>
        )}

        {isObject && (
          <span className="ml-1 text-xs text-slate-400">
            {isArray ? `[${value.length}]` : `{${Object.keys(value).length}}`}
          </span>
        )}
      </div>

      {open &&
        isObject &&
        Object.entries(value).map(([k, v]) => (
          <TreeNode key={k} name={k} value={v} depth={depth + 1} />
        ))}
    </div>
  );
}

/* ===================== SCHEMA INFERENCE ===================== */
function inferSchema(value) {
  if (value === null) return { type: "null" };

  if (Array.isArray(value)) {
    if (value.length === 0)
      return { type: "array", items: { type: "any" } };
    return {
      type: "array",
      items: mergeSchemas(value.map(inferSchema)),
    };
  }

  if (typeof value === "object") {
    const props = {};
    for (const k in value) props[k] = inferSchema(value[k]);
    return { type: "object", properties: props };
  }

  return { type: typeof value };
}

function mergeSchemas(schemas) {
  const types = [...new Set(schemas.map((s) => s.type))];
  if (types.length === 1) {
    if (types[0] === "object") {
      const props = {};
      schemas.forEach((s) =>
        Object.entries(s.properties || {}).forEach(([k, v]) => {
          props[k] = mergeSchemas([props[k], v].filter(Boolean));
        })
      );
      return { type: "object", properties: props };
    }
    if (types[0] === "array") {
      return { type: "array", items: mergeSchemas(schemas.map((s) => s.items)) };
    }
    return schemas[0];
  }
  return { type: types.join(" | ") };
}

/* ===================== SCHEMA VIEW ===================== */
function SchemaNode({ name, schema, depth = 0 }) {
  const [open, setOpen] = useState(true);
  const indent = { marginLeft: depth * 12 };

  if (schema.type === "object") {
    return (
      <div style={indent}>
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <span className="text-slate-400">{open ? "▾" : "▸"}</span>
          <span className="text-slate-700 dark:text-slate-300">{name}</span>
          <span className="text-xs text-slate-400 ml-1">object</span>
        </div>
        {open &&
          Object.entries(schema.properties || {}).map(([k, v]) => (
            <SchemaNode key={k} name={k} schema={v} depth={depth + 1} />
          ))}
      </div>
    );
  }

  if (schema.type === "array") {
    return (
      <div style={indent}>
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <span className="text-slate-400">{open ? "▾" : "▸"}</span>
          <span className="text-slate-700 dark:text-slate-300">{name}</span>
          <span className="text-xs text-violet-600 dark:text-violet-400 ml-1">
            array
          </span>
        </div>
        {open && (
          <SchemaNode
            name="item"
            schema={schema.items}
            depth={depth + 1}
          />
        )}
      </div>
    );
  }

  const color =
    schema.type === "string"
      ? "text-emerald-600"
      : schema.type === "number"
      ? "text-cyan-600"
      : schema.type === "boolean"
      ? "text-amber-600"
      : schema.type === "null"
      ? "text-rose-500"
      : "text-slate-400";

  return (
    <div style={indent} className="flex gap-2">
      <span className="text-slate-700 dark:text-slate-300">{name}</span>
      <span className={`text-sm ${color}`}>{schema.type}</span>
    </div>
  );
}

/* ===================== INVALID STATE ===================== */
function InvalidInspector() {
  return (
    <div className="p-4 text-sm text-slate-400">
      Invalid JSON — cannot analyze
    </div>
  );
}

/* ===================== MAIN ===================== */
export default function JsonFormatter() {
  const [text, setText] = useState(`{
  "name": "Acme Co",
  "active": true,
  "items": [
    { "id": 1, "price": 2500 },
    { "id": 2, "price": 1500 }
  ]
}`);
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState(null);
  const taRef = useRef(null);

  useEffect(() => {
    try {
      const p = JSON.parse(text);
      setParsed(p);
      setError(null);
    } catch (e) {
      const match = e.message.match(/position (\d+)/);
      if (match) {
        const pos = Number(match[1]);
        const before = text.slice(0, pos);
        const line = before.split("\n").length;
        const col = pos - before.lastIndexOf("\n");
        setError({ line, col });
        taRef.current.scrollTop = Math.max(0, (line - 2) * LINE_HEIGHT);
      }
      setParsed(null);
    }
  }, [text]);

  const schema = useMemo(
    () => (parsed ? inferSchema(parsed) : null),
    [parsed]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <h1 className="text-2xl font-semibold mb-4" style={{ color: ACCENT }}>
        JSON Analyser
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        {/* INPUT */}
        <section
          className={`rounded-lg border bg-white dark:bg-[#1e293b80]
            ${parsed ? "border-emerald-400/60" : "border-rose-400/60"}`}
        >
          <header className="px-4 py-2 border-b text-sm font-medium">
            JSON Input
          </header>

          <div className="relative flex font-mono text-sm leading-6">
            {/* GUTTER */}
            <div className="select-none text-right pr-3 pt-4 text-slate-400">
              {text.split("\n").map((_, i) => (
                <div
                  key={i}
                  className={
                    error?.line === i + 1
                      ? "bg-rose-100/40 dark:bg-rose-500/10"
                      : ""
                  }
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* CODE */}
            <div className="relative flex-1">
              <pre
                className="absolute inset-0 p-4 whitespace-pre-wrap pointer-events-none"
                dangerouslySetInnerHTML={{
                  __html: highlightJson(text),
                }}
              />

              {error && (
                <div
                  className="absolute w-[2px] bg-rose-500"
                  style={{
                    left: error.col * 8,
                    top: 4 + (error.line - 1) * LINE_HEIGHT,
                    height: LINE_HEIGHT,
                  }}
                />
              )}

              <textarea
                ref={taRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck={false}
                rows={20}
                className="relative w-full p-4 bg-transparent text-transparent caret-black dark:caret-white outline-none resize-none"
                style={{ lineHeight: `${LINE_HEIGHT}px` }}
              />
            </div>
          </div>
        </section>

        {/* INSPECTORS */}
        <div className="space-y-4">
          <section className="rounded-lg border bg-white dark:bg-[#1e293b80]">
            <header className="px-4 py-2 border-b text-sm font-medium">
              JSON Tree
            </header>
            {parsed ? (
              <div className="p-3 text-sm">
                <TreeNode name="root" value={parsed} />
              </div>
            ) : (
              <InvalidInspector />
            )}
          </section>

          <section className="rounded-lg border bg-white dark:bg-[#1e293b80]">
            <header className="px-4 py-2 border-b text-sm font-medium">
              Inferred Schema
            </header>
            {schema ? (
              <div className="p-3 text-sm">
                <SchemaNode name="root" schema={schema} />
              </div>
            ) : (
              <InvalidInspector />
            )}
          </section>
        </div>
      </div>
    </motion.div>
  );
}

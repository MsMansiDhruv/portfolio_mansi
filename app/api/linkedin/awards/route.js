// app/api/linkedin/awards/route.js
import fs from "fs/promises";
import path from "path";

const MEM_TTL = 10 * 60 * 1000;
if (!globalThis.__LINKEDIN_AWARDS_CACHE) globalThis.__LINKEDIN_AWARDS_CACHE = new Map();
const MEMCACHE = globalThis.__LINKEDIN_AWARDS_CACHE;
const now = () => Date.now();

function diskFileFor(username) {
  return path.join(process.cwd(), "data", `linkedin_awards_${username.replace(/[^a-z0-9\.-]/gi, "_")}.json`);
}
async function readDisk(username) {
  try {
    const p = diskFileFor(username);
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
async function writeDisk(username, obj) {
  try {
    const p = diskFileFor(username);
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, JSON.stringify(obj, null, 2), "utf8");
  } catch (e) {
    console.error("writeDisk error:", e?.message || e);
  }
}

/* --- cleaning utilities (aggressive) --- */
function decodeEntities(str = "") {
  if (!str) return "";
  const ents = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&#x27;": "'",
    "&#39;": "'",
    "&quot;": '"',
    "&lt;": "<",
    "&gt;": ">",
    "&ndash;": "–",
    "&mdash;": "—",
  };
  return String(str).replace(/&[a-zA-Z0-9#]+;/g, (m) => (ents[m] !== undefined ? ents[m] : " "));
}

function stripTags(s = "") {
  return (s || "").replace(/<\/?[^>]+(>|$)/g, " ");
}

function removeUtilityTokens(s = "") {
  if (!s) return "";
  // drop tokens likely to be class names / JIT tokens
  const tokens = s.split(/\s+/).filter(Boolean);
  const keep = [];
  for (const tok of tokens) {
    const k = tok.trim();
    if (!k) continue;
    if (/[\[\]\{\}\:\*]/.test(k)) continue;
    if (/(?:^|[-_])(text|color|leading|mb|px|py|group|hover|not-first|middot|font|truncate|line-clamp|prose|shadow|rounded|bg|dark|light|from|to|border|gap|grid|flex|items|justify|hover|underline|class|aria)/i.test(k)) continue;
    if (/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(k) && k.length < 28 && /[a-z]/.test(k)) continue;
    if (/^[\W_]+$/.test(k)) continue;
    keep.push(k);
  }
  return keep.join(" ");
}

function cleanText(raw = "") {
  let t = String(raw || "");
  t = decodeEntities(t);
  t = stripTags(t);
  t = removeUtilityTokens(t);
  // extra cleanup
  t = t.replace(/\s{2,}/g, " ").replace(/^[\s\-\–\—\•\·\|]+/, "").replace(/[\s\-\–\—\•\·\|]+$/, "");
  t = t.replace(/\[[^\]]+\]/g, "").trim();
  return t;
}

/* --- JSON-LD extractor helper --- */
function extractJsonLd(html = "") {
  const results = [];
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(m[1]);
      results.push(parsed);
    } catch (e) {
      // ignore bad JSON
    }
  }
  return results;
}

/* --- main parsing heuristics: broadened --- */
function parseAwardsFromHtml(html = "", profileUrl = "") {
  const found = [];

  function pushCandidate(raw) {
    const cleaned = cleanText(raw || "");
    if (!cleaned) return;
    if (cleaned.length < 6) return;
    if (/view profile|connect|follow|see more/i.test(cleaned)) return;
    // avoid lines that are purely navigation or duplicated UI strings
    found.push({ title: cleaned, org: "", year: "", sourceUrl: profileUrl });
  }

  // 1) global <li> scan (anywhere on page)
  try {
    for (const m of html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) {
      pushCandidate(m[1]);
    }
  } catch (e) {}

  // 2) element-level keyword matches: find any tag that contains award keywords in its text
  const keywordRegex = /(award|honor|recognition|scholarship|merit|recipient|winner|finalist|gem\s+award|value-?able)/i;
  try {
    // match tag blocks that include the keywords in their inner text (up to reasonable size)
    // This grabs e.g. <div ...> ... Award ... </div> or <span ...> ... Award ... </span>
    for (const m of html.matchAll(new RegExp(`<([a-z0-9]+)(?:\\s[^>]*)?>([\\s\\S]{0,800}?(?:${keywordRegex.source})[\\s\\S]{0,800}?)<\\/\\1>`, "gi"))) {
      pushCandidate(m[2]);
    }
  } catch (e) {}

  // 3) JSON-LD: check for CreativeWork/Thing objects mentioning awards/honors
  try {
    const jsons = extractJsonLd(html);
    for (const j of jsons) {
      // walk structure
      (function walk(o) {
        if (!o || typeof o !== "object") return;
        if (Array.isArray(o)) return o.forEach(walk);
        // common keys
        if (o.name && typeof o.name === "string" && /award|honor|recognition|scholarship|merit/i.test(o.name)) {
          pushCandidate(o.name + (o.description ? " · " + o.description : ""));
        }
        if (o.award || o.honour || o.honors || o.recognition) {
          pushCandidate(JSON.stringify(o));
        }
        for (const k of Object.keys(o)) walk(o[k]);
      })(j);
    }
  } catch (e) {}

  // 4) nearby-text windowing: if keywords appear in text nodes not wrapped, grab a window of raw HTML around each keyword
  try {
    for (const m of html.matchAll(new RegExp(`(.{0,220}?)(?:${keywordRegex.source})(.{0,220}?)`, "gi"))) {
      const left = m[1] || "";
      const right = m[2] || "";
      // combine and strip tags
      pushCandidate(left + " " + right);
    }
  } catch (e) {}

  // 5) fallback: paragraphs with keywords
  try {
    for (const m of html.matchAll(/<p\b[^>]*>([\s\S]{30,600})<\/p>/gi)) {
      const text = m[1] || "";
      if (keywordRegex.test(text)) pushCandidate(text);
    }
  } catch (e) {}

  // dedupe & lightweight parse for org/year heuristics (attempt)
  const seen = new Set();
  const out = [];
  for (const item of found) {
    const key = (item.title || "").slice(0, 220).toLowerCase();
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);

    let title = item.title;
    let org = "";
    let year = "";

    // try extract year like "Jul 2024" or "2023" etc
    const yearMatch = title.match(/(19|20)\d{2}/);
    if (yearMatch) {
      year = yearMatch[0];
      // remove year from title to keep it tidy
      title = title.replace(yearMatch[0], "").replace(/\s{2,}/g, " ").trim();
    }

    // try " · " or " - " splits to find org (common in LinkedIn e.g. "Gem Award · SG Analytics · Mar 2023")
    const parts = title.split(/\s*[·|\-|\—|•]\s*/).map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      // often pattern: Title · Org · Date
      // first part might be title, last could be date, middle org
      if (!org && parts.length >= 2) {
        // heuristics: if last part contains year we already removed it; choose middle as org
        org = parts.length === 2 ? "" : parts.slice(1, parts.length).join(" · ");
        // reduce title to first part
        title = parts[0];
      }
    }

    title = title.trim();
    if (!title) continue;
    out.push({ title, org: org.trim(), year: year ? String(year) : "", sourceUrl: item.sourceUrl || profileUrl });
  }

  return out;
}

export async function GET(request) {
  try {
    const u = new URL(request.url).searchParams.get("u") || new URL(request.url).searchParams.get("username");
    if (!u) return new Response(JSON.stringify({ error: "Missing query param `u` (username or profile URL)" }), { status: 400 });
    let profileUrl = u;
    if (!/^https?:\/\//i.test(u)) profileUrl = `https://www.linkedin.com/in/${u.replace(/^\/+|\/+$/g, "")}/`;
    const username = (() => { try { const p = new URL(profileUrl); return p.pathname.split("/").filter(Boolean).pop() || u; } catch { return u; } })();
    const cacheKey = `linkedin:awards:${username}`;

    const memEntry = MEMCACHE.get(cacheKey);
    if (memEntry && (now() - memEntry.t) < MEM_TTL && memEntry.data && Array.isArray(memEntry.data.awards) && memEntry.data.awards.length) {
      return new Response(JSON.stringify({ awards: memEntry.data.awards, cached: true }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    let fetched;
    try {
      fetched = await fetch(profileUrl, { headers: { "User-Agent": "Mozilla/5.0 (compatible;)", Accept: "text/html" }});
    } catch (err) {
      const disk = await readDisk(username);
      if (disk && Array.isArray(disk.awards) && disk.awards.length) return new Response(JSON.stringify({ awards: disk.awards, stale: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: `Network error fetching profile: ${String(err?.message || err)}` }), { status: 502 });
    }

    const status = Number(fetched?.status) || 0;
    if (!fetched || status < 200 || status > 399) {
      const disk = await readDisk(username);
      if (disk && Array.isArray(disk.awards) && disk.awards.length) return new Response(JSON.stringify({ awards: disk.awards, stale: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      if (memEntry && memEntry.data && memEntry.data.awards && memEntry.data.awards.length) return new Response(JSON.stringify({ awards: memEntry.data.awards, stale: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: `LinkedIn returned status ${String(fetched?.status)}` }), { status: 502 });
    }

    const html = await fetched.text();
    const awards = parseAwardsFromHtml(html, profileUrl);

    if (awards && awards.length) {
      MEMCACHE.set(cacheKey, { t: now(), data: { awards } });
      await writeDisk(username, { awards, cachedAt: Date.now() }).catch(() => {});
      return new Response(JSON.stringify({ awards }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    const disk = await readDisk(username);
    if (disk && Array.isArray(disk.awards) && disk.awards.length) return new Response(JSON.stringify({ awards: disk.awards, stale: true }), { status: 200, headers: { "Content-Type": "application/json" } });
    if (memEntry && memEntry.data && memEntry.data.awards && memEntry.data.awards.length) return new Response(JSON.stringify({ awards: memEntry.data.awards, stale: true }), { status: 200, headers: { "Content-Type": "application/json" } });

    return new Response(JSON.stringify({ awards: [], error: "No awards found (public profile may hide them)" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("awards route error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

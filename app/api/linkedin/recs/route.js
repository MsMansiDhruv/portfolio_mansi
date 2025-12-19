// app/api/linkedin/recs/route.js
// Robust LinkedIn recs route — defensive about fetch results and Response status
// Keeps same heuristics + 10 min cache; avoids RangeError by coercing status.

const CACHE_TTL_MS = 10 * 60 * 1000;
if (!globalThis.__LINKEDIN_REC_CACHE) globalThis.__LINKEDIN_REC_CACHE = new Map();
const CACHE = globalThis.__LINKEDIN_REC_CACHE;
const now = () => Date.now();

function normalizeUrl(u) {
  if (!u) return null;
  try {
    const url = new URL(u, "https://www.linkedin.com");
    if (!/linkedin\.com/i.test(url.hostname)) return null;
    url.pathname = url.pathname.replace(/\/+$/, "");
    return url.toString();
  } catch {
    return null;
  }
}

function stripHtmlAndDecode(s = "") {
  if (!s) return "";
  s = s.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1");
  s = s.replace(/<\/?[^>]+(>|$)/g, "");
  s = s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  return s.replace(/\s+/g, " ").trim();
}

function extractJsonLd(html) {
  const matches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (!matches.length) return null;
  for (const m of matches) {
    try {
      const data = JSON.parse(m[1]);
      if (data) return data;
    } catch (e) {
      // ignore parse errors for specific script tags
    }
  }
  return null;
}

function parseLinkedInRecommendationsFromHtml(html, profileUrl) {
  const recs = [];

  // Strategy: look for long <blockquote>, <li>, or <p> blocks near name/imgs
  try {
    const sectionRegex = /<section\b[^>]*>([\s\S]*?)<\/section>/gi;
    for (const secMatch of html.matchAll(sectionRegex)) {
      const sec = secMatch[1];
      if (!/recommendation|recommendations|recommended|recommends|recommend/i.test(sec)) continue;

      const itemRegexes = [
        /<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi,
        /<li\b[^>]*>([\s\S]*?)<\/li>/gi,
        /<div[^>]*class=["'][^"']*(recommendation|reco|recommends)[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
      ];

      for (const re of itemRegexes) {
        for (const m of sec.matchAll(re)) {
          const candidate = (m[1] || m[2] || "").trim();
          if (!candidate || candidate.length < 40) continue;

          const imgMatch = candidate.match(/<img[^>]+src=["']([^"']+)["']/i);
          const photo = imgMatch ? imgMatch[1] : null;

          const nameMatch = candidate.match(/<strong[^>]*>([^<]+)<\/strong>/i) || candidate.match(/<h3[^>]*>([^<]+)<\/h3>/i);
          const name = nameMatch ? stripHtmlAndDecode(nameMatch[1]) : null;

          const roleMatch = candidate.match(/<span[^>]*class=["'][^"']*(title|occupation|subtitle|headline)[^"']*["'][^>]*>([^<]+)<\/span>/i)
            || candidate.match(/<div[^>]*class=["'][^"']*(profile|headline)[^"']*["'][^>]*>([^<]+)<\/div>/i);
          const role = roleMatch ? stripHtmlAndDecode(roleMatch[2] || roleMatch[1]) : "";

          const excerpt = stripHtmlAndDecode(candidate).slice(0, 800);

          recs.push({ name: name || "Unknown", role, photo, excerpt, sourceUrl: profileUrl });
        }
      }
    }
  } catch (e) {
    // ignore parse errors
  }

  // JSON-LD fallback
  try {
    const jsonld = extractJsonLd(html);
    if (jsonld) {
      const candidates = [];
      (function collect(obj) {
        if (!obj || typeof obj !== "object") return;
        if (Array.isArray(obj)) return obj.forEach(collect);
        if (obj["@type"] && /Review|Recommendation|Person|CreativeWork/i.test(String(obj["@type"]))) candidates.push(obj);
        for (const k of Object.keys(obj)) collect(obj[k]);
      })(jsonld);

      for (const c of candidates) {
        if (c.author && (c.reviewBody || c.description || c.text)) {
          const name = (c.author.name || c.author) + "";
          const excerpt = c.reviewBody || c.description || c.text || "";
          const photo = c.author?.image || c.image || null;
          recs.push({ name: stripHtmlAndDecode(name), role: c.author?.jobTitle || "", photo, excerpt: stripHtmlAndDecode(excerpt), sourceUrl: profileUrl });
        }
      }
    }
  } catch (e) {
    // ignore
  }

  // Paragraph fallback
  try {
    for (const pMatch of html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
      const textHtml = pMatch[1];
      const txt = stripHtmlAndDecode(textHtml);
      if (!txt || txt.length < 120) continue;
      const idx = pMatch.index || 0;
      const slice = html.slice(Math.max(0, idx - 400), idx + 400);
      const nameM = slice.match(/<strong[^>]*>([^<]+)<\/strong>/i) || slice.match(/<h3[^>]*>([^<]+)<\/h3>/i);
      const imgM = slice.match(/<img[^>]+src=["']([^"']+)["']/i);
      recs.push({ name: nameM ? stripHtmlAndDecode(nameM[1]) : "Unknown", role: "", photo: imgM ? imgM[1] : null, excerpt: txt.slice(0, 900), sourceUrl: profileUrl });
    }
  } catch (e) {
    // ignore
  }

  // Deduplicate
  const seen = new Set();
  const out = [];
  for (const r of recs) {
    const key = `${(r.name || "").slice(0, 40)}::${(r.excerpt || "").slice(0, 120)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

export async function GET(request) {
  try {
    const urlParams = new URL(request.url).searchParams;
    let u = urlParams.get("u") || urlParams.get("username") || null;
    if (!u) {
      return new Response(JSON.stringify({ error: "Missing query param `u`. Supply username or full LinkedIn profile URL." }), { status: 400 });
    }

    let profileUrl = null;
    if (/^https?:\/\//i.test(u)) {
      profileUrl = normalizeUrl(u);
      if (!profileUrl) return new Response(JSON.stringify({ error: "Invalid LinkedIn URL" }), { status: 400 });
    } else {
      const candidate = `https://www.linkedin.com/in/${u.replace(/^\/+|\/+$/g, "")}/`;
      profileUrl = normalizeUrl(candidate);
    }

    if (!profileUrl) return new Response(JSON.stringify({ error: "Could not determine LinkedIn profile URL" }), { status: 400 });

    const cacheKey = `linkedin:recs:${profileUrl}`;
    if (CACHE.has(cacheKey)) {
      const entry = CACHE.get(cacheKey);
      if (now() - entry.t < CACHE_TTL_MS && entry.data) {
        // ensure we return with a valid numeric status
        return new Response(JSON.stringify(entry.data), { status: 200, headers: { "Content-Type": "application/json" } });
      }
    }

    // Fetch with defensive try/catch
    let fetched;
    try {
      fetched = await fetch(profileUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; +https://your-site.example/; )", Accept: "text/html,application/xhtml+xml" },
        // keep redirect handling default (follow)
      });
    } catch (errFetch) {
      const msg = `LinkedIn fetch network error: ${String(errFetch?.message || errFetch)}`;
      CACHE.set(cacheKey, { t: now(), data: { recs: [], error: msg } });
      return new Response(JSON.stringify({ error: msg }), { status: 502 });
    }

    // coerce status to a valid integer 200-599
    const status = Number(fetched?.status) || 0;
    if (status < 200 || status > 599) {
      // treat as failure
      const msg = `LinkedIn fetch returned invalid status: ${String(fetched?.status)}`;
      CACHE.set(cacheKey, { t: now(), data: { recs: [], error: msg } });
      return new Response(JSON.stringify({ error: msg }), { status: 502 });
    }

    if (!fetched.ok) {
      const msg = `LinkedIn fetch failed: ${status}`;
      CACHE.set(cacheKey, { t: now(), data: { recs: [], error: msg } });
      return new Response(JSON.stringify({ error: msg }), { status: 502 });
    }

    const html = await fetched.text();

    const recs = parseLinkedInRecommendationsFromHtml(html, profileUrl) || [];

    const out = { recs };
    CACHE.set(cacheKey, { t: now(), data: out });
    return new Response(JSON.stringify(out), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("LinkedIn recs unexpected error:", err);
    return new Response(JSON.stringify({ error: "Server error", message: String(err?.message || err) }), { status: 500 });
  }
}

// app/api/medium/[username]/route.js
// Medium proxy: JSON fallback -> RSS fallback
// Improved: cleans CDATA, strips tags, decodes HTML entities, robust image extraction.
// caches responses in-memory (10min)

const CACHE_TTL_MS = 10 * 60 * 1000;
if (!globalThis.__MEDIUM_CACHE) globalThis.__MEDIUM_CACHE = new Map();
const CACHE = globalThis.__MEDIUM_CACHE;
const now = () => Date.now();

function stripCData(s = "") {
  // unwrap CDATA sections if present
  return s.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1");
}
function stripTags(s = "") {
  return s.replace(/<\/?[^>]+(>|$)/g, "");
}
function decodeEntities(s = "") {
  if (!s) return s;
  // common named entities
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };
  // replace named entities
  s = s.replace(/&([a-zA-Z]+);/g, (m, name) => (named[name] !== undefined ? named[name] : m));
  // replace numeric entities (decimal & hex)
  s = s.replace(/&#(\d+);/g, (m, num) => String.fromCharCode(parseInt(num, 10)));
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)));
  return s;
}
function cleanText(raw = "") {
  return decodeEntities(stripTags(stripCData(raw)).trim());
}

// extract first capture
function extractFirst(regex, str) {
  const m = str.match(regex);
  return m ? m[1] : null;
}

function parseRssItems(xmlText = "", username = "") {
  const items = [];
  const itemRegex = /<item\b[^>]*?>([\s\S]*?)<\/item>/gi;
  let itemMatch;
  while ((itemMatch = itemRegex.exec(xmlText))) {
    const itemXml = itemMatch[1];

    const rawTitle = extractFirst(/<title>([\s\S]*?)<\/title>/i, itemXml) || "";
    const title = cleanText(rawTitle) || "";

    // link often wrapped in CDATA
    let link = extractFirst(/<link>([\s\S]*?)<\/link>/i, itemXml) || "";
    link = stripCData(link).trim();

    const pubDateRaw = extractFirst(/<pubDate>([\s\S]*?)<\/pubDate>/i, itemXml) || "";
    const publishedAt = pubDateRaw ? Date.parse(stripCData(pubDateRaw)) || 0 : 0;

    // try several ways to find an image
    let previewImage = null;
    const mediaMatch = itemXml.match(/<media:content[^>]*url=["']([^"']+)["']/i);
    if (mediaMatch) previewImage = mediaMatch[1];

    if (!previewImage) {
      const thumbMatch = itemXml.match(/<media:thumbnail[^>]*url=["']([^"']+)["']/i);
      if (thumbMatch) previewImage = thumbMatch[1];
    }

    if (!previewImage) {
      const descRaw = extractFirst(/<(?:description|content:encoded)>([\s\S]*?)<\/(?:description|content:encoded)>/i, itemXml) || "";
      const descClean = stripCData(descRaw);
      const imgMatch = descClean.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch) previewImage = imgMatch[1];
    }

    // final safe-cleaned URL fallback
    if (!link) link = username ? `https://medium.com/@${username}` : "";

    items.push({
      id: link || (title + publishedAt),
      title: title || "Untitled",
      subtitle: "", // RSS rarely has a separate subtitle
      slug: (link.split("/").pop() || title.replace(/\s+/g, "-").toLowerCase()).replace(/\?.*$/, ""),
      url: link,
      previewImage: previewImage || null,
      publishedAt: publishedAt || 0,
    });
  }
  return items;
}

export async function GET(request, context) {
  try {
    const maybeParams = context?.params;
    const params = maybeParams ? await maybeParams : null;
    let username = params?.username ?? null;

    if (!username) {
      try {
        const url = new URL(request.url);
        username = url.searchParams.get("u") || null;
      } catch (e) {}
    }
    if (!username) {
      // defensive extraction
      try {
        const url = new URL(request.url);
        const segments = url.pathname.split("/").filter(Boolean);
        const idx = segments.indexOf("medium");
        if (idx >= 0 && segments.length > idx + 1) username = segments[idx + 1];
      } catch (e) {}
    }

    if (!username) {
      return new Response(JSON.stringify({ error: "Missing username. Provide as /api/medium/{username} or ?u=" }), { status: 400 });
    }

    const cacheKey = `medium:${username}`;
    if (CACHE.has(cacheKey)) {
      const entry = CACHE.get(cacheKey);
      if (now() - entry.t < CACHE_TTL_MS && entry.data) {
        return new Response(JSON.stringify(entry.data), { status: 200, headers: { "Content-Type": "application/json" } });
      }
    }

    // Try Medium JSON endpoint first
    let posts = [];
    try {
      const mediumJsonUrl = `https://medium.com/@${username}?format=json`;
      const res = await fetch(mediumJsonUrl, { headers: { Accept: "application/json" } });
      if (res.ok) {
        let text = await res.text();
        const prefix = "])}while(1);</x>";
        if (text.startsWith(prefix)) text = text.slice(prefix.length);
        try {
          const json = JSON.parse(text);
          const postsRef = json?.payload?.references?.Post || {};
          posts = Object.values(postsRef).map((p) => {
            // prefer virtuals.title if present but keep decoded
            const rawTitle = p.title || (p.virtuals && p.virtuals.title) || "";
            const title = decodeEntities(stripTags(stripCData(rawTitle))).trim() || "";
            const slug = p.uniqueSlug || p.slug || "";
            const imageId = p.virtuals?.previewImage?.imageId || p.previewImage?.imageId || null;
            return {
              id: p.id,
              title: title || (p.virtuals?.title || p.title || ""),
              subtitle: p.virtuals?.subtitle || "",
              slug,
              url: p.canonicalUrl || `https://medium.com/@${username}/${slug}`,
              previewImage: imageId ? `https://miro.medium.com/fit/c/800/420/${imageId}` : null,
              publishedAt: p.firstPublishedAt || 0,
            };
          });
          posts.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
        } catch (e) {
          // JSON parse error -> fall through to RSS fallback
          posts = [];
        }
      }
    } catch (e) {
      posts = [];
    }

    // If JSON returned nothing, try RSS
    if (!posts || posts.length === 0) {
      try {
        const rssUrl = `https://medium.com/feed/@${username}`;
        const rssRes = await fetch(rssUrl, { headers: { Accept: "application/xml, text/xml" } });
        if (rssRes.ok) {
          const xmlText = await rssRes.text();
          const rssPosts = parseRssItems(xmlText, username);
          if (rssPosts && rssPosts.length) {
            posts = rssPosts;
            posts.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
          }
        }
      } catch (e) {
        // ignore; posts may stay empty
      }
    }

    const out = { posts };
    CACHE.set(cacheKey, { t: now(), data: out });

    return new Response(JSON.stringify(out), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Medium route unexpected error:", err);
    return new Response(JSON.stringify({ error: "Server error", message: String(err?.message || err) }), { status: 500 });
  }
}

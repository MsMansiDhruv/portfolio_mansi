export function titleCase(value = "") {
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function unique(list = []) {
  return Array.from(new Set(list.filter(Boolean)));
}

export function asBullets(items = []) {
  return unique(items.map((item) => String(item).trim()).filter(Boolean));
}

export function asTextList(items = [], separator = " ") {
  return asBullets(items).join(separator);
}

export function scoreTerms(text = "", terms = [], weight = 1) {
  const normalizedText = normalizeText(text);
  return terms.reduce((score, term) => {
    const normalizedTerm = normalizeText(term);
    return normalizedTerm && normalizedText.includes(normalizedTerm) ? score + weight : score;
  }, 0);
}

export function getSectionValue(document = {}, keys = []) {
  for (const key of keys) {
    const value = document?.[key];
    if (Array.isArray(value) && value.length) return value;
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

export function section(heading, bodyOrBullets) {
  if (!bodyOrBullets) return null;
  if (Array.isArray(bodyOrBullets) && !bodyOrBullets.length) return null;
  return Array.isArray(bodyOrBullets)
    ? { heading, bullets: asBullets(bodyOrBullets) }
    : { heading, body: String(bodyOrBullets).trim() };
}

export function firstPersonSentence(subject, detail) {
  return `${subject} ${detail}`.replace(/\s+/g, " ").trim();
}

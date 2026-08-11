/**
 * Repairs LLM spacing glitches: concatenated lowercase words, single-point
 * camelCase merges, hyphen-glued segments, and article typos.
 */

const PROTECTED_TERMS = new Set([
  "database",
  "databases",
  "postgresql",
  "throughput",
  "dataframe",
  "dataframes",
  "redshift",
  "databricks",
  "snowflake",
  "ksqldb",
  "mapgroupswithstate",
  "groupbykey",
  "sort-merge",
  "liquid clustering",
  "power bi",
  "delta lake",
  "z-ordering",
]);

const ARTICLE_TYPOS: Record<string, string> = {
  implementa: "implement a",
  maintaina: "maintain a",
  ensurea: "ensure a",
  handlea: "handle a",
  avoida: "avoid a",
  usea: "use a",
  createa: "create a",
  builda: "build a",
};

const BOUNDARY_SUFFIXES = [
  "optimizations",
  "optimization",
  "implementation",
  "implement",
  "partitioning",
  "partition",
  "partitions",
  "clustering",
  "processing",
  "versioning",
  "awareness",
  "mechanics",
  "features",
  "architectural",
  "relational",
  "performance",
  "fundamental",
  "dimension",
  "streaming",
  "stateful",
  "broadcast",
  "standard",
  "distribution",
  "skewed",
  "because",
  "although",
  "however",
  "therefore",
  "otherwise",
  "without",
  "within",
  "between",
  "through",
  "against",
  "about",
  "under",
  "over",
  "again",
  "before",
  "after",
  "during",
  "while",
  "where",
  "when",
  "which",
  "that",
  "this",
  "with",
  "from",
  "into",
  "onto",
  "upon",
  "would",
  "could",
  "should",
  "already",
  "queries",
  "tables",
  "joins",
  "engine",
  "memory",
  "small",
  "large",
  "layer",
  "layers",
  "depth",
  "first",
  "based",
  "using",
  "used",
  "query",
  "table",
  "join",
  "keys",
  "have",
  "has",
  "had",
  "were",
  "was",
  "are",
  "been",
  "being",
  "will",
  "just",
  "only",
  "even",
  "still",
  "also",
  "then",
  "than",
  "not",
  "but",
  "for",
  "and",
  "the",
  "key",
  "data",
  "sql",
  "so",
  "core",
  "discuss",
  "shows",
  "time",
  "layout",
  "index",
  "basic",
  "filtered",
  "ensure",
  "handle",
  "avoid",
  "maintain",
  "induced",
  "manual",
  "layout",
  "enemies",
  "primary",
  "challenge",
  "velocity",
  "slowly",
  "changing",
  "effective",
  "range",
  "lookup",
  "costs",
  "not",
];

const SORTED_SUFFIXES = [...BOUNDARY_SUFFIXES].sort((a, b) => b.length - a.length);

function minPrefixLength(suffix: string): number {
  if (suffix.length >= 6) return 2;
  if (suffix.length >= 4) return 3;
  return 4;
}

function repairLowercaseMerge(token: string): string {
  const lower = token.toLowerCase();
  if (PROTECTED_TERMS.has(lower) || !/^[a-z]+$/i.test(token) || token.length < 6) {
    return token;
  }

  let result = token;
  for (let pass = 0; pass < 8; pass += 1) {
    let changed = false;
    for (const suffix of SORTED_SUFFIXES) {
      const minPrefix = minPrefixLength(suffix);
      const pattern = new RegExp(`([a-z]{${minPrefix},})(${suffix})$`, "i");
      const match = result.match(pattern);
      if (!match) continue;
      if (PROTECTED_TERMS.has(result.toLowerCase())) break;
      result = `${match[1]} ${match[2]}`;
      changed = true;
      break;
    }
    if (!changed) break;
  }

  return result;
}

/** Split only when there is a single camelCase boundary (avoids breaking API names). */
function repairSingleCamelMerge(token: string): string {
  if (PROTECTED_TERMS.has(token.toLowerCase())) return token;
  const upperCount = (token.match(/[A-Z]/g) || []).length;
  if (upperCount !== 1) return token;
  return token.replace(/([a-z]{2,})([A-Z][a-z]*)$/, "$1 $2");
}

function repairArticleTypo(token: string): string {
  return ARTICLE_TYPOS[token.toLowerCase()] || token;
}

function repairWordCore(core: string): string {
  if (!core) return core;
  if (PROTECTED_TERMS.has(core.toLowerCase())) return core;

  let result = repairArticleTypo(core);
  if (core.includes("-")) {
    return core
      .split("-")
      .map((part) => repairWordCore(part))
      .join("-");
  }

  result = repairSingleCamelMerge(result);
  result = repairLowercaseMerge(result);
  return result;
}

function repairToken(token: string): string {
  if (!token || !/[a-zA-Z]/.test(token)) return token;

  const match = token.match(/^([^a-zA-Z]*)([a-zA-Z][a-zA-Z-]*)([^a-zA-Z]*)$/);
  if (!match) return token;

  const [, lead, core, trail] = match;
  return `${lead}${repairWordCore(core)}${trail}`;
}

function repairPlainSegment(text: string): string {
  return text
    .split(/(\s+)/)
    .map((part) => (/^\s+$/.test(part) ? part : repairToken(part)))
    .join("");
}

/** Fix merged words in prose while preserving fenced code blocks. */
export function repairMergedWords(text: string): string {
  const input = String(text || "");
  if (!input) return input;

  const parts = input.split(/(```[\s\S]*?```)/g);
  return parts
    .map((part, index) => {
      if (index % 2 === 1) return part;
      return repairPlainSegment(part);
    })
    .join("");
}

import { readdirSync, readFileSync } from "fs";
import { join, relative, sep } from "path";
import type { KnowledgeDocument, KnowledgeFrontmatter, KnowledgeSection } from "../lib/ai/types";

const ROOT = join(process.cwd(), "knowledge");

const CATEGORY_MAP: Record<string, string> = {
  resume: "resume",
  projects: "project",
  technologies: "technology",
  philosophy: "philosophy",
  stories: "story",
  interview: "interview",
};

function walkMarkdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) return walkMarkdownFiles(absolutePath);
    if (entry.isFile() && entry.name.endsWith(".md")) return [absolutePath];
    return [];
  });
}

function toList(value = ""): string[] {
  const text = String(value).trim();
  if (!text) return [];
  const normalized = text.replace(/^\[/, "").replace(/\]$/, "");
  return normalized
    .split(",")
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean);
}

function parseFrontmatter(raw = ""): { frontmatter: KnowledgeFrontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw.trim() };

  const frontmatter: KnowledgeFrontmatter = {};
  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;
    const key = pair[1];
    const value = pair[2].trim();
    const list = toList(value);
    switch (key) {
      case "title":
        frontmatter.title = value.replace(/^['"]|['"]$/g, "");
        break;
      case "tags":
        frontmatter.tags = list;
        break;
      case "technologies":
        frontmatter.technologies = list;
        break;
      case "projects":
        frontmatter.projects = list;
        break;
      case "skills":
        frontmatter.skills = list;
        break;
      case "topics":
        frontmatter.topics = list;
        break;
      case "difficulty":
        frontmatter.difficulty = list;
        break;
      case "related_documents":
        frontmatter.relatedDocuments = list;
        break;
      case "summary":
        frontmatter.summary = value.replace(/^['"]|['"]$/g, "");
        break;
      case "category":
        frontmatter.category = value.replace(/^['"]|['"]$/g, "");
        break;
      case "kind":
        frontmatter.kind = value.replace(/^['"]|['"]$/g, "");
        break;
      case "status":
        frontmatter.status = value.replace(/^['"]|['"]$/g, "");
        break;
      default:
        break;
    }
  }

  return { frontmatter, body: match[2].trim() };
}

function isHeadingCandidate(line = "", nextLine = "") {
  return Boolean(
    line &&
      !line.startsWith("-") &&
      !line.startsWith("#") &&
      nextLine.startsWith("-") &&
      /^[A-Za-z0-9][A-Za-z0-9 ,/&'().:-]+$/.test(line) &&
      line.length < 90
  );
}

function parseSections(body = ""): KnowledgeSection[] {
  const lines = body.split(/\r?\n/);
  const sections: KnowledgeSection[] = [];
  let currentHeading = "Overview";
  let currentParagraphs: string[] = [];
  let currentBullets: string[] = [];

  const flush = () => {
    if (!currentParagraphs.length && !currentBullets.length) return;
    sections.push({
      heading: currentHeading,
      paragraphs: currentParagraphs,
      bullets: currentBullets,
    });
    currentParagraphs = [];
    currentBullets = [];
  };

  const nextMeaningfulLine = (index: number) => {
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const candidate = lines[cursor].trim();
      if (candidate) return candidate;
    }
    return "";
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) continue;

    if (line.startsWith("#")) {
      flush();
      currentHeading = line.replace(/^#+\s*/, "").trim();
      continue;
    }

    const nextLine = nextMeaningfulLine(index);
    if (isHeadingCandidate(line, nextLine)) {
      flush();
      currentHeading = line;
      continue;
    }

    if (line.startsWith("-")) {
      currentBullets.push(line.replace(/^-+\s*/, "").trim());
      continue;
    }

    currentParagraphs.push(line);
  }

  flush();
  return sections;
}

function normalizeRelatedDocuments(items: string[] = []) {
  return items.map((item) => {
    const value = item.trim();
    if (!value) return value;
    if (value.startsWith("knowledge/") || value.startsWith("/")) return value.replace(/\\/g, "/");
    if (value.endsWith(".md")) return `knowledge/${value.replace(/\\/g, "/")}`;
    return value;
  });
}

function titleFrom(fileName: string, frontmatter: KnowledgeFrontmatter, sections: KnowledgeSection[]) {
  if (frontmatter.title) return frontmatter.title;
  const heading = sections.find((section) => section.heading && section.heading !== "Overview");
  if (heading?.heading) return heading.heading;
  return fileName.replace(/[-_]+/g, " ").replace(/\.md$/, "");
}

function summaryFrom(frontmatter: KnowledgeFrontmatter, sections: KnowledgeSection[], body = "") {
  if (frontmatter.summary) return frontmatter.summary;
  const firstSection = sections[0];
  const firstParagraph = firstSection?.paragraphs?.[0];
  if (firstParagraph) return firstParagraph;
  const firstBullet = firstSection?.bullets?.[0];
  if (firstBullet) return firstBullet;
  return body.split(/\r?\n/).map((line) => line.trim()).find(Boolean) || "";
}

function excerptFrom(body = "") {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(" ");
}

function buildDocument(filePath: string): KnowledgeDocument {
  const relativePath = relative(ROOT, filePath).replace(/\\/g, "/");
  const [categoryFolder = "misc"] = relativePath.split("/");
  const semanticCategory = CATEGORY_MAP[categoryFolder] || categoryFolder;
  const raw = readFileSync(filePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(raw);
  const sections = parseSections(body);
  const slug = relativePath.replace(/\.md$/, "").split("/").pop() || relativePath.replace(/\.md$/, "");
  const title = titleFrom(slug, frontmatter, sections);
  const summary = summaryFrom(frontmatter, sections, body);
  const tags = frontmatter.tags || [];
  const technologies = frontmatter.technologies || [];
  const projects = frontmatter.projects || [];
  const skills = frontmatter.skills || [];
  const topics = frontmatter.topics || [];
  const difficulty = frontmatter.difficulty || [];
  const relatedDocuments = normalizeRelatedDocuments(frontmatter.relatedDocuments || []);

  return {
    id: `${semanticCategory}/${slug}`,
    title,
    slug,
    path: relativePath,
    category: semanticCategory,
    tags,
    technologies,
    projects,
    skills,
    topics,
    difficulty,
    relatedDocuments,
    summary,
    excerpt: excerptFrom(body),
    sections,
    frontmatter,
    content: body,
  };
}

const knowledgeFiles = walkMarkdownFiles(ROOT);

export const knowledgeCatalog: KnowledgeDocument[] = knowledgeFiles.map(buildDocument).sort((left, right) => {
  if (left.category === right.category) return left.title.localeCompare(right.title);
  return left.category.localeCompare(right.category);
});

export const knowledgeIndex = knowledgeCatalog;

export const knowledgeById = Object.fromEntries(knowledgeCatalog.map((document) => [document.id, document]));

export const knowledgeTree = knowledgeCatalog.reduce<Record<string, KnowledgeDocument[]>>((tree, document) => {
  const bucket = tree[document.category] || [];
  bucket.push(document);
  tree[document.category] = bucket;
  return tree;
}, {});

export function loadKnowledge() {
  return knowledgeCatalog;
}

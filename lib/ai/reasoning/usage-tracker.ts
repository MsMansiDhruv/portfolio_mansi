export type UsageTracker = {
  documentIds: Set<string>;
  topics: Set<string>;
  technologies: Set<string>;
};

export function createUsageTracker(): UsageTracker {
  return {
    documentIds: new Set(),
    topics: new Set(),
    technologies: new Set(),
  };
}

export function trackDocument(tracker: UsageTracker | undefined, docId: string | undefined) {
  if (!tracker || !docId) return;
  tracker.documentIds.add(docId);
}

export function trackTechnology(tracker: UsageTracker | undefined, label: string | undefined) {
  if (!tracker || !label) return;
  tracker.technologies.add(label.trim());
}

export function trackTopic(tracker: UsageTracker | undefined, label: string | undefined) {
  if (!tracker || !label) return;
  tracker.topics.add(label.trim());
}

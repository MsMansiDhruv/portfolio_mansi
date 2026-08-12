const STORAGE_KEY = "mansi-universe-explored";

export function markNodeExplored(nodeId) {
  if (typeof window === "undefined" || !nodeId) return;
  try {
    const set = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    set.add(nodeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore quota / private mode */
  }
}

export function getExploredNodes() {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

export function getExplorationRatio(totalNodes) {
  if (!totalNodes) return 0;
  return getExploredNodes().size / totalNodes;
}

export function isUniverseAwakened(totalNodes, threshold = 0.55) {
  return getExplorationRatio(totalNodes) >= threshold;
}

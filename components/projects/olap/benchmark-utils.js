/** Numeric helpers for OLAP benchmark bars — values only, no invented scores. */

export function parseMs(value) {
  const m = String(value).match(/^([\d,]+)\s*ms$/i);
  if (!m) return null;
  return Number(m[1].replace(/,/g, ""));
}

export function parseMinSec(value) {
  const min = String(value).match(/^([\d.]+)\s*min$/i);
  if (min) return Number(min[1]) * 60_000;
  const sec = String(value).match(/^([\d.]+)\s*sec$/i);
  if (sec) return Number(sec[1]) * 1000;
  return null;
}

export function workloadNumeric(value) {
  return parseMs(value) ?? parseMinSec(value);
}

export const BENCHMARK_ENGINES = [
  { key: "redshift", label: "Redshift" },
  { key: "aurora", label: "Aurora" },
  { key: "s3", label: "S3 Tables" },
];

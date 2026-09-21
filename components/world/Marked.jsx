import { Fragment } from "react";

const TERM =
  /^(power|energy|cloud|halls|AI factory|interconnection|gigawatts|lakehouse|source of truth|Correctness|complexity|pipelines|trade-offs|Databricks|architecture|decisions)$/i;
const SPLIT =
  /(\b(?:power|energy|cloud|halls|AI factory|interconnection|gigawatts|lakehouse|source of truth|Correctness|complexity|pipelines|trade-offs|Databricks|architecture|decisions)\b)/gi;

export default function Marked({ text }) {
  if (!text) return null;
  return String(text)
    .split(SPLIT)
    .map((part, i) =>
      TERM.test(part) ? (
        <em key={`${part}-${i}`} className="wd-mark">
          {part}
        </em>
      ) : (
        <Fragment key={`${part}-${i}`}>{part}</Fragment>
      )
    );
}

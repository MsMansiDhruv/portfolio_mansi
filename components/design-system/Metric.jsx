import { cn } from "../../lib/cn";
import { Tag } from "./Tag";

export function Metric({
  label,
  value,
  hint,
  delta,
  deltaDirection = "neutral",
  badge,
  className,
  ...props
}) {
  const deltaClass =
    deltaDirection === "up"
      ? "ds-metric__delta--up"
      : deltaDirection === "down"
        ? "ds-metric__delta--down"
        : "ds-metric__delta--neutral";

  return (
    <div className={cn("ds-metric", className)} {...props}>
      {label ? <span className="ds-metric__label">{label}</span> : null}
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="ds-metric__value">{value}</span>
        {badge ? <Tag variant="accent">{badge}</Tag> : null}
      </div>
      {delta != null ? (
        <span className={cn("ds-metric__delta", deltaClass)}>
          {deltaDirection === "up" ? "↑" : deltaDirection === "down" ? "↓" : "·"} {delta}
        </span>
      ) : null}
      {hint ? <span className="ds-metric__hint">{hint}</span> : null}
    </div>
  );
}

export function MetricGrid({ columns = 3, className, children, ...props }) {
  return (
    <div
      className={cn("grid gap-6", className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

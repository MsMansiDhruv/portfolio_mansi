import { cn } from "../../lib/cn";
import { Tag } from "../Tag";

const STATUS_VARIANT = {
  success: "success",
  running: "data",
  pending: "outline",
  failed: "error",
  skipped: "default",
};

export function Pipeline({ title, description, className, children, ...props }) {
  return (
    <div className={cn("ds-pipeline", className)} {...props}>
      {(title || description) && (
        <div className="mb-4">
          {title ? <h4 className="m-0 font-semibold text-[var(--ds-text)]">{title}</h4> : null}
          {description ? (
            <p className="m-0 mt-1 text-sm text-[var(--ds-text-muted)]">{description}</p>
          ) : null}
        </div>
      )}
      <div className="ds-pipeline__row">{children}</div>
    </div>
  );
}

export function PipelineStage({
  name,
  meta,
  status = "pending",
  tags,
  className,
  ...props
}) {
  return (
    <div className={cn("ds-pipeline__stage", `ds-pipeline__stage--${status}`, className)} {...props}>
      <div className="flex items-start justify-between gap-2">
        <span className="ds-pipeline__stage-name">{name}</span>
        <Tag variant={STATUS_VARIANT[status] || "outline"} dot>
          {status}
        </Tag>
      </div>
      {meta ? <span className="ds-pipeline__stage-meta">{meta}</span> : null}
      {tags?.length ? (
        <div className="flex flex-wrap gap-1 mt-1">
          {tags.map((t) => (
            <Tag key={t} variant="outline">
              {t}
            </Tag>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PipelineTimeline({ steps, className }) {
  return (
    <Pipeline className={className}>
      {steps.map((step) => (
        <PipelineStage key={step.name} {...step} />
      ))}
    </Pipeline>
  );
}

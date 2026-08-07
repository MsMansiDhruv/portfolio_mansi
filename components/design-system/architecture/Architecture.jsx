import { cn } from "../../lib/cn";
import { Tag } from "../Tag";

export function ArchDiagram({ title, description, className, children, ...props }) {
  return (
    <div className={cn("ds-arch", className)} {...props}>
      {(title || description) && (
        <div className="mb-2">
          {title ? (
            <h4 className="m-0 text-[var(--ds-text-base)] font-semibold text-[var(--ds-text)]">{title}</h4>
          ) : null}
          {description ? (
            <p className="m-0 mt-1 text-sm text-[var(--ds-text-muted)]">{description}</p>
          ) : null}
        </div>
      )}
      {children}
    </div>
  );
}

export function ArchLayer({ label, className, children, ...props }) {
  return (
    <div className={cn("ds-arch__layer", className)} {...props}>
      {label ? <span className="ds-arch__layer-label">{label}</span> : null}
      {children}
    </div>
  );
}

export function ArchNode({ title, subtitle, badge, variant = "default", className, ...props }) {
  return (
    <div
      className={cn("ds-arch__node", className)}
      style={
        variant === "accent"
          ? { borderColor: "var(--ds-accent)", boxShadow: "var(--ds-shadow-glow)" }
          : variant === "data"
            ? { borderColor: "var(--ds-data)" }
            : undefined
      }
      {...props}
    >
      <div className="flex items-center gap-2 w-full">
        <span className="ds-arch__node-title">{title}</span>
        {badge ? <Tag variant="outline">{badge}</Tag> : null}
      </div>
      {subtitle ? <span className="ds-arch__node-sub">{subtitle}</span> : null}
    </div>
  );
}

export function ArchConnector({ className, ...props }) {
  return <div className={cn("ds-arch__connector", className)} aria-hidden {...props} />;
}

/** Opinionated stack: ingestion → storage → compute → serving */
export function ArchReferenceStack({ className }) {
  return (
    <ArchDiagram title="Reference architecture" description="Layered data platform (illustrative)" className={className}>
      <ArchLayer label="Serving &amp; APIs">
        <ArchNode title="BI / Metrics" subtitle="Semantic layer" />
        <ArchConnector />
        <ArchNode title="REST / GraphQL" subtitle="Product APIs" variant="accent" />
      </ArchLayer>
      <ArchLayer label="Compute">
        <ArchNode title="Spark / dbt" subtitle="Transform" variant="data" />
        <ArchConnector />
        <ArchNode title="ML Training" subtitle="Batch + features" />
      </ArchLayer>
      <ArchLayer label="Storage">
        <ArchNode title="Lakehouse" subtitle="Iceberg / Delta" variant="data" />
        <ArchConnector />
        <ArchNode title="Warehouse" subtitle="Analytics" />
      </ArchLayer>
      <ArchLayer label="Ingestion">
        <ArchNode title="CDC / Events" subtitle="Kafka" />
        <ArchConnector />
        <ArchNode title="Batch loads" subtitle="S3 / ADLS" />
      </ArchLayer>
    </ArchDiagram>
  );
}

import { cn } from "../../lib/cn";

const VARIANTS = {
  default: "ds-tag--default",
  accent: "ds-tag--accent",
  outline: "ds-tag--outline",
  success: "ds-tag--success",
  warning: "ds-tag--warning",
  error: "ds-tag--error",
  data: "ds-tag--data",
  pipeline: "ds-tag--pipeline",
};

export function Tag({
  variant = "default",
  dot = false,
  className,
  children,
  ...props
}) {
  return (
    <span
      className={cn("ds-tag", VARIANTS[variant], dot && "ds-tag--dot", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function TagGroup({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...props}>
      {children}
    </div>
  );
}

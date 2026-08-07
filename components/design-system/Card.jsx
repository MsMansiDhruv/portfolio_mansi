import { cn } from "../../lib/cn";

const VARIANTS = {
  default: "",
  elevated: "ds-card--elevated",
  glass: "ds-card--glass",
  interactive: "ds-card--interactive",
};

export function Card({
  variant = "default",
  className,
  children,
  padding,
  as: Component = "div",
  ...props
}) {
  return (
    <Component
      className={cn("ds-card", VARIANTS[variant], className)}
      style={padding != null ? { padding } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("ds-card__header", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("ds-text-title m-0", className)}
      style={{ fontSize: "var(--ds-text-lg)" }}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("ds-text-caption mt-1 mb-0", className)} {...props}>
      {children}
    </p>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn("ds-card__body", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("ds-card__footer", className)} {...props}>
      {children}
    </div>
  );
}

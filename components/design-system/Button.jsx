import { cn } from "../../../lib/cn";

const VARIANTS = {
  primary: "ds-btn--primary",
  secondary: "ds-btn--secondary",
  outline: "ds-btn--outline",
  ghost: "ds-btn--ghost",
  accent: "ds-btn--accent",
  danger: "ds-btn--danger",
  link: "ds-btn--link",
};

const SIZES = {
  sm: "ds-btn--sm",
  md: "ds-btn--md",
  lg: "ds-btn--lg",
};

/**
 * Premium button — Linear / Vercel inspired variants.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  leftIcon,
  rightIcon,
  fullWidth,
  ...props
}) {
  const classes = cn(
    "ds-btn ds-focus-ring",
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {leftIcon ? <span className="inline-flex shrink-0">{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span className="inline-flex shrink-0">{rightIcon}</span> : null}
    </>
  );

  if (props.href) {
    return (
      <a className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}

export function ButtonGroup({ className, children, ...props }) {
  return (
    <div
      className={cn("inline-flex rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] p-0.5 gap-0.5 bg-[var(--ds-bg-muted)]", className)}
      role="group"
      {...props}
    >
      {children}
    </div>
  );
}

import { cn } from "../../lib/cn";
import { spacingScale } from "../typography/Typography";

/**
 * Vertical/horizontal stack with token-based gap.
 */
export function Stack({
  direction = "column",
  gap = 4,
  align,
  justify,
  className,
  style,
  children,
  as: Component = "div",
  ...props
}) {
  const gapValue = spacingScale[gap] ?? spacingScale[4];

  return (
    <Component
      className={cn(className)}
      style={{
        display: "flex",
        flexDirection: direction === "row" ? "row" : "column",
        gap: gapValue,
        alignItems: align,
        justifyContent: justify,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Container({
  size = "6xl",
  className,
  children,
  ...props
}) {
  const maxWidth =
    size === "full"
      ? "100%"
      : size === "6xl"
        ? "72rem"
        : size === "5xl"
          ? "64rem"
          : "48rem";

  return (
    <div
      className={cn("mx-auto w-full px-4 md:px-6", className)}
      style={{ maxWidth }}
      {...props}
    >
      {children}
    </div>
  );
}

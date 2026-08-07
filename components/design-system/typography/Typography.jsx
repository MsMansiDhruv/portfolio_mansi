import { cn } from "../../../lib/cn";

const VARIANT_CLASS = {
  display: "ds-text-display",
  headline: "ds-text-headline",
  title: "ds-text-title",
  body: "ds-text-body",
  caption: "ds-text-caption",
  overline: "ds-text-overline",
};

const SIZE_MAP = {
  xs: { fontSize: "var(--ds-text-xs)" },
  sm: { fontSize: "var(--ds-text-sm)" },
  base: { fontSize: "var(--ds-text-base)" },
  md: { fontSize: "var(--ds-text-md)" },
  lg: { fontSize: "var(--ds-text-lg)" },
  xl: { fontSize: "var(--ds-text-xl)" },
  "2xl": { fontSize: "var(--ds-text-2xl)" },
  "3xl": { fontSize: "var(--ds-text-3xl)" },
  "4xl": { fontSize: "var(--ds-text-4xl)" },
  "5xl": { fontSize: "var(--ds-text-5xl)" },
  "6xl": { fontSize: "var(--ds-text-6xl)" },
};

const WEIGHT_MAP = {
  normal: "var(--ds-weight-normal)",
  medium: "var(--ds-weight-medium)",
  semibold: "var(--ds-weight-semibold)",
  bold: "var(--ds-weight-bold)",
};

const COLOR_MAP = {
  default: "var(--ds-text)",
  secondary: "var(--ds-text-secondary)",
  muted: "var(--ds-text-muted)",
  accent: "var(--ds-accent)",
  link: "var(--ds-text-link)",
  inverse: "var(--ds-text-inverse)",
};

/**
 * Typography primitive — maps to design tokens.
 */
export function Text({
  as: Component = "p",
  variant = "body",
  size,
  weight,
  color = "default",
  mono = false,
  className,
  style,
  children,
  ...props
}) {
  const variantClass = VARIANT_CLASS[variant];
  const useVariant = variantClass && !size;

  return (
    <Component
      className={cn(useVariant && variantClass, mono && "ds-font-mono", className)}
      style={{
        ...(size && SIZE_MAP[size] ? SIZE_MAP[size] : {}),
        ...(weight && WEIGHT_MAP[weight] ? { fontWeight: WEIGHT_MAP[weight] } : {}),
        color: COLOR_MAP[color] || color,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Display(props) {
  return <Text as="h1" variant="display" {...props} />;
}

export function Headline(props) {
  return <Text as="h2" variant="headline" {...props} />;
}

export function Title(props) {
  return <Text as="h3" variant="title" {...props} />;
}

export function Caption(props) {
  return <Text as="span" variant="caption" {...props} />;
}

export function Overline(props) {
  return <Text as="span" variant="overline" {...props} />;
}

/** Spacing scale reference (for docs / layout helpers) */
export const spacingScale = {
  0: "var(--ds-space-0)",
  px: "var(--ds-space-px)",
  0.5: "var(--ds-space-0-5)",
  1: "var(--ds-space-1)",
  1.5: "var(--ds-space-1-5)",
  2: "var(--ds-space-2)",
  2.5: "var(--ds-space-2-5)",
  3: "var(--ds-space-3)",
  3.5: "var(--ds-space-3-5)",
  4: "var(--ds-space-4)",
  5: "var(--ds-space-5)",
  6: "var(--ds-space-6)",
  7: "var(--ds-space-7)",
  8: "var(--ds-space-8)",
  9: "var(--ds-space-9)",
  10: "var(--ds-space-10)",
  11: "var(--ds-space-11)",
  12: "var(--ds-space-12)",
  14: "var(--ds-space-14)",
  16: "var(--ds-space-16)",
  20: "var(--ds-space-20)",
  24: "var(--ds-space-24)",
  32: "var(--ds-space-32)",
};

/** Color tokens export for programmatic use */
export const colorTokens = [
  "bg",
  "bg-subtle",
  "bg-muted",
  "text",
  "text-secondary",
  "text-muted",
  "accent",
  "success",
  "warning",
  "error",
  "info",
  "data",
  "pipeline",
];

export function tokenVar(name) {
  return `var(--ds-${name})`;
}

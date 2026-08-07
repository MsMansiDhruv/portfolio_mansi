/**
 * Premium Design System — public API
 *
 * Import styles once when adopting:
 *   import "../components/design-system/styles/index.css";
 */

/* Theme */
export { ThemeProvider, useDsTheme } from "./theme/ThemeProvider";
export { ThemeToggle } from "./theme/ThemeToggle";
export { useResolvedTheme } from "./theme/useResolvedTheme";

/* Typography & tokens */
export {
  Text,
  Display,
  Headline,
  Title,
  Caption,
  Overline,
  spacingScale,
  colorTokens,
  tokenVar,
} from "./typography/Typography";

/* Primitives */
export { Button, ButtonGroup } from "./Button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from "./Card";
export { Tag, TagGroup } from "./Tag";
export { Metric, MetricGrid } from "./Metric";
export { Stack, Container } from "./layout/Stack";
export { CodeBlock, InlineCode } from "./CodeBlock";

/* Overlays & navigation */
export { Modal } from "./Modal";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
export { Accordion, AccordionItem } from "./Accordion";
export { Nav, NavLink, NavSection, NavBar } from "./navigation/Nav";
export { Breadcrumb, breadcrumbsFromPath } from "./navigation/Breadcrumb";

/* Domain */
export {
  ArchDiagram,
  ArchLayer,
  ArchNode,
  ArchConnector,
  ArchReferenceStack,
} from "./architecture/Architecture";
export { Pipeline, PipelineStage, PipelineTimeline } from "./pipeline/Pipeline";

/* Charts */
export {
  Sparkline,
  BarChart,
  LineChart,
  DonutChart,
  chartColors,
} from "./charts/Charts";

/* Motion */
export {
  dsDuration,
  dsEase,
  dsTransition,
  dsStagger,
  dsVariants,
  motionGuidelines,
} from "./motion/motion";

export { dsColors, dsSpacing, dsRadii, dsTypography } from "./foundation/tokens";

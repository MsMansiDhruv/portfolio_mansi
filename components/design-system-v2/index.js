/**
 * Design System v2 - Main Export
 *
 * Premium design system inspired by Linear, Vercel, Stripe, Raycast, and OpenAI.
 * 
 * USAGE:
 * 1. Import the theme provider in your root layout:
 *    import { DSv2ThemeProvider } from '@/components/design-system-v2'
 *    import '@/components/design-system-v2/styles/index.css'
 *
 * 2. Wrap your app:
 *    <DSv2ThemeProvider>
 *      <YourApp />
 *    </DSv2ThemeProvider>
 *
 * 3. Use components throughout your app:
 *    import { Button, Card, Tag, Modal } from '@/components/design-system-v2'
 */

/* ============================================================================
   FOUNDATION & TOKENS
   ============================================================================ */

export {
  colors,
  themeTokens,
  typography,
  spacing,
  radii,
  shadows,
  borders,
  zIndex,
  breakpoints,
  transitions,
  designTokens,
} from './foundation/tokens';

/* ============================================================================
   THEME PROVIDER & UTILITIES
   ============================================================================ */

export {
  DSv2ThemeProvider,
  useTheme,
  useThemeColor,
  useThemeToken,
} from './theme/ThemeProvider';

/* ============================================================================
   MOTION & ANIMATIONS
   ============================================================================ */

export {
  motionConfig,
  motionVariants,
  hoverVariants,
  keyframeAnimations,
  animationUtilities,
  transitions as motionTransitions,
} from './motion/motion.js';

/* ============================================================================
   PRIMITIVE COMPONENTS
   ============================================================================ */

// Button
export { Button } from './primitives/Button.jsx';

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './primitives/Card.jsx';

// Tag & Badge
export { Tag, Badge, TagGroup } from './primitives/Tag.jsx';

// Metric & Stat
export { Metric, Stat, MetricGrid } from './primitives/Metric.jsx';

/* ============================================================================
   LAYOUT COMPONENTS
   ============================================================================ */

export {
  Container,
  Stack,
  Grid,
  Flex,
} from './layout/LayoutComponents.jsx';

/* ============================================================================
   OVERLAY & INTERACTION COMPONENTS
   ============================================================================ */

// Modal
export { Modal } from './overlay/Modal.jsx';

// Tabs
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from './overlay/Tabs.jsx';

// Accordion
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './overlay/Accordion.jsx';

/* ============================================================================
   NAVIGATION COMPONENTS
   ============================================================================ */

export {
  Breadcrumb,
  BreadcrumbItem,
  breadcrumbsFromPath,
  Nav,
  NavLink,
} from './navigation/Navigation.jsx';

/* ============================================================================
   DATA & CONTENT COMPONENTS
   ============================================================================ */

// Code
export { CodeBlock, InlineCode } from './data/CodeBlock.jsx';

// Architecture
export {
  Architecture,
  ArchLayer,
  ArchNode,
  ArchConnector,
  ArchReferenceStack,
} from './data/Architecture.jsx';

// Pipeline
export {
  Pipeline,
  PipelineStage,
  PipelineTimeline,
  PipelineTimelineItem,
} from './data/Pipeline.jsx';

// Charts
export {
  chartColors,
  Sparkline,
  BarChart,
  LineChart,
  DonutChart,
} from './data/Charts.jsx';

/* ============================================================================
   CSS IMPORT NOTICE
   ============================================================================ */

/**
 * To use the design system, import the styles in your root layout:
 * 
 * import './components/design-system-v2/styles/index.css'
 * 
 * This will provide:
 * - CSS custom properties for theming
 * - Button, card, tag, and other component styles
 * - Animation utilities
 * - Dark mode support
 */

export default {
  name: 'Design System v2',
  version: '1.0.0',
  description: 'Premium design system inspired by Linear, Vercel, Stripe, Raycast, and OpenAI',
};

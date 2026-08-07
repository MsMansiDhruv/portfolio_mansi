/**
 * Design System v2 - Documentation & Reference
 * 
 * A premium, production-ready design system inspired by:
 * - Linear (minimalist, refined)
 * - Vercel (modern, accessible)
 * - Stripe (professional, polished)
 * - Raycast (performance, attention to detail)
 * - OpenAI (bold, confident)
 */

/**
 * QUICK START
 * ===========
 * 
 * 1. Install if not already included:
 *    npm install framer-motion lucide-react
 * 
 * 2. Add to your root layout (app/layout.js):
 *    
 *    import '@/components/design-system-v2/styles/index.css'
 *    import { DSv2ThemeProvider } from '@/components/design-system-v2'
 *    
 *    export default function RootLayout({ children }) {
 *      return (
 *        <DSv2ThemeProvider>
 *          {children}
 *        </DSv2ThemeProvider>
 *      )
 *    }
 * 
 * 3. Use components anywhere:
 *    
 *    import { Button, Card, CardTitle, Container } from '@/components/design-system-v2'
 *    
 *    export default function Page() {
 *      return (
 *        <Container>
 *          <Card>
 *            <CardTitle>Hello World</CardTitle>
 *            <Button>Click me</Button>
 *          </Card>
 *        </Container>
 *      )
 *    }
 */

/**
 * COMPONENT CATEGORIES
 * ====================
 */

/**
 * FOUNDATION (Tokens)
 * -------------------
 * Core design tokens that define the system
 * 
 * - colors: Full palette (neutral, primary, success, warning, error, info)
 * - themeTokens: Light & dark mode semantic colors
 * - typography: Font families, weights, scales
 * - spacing: Consistent 4px-based scale
 * - radii: Border radius options
 * - shadows: Depth and layering
 * - borders: Border widths
 * - zIndex: Layering hierarchy
 * - breakpoints: Responsive design breakpoints
 * - transitions: Animation timing
 * 
 * Usage:
 *   import { spacing, colors, typography } from '@/components/design-system-v2'
 */

/**
 * THEME PROVIDER
 * ---------------
 * Light/dark mode management and color token provision
 * 
 * Components:
 *   - DSv2ThemeProvider: Root provider (wrap in layout)
 *   - useTheme: Hook to access current theme and tokens
 *   - useThemeColor: Helper for theme-aware colors
 *   - useThemeToken: Access specific token value
 * 
 * Usage:
 *   const { resolvedTheme, isDark, tokens, setTheme } = useTheme()
 *   setTheme('dark') // 'light' | 'dark' | 'system'
 */

/**
 * PRIMITIVES (Reusable UI Elements)
 * ----------------------------------
 * Small, focused, highly reusable components
 * 
 * Button
 *   Props: variant, size, disabled, isLoading, leftIcon, rightIcon, fullWidth
 *   Variants: primary, secondary, outline, ghost, danger, success
 *   Sizes: xs, sm, md, lg, xl
 * 
 * Card
 *   Props: variant, clickable
 *   Variants: default, elevated, outlined, ghost, interactive
 *   Children: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
 * 
 * Tag & Badge
 *   Tag: inline labels for categorization
 *   Badge: indicator badges for status/count
 *   Props: variant, size, icon, onRemove (Tag)
 *   TagGroup: container for multiple tags
 * 
 * Metric & Stat
 *   Metric: small labeled metric display
 *   Stat: larger prominent statistic
 *   MetricGrid: responsive grid of metrics
 *   Props: label, value, unit, trend, icon
 */

/**
 * LAYOUT COMPONENTS
 * ------------------
 * Building blocks for page and component layouts
 * 
 * Container
 *   Centered max-width container
 *   Sizes: sm, md, lg, xl, full
 *   Usage: <Container size="lg"><YourContent /></Container>
 * 
 * Stack
 *   Vertical or horizontal spacing container
 *   Props: direction (vertical|horizontal), gap, align, justify
 *   Gap options: xs, sm, md, lg, xl
 * 
 * Grid
 *   Responsive grid layout
 *   Props: cols (1-6), gap
 *   Automatically responsive (mobile-first)
 * 
 * Flex
 *   Fine-grained flex control
 *   Props: direction, wrap, gap, align, justify
 */

/**
 * OVERLAY & INTERACTION COMPONENTS
 * ----------------------------------
 * More complex components for user interaction
 * 
 * Modal
 *   Props: isOpen, onClose, title, description, size, closeButton, backdrop
 *   Sizes: sm, md, lg, xl, 2xl
 *   Features: Focus trap, keyboard handling (Escape), backdrop
 * 
 * Tabs
 *   Props: defaultValue, value, onValueChange, type (single|multiple)
 *   Components: TabsList, TabsTrigger, TabsContent
 *   Features: Keyboard accessible, controlled/uncontrolled
 * 
 * Accordion
 *   Props: type (single|multiple), defaultValue, value, onValueChange
 *   Components: AccordionItem, AccordionTrigger, AccordionContent
 *   Features: Single or multi-expand, keyboard accessible
 */

/**
 * NAVIGATION COMPONENTS
 * ----------------------
 * For page and section navigation
 * 
 * Breadcrumb
 *   Shows page hierarchy
 *   Children: BreadcrumbItem
 *   Helper: breadcrumbsFromPath(pathname) - auto-generate from URL
 * 
 * Nav
 *   Header navigation container
 *   Props: sticky
 *   Children: NavLink
 * 
 * NavLink
 *   Navigation link
 *   Props: href, active
 */

/**
 * DATA & CONTENT COMPONENTS
 * --------------------------
 * For displaying code, architecture, pipelines, and data
 * 
 * CodeBlock
 *   Syntax-highlighted code display
 *   Props: code, language, showLineNumbers, copyable
 *   Features: Copy to clipboard, language badge
 * 
 * InlineCode
 *   Inline monospace code styling
 * 
 * Architecture
 *   SVG-based system architecture diagrams
 *   Components: ArchLayer, ArchNode, ArchConnector, ArchReferenceStack
 * 
 * Pipeline
 *   Data/process pipeline visualization
 *   Components: PipelineStage, PipelineTimeline, PipelineTimelineItem
 *   Props: orientation (horizontal|vertical)
 *   Status: pending, in-progress, completed, failed
 * 
 * Charts
 *   Simple data visualizations
 *   Components: Sparkline, BarChart, LineChart, DonutChart
 *   Features: Responsive, customizable colors
 */

/**
 * MOTION & ANIMATIONS
 * --------------------
 * Consistent, performant animations across the system
 * 
 * motionVariants
 *   Pre-built Framer Motion variants
 *   - fadeIn, fadeInUp, scaleIn
 *   - slideInRight, slideInLeft
 *   - staggerContainer, staggerItem
 * 
 * hoverVariants
 *   Pre-built hover/interaction states
 *   - lift: subtle upward movement
 *   - scale: slight magnification
 *   - glow: box-shadow effect
 *   - interactive: combined lift + scale
 * 
 * motionConfig
 *   Timing functions and durations
 *   - durations: instant, fast, base, slow, slower
 *   - eases: linear, ease, easeIn, easeOut, easeInOut, smooth, spring
 * 
 * CSS Animations
 *   Global animations applied via CSS
 *   - .ds-animate-fadeIn, .ds-animate-scaleIn, etc.
 *   - .ds-animate-pulse, .ds-animate-spin, .ds-animate-bounce
 */

/**
 * THEMING & CUSTOMIZATION
 * ========================
 * 
 * CSS Variables (Light Mode)
 *   --ds-bg: background
 *   --ds-surface: card/surface background
 *   --ds-text: primary text
 *   --ds-primary, --ds-secondary: brand colors
 *   --ds-border, --ds-border-subtle: dividers
 *   And more...
 * 
 * Dark Mode
 *   Automatically switched when .dark class is present
 *   Uses different color values for all CSS variables
 *   Handled by DSv2ThemeProvider
 * 
 * Custom Theme Colors
 *   Override CSS variables in your app
 *   Example:
 *     :root {
 *       --ds-primary: #your-color;
 *     }
 */

/**
 * ACCESSIBILITY
 * ==============
 * 
 * Built-in Features
 *   - Semantic HTML (nav, button, role attributes)
 *   - Keyboard navigation support
 *   - ARIA labels and descriptions
 *   - Focus indicators with contrasting colors
 *   - Color contrast compliant
 *   - Reduced motion support (respects prefers-reduced-motion)
 * 
 * Best Practices
 *   - Use semantic components (Button vs div with click)
 *   - Always provide alt text for images
 *   - Use aria-label for icon-only buttons
 *   - Test with keyboard navigation
 *   - Check color contrast ratios
 */

/**
 * PERFORMANCE TIPS
 * =================
 * 
 * 1. Use Code Splitting
 *    import { Button } from '@/components/design-system-v2'
 *    // Only Button component is imported, not entire system
 * 
 * 2. Lazy Load Complex Components
 *    const Modal = dynamic(() => import('@/components/design-system-v2'), {
 *      loading: () => <div>Loading...</div>
 *    })
 * 
 * 3. Memoize Theme-Dependent Components
 *    const MyComponent = React.memo(({ isDark }) => ...)
 * 
 * 4. Use CSS Variables for Theming
 *    Avoiding runtime color calculations keeps things fast
 * 
 * 5. Motion Preferences
 *    Automatically respects prefers-reduced-motion
 *    Animations are automatically disabled in these cases
 */

/**
 * BROWSER SUPPORT
 * ================
 * 
 * Modern Browsers (ES2020+)
 *   - Chrome/Edge 88+
 *   - Firefox 87+
 *   - Safari 14+
 * 
 * Features
 *   - CSS Grid & Flexbox
 *   - CSS Custom Properties
 *   - CSS Transitions & Transforms
 *   - SVG Support
 *   - localStorage (for theme preference)
 */

/**
 * TROUBLESHOOTING
 * ================
 * 
 * Theme not working?
 *   - Make sure DSv2ThemeProvider is in your root layout
 *   - CSS file must be imported: import '@/components/design-system-v2/styles/index.css'
 *   - Check that .dark class is being applied to html element
 * 
 * Components styled incorrectly?
 *   - Verify CSS file is imported
 *   - Check for CSS conflicts with other frameworks
 *   - Use CSS modules or component-level styles if needed
 * 
 * Animations not smooth?
 *   - Check browser hardware acceleration settings
 *   - Consider reducing animation durations for low-power devices
 *   - Test with prefers-reduced-motion
 * 
 * Accessibility tests failing?
 *   - Use semantic components (Button, not div)
 *   - Provide aria-labels for icon-only elements
 *   - Ensure sufficient color contrast
 *   - Test with keyboard navigation
 */

export default 'Design System v2 Documentation';

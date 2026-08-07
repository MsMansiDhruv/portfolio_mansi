# Design System v2 - Usage Examples

A collection of practical examples and common patterns for using the Design System v2.

## Table of Contents
1. [Setup & Installation](#setup--installation)
2. [Basic Components](#basic-components)
3. [Layout Patterns](#layout-patterns)
4. [Forms & Interaction](#forms--interaction)
5. [Data Display](#data-display)
6. [Navigation](#navigation)
7. [Theming](#theming)
8. [Advanced Patterns](#advanced-patterns)

---

## Setup & Installation

### Step 1: Add to Root Layout

```jsx
// app/layout.js
import '@/components/design-system-v2/styles/index.css'
import { DSv2ThemeProvider } from '@/components/design-system-v2'

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <DSv2ThemeProvider defaultTheme="system" storageKey="theme">
          <Nav />
          {children}
          <Footer />
        </DSv2ThemeProvider>
      </body>
    </html>
  )
}
```

### Step 2: Import Components

Pick what you need - components are tree-shakeable:

```jsx
import { 
  Button, 
  Card, 
  CardTitle, 
  Container,
  Stack,
  useTheme 
} from '@/components/design-system-v2'
```

### Step 3: Use CSS Variables (Optional)

Override default theme colors in your global CSS:

```css
:root {
  --ds-primary: #0066ff;
  --ds-primary-hover: #0052cc;
  --ds-primary-active: #003d99;
}

.dark {
  --ds-primary: #1a88ff;
  --ds-primary-hover: #3399ff;
  --ds-primary-active: #0055cc;
}
```

---

## Basic Components

### Button Variants

```jsx
import { Button } from '@/components/design-system-v2'

export function ButtonShowcase() {
  return (
    <>
      {/* Primary action */}
      <Button variant="primary">Save Changes</Button>

      {/* Secondary action */}
      <Button variant="secondary">Cancel</Button>

      {/* Outline for lower emphasis */}
      <Button variant="outline">Learn More</Button>

      {/* Ghost for tertiary */}
      <Button variant="ghost">Skip</Button>

      {/* Danger for destructive */}
      <Button variant="danger">Delete</Button>

      {/* Success for positive outcome */}
      <Button variant="success">Published</Button>

      {/* With icons */}
      <Button leftIcon={<Plus />}>Add New</Button>
      <Button rightIcon={<ChevronRight />}>Next</Button>

      {/* Loading state */}
      <Button isLoading>Saving...</Button>

      {/* Disabled */}
      <Button disabled>Unavailable</Button>

      {/* Different sizes */}
      <Button size="xs">Tiny</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>

      {/* Full width */}
      <Button fullWidth>Full Width Button</Button>

      {/* As link */}
      <Button as="a" href="/blog" variant="primary">
        Read Blog
      </Button>
    </>
  )
}
```

### Card Patterns

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '@/components/design-system-v2'

export function CardPatterns() {
  return (
    <>
      {/* Basic card */}
      <Card>
        <CardHeader>
          <CardTitle>Article Title</CardTitle>
          <CardDescription>Published on March 15, 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here...</p>
        </CardContent>
      </Card>

      {/* Card with footer (CTA) */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Get access to premium features</p>
        </CardContent>
        <CardFooter>
          <Button variant="primary">Upgrade Now</Button>
        </CardFooter>
      </Card>

      {/* Elevated card */}
      <Card variant="elevated">
        <CardContent>This card has a subtle shadow</CardContent>
      </Card>

      {/* Outlined card */}
      <Card variant="outlined">
        <CardContent>This card has a border</CardContent>
      </Card>

      {/* Interactive card */}
      <Card variant="interactive" clickable>
        <CardHeader>
          <CardTitle>Category</CardTitle>
        </CardHeader>
        <CardContent>Click anywhere in this card to interact</CardContent>
      </Card>

      {/* Ghost card (minimal) */}
      <Card variant="ghost">
        <CardContent>Minimal styling, transparent background</CardContent>
      </Card>
    </>
  )
}
```

### Tags & Badges

```jsx
import { Tag, Badge, TagGroup } from '@/components/design-system-v2'

export function TagsAndBadges() {
  const [tags, setTags] = useState(['React', 'Next.js', 'Tailwind'])

  return (
    <>
      {/* Tag group */}
      <TagGroup>
        {tags.map(tag => (
          <Tag 
            key={tag}
            variant="primary"
            onRemove={() => setTags(tags.filter(t => t !== tag))}
          >
            {tag}
          </Tag>
        ))}
      </TagGroup>

      {/* Badge for status */}
      <Badge variant="dot" color="success">Active</Badge>
      <Badge variant="dot" color="error">Inactive</Badge>
      <Badge variant="dot" color="warning">Pending</Badge>

      {/* Animated badge */}
      <Badge animated color="info">New</Badge>

      {/* With icon */}
      <Tag leftIcon={<Check />} variant="success">Completed</Tag>
    </>
  )
}
```

### Metrics & Stats

```jsx
import { Metric, Stat, MetricGrid } from '@/components/design-system-v2'

export function MetricsExample() {
  return (
    <>
      {/* Small metric */}
      <Metric 
        label="Total Views" 
        value={2450} 
        trend={{ value: 12, direction: 'up' }}
      />

      {/* Larger stat */}
      <Stat
        label="Revenue"
        value="$45,231"
        unit="this month"
        icon={<TrendingUp />}
      />

      {/* Grid of metrics */}
      <MetricGrid cols={3}>
        <Metric label="Users" value={1234} trend={{ value: 5, direction: 'up' }} />
        <Metric label="Sessions" value={5678} trend={{ value: 2, direction: 'down' }} />
        <Metric label="Conversion" value="3.24%" trend={{ value: 0.5, direction: 'up' }} />
      </MetricGrid>

      {/* Responsive grid */}
      <MetricGrid cols={{ sm: 1, md: 2, lg: 3, xl: 4 }}>
        <Metric label="Q1" value="$10K" />
        <Metric label="Q2" value="$15K" />
        <Metric label="Q3" value="$22K" />
        <Metric label="Q4" value="$18K" />
      </MetricGrid>
    </>
  )
}
```

---

## Layout Patterns

### Container & Stack

```jsx
import { Container, Stack, Button } from '@/components/design-system-v2'

export function LayoutExample() {
  return (
    <>
      {/* Centered container */}
      <Container size="lg">
        <h1>Page Title</h1>
        <p>Content is centered and has max-width</p>
      </Container>

      {/* Vertical stack */}
      <Stack direction="vertical" gap="lg">
        <h2>Section 1</h2>
        <p>Paragraph with consistent vertical spacing</p>
        <Button>Action</Button>
      </Stack>

      {/* Horizontal stack (spacing between) */}
      <Stack direction="horizontal" gap="md" justify="space-between">
        <span>Left content</span>
        <span>Right content</span>
      </Stack>

      {/* Nested stacks */}
      <Stack direction="vertical" gap="xl">
        <h2>Vertical Layout</h2>
        <Stack direction="horizontal" gap="md">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </Stack>
      </Stack>
    </>
  )
}
```

### Grid & Responsive

```jsx
import { Grid, Card, CardTitle } from '@/components/design-system-v2'

export function ResponsiveGrid() {
  return (
    <>
      {/* Auto columns */}
      <Grid cols={3} gap="lg">
        <Card><CardTitle>Card 1</CardTitle></Card>
        <Card><CardTitle>Card 2</CardTitle></Card>
        <Card><CardTitle>Card 3</CardTitle></Card>
      </Grid>

      {/* Fully responsive */}
      <Grid 
        cols={{ 
          base: 1,      // Mobile
          sm: 2,        // Small screens
          md: 3,        // Medium
          lg: 4,        // Large
          xl: 6         // Extra large
        }} 
        gap="md"
      >
        {[...Array(12)].map((_, i) => (
          <Card key={i}>
            <CardTitle>Item {i + 1}</CardTitle>
          </Card>
        ))}
      </Grid>
    </>
  )
}
```

### Flex Control

```jsx
import { Flex, Button } from '@/components/design-system-v2'

export function FlexPatterns() {
  return (
    <>
      {/* Horizontal center */}
      <Flex justify="center" align="center">
        <Button>Centered Button</Button>
      </Flex>

      {/* Space between */}
      <Flex justify="space-between">
        <span>Left</span>
        <span>Right</span>
      </Flex>

      {/* Column with wrap */}
      <Flex direction="column" gap="md" wrap>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
      </Flex>
    </>
  )
}
```

---

## Forms & Interaction

### Tabs Example

```jsx
import { Tabs, TabsList, TabsTrigger, TabsContent, Card } from '@/components/design-system-v2'

export function TabsExample() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <p>Overview content here</p>
        </Card>
      </TabsContent>

      <TabsContent value="details">
        <Card>
          <p>Details content here</p>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <Card>
          <p>Settings content here</p>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
```

### Accordion Example

```jsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/design-system-v2'

export function FAQSection() {
  return (
    <Accordion type="single" defaultValue="q1">
      <AccordionItem value="q1">
        <AccordionTrigger>What is included?</AccordionTrigger>
        <AccordionContent>
          Full access to all premium features and 24/7 support
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="q2">
        <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
        <AccordionContent>
          Yes, you can cancel your subscription at any time without penalties
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="q3">
        <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
        <AccordionContent>
          We offer a 30-day money-back guarantee for all plans
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

### Modal Example

```jsx
import { Modal, Button } from '@/components/design-system-v2'
import { useState } from 'react'

export function ModalExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        description="This action cannot be undone"
        size="md"
      >
        <div className="space-y-4">
          <p>Are you sure you want to continue?</p>
          <div className="flex gap-2">
            <Button variant="danger" onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
```

---

## Data Display

### Code Block

```jsx
import { CodeBlock, InlineCode } from '@/components/design-system-v2'

export function CodeExample() {
  const code = `function greet(name) {
  return \`Hello, \${name}!\`
}`

  return (
    <>
      <CodeBlock
        code={code}
        language="javascript"
        showLineNumbers
        copyable
      />

      <p>
        Use <InlineCode>const variable = value</InlineCode> to declare variables
      </p>
    </>
  )
}
```

### Charts

```jsx
import { Sparkline, BarChart, LineChart, DonutChart } from '@/components/design-system-v2'

export function ChartsExample() {
  const data = [10, 20, 15, 30, 25, 35]

  return (
    <>
      {/* Tiny inline sparkline */}
      <Sparkline data={data} height={20} stroke="currentColor" />

      {/* Bar chart */}
      <BarChart
        data={[
          { label: 'Jan', value: 10 },
          { label: 'Feb', value: 15 },
          { label: 'Mar', value: 20 }
        ]}
        height={200}
      />

      {/* Line chart */}
      <LineChart
        data={data}
        height={150}
        width={300}
      />

      {/* Donut chart */}
      <DonutChart
        data={[
          { label: 'Completed', value: 65 },
          { label: 'Pending', value: 25 },
          { label: 'Failed', value: 10 }
        ]}
        width={200}
        height={200}
      />
    </>
  )
}
```

### Pipeline

```jsx
import { Pipeline, PipelineStage, PipelineTimeline, PipelineTimelineItem } from '@/components/design-system-v2'

export function ProcessFlow() {
  return (
    <>
      {/* Horizontal pipeline */}
      <Pipeline orientation="horizontal">
        <PipelineStage status="completed" label="Design" />
        <PipelineStage status="completed" label="Development" />
        <PipelineStage status="in-progress" label="Testing" />
        <PipelineStage status="pending" label="Deploy" />
      </Pipeline>

      {/* Vertical timeline */}
      <PipelineTimeline>
        <PipelineTimelineItem status="completed" title="Project Started" />
        <PipelineTimelineItem status="completed" title="Design Phase" />
        <PipelineTimelineItem status="in-progress" title="Development" />
        <PipelineTimelineItem status="pending" title="Launch" />
      </PipelineTimeline>
    </>
  )
}
```

---

## Navigation

### Navigation Bar

```jsx
import { Nav, NavLink, useTheme } from '@/components/design-system-v2'

export function HeaderNav() {
  const { isDark, setTheme } = useTheme()

  return (
    <Nav sticky>
      <NavLink href="/" active>Home</NavLink>
      <NavLink href="/blog">Blog</NavLink>
      <NavLink href="/projects">Projects</NavLink>
      
      <button 
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="ml-auto"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </Nav>
  )
}
```

### Breadcrumbs

```jsx
import { Breadcrumb, BreadcrumbItem, breadcrumbsFromPath } from '@/components/design-system-v2'
import { usePathname } from 'next/navigation'

export function BreadcrumbNav() {
  const pathname = usePathname()
  const breadcrumbs = breadcrumbsFromPath(pathname)

  return (
    <Breadcrumb separator="/">
      {breadcrumbs.map((crumb, i) => (
        <BreadcrumbItem 
          key={i}
          href={crumb.href}
          active={i === breadcrumbs.length - 1}
        >
          {crumb.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  )
}
```

---

## Theming

### Using Theme Hook

```jsx
import { useTheme } from '@/components/design-system-v2'

export function ThemeAwareComponent() {
  const { theme, isDark, setTheme, tokens } = useTheme()

  return (
    <div style={{
      backgroundColor: tokens.surface,
      color: tokens.text,
      padding: tokens.spacing.lg
    }}>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(isDark ? 'light' : 'dark')}>
        Toggle Theme
      </button>
    </div>
  )
}
```

### Getting Theme Colors

```jsx
import { useThemeColor } from '@/components/design-system-v2'

export function ColoredComponent() {
  const primaryColor = useThemeColor('primary')
  const successColor = useThemeColor('success')

  return (
    <div style={{ color: primaryColor }}>
      <p style={{ color: successColor }}>Themed content</p>
    </div>
  )
}
```

---

## Advanced Patterns

### Form with Error States

```jsx
import { Button, Card, CardContent } from '@/components/design-system-v2'
import { useState } from 'react'

export function FormExample() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email is required')
    } else {
      setError('')
      // Handle submission
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <Button type="submit" variant="primary">Submit</Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

### Dashboard Grid

```jsx
import { Container, Grid, Card, CardTitle, Metric, Chart } from '@/components/design-system-v2'

export function Dashboard() {
  return (
    <Container size="xl">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* KPI Row */}
      <Grid cols={4} gap="lg" className="mb-8">
        <Card>
          <Metric label="Total Revenue" value="$45,231" trend={{ value: 12, direction: 'up' }} />
        </Card>
        <Card>
          <Metric label="Users" value="2,543" trend={{ value: 5, direction: 'up' }} />
        </Card>
        <Card>
          <Metric label="Engagement" value="68%" trend={{ value: 2, direction: 'down' }} />
        </Card>
        <Card>
          <Metric label="Conversion" value="3.24%" trend={{ value: 0.5, direction: 'up' }} />
        </Card>
      </Grid>

      {/* Charts Row */}
      <Grid cols={2} gap="lg">
        <Card>
          <CardTitle>Revenue Trend</CardTitle>
          <LineChart data={[...]} />
        </Card>
        <Card>
          <CardTitle>Traffic Sources</CardTitle>
          <DonutChart data={[...]} />
        </Card>
      </Grid>
    </Container>
  )
}
```

---

## Next Steps

1. **Integrate Design System** into your root layout
2. **Start with basic components** (Button, Card, Container)
3. **Build layout** with Stack/Grid/Flex
4. **Add interactivity** with Tabs/Accordion/Modal
5. **Style data displays** with Charts/Pipeline/CodeBlock
6. **Customize theming** via CSS variables or `useTheme` hook

For more information, check the README.js in the design-system-v2 directory.

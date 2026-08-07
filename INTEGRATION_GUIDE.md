# 🚀 New Design System - Integration Guide

## Quick Start for Pages

### Step 1: Import Layout Components

```jsx
import {
  MainContainer,
  ResponsiveGrid,
  PageSection,
  HeroSection,
} from '@/components/MainContainer'
```

### Step 2: Use in Your Page

#### Hero Section Example
```jsx
export default function ProjectsPage() {
  return (
    <>
      <HeroSection
        title="Projects"
        subtitle="Explore my work"
        description="A collection of projects I've built"
      />

      <MainContainer>
        {/* Your content here */}
      </MainContainer>
    </>
  )
}
```

#### Responsive Grid Example
```jsx
export default function ProjectsPage() {
  return (
    <MainContainer>
      <PageSection
        title="Featured Projects"
        description="My best work"
      >
        <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
          {projects.map(project => (
            <Card key={project.id}>
              <CardTitle>{project.title}</CardTitle>
              <p>{project.description}</p>
            </Card>
          ))}
        </ResponsiveGrid>
      </PageSection>
    </MainContainer>
  )
}
```

## Component Reference

### MainContainer
Centered responsive container for page content.

**Props:**
- `size` - Container size: 'sm' | 'md' | 'lg' | 'xl' (default: 'lg')
- `noPadding` - Remove horizontal padding
- `className` - Additional CSS classes
- `children` - Content

**Usage:**
```jsx
<MainContainer size="lg">
  <p>Centered content with optimal max-width</p>
</MainContainer>
```

### ResponsiveGrid
Responsive grid layout with automatic column adjustment.

**Props:**
- `cols` - Column config for breakpoints (default: { sm: 1, md: 2, lg: 3, xl: 3 })
  - `sm`: 1-6 columns (mobile)
  - `md`: 1-6 columns (tablet)
  - `lg`: 1-6 columns (desktop)
  - `xl`: 1-6 columns (large desktop)
- `gap` - Spacing: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'lg')
- `className` - Additional CSS classes
- `children` - Grid items

**Usage:**
```jsx
<ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</ResponsiveGrid>

{/* Or with custom cols */}
<ResponsiveGrid cols={{ sm: 1, md: 3, lg: 4, xl: 6 }} gap="md">
  {items}
</ResponsiveGrid>
```

### PageSection
Section wrapper with optional title and description.

**Props:**
- `title` - Section heading
- `description` - Section description
- `className` - Additional CSS classes
- `children` - Content

**Usage:**
```jsx
<PageSection
  title="Featured Work"
  description="Here are my best projects"
>
  <ResponsiveGrid>
    {/* items */}
  </ResponsiveGrid>
</PageSection>
```

### HeroSection
Centered hero layout for page headers.

**Props:**
- `title` - Main heading
- `subtitle` - Subtitle text
- `description` - Descriptive text
- `className` - Additional CSS classes
- `children` - CTA buttons or other content

**Usage:**
```jsx
<HeroSection
  title="Welcome"
  subtitle="Full-Stack Developer"
  description="Building amazing things with code"
>
  <Button variant="primary">Get Started</Button>
</HeroSection>
```

## Design System Integration

### Using Theme Hook
```jsx
'use client'
import { useTheme } from '@/components/design-system-v2'

export function MyComponent() {
  const { isDark, setTheme, tokens } = useTheme()

  return (
    <div style={{ color: tokens.text }}>
      <button onClick={() => setTheme(isDark ? 'light' : 'dark')}>
        Toggle Theme
      </button>
    </div>
  )
}
```

### Using Design System Components
```jsx
import { 
  Button, 
  Card, 
  CardTitle, 
  Stack,
  Grid,
} from '@/components/design-system-v2'

export function Example() {
  return (
    <Stack direction="vertical" gap="lg">
      <Card>
        <CardTitle>My Card</CardTitle>
        <Button variant="primary">Click me</Button>
      </Card>
    </Stack>
  )
}
```

## Responsive Breakpoints

### Available Breakpoints
```javascript
{
  sm: 640,   // Mobile
  md: 768,   // Tablet
  lg: 1024,  // Desktop
  xl: 1280,  // Large screen
  '2xl': 1536, // Extra large
}
```

### Examples
```jsx
{/* Single column on mobile, 2 on tablet, 3 on desktop */}
<ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">

{/* 1 on mobile, 3 on tablet, 4 on desktop */}
<ResponsiveGrid cols={{ sm: 1, md: 3, lg: 4 }} gap="md">

{/* Same across all sizes */}
<ResponsiveGrid cols={{ sm: 2, md: 2, lg: 2 }} gap="lg">
```

## Common Patterns

### Blog Post Grid
```jsx
export default function BlogPage() {
  return (
    <>
      <HeroSection title="Blog" description="Latest articles" />
      <MainContainer>
        <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
          {posts.map(post => (
            <Card key={post.id} clickable>
              <CardTitle>{post.title}</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {post.excerpt}
              </p>
            </Card>
          ))}
        </ResponsiveGrid>
      </MainContainer>
    </>
  )
}
```

### Project Showcase
```jsx
export default function ProjectsPage() {
  return (
    <>
      <HeroSection title="Projects" />
      <MainContainer>
        <PageSection title="Featured">
          <ResponsiveGrid cols={{ sm: 1, md: 2 }} gap="xl">
            {featuredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ResponsiveGrid>
        </PageSection>
        <PageSection title="All Projects">
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
            {allProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ResponsiveGrid>
        </PageSection>
      </MainContainer>
    </>
  )
}
```

### Credentials/Skills
```jsx
export default function CredentialsPage() {
  return (
    <>
      <HeroSection title="Credentials" />
      <MainContainer>
        <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap="lg">
          {certifications.map(cert => (
            <Card key={cert.id}>
              <CardTitle>{cert.name}</CardTitle>
              <p className="text-xs text-slate-500">{cert.issuer}</p>
            </Card>
          ))}
        </ResponsiveGrid>
      </MainContainer>
    </>
  )
}
```

## Color Usage

### Text Colors
```jsx
// Primary text (always use this for body text)
className="text-slate-900 dark:text-white"

// Secondary text
className="text-slate-600 dark:text-slate-400"

// Muted/tertiary text
className="text-slate-500 dark:text-slate-500"

// Accent color
className="text-blue-600 dark:text-blue-400"
```

### Background Colors
```jsx
// Card backgrounds
className="bg-white dark:bg-slate-900"

// Subtle background
className="bg-slate-50 dark:bg-slate-800"

// Hover state
className="hover:bg-slate-100 dark:hover:bg-slate-800"
```

## Spacing Guide

```jsx
// Gaps in Stack/Grid
gap="xs"    // 8px
gap="sm"    // 12px
gap="md"    // 16px (common)
gap="lg"    // 24px (common)
gap="xl"    // 32px

// Padding in containers
p-4 sm:p-6 lg:p-8    // Mobile to desktop padding
```

## Animation Tips

Page transitions are automatic, but you can add component-level animations:

```jsx
import { motion } from 'framer-motion'

export function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>Content</Card>
    </motion.div>
  )
}
```

## Testing Responsive Design

### Browser DevTools Method
1. Press `F12` to open DevTools
2. Click responsive design mode icon
3. Test different screen sizes
4. Watch grid columns adjust

### Manual Testing Sizes
- Mobile: 375px (iPhone)
- Tablet: 768px (iPad)
- Desktop: 1024px (Laptop)
- Large: 1280px (Desktop)

## Keyboard Shortcuts

### Available Shortcuts
| Shortcut | Action |
|----------|--------|
| `Cmd+K` / `Ctrl+K` | Open command palette |
| `↑` / `↓` | Navigate in palette |
| `Enter` | Select item |
| `Esc` | Close palette |

## Performance Tips

1. **Use MainContainer** for consistent layouts
2. **Use ResponsiveGrid** instead of custom grid CSS
3. **Lazy load images** in cards
4. **Memoize** heavy components
5. **Avoid inline functions** in JSX (use useCallback)

## Troubleshooting

### Grid not responsive?
Make sure you're using `ResponsiveGrid` with `cols` prop:
```jsx
<ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }}>
  {/* items */}
</ResponsiveGrid>
```

### Dark mode not working?
Ensure `DSv2ThemeProvider` wraps your app (already in layout.js):
```jsx
<DSv2ThemeProvider>
  {children}
</DSv2ThemeProvider>
```

### Colors look wrong?
Use the semantic color tokens, not hardcoded colors:
```jsx
// ✅ Good
className="text-slate-900 dark:text-white"

// ❌ Avoid
className="text-black" // Won't adapt to dark mode
```

## Next Steps

1. **Update existing pages** to use MainContainer and ResponsiveGrid
2. **Test dark mode** switching on each page
3. **Check mobile responsiveness** by resizing browser
4. **Test keyboard navigation** (Cmd+K for command palette)
5. **Verify all links work** (same URLs preserved)

---

**Happy building! The new design system is ready to use. 🎉**

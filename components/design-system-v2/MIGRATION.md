# Design System v2 - Migration Guide

This guide helps you understand:
- How DSv2 differs from the current design system
- When and how to migrate pages
- Component mapping from old to new
- Breaking changes and compatibility

---

## Overview

| Aspect | Old (design-system) | New (design-system-v2) |
|--------|-----|-----|
| **Approach** | Tailwind + custom utilities | Premium component library |
| **Philosophy** | Low-level utility classes | High-level composable components |
| **Theming** | Tailwind config | CSS variables + React Context |
| **Components** | Basic (Button, Card, etc) | Comprehensive (18+ complex components) |
| **Animations** | Scattered motion.js | Centralized Framer Motion variants |
| **TypeScript** | Yes (partial) | Yes (ready for typing) |
| **Status** | Current (keep for now) | New (migrate gradually) |

---

## Key Differences to Understand

### 1. Component-First vs Utility-First

**Old Approach:**
```jsx
<div className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow">
  <h3 className="text-lg font-semibold">Title</h3>
  <button className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click
  </button>
</div>
```

**New Approach:**
```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="primary">Click</Button>
  </CardContent>
</Card>
```

**Benefits:**
- Semantic and readable
- Consistency guaranteed
- Easier to theme globally
- Accessibility built-in

### 2. Theme Management

**Old Approach:**
```jsx
// Tailwind relies on CSS class names
// Dark mode: append `dark:` prefix
<div className="bg-white dark:bg-gray-900"></div>
```

**New Approach:**
```jsx
// CSS variables + React Context
// Automatic switching, fully typed theme access
const { tokens, isDark } = useTheme()
// OR use CSS variables directly
<div style={{ backgroundColor: 'var(--ds-surface)' }}></div>
```

### 3. Spacing System

**Old Approach:**
```jsx
// Tailwind spacing scale
<div className="p-4 gap-3 mb-6"></div>  // mix of Tailwind and intuition
```

**New Approach:**
```jsx
// Consistent token-based spacing
import { spacing } from '@/components/design-system-v2'
// Or use component props
<Stack gap="lg">  // lg = 24px (consistent across app)
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>
```

### 4. Typography

**Old Approach:**
```jsx
<h1 className="text-4xl font-bold leading-tight">Heading</h1>
<p className="text-base font-normal leading-relaxed">Paragraph</p>
```

**New Approach:**
```jsx
import { typography } from '@/components/design-system-v2'

// Use tokens for consistency
<h1 style={typography.heading1}>Heading</h1>
<p style={typography.body}>Paragraph</p>

// Or use Typography component (planned)
<Typography variant="heading1">Heading</Typography>
<Typography variant="body">Paragraph</Typography>
```

---

## Migration Strategy

### Phase 1: Coexistence (Now)
- Keep old design system intact
- New design system available for fresh components
- No forced migration

### Phase 2: New Pages (Next)
- New pages use DSv2 exclusively
- Gradually build new pages (contact form, tools)
- Old pages can remain on old system

### Phase 3: Selective Migration (Future)
- Migrate high-impact pages (home, blog, projects)
- Use both systems in same page if needed
- Plan per-page migration strategy

### Phase 4: Full Migration (Optional)
- Complete redesign of all pages with DSv2
- Remove old design-system folder
- Declare DSv2 as canonical design system

---

## Component Mapping

### Layout & Container

| Old | New | Status |
|-----|-----|--------|
| `flex flex-col` | `Stack` | Direct replacement |
| `grid grid-cols-3` | `Grid` | Direct replacement |
| `container mx-auto` | `Container` | Direct replacement |
| `flex items-center justify-between` | `Flex` | Direct replacement |

### Buttons & Actions

| Old | New | Status |
|-----|-----|--------|
| `btn btn-primary` | `<Button variant="primary">` | Direct replacement |
| `btn btn-secondary` | `<Button variant="secondary">` | Direct replacement |
| `btn btn-outline` | `<Button variant="outline">` | Direct replacement |
| `text-blue-500 hover:text-blue-600` | `<NavLink>` | Semantic replacement |

### Cards & Surfaces

| Old | New | Status |
|-----|-----|--------|
| `bg-white rounded shadow` | `<Card>` | Direct replacement |
| Manual card structure | `<Card><CardHeader>...<CardContent>` | Composable replacement |
| `border border-gray-200` | `<Card variant="outlined">` | Direct replacement |

### Tags & Badges

| Old | New | Status |
|-----|-----|--------|
| `bg-blue-100 text-blue-800 rounded-full` | `<Tag variant="primary">` | Direct replacement |
| `bg-green-100` | `<Badge variant="dot" color="success">` | Direct replacement |

### Modals & Overlays

| Old | New | Status |
|-----|-----|--------|
| Custom modal | `<Modal>` | Direct replacement |
| Custom tabs | `<Tabs>` | Direct replacement |
| Custom accordion | `<Accordion>` | Direct replacement |

### Navigation

| Old | New | Status |
|-----|-----|--------|
| Manual breadcrumb | `<Breadcrumb>` | Direct replacement |
| Custom nav | `<Nav/>` | Direct replacement |
| Manual link styling | `<NavLink>` | Semantic replacement |

---

## How to Migrate a Page

### Step 1: Choose a Page
Start with a page that has minimal dependencies. Example: `/contact`

### Step 2: Update Imports
```jsx
// Before
import Button from '@/components/design-system/Button'
import Card from '@/components/design-system/Card'

// After
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/design-system-v2'
```

### Step 3: Replace Components
```jsx
// Before
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Send
  </button>
</div>

// After
<Card>
  <CardHeader>
    <CardTitle>Contact Us</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="primary">Send</Button>
  </CardContent>
</Card>
```

### Step 4: Update Layout
```jsx
// Before
<div className="flex flex-col gap-4 max-w-2xl mx-auto">
  <div>Content 1</div>
  <div>Content 2</div>
</div>

// After
<Container size="md">
  <Stack direction="vertical" gap="lg">
    <div>Content 1</div>
    <div>Content 2</div>
  </Stack>
</Container>
```

### Step 5: Test & Validate
- Test light/dark mode switching
- Check responsive behavior on mobile
- Validate accessibility (keyboard nav, focus states)
- Compare with design mockups

---

## Common Migration Patterns

### Converting a Button Group

**Before:**
```jsx
<div className="flex gap-2">
  <button className="btn btn-primary">Save</button>
  <button className="btn btn-secondary">Cancel</button>
  <button className="btn btn-ghost">Help</button>
</div>
```

**After:**
```jsx
<Stack direction="horizontal" gap="md">
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
  <Button variant="ghost">Help</Button>
</Stack>
```

### Converting a Grid

**Before:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <div key={item.id} className="bg-white rounded shadow p-4">
      {/* content */}
    </div>
  ))}
</div>
```

**After:**
```jsx
<Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
  {items.map(item => (
    <Card key={item.id}>
      {/* content */}
    </Card>
  ))}
</Grid>
```

### Converting Typography

**Before:**
```jsx
<h1 className="text-4xl font-bold leading-tight">Title</h1>
<p className="text-base text-gray-600">Description</p>
<small className="text-sm text-gray-400">Caption</small>
```

**After:**
```jsx
<h1 className="text-4xl font-bold">Title</h1>
<p className="text-base text-secondary">Description</p>
<small className="text-sm text-muted">Caption</small>
```

---

## Breaking Changes

### None Currently
DSv2 is designed to coexist with the old system. No breaking changes to migrate.

### Future Removals (When Old System Deprecated)
- Remove `components/design-system/` folder
- Update all imports from `design-system` to `design-system-v2`
- Remove old CSS utilities

---

## Compatibility Matrix

### Tailwind + DSv2
You can use Tailwind utilities alongside DSv2:

```jsx
<Card className="mb-6">  // Tailwind spacing
  <CardTitle>Title</CardTitle>
  <CardContent className="text-center">  // Tailwind text alignment
    Content
  </CardContent>
</Card>
```

### Dark Mode
DSv2 handles dark mode automatically. For Tailwind utilities:

```jsx
<div className="bg-white dark:bg-gray-900">
  This works with DSv2 theme provider
</div>
```

### Custom CSS
You can extend DSv2 with custom CSS:

```css
/* your-custom.css */
.custom-card {
  background: var(--ds-surface);  /* Uses DSv2 variables */
  border: 1px solid var(--ds-border);
  padding: var(--ds-spacing-md);
}
```

---

## Troubleshooting Migration

### Issue: Components look wrong
**Solution:** Import CSS file in root layout
```jsx
import '@/components/design-system-v2/styles/index.css'
```

### Issue: Old styles conflicting
**Solution:** Use CSS specificity or reset conflicting classes
```jsx
<Card className="!p-6">  // ! to override */
</Card>
```

### Issue: Dark mode not switching
**Solution:** Ensure theme provider wraps children
```jsx
<DSv2ThemeProvider>
  {children}  // Must be inside provider
</DSv2ThemeProvider>
```

### Issue: Custom colors not working
**Solution:** Update CSS variables
```css
:root {
  --ds-primary: #your-color;
}
```

---

## Timeline Example

**Week 1:** Setup & small components
- [ ] Integrate DSv2 into layout
- [ ] Migrate `/tools` page
- [ ] Migrate `/contact` page

**Week 2:** Medium pages
- [ ] Migrate `/blog` page
- [ ] Migrate `/projects` listing
- [ ] Migrate `/credentials` page

**Week 3:** Complex pages
- [ ] Migrate home page
- [ ] Migrate project details pages
- [ ] Testing & refinement

**Week 4:** Polish
- [ ] Full dark mode testing
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Remove old design system (if decided)

---

## When You're Ready

1. **Setup** (5 min): Add DSv2ThemeProvider and CSS import to layout
2. **Pick a page** (1-2 hour): Start with simple page like `/contact`
3. **Test** (30 min): Verify light/dark mode, responsive, accessibility
4. **Iterate** (1-2 hours/page): Continue with other pages
5. **Polish** (2-3 hours): Dashboard testing, cross-browser checks

**Total for full migration:** ~8-12 hours spread over 2-4 weeks

---

## Questions?

Refer to:
- `README.js` - Comprehensive documentation
- `USAGE.md` - Practical examples
- Individual component files - Inline JSDoc with props and usage
- `foundation/tokens.js` - Available tokens for theming

---

## Next Steps

1. ✅ Design System v2 is ready
2. **Now:** You can choose to start migrating pages (optional)
3. **Or:** Just use DSv2 for new features/pages going forward
4. **Future:** Gradual migration as you update pages anyway

No rush - DSv2 works alongside your current system.

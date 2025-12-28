# AI Learning Lab - Design System

**Philosophy:** "What you make and how it feels are inseparable"
**Reference:** Inspired by lelezhang.design - minimal, elegant, intentional

---

## 🎨 Core Principles

1. **Minimal & Clean** - Remove unnecessary elements, embrace whitespace
2. **Intentional** - Every element serves a purpose
3. **Elegant Interactions** - Smooth, delightful micro-interactions
4. **Readable** - High contrast, generous spacing, clear hierarchy
5. **Breathing Room** - Don't crowd elements, let them breathe

---

## 📐 Typography

### Font Family
- **Primary:** Instrument Sans (Google Fonts)
- **Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Variable:** `--font-instrument-sans`

### Type Scale & Usage

```tsx
// Page Headlines
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.2] tracking-tight text-zinc-900">

// Section Headings
<h2 className="text-3xl font-medium text-zinc-900">

// Card/Component Titles
<h3 className="text-xl font-medium text-zinc-900">

// Body Text (Primary)
<p className="text-base leading-relaxed text-zinc-600">

// Body Text (Large)
<p className="text-lg leading-relaxed text-zinc-600">

// Subtext / Captions
<span className="text-sm text-zinc-500">

// Labels
<label className="text-sm font-medium text-zinc-700">
```

### Key Rules
- Use `font-medium` for headings (NOT `font-semibold` or `font-bold`)
- Use `leading-relaxed` for body text
- Use `tracking-tight` for large headings
- Text hierarchy: zinc-900 (primary) → zinc-700 (secondary) → zinc-600 (body) → zinc-500 (muted)

---

## 🎨 Color Palette

### Background Colors
```css
--background: #FBFBFC (off-white/cream)
--card-bg: white
--header-bg: white/85 with backdrop-blur
```

### Text Colors
```css
--text-primary: zinc-900 (headings, important text)
--text-secondary: zinc-700 (labels, nav items)
--text-body: zinc-600 (paragraphs, descriptions)
--text-muted: zinc-500 (captions, helper text)
```

### Border Colors
```css
--border-subtle: border-zinc-200/60 (default for cards, dividers)
--border-interactive: border-zinc-900 (hover states)
```

### Interactive States
```tsx
// Default → Hover
text-zinc-700 → text-zinc-900
border-zinc-200 → border-zinc-900
bg-zinc-100 → bg-zinc-900 text-white
```

---

## 🧩 Component Patterns

### Cards

```tsx
<div className="flex flex-col gap-5 rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md">
  {/* Icon */}
  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
    <Icon className="h-6 w-6 text-zinc-700 group-hover:text-white transition-colors" />
  </div>

  {/* Content */}
  <div className="flex flex-col gap-3">
    <h3 className="text-xl font-medium text-zinc-900">Title</h3>
    <p className="text-base leading-relaxed text-zinc-600">Description</p>
  </div>
</div>
```

**Key Properties:**
- Border radius: `rounded-2xl`
- Border: `border-zinc-200/60`
- Padding: `p-8` (generous)
- Gap: `gap-5` for icon/content, `gap-3` for text elements
- Shadow: `shadow-sm` → `shadow-md` on hover
- Transition: `transition-all duration-300`

### Buttons

```tsx
// Primary Button
<Button className="rounded-full px-9 py-6 text-base font-medium shadow-sm transition-all hover:shadow-md">
  Get Started
</Button>

// Secondary/Ghost Button
<Button variant="ghost" className="rounded-full px-9 py-6 text-base font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900">
  Learn More
</Button>

// Outline Button
<Button variant="outline" className="rounded-full border-zinc-200 py-7 text-base font-medium hover:border-zinc-900 hover:bg-zinc-50">
  Sign In
</Button>
```

**Key Properties:**
- Shape: `rounded-full` (always)
- Padding: `px-9 py-6` for normal, `py-7` for larger
- Font: `text-base font-medium`
- Transition: `transition-all duration-200`
- Shadow on primary: `shadow-sm` → `shadow-md` on hover

### Form Inputs

```tsx
<input className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-base transition-all focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2" />
```

**Key Properties:**
- Border radius: `rounded-xl`
- Border: `border-zinc-200`
- Padding: `px-4 py-3`
- Focus state: border changes to zinc-900, adds ring

### Navigation Items

```tsx
<Link className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
  isActive
    ? "bg-zinc-900 text-white shadow-sm"
    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
}`}>
  <Icon className="h-4 w-4" />
  <span>Label</span>
</Link>
```

**Key Properties:**
- Shape: `rounded-full`
- Padding: `px-5 py-2.5`
- Active state: dark background with shadow
- Inactive: subtle hover effect

---

## 📏 Spacing System

### Container Padding
```tsx
// Mobile → Desktop
px-6 md:px-8
```

### Section Spacing
```tsx
// Vertical padding for sections
py-12  // Small sections
py-16  // Medium sections
py-24  // Large sections
py-32  // Hero sections (desktop)
```

### Component Spacing
```tsx
gap-3  // Tight (text elements)
gap-4  // Default
gap-5  // Comfortable (card internals)
gap-6  // Spacious
gap-8  // Wide (between major sections)
```

### Element Spacing
```tsx
mt-2   // Tight
mt-3   // Default
mt-4   // Comfortable
mt-6   // Spacious
```

---

## ✨ Animations & Transitions

### Transition Durations
```tsx
duration-150  // Quick interactions (view transitions)
duration-200  // Button hovers, focus states
duration-300  // Card hovers, larger elements
duration-700  // Page entrance animations
```

### Common Patterns

```tsx
// Fade in on page load
className="animate-in fade-in slide-in-from-bottom-4 duration-700"

// Staggered delays
delay-100  // Second element
delay-200  // Third element
delay-300  // Fourth element

// Hover transitions
className="transition-all hover:scale-105"
className="transition-transform group-hover:translate-x-1"
className="transition-colors group-hover:bg-zinc-900"
```

### View Transitions (Page Navigation)
- Enabled via CSS in `globals.css`
- Duration: `0.15s` (150ms)
- Applied automatically to page changes

---

## 🎭 Interactive States

### Hover Effects

```tsx
// Buttons
hover:shadow-md
hover:bg-zinc-50
hover:border-zinc-900

// Cards
hover:shadow-md
group-hover:bg-zinc-900 (for icons)
group-hover:text-white

// Links
hover:text-zinc-900
hover:bg-zinc-100
```

### Focus States
```tsx
focus:outline-none
focus:ring-2
focus:ring-zinc-900
focus:ring-offset-2
```

### Active States
```tsx
// Navigation
bg-zinc-900 text-white shadow-sm

// Buttons
active:scale-95
```

---

## 📱 Responsive Design

### Breakpoint Usage
```tsx
// Mobile-first approach
className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
className="py-24 md:py-32"
className="gap-6 md:gap-8 lg:gap-10"
className="grid md:grid-cols-2 lg:grid-cols-3"
```

### Common Patterns
```tsx
// Mobile menu
<div className="md:hidden">Mobile content</div>
<div className="hidden md:flex">Desktop content</div>

// Responsive spacing
className="px-4 md:px-6 lg:px-8"

// Responsive layout
className="flex-col sm:flex-row"
```

---

## 🎯 Implementation Checklist

When building a new component or page, ensure:

- [ ] Uses Instrument Sans font family
- [ ] Headings use `font-medium` (not semibold/bold)
- [ ] Text follows color hierarchy (900 → 700 → 600 → 500)
- [ ] Buttons are `rounded-full` with proper padding
- [ ] Cards use `rounded-2xl` with `border-zinc-200/60`
- [ ] Generous spacing (gap-5, gap-8, py-24, etc.)
- [ ] Smooth transitions (duration-200/300)
- [ ] Hover states on interactive elements
- [ ] Focus states for accessibility
- [ ] Backdrop blur on overlays/headers
- [ ] Shadows: `shadow-sm` → `shadow-md` on hover
- [ ] Mobile-first responsive design

---

## 💬 How to Use This File

### For New Features
When asking Claude to build a new feature, reference this file:

> "Build [feature] following the design system in DESIGN_SYSTEM.md"

### For Specific Components
> "Create a settings page card layout using the card pattern from DESIGN_SYSTEM.md"

### For Consistency Checks
> "Review this component and ensure it matches DESIGN_SYSTEM.md principles"

### Quick Reference
Copy these patterns directly into your components and adjust content as needed.

---

## 🔄 Updates

**Last Updated:** 2025-12-28
**Version:** 1.0
**Based on:** lelezhang.design aesthetic

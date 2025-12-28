# AI Learning Lab - Design System

**Philosophy:** "What you make and how it feels are inseparable"
**Reference:** Inspired by lelezhang.design and supernotes.app - minimal, elegant, premium feel
**Version:** 2.0 (Updated with modern UI patterns)

---

## Core Principles

1. **Minimal & Premium** - Clean, sophisticated UI with subtle depth
2. **Intentional Motion** - Smooth, purposeful animations using Framer Motion
3. **Interactive Feedback** - Every interaction should feel responsive
4. **Readable** - High contrast, generous spacing, clear hierarchy
5. **Breathing Room** - Generous whitespace, let elements breathe

---

## Typography

### Font Family
- **Primary:** Instrument Sans (Google Fonts)
- **Weights:** 400 (regular), 500 (medium), 600 (semibold)
- **Variable:** `--font-instrument-sans`

### Type Scale & Usage

```tsx
// Page Headlines (Large)
<h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">

// Section Headings
<h2 className="text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl">

// Card/Component Titles
<h3 className="text-base font-medium text-zinc-900">

// Body Text (Primary)
<p className="text-base leading-relaxed text-zinc-500">

// Subtext / Captions
<span className="text-sm text-zinc-400">

// Labels (Uppercase)
<p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
```

### Key Rules
- Use `font-medium` for headings (NOT `font-semibold` or `font-bold`)
- Use `tracking-tight` for larger headings
- Use `leading-relaxed` for body text
- Text hierarchy: zinc-900 (primary) → zinc-600 (secondary) → zinc-500 (body) → zinc-400 (muted)

---

## Color Palette

### Background Colors
```tsx
// Page backgrounds - subtle gradient
className="bg-gradient-to-br from-zinc-50 via-white to-zinc-100"

// Subtle pattern overlay
className="bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]"

// Card backgrounds
className="bg-white" // or "bg-white/80 backdrop-blur-xl"
```

### Interactive Colors
```tsx
// Primary actions (buttons, selected states)
bg-zinc-900 text-white shadow-lg shadow-zinc-900/20

// Secondary/outline buttons
border-2 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50

// Selected option cards (single-select)
border-zinc-900 bg-zinc-900 text-white shadow-lg shadow-zinc-900/20

// Selected option cards (multi-select)
border-zinc-900 bg-zinc-50

// Error states
border-red-200 bg-red-50 text-red-600
```

---

## Component Patterns

### Page Layout Container

```tsx
<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
  {/* Background pattern */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

  {/* Content */}
  <div className="relative py-8 sm:py-12">
    {/* ... */}
  </div>
</div>
```

### Cards (Premium Style)

```tsx
// Main content card
<div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 sm:p-8">
  {/* Content */}
</div>

// Glassmorphism card (for floating elements)
<div className="rounded-3xl border border-zinc-200/80 bg-white/80 p-8 shadow-xl shadow-zinc-200/50 backdrop-blur-xl">
  {/* Content */}
</div>
```

**Key Properties:**
- Border radius: `rounded-3xl` (for main cards)
- Border: `border border-zinc-200/80`
- Shadow: `shadow-xl shadow-zinc-200/30`
- Padding: `p-6 sm:p-8`

### Option Cards (Single Select)

```tsx
<motion.button
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.99 }}
  className={`relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
    selected
      ? "border-zinc-900 bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
      : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
  }`}
>
  {/* Radio indicator */}
  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
    selected ? "border-white bg-white" : "border-zinc-300"
  }`}>
    {selected && <Check className="h-4 w-4 text-zinc-900" />}
  </div>
  <span>{children}</span>
</motion.button>
```

### Option Cards (Multi Select)

```tsx
<motion.button
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.99 }}
  className={`relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
    selected
      ? "border-zinc-900 bg-zinc-50"
      : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
  }`}
>
  {/* Checkbox indicator */}
  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 ${
    selected ? "border-zinc-900 bg-zinc-900" : "border-zinc-300 bg-white"
  }`}>
    {selected && <Check className="h-4 w-4 text-white" />}
  </div>
  <span>{children}</span>
</motion.button>
```

### Primary Buttons

```tsx
<Button
  className="group h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25"
>
  <span className="flex items-center gap-2">
    Continue
    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
  </span>
</Button>
```

### Secondary/Outline Buttons

```tsx
<Button
  variant="outline"
  className="h-14 rounded-2xl border-2 border-zinc-200 px-8 text-base font-medium transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50"
>
  Back
</Button>
```

**Button Key Properties:**
- Height: `h-14`
- Border radius: `rounded-2xl`
- Padding: `px-8`
- Font: `text-base font-medium`
- Shadow on primary: `shadow-lg shadow-zinc-900/20`

### Form Inputs

```tsx
<Input
  className="h-14 rounded-2xl border-zinc-200 bg-zinc-50/50 pl-5 pr-5 text-base transition-all duration-200 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
/>
```

### Progress Indicators

```tsx
// Segmented progress bar
<div className="flex gap-1.5">
  {Array.from({ length: totalSteps }, (_, i) => (
    <motion.div
      key={i}
      className={`h-2 w-8 rounded-full transition-colors duration-300 ${
        i + 1 <= currentStep ? "bg-zinc-900" : "bg-zinc-200"
      }`}
      animate={{ scale: i + 1 === currentStep ? 1.1 : 1 }}
    />
  ))}
</div>
```

### Section Headers (with icon)

```tsx
<div className="mb-8">
  <div className="mb-4 flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
      Step {step} of {totalSteps}
    </span>
  </div>
  <h2 className="text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl">
    {title}
  </h2>
  <p className="mt-2 text-base leading-relaxed text-zinc-500">
    {description}
  </p>
</div>
```

### Loading Spinner

```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
  className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
/>
```

### Skeleton Loading

```tsx
<div className="space-y-3">
  <div className="h-6 w-48 animate-pulse rounded-lg bg-zinc-100" />
  <div className="h-4 w-full animate-pulse rounded-lg bg-zinc-100" />
  <div className="h-4 w-5/6 animate-pulse rounded-lg bg-zinc-100" />
</div>
```

---

## Animation Patterns

### Framer Motion Imports
```tsx
import { motion, AnimatePresence } from "framer-motion";
```

### Page/Card Enter Animation
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
>
```

### Staggered Children Animation
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
  >
    {/* Content */}
  </motion.div>
))}
```

### Section Slide Animation (multi-step forms)
```tsx
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -50 : 50,
    opacity: 0,
  }),
};

<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={currentSection}
    custom={direction}
    variants={slideVariants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* Section content */}
  </motion.div>
</AnimatePresence>
```

### Interactive Feedback
```tsx
<motion.button
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.99 }}
>
```

### Check Icon Animation
```tsx
{selected && (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
  >
    <Check className="h-4 w-4" />
  </motion.div>
)}
```

---

## Spacing System

### Container Padding
```tsx
px-4 sm:px-6 lg:px-8
```

### Card Internal Padding
```tsx
p-6 sm:p-8
```

### Section Spacing
```tsx
py-8 sm:py-12  // Page sections
mb-8 sm:mb-10  // Header to content
mt-6           // Between action areas
```

### Element Spacing
```tsx
gap-3   // Option cards, form fields
gap-4   // Feature cards
space-y-8  // Question groups
```

---

## Responsive Design

### Breakpoint Usage
```tsx
// Mobile-first approach
className="text-3xl sm:text-4xl"
className="p-6 sm:p-8"
className="flex-col sm:flex-row"
className="py-8 sm:py-12"
```

### Common Responsive Patterns
```tsx
// Buttons (stack on mobile, row on desktop)
<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">

// Cards (full width with max-width)
<div className="mx-auto w-full max-w-xl">
```

---

## Icon Usage

### Lucide React Icons
```tsx
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Target,
  BookOpen,
  Zap,
  User,
  Clock,
  Brain,
  Eye,
  Briefcase,
  AlertCircle,
  Pencil
} from "lucide-react";
```

### Icon Sizes
```tsx
h-4 w-4  // Small (badges, inline)
h-5 w-5  // Medium (buttons, actions)
h-6 w-6  // Large (section headers)
h-7 w-7  // Extra large (alerts)
```

---

## Implementation Checklist

When building a new component or page, ensure:

- [ ] Uses Instrument Sans font family
- [ ] Headings use `font-medium` and `tracking-tight`
- [ ] Text follows color hierarchy (900 → 600 → 500 → 400)
- [ ] Buttons are `rounded-2xl` with `h-14` height
- [ ] Cards use `rounded-3xl` with `shadow-xl shadow-zinc-200/30`
- [ ] Page uses gradient background with pattern overlay
- [ ] Interactive elements have Framer Motion animations
- [ ] Option cards have proper selected/unselected states
- [ ] Loading states use skeleton or spinner animations
- [ ] Proper spacing (gap-3, space-y-8, etc.)
- [ ] Mobile-first responsive design
- [ ] Focus states for accessibility

---

## Quick Copy Patterns

### Full Page Wrapper
```tsx
<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />
  <div className="relative py-8 sm:py-12">
    <div className="container mx-auto max-w-3xl px-4 sm:px-6">
      {/* Content */}
    </div>
  </div>
</div>
```

### Card with Animation
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 sm:p-8"
>
  {/* Content */}
</motion.div>
```

### Primary Action Button
```tsx
<Button className="group h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25">
  <span className="flex items-center gap-2">
    Continue
    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
  </span>
</Button>
```

---

## Updates

**Last Updated:** 2025-12-28
**Version:** 2.0
**Based on:** lelezhang.design + supernotes.app aesthetics

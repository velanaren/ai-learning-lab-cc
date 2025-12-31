#AI Learning Lab - Design Principles & Guidelines

**Version:** 1.1  
**Last Updated:** December 31, 2025  
**Purpose:** Comprehensive guide for building consistent, accessible, and beautiful user experiences

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing System](#4-spacing-system)
5. [Component Architecture](#5-component-architecture)
6. [Animation & Motion](#6-animation--motion)
7. [Responsive Design](#7-responsive-design)
8. [Content & Copywriting](#8-content--copywriting)
9. [Performance](#9-performance)
10. [User Experience Patterns](#10-user-experience-patterns)
11. [Inclusive Design & Neurodivergent Accessibility](#11-inclusive-design--neurodivergent-accessibility)
12. [Implementation Reference (CSS Class System)](#12-implementation-reference-css-class-system)
13. [Logo Component Guidelines](#13-logo-component-guidelines)
14. [Page Structure Patterns](#14-page-structure-patterns)
15. [Component Patterns](#15-component-patterns)
16. [Applying to Other Pages](#16-applying-to-other-pages)

---

## 1. Design Philosophy

### Inspired by CRED

Our design draws inspiration from CRED's approach:
- **Lowercase everything** - Friendly, approachable, confident without shouting
- **Dark-first design** - Premium feel, reduces eye strain
- **Generous whitespace** - Clarity through breathing room
- **Deliberate typography** - Size creates hierarchy, not decoration
- **Subtle motion** - Animation enhances, never distracts

### Core Principles

**Trust through simplicity** - If users need to think hard, we've failed.

**Consistency builds confidence** - Same patterns work the same way everywhere.

**Performance is design** - Slow = broken. Fast = delightful.

---

## 2. Color System

### Primary Palette

```css
:root {
    /* Backgrounds */
    --bg-dark: #0D0D0D;      /* Main background */
    --bg-elevated: #1A1A1A;   /* Cards, modals */
    --bg-card: #161616;       /* Alternative cards */

    /* Text */
    --text-white: #FFFFFF;    /* Headings, primary text */
    --text-gray: #7A7A7A;     /* Body text, descriptions */
    --text-muted: #4A4A4A;    /* Subtle text, hints */

    /* Accent */
    --accent: #00D09C;        /* Primary actions, links */
    --accent-hover: #00FFB3;  /* Hover states */
    --accent-glow: rgba(0, 208, 156, 0.2); /* Shadows, glows */
}
```

### Usage Rules

**Text contrast:**
- Headings: `var(--text-white)` on `var(--bg-dark)` = 21:1 ratio (WCAG AAA)
- Body text: `var(--text-gray)` on `var(--bg-dark)` = 7:1 ratio (WCAG AA)

**Never use:**
- Pure black (#000000) for text
- Pure gray (#808080) - always use semantic variables

---

## 3. Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
```

**Why:** Native system fonts load instantly, render perfectly, feel familiar.

### Type Scale

```css
--text-xs: 12px;    /* Captions, labels */
--text-sm: 14px;    /* Buttons, links */
--text-base: 18px;  /* Body text */
--text-lg: 24px;    /* Lead paragraphs */
--text-xl: 32px;    /* Card headings */
--text-2xl: 64px;   /* Section headings */
--text-3xl: 96px;   /* Hero headings */
```

### Typography Rules

**Lowercase everything:**
```css
text-transform: lowercase;
```

**Tight letter-spacing on large text:**
```css
.hero h1 {
    letter-spacing: -2px; /* 96px headings */
}
.section-title {
    letter-spacing: -1px; /* 64px headings */
}
```

**Line height:**
- Headings: `1.0 - 1.2`
- Body: `1.6`
- Small text: `1.5`

---

## 4. Spacing System

### 8px Grid

All spacing uses multiples of 8:

```css
:root {
    --space-1: 8px;
    --space-2: 16px;
    --space-3: 24px;
    --space-4: 32px;
    --space-5: 40px;
    --space-6: 48px;
    --space-8: 64px;
    --space-10: 80px;
    --space-12: 96px;
    --space-16: 128px;
    --space-20: 160px;
    --space-25: 200px;
}
```

### Usage

**Component padding:**
- Buttons: `var(--space-2) var(--space-4)` (12px 32px)
- Cards: `var(--space-8)` (64px)
- Sections: `var(--space-25) 0` (200px vertical)

**Never use arbitrary values:**
```css
/* âŒ Bad */
padding: 13px 27px;

/* âœ… Good */
padding: var(--space-2) var(--space-4);
```

---

## 5. Component Architecture

### Button System

**Base class:**
```css
.btn {
    padding: 12px 32px;
    font-weight: 700;
    font-size: 14px;
    text-transform: lowercase;
    letter-spacing: 1px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Variants:**
```css
.btn--primary {
    background: var(--text-white);
    color: var(--bg-dark);
}

.btn--large {
    padding: 20px 56px;
    font-size: 16px;
}
```

### Card System

**Base card:**
```css
.card {
    background: var(--bg-card);
    padding: var(--space-8);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.06);
}
```

**Variants:**
```css
.card--featured {
    background: linear-gradient(135deg, rgba(0, 208, 156, 0.15) 0%, var(--bg-card) 100%);
}

.card--stat {
    text-align: center;
    padding: var(--space-6);
}
```

---

## 6. Animation & Motion

### Timing Functions

```css
/* Ease out - entering */
cubic-bezier(0.2, 0.8, 0.2, 1)

/* Ease in-out - general */
cubic-bezier(0.4, 0, 0.2, 1)
```

### Duration

- **Micro-interactions:** 0.2s (hover, focus)
- **Transitions:** 0.3-0.4s (color, transform)
- **Reveals:** 0.6-0.8s (scroll animations)

### Principles

**Performance:**
- Only animate `transform` and `opacity`
- Never animate `width`, `height`, `margin`

**Reduce motion:**
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 7. Responsive Design

### Breakpoints

```css
/* Mobile: < 768px */
@media (max-width: 768px) { }

/* Tablet: 768px - 1024px */
@media (min-width: 768px) and (max-width: 1024px) { }

/* Desktop: > 1024px */
@media (min-width: 1024px) { }
```

### Fluid Typography

Use `clamp()`:
```css
.hero h1 {
    font-size: clamp(48px, 8vw, 96px);
}
```

**Formula:** `clamp(min, preferred, max)`

---

## 8. Content & Copywriting

### Voice & Tone

**Voice:**
- Lowercase (never shout)
- Direct (no fluff)
- Confident (not arrogant)
- Engineering-focused

**Examples:**
- âœ… "crafted for the engineers who ship"
- âŒ "Designed For Engineers Who Ship Products"
- âœ… "not everyone makes it in."
- âŒ "Not everyone qualifies for membership."

### Content Structure

**Hero sections:**
1. Big statement (96px)
2. Explanatory subtext (24px gray)

**Body sections:**
1. Eyebrow (12px uppercase accent)
2. Heading (64px)
3. Description (20px gray)
4. CTA (button)

---

## 9. Performance

### Core Web Vitals Targets

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Optimization

**Fonts:**
- Use system fonts (zero download)
- If custom fonts: preload, subset, swap

**Images:**
- WebP format
- Lazy load below fold
- Responsive srcset

**CSS:**
- Inline critical CSS
- Defer non-critical
- Use CSS custom properties (fast)

---

## 10. User Experience Patterns

### Loading States

**Skeleton screens** instead of spinners:
```css
.skeleton {
    background: linear-gradient(90deg, #1A1A1A 25%, #2A2A2A 50%, #1A1A1A 75%);
    background-size: 200% 100%;
    animation: loading 1.5s ease-in-out infinite;
}
```

### Error States

**Toast notifications:**
- Error: Red (#FF4444)
- Success: Accent green
- Info: Neutral gray

### Empty States

Include:
- Icon/illustration
- Explanation
- CTA to fix

---

## 11. Inclusive Design & Neurodivergent Accessibility

### Philosophy

**Inclusive design is not optionalâ€”it's essential.** Our platform should be accessible to all users, including those who are neurodivergent, have visual processing differences, sensory sensitivities, or cognitive variations. Every user should have the ability to customize their experience to match their needs.

**Critical Principle:** User preferences must persist across ALL pages of the application. If a user selects "Dyslexic Font" and "High Contrast Mode" on the landing page, these settings must apply to the dashboard, labs, community pages, and every other page in the application.

### Implementation Strategy

All accessibility settings are stored in `localStorage` and applied via CSS classes on the `<body>` element. This makes preferences:
- Persistent across sessions
- Consistent across all pages
- Easy to implement (single source of truth)
- Performance-friendly (no API calls needed)

---

## Accessibility Toolbar

### Visual Design

The accessibility toolbar is a floating panel positioned in the top-right corner of the screen:

```css
.a11y-toolbar {
    position: fixed;
    right: 20px;
    top: 100px;
    z-index: 10000;
    background: var(--bg-elevated);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    max-width: 280px;
}
```

**Key Features:**
- High z-index (10000) ensures it's always on top
- Floating panel doesn't block main content
- Collapsible (slides out when not needed)
- Visible on all pages

### Toggle Button

A floating gear icon triggers the toolbar:

```css
.a11y-toggle {
    position: fixed;
    right: 20px;
    top: 100px;
    background: var(--accent);
    color: var(--bg-dark);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 24px;
}
```

**Emoji used:** âš™ï¸ (universally recognized settings icon)

---

## Accessibility Features

### 1. Color Theme Options

**Purpose:** Different users process colors differently. Some find dark mode straining, others need high contrast.

#### Dark Mode (Default)
```css
:root {
    --bg-dark: #0D0D0D;
    --bg-elevated: #1A1A1A;
    --text-white: #FFFFFF;
    --text-gray: #7A7A7A;
}
```

**Best for:** 
- Users who prefer dark interfaces
- Nighttime browsing
- Reducing eye strain in low light

#### Light Mode
```css
body.theme-light {
    --bg-dark: #FAFAFA;
    --bg-elevated: #FFFFFF;
    --text-white: #1A1A1A;
    --text-gray: #666666;
}
```

**Best for:**
- Users with dyslexia (many prefer light backgrounds)
- Daytime reading
- Users who find dark mode harder to read

**Why it matters:** Research shows 60% of dyslexic users prefer light backgrounds with dark text.

#### High Contrast Mode
```css
body.theme-contrast {
    --bg-dark: #000000;
    --bg-elevated: #1A1A1A;
    --text-white: #FFFFFF;
    --text-gray: #CCCCCC;
    --accent: #00FFB3;
}
```

**Best for:**
- Visual impairments
- Low vision users
- Users with color blindness
- Bright sunlight conditions

**Contrast ratios:**
- Pure black on white: 21:1 (WCAG AAA)
- Enhanced accent brightness for visibility

### Implementation

```javascript
function applyTheme(theme) {
    body.className = body.className.replace(/theme-\w+/g, '');
    body.classList.add(`theme-${theme}`);
    localStorage.setItem('a11y-theme', theme);
}
```

---

### 2. Font Type Options

**Purpose:** Different fonts help different cognitive processing styles.

#### Default Font
```css
:root {
    --font-display: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
}
```

**Characteristics:**
- Clean, modern
- High readability
- Native to system (fast loading)

#### Dyslexic-Friendly Font
```css
body.font-dyslexic {
    --font-display: 'Comic Sans MS', 'OpenDyslexic', Verdana, sans-serif;
}
```

**Why Comic Sans?**
- Unique letter shapes (b, d, p, q are clearly different)
- No mirrored characters
- Irregular baseline (easier tracking)
- Wider spacing between letters

**Research:** Studies show 73% of dyslexic readers find Comic Sans easier to read than Arial or Times New Roman.

**OpenDyslexic fallback:** Specifically designed font with weighted bottoms to prevent character rotation.

#### Monospace Font
```css
body.font-mono {
    --font-display: 'SF Mono', Monaco, 'Courier New', monospace;
}
```

**Best for:**
- ADHD users (consistent spacing aids focus)
- Developers (familiar reading pattern)
- Users who need clear character distinction

**Characteristics:**
- Equal width for all characters
- Clear 0 vs O, 1 vs l distinction
- Predictable rhythm

### Implementation

All text sizing must use the font multiplier:

```css
.hero h1 {
    font-size: calc(96px * var(--font-size-base));
}

.section-description {
    font-size: calc(20px * var(--font-size-base));
}
```

This ensures when a user changes fonts, all text scales appropriately.

---

### 3. Text Size Control

**Purpose:** Allows users to scale text without breaking layout.

#### Size Options

| Size | Multiplier | Example (20px base) |
|------|-----------|---------------------|
| Small | 0.875 | 17.5px |
| Medium | 1.0 | 20px |
| Large | 1.125 | 22.5px |
| XL | 1.25 | 25px |

```css
body.text-small { --font-size-base: 0.875; }
body.text-medium { --font-size-base: 1; }
body.text-large { --font-size-base: 1.125; }
body.text-xlarge { --font-size-base: 1.25; }
```

#### Critical Rule: Use calc() Everywhere

**Wrong:**
```css
.hero h1 { font-size: 96px; } /* Fixed, won't scale */
```

**Correct:**
```css
.hero h1 { font-size: calc(96px * var(--font-size-base)); }
```

This applies to:
- All headings (h1, h2, h3)
- Body text
- Button text
- Footer text
- Nav text

**Exception:** Don't scale:
- Icons (remain fixed size)
- Borders (1px stays 1px)
- Spacing (maintains layout integrity)

---

### 4. Line Spacing Options

**Purpose:** Increased spacing helps users with dyslexia, ADHD, and visual tracking issues.

#### Normal Spacing
```css
body.spacing-normal { 
    --line-height-base: 1.6; 
    --letter-spacing-base: 0; 
}
```

#### Relaxed Spacing
```css
body.spacing-relaxed { 
    --line-height-base: 1.8; 
    --letter-spacing-base: 0.5px; 
}
```

**Use case:** Users who lose their place when reading

#### Extra Spacing
```css
body.spacing-extra { 
    --line-height-base: 2.0; 
    --letter-spacing-base: 1px; 
}
```

**Use case:** Severe dyslexia, visual processing disorders

**Research:** British Dyslexia Association recommends 1.5-2.0 line-height.

#### Implementation

Apply spacing to all text:

```css
.section-description {
    line-height: var(--line-height-base);
    letter-spacing: var(--letter-spacing-base);
}
```

**Formula for combined spacing:**
```css
letter-spacing: calc(-1px + var(--letter-spacing-base));
/* Negative letter-spacing on headings + user preference */
```

---

### 5. Reduce Motion Toggle

**Purpose:** Prevents vestibular disorders, motion sickness, and sensory overload.

#### CSS Implementation

```css
body.reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}
```

**What gets disabled:**
- Scroll reveal animations
- Hover transitions
- Button animations
- Background pulse effects
- Card lift effects

**What remains:**
- Instant state changes (color, visibility)
- Layout shifts (still smooth with 0.01ms)
- User interactions (still responsive)

#### Respecting System Preferences

Also check browser-level preference:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

**Priority order:**
1. User's explicit toggle (highest)
2. Browser `prefers-reduced-motion` setting
3. Default animations (if neither set)

#### JavaScript Toggle

```javascript
function applyReducedMotion(enabled) {
    if (enabled) {
        body.classList.add('reduced-motion');
    } else {
        body.classList.remove('reduced-motion');
    }
    localStorage.setItem('a11y-reduced-motion', enabled);
}
```

**Critical:** This affects users with:
- Vestibular disorders (animations cause nausea)
- Autism (unexpected motion is overwhelming)
- ADHD (motion is distracting)
- Epilepsy (flashing/moving content can trigger seizures)

---

### 6. Focus Mode

**Purpose:** Removes visual noise for users who are easily distracted.

#### What Gets Hidden

```css
body.focus-mode .hero::before,
body.focus-mode body::before {
    display: none !important;
}

body.focus-mode .feature-card::before {
    display: none !important;
}
```

**Elements removed:**
- Background noise texture
- Radial gradient pulse in hero
- Card hover glow effects
- Decorative pseudo-elements

**Elements kept:**
- All content and text
- Navigation
- Buttons and links
- Layout structure

#### Visual Comparison

**Normal Mode:**
- Subtle texture overlay
- Gradient backgrounds
- Hover glows
- Visual depth

**Focus Mode:**
- Flat backgrounds
- No decorative elements
- Pure content
- Maximum clarity

**Best for:**
- ADHD users who get distracted by visual effects
- Autism users who prefer predictability
- Users with processing delays
- Low-bandwidth situations (fewer renders)

---

### 7. Persistent Preferences (LocalStorage)

**Critical Feature:** Settings must persist across:
- Page refreshes
- Navigation between pages
- Browser close/reopen
- Days/weeks later

#### Storage Structure

```javascript
// Save
localStorage.setItem('a11y-theme', 'light');
localStorage.setItem('a11y-font', 'dyslexic');
localStorage.setItem('a11y-textsize', 'large');
localStorage.setItem('a11y-spacing', 'relaxed');
localStorage.setItem('a11y-reduced-motion', 'true');
localStorage.setItem('a11y-focus-mode', 'true');

// Load
const theme = localStorage.getItem('a11y-theme') || 'dark';
const font = localStorage.getItem('a11y-font') || 'default';
// ... etc
```

#### Load on Every Page

Every HTML page must include this script:

```javascript
// Load preferences immediately (before page renders)
document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
});

function loadPreferences() {
    const theme = localStorage.getItem('a11y-theme') || 'dark';
    const font = localStorage.getItem('a11y-font') || 'default';
    const textSize = localStorage.getItem('a11y-textsize') || 'medium';
    const spacing = localStorage.getItem('a11y-spacing') || 'normal';
    const reducedMotion = localStorage.getItem('a11y-reduced-motion') === 'true';
    const focusMode = localStorage.getItem('a11y-focus-mode') === 'true';

    applyTheme(theme);
    applyFont(font);
    applyTextSize(textSize);
    applySpacing(spacing);
    if (reducedMotion) applyReducedMotion(true);
    if (focusMode) applyFocusMode(true);
}
```

**Place in `<head>` for instant application:**
```html
<script>
    // Inline script in <head> to prevent flash
    (function() {
        const theme = localStorage.getItem('a11y-theme') || 'dark';
        document.body.classList.add(`theme-${theme}`);
        // ... apply other settings
    })();
</script>
```

This prevents "flash of unstyled content" where the page loads in default mode then switches.

---

### 8. Reset to Default Button

**Purpose:** Some users get overwhelmed by changes and need a "panic button."

```javascript
document.getElementById('resetSettings').addEventListener('click', () => {
    if (confirm('Reset all accessibility settings to default?')) {
        localStorage.clear();
        location.reload();
    }
});
```

**UX considerations:**
- Confirmation dialog prevents accidental resets
- Full page reload ensures clean state
- All localStorage keys cleared (not just accessibility)

**Alternative (safer):**
```javascript
const resetAccessibility = () => {
    // Only clear accessibility keys
    const keysToRemove = [
        'a11y-theme',
        'a11y-font',
        'a11y-textsize',
        'a11y-spacing',
        'a11y-reduced-motion',
        'a11y-focus-mode'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    location.reload();
};
```

---

## Accessibility Toolbar UI Components

### Button Groups

```css
.a11y-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.a11y-btn {
    background: var(--bg-dark);
    color: var(--text-white);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
    min-width: 60px;
}

.a11y-btn.active {
    background: var(--accent);
    color: var(--bg-dark);
    border-color: var(--accent);
    font-weight: 700;
}
```

**Visual feedback:**
- Active button uses accent color
- Bold text for active state
- Hover shows border highlight
- Clear visual hierarchy

### Toggle Buttons (Binary Options)

```html
<button class="a11y-toggle-btn" id="reducedMotion">
    <span>Reduce Motion</span>
    <span class="status">OFF</span>
</button>
```

```css
.a11y-toggle-btn {
    display: flex;
    justify-content: space-between;
    padding: 10px;
}

.a11y-toggle-btn.active {
    background: var(--accent);
    color: var(--bg-dark);
}

.status {
    font-size: 10px;
    opacity: 0.7;
}
```

**States:**
- OFF: Default background
- ON: Accent background + "ON" text

### Section Labels

```css
.a11y-group label {
    display: block;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    color: var(--text-gray);
    font-weight: 600;
}
```

**Purpose:** Clear categorization of options

---

## Mobile Optimization

### Responsive Toolbar

```css
@media (max-width: 768px) {
    .a11y-toolbar {
        right: 10px;
        top: 80px;
        max-width: calc(100vw - 20px);
    }

    .a11y-toggle {
        right: 10px;
        top: 80px;
    }
}
```

**Mobile considerations:**
- Full-width toolbar on small screens
- Touch-friendly button sizes (minimum 44px)
- Larger text in toolbar
- No hover states (use :active instead)

### Touch Targets

```css
@media (hover: none) and (pointer: coarse) {
    .a11y-btn {
        min-height: 44px; /* Apple HIG minimum */
        min-width: 44px;
    }
}
```

**Research:** 44x44px is the minimum touch target size for accessibility (WCAG 2.5.5).

---

## Testing Accessibility Features

### Manual Testing Checklist

**Theme switching:**
- [ ] Dark â†’ Light switches all colors
- [ ] Light â†’ High Contrast works
- [ ] Settings persist on page refresh
- [ ] Settings apply on other pages

**Font switching:**
- [ ] Dyslexic font loads correctly
- [ ] Monospace font applies to all text
- [ ] Font choice persists
- [ ] Fallback fonts work if primary unavailable

**Text sizing:**
- [ ] All text scales proportionally
- [ ] Layout doesn't break at XL size
- [ ] Buttons remain readable
- [ ] Mobile view adjusts correctly

**Line spacing:**
- [ ] Extra spacing doesn't overflow containers
- [ ] Headings maintain visual hierarchy
- [ ] Cards expand to fit content

**Reduce motion:**
- [ ] All animations stop
- [ ] Scroll still works smoothly
- [ ] Hover states still change (color, not transform)
- [ ] Page remains usable

**Focus mode:**
- [ ] Background effects disappear
- [ ] Content remains intact
- [ ] Cards still interactive
- [ ] No layout shift

**Reset button:**
- [ ] Confirmation dialog appears
- [ ] All settings revert to default
- [ ] Page reloads cleanly

---

## Implementation Checklist for All Pages

When adding a new page to the application, ensure:

- [ ] Accessibility toolbar HTML is included
- [ ] Accessibility CSS is included or linked
- [ ] `loadPreferences()` runs on DOMContentLoaded
- [ ] All text uses `calc(Xpx * var(--font-size-base))`
- [ ] All text has `line-height: var(--line-height-base)`
- [ ] All text has `letter-spacing: var(--letter-spacing-base)`
- [ ] Theme classes are defined (theme-light, theme-contrast)
- [ ] Font classes are defined (font-dyslexic, font-mono)
- [ ] Reduced motion styles exist
- [ ] Focus mode hides decorative elements
- [ ] Mobile responsive toolbar positioning works
- [ ] Reset button clears settings correctly

---

## Legal & Compliance

### WCAG 2.1 Level AA Compliance

Our accessibility features help meet:

**1.4.3 Contrast (Minimum)** - High contrast mode provides 21:1 ratio  
**1.4.4 Resize Text** - Text can be resized up to 200% (XL = 125%, custom browser zoom adds more)  
**1.4.12 Text Spacing** - Extra spacing mode exceeds WCAG requirements  
**2.2.2 Pause, Stop, Hide** - Reduced motion stops all animations  
**2.3.1 Three Flashes** - No flashing content when motion reduced

### ADA Compliance

Features support:
- Visual disabilities (contrast, sizing)
- Cognitive disabilities (simplified layouts, spacing)
- Motor disabilities (reduced motion prevents triggers)
- Neurological disabilities (motion control)

---

## Summary

**Inclusive design isn't a featureâ€”it's a fundamental requirement.** By implementing these accessibility controls, we ensure that:

1. **Neurodivergent users** can customize their experience
2. **Users with disabilities** have equal access
3. **All preferences persist** across every page
4. **No users are left behind**

**Remember:** Test with real users who have these needs. Accessibility isn't about checkboxesâ€”it's about people.

---

---

## 12. Implementation Reference (CSS Class System)

This section documents the actual CSS classes implemented in `globals.css`. Use these classes for consistency across all pages.

### CSS Variables (Root)

```css
:root {
  /* Backgrounds */
  --bg-dark: #0D0D0D;
  --bg-elevated: #1A1A1A;
  --bg-card: #161616;

  /* Text */
  --text-white: #FFFFFF;
  --text-gray: #9A9A9A;
  --text-muted: #6A6A6A;

  /* Accent */
  --accent-primary: #00D09C;
  --accent-hover: #00FFB3;
  --accent-glow: rgba(0, 208, 156, 0.15);

  /* Spacing (8px grid) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;
  --space-10: 80px;
  --space-12: 96px;
  --space-16: 128px;
  --space-20: 160px;

  /* Typography multipliers */
  --font-size-multiplier: 1;
  --line-height-multiplier: 1;
  --letter-spacing-add: 0px;
}
```

### Button Classes

| Class | Usage | Appearance |
|-------|-------|------------|
| `.btn-primary` | Main CTA buttons | White bg, dark text, bold |
| `.btn-accent` | Secondary CTA | Accent green bg, dark text |
| `.btn-ghost` | Tertiary actions | Transparent, white text, border on hover |
| `.btn-outline` | Navigation/subtle | Transparent, white border |

**Example:**
```jsx
<Link href="/login" className="btn-primary">
  start learning free
  <ArrowRight className="h-5 w-5" />
</Link>
```

**CSS Implementation:**
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 32px;
  background: var(--text-white);
  color: var(--bg-dark);
  font-weight: 600;
  font-size: calc(14px * var(--font-size-multiplier));
  text-transform: lowercase;
  letter-spacing: 0.5px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
}
```

### Card Classes

| Class | Usage | Appearance |
|-------|-------|------------|
| `.card-dark` | Standard cards | Dark bg, subtle border |
| `.card-elevated` | Featured cards | Slightly lighter bg, more border |
| `.card-featured` | CTA cards | Accent gradient, glow effect |
| `.card-stat` | Stats display | Centered, minimal padding |

**Example:**
```jsx
<div className="card-featured max-w-3xl mx-auto text-center">
  <h2 className="text-section-title">your learning journey starts now.</h2>
  <p className="text-body">...</p>
</div>
```

### Typography Classes

| Class | Size | Usage |
|-------|------|-------|
| `.text-hero` | 64-80px | Main landing hero headline |
| `.text-section-title` | 32-40px | Section headings |
| `.text-eyebrow` | 12px uppercase | Pre-heading labels |
| `.text-body` | 16px | Standard body text |
| `.text-body-lg` | 18-20px | Lead paragraphs |
| `.text-muted-sm` | 14px | Helper text, captions |
| `.link-muted` | 14px | Footer/nav links |

**Example:**
```jsx
<span className="text-eyebrow">for engineers who ship</span>
<h1 className="text-hero">master any skill.</h1>
<p className="text-body-lg">personalized learning paths...</p>
```

### Animation Classes

| Class | Effect | Duration |
|-------|--------|----------|
| `.animate-fade-in-up` | Fade in + slide up | 0.6s |
| `.animate-delay-1` | Delay 0.1s | - |
| `.animate-delay-2` | Delay 0.2s | - |
| `.animate-delay-3` | Delay 0.3s | - |
| `.animate-delay-4` | Delay 0.4s | - |
| `.reveal` | Scroll-triggered reveal | - |
| `.revealed` | Applied when in viewport | - |

**Example:**
```jsx
<div className="animate-fade-in-up animate-delay-2">
  <HeroVisual />
</div>
```

### Layout Classes

| Class | Usage |
|-------|-------|
| `.landing-page` | Root wrapper for landing pages |
| `.noise-overlay` | Subtle texture background |
| `.hero-gradient` | Radial gradient background |
| `.hero-glow` | Accent color glow effect |
| `.logo-strip` | Horizontal scrolling logo bar |
| `.icon-box-accent` | Accent-colored icon container |

---

## 13. Logo Component Guidelines

### Logo Component (`@/components/brand`)

The logo has three variants for different use cases:

#### 1. Standard Logo
```jsx
import { Logo } from "@/components/brand";

// Sizes: sm (32px), md (40px), lg (56px), xl (80px)
<Logo size="lg" />              // Logo mark + text
<Logo size="md" showText={false} />  // Icon only
```

**Usage:**
- Header: `size="lg"` with text
- Footer: `size="md"` with text
- Mobile header: `size="md"` with text

#### 2. Animated Logo
```jsx
import { LogoAnimated } from "@/components/brand";

<LogoAnimated className="w-32 h-32" />
```

**Usage:**
- Hero sections (landing pages)
- Loading states
- Marketing materials

**Features:**
- Pulsing outer ring
- Animated node sizes
- Orbiting particle
- Glowing top node

#### 3. Icon Logo
```jsx
import { LogoIcon } from "@/components/brand";

<LogoIcon size={32} />
```

**Usage:**
- Favicons (generated via `icon.tsx`)
- Small UI elements
- Tab icons

### Logo Design Specifications

**Visual Elements:**
- Circular base with gradient (#00D09C → #00FFB3)
- Neural network pattern (4 nodes + connecting lines)
- Top node represents "growth/enlightenment"
- Dark nodes on bright background

**Size Guidelines:**
| Context | Size | Component |
|---------|------|-----------|
| Landing header | 56px | `<Logo size="lg" />` |
| Dashboard header | 40px | `<Logo size="md" />` |
| Footer | 40px | `<Logo size="md" />` |
| Mobile header | 40px | `<Logo size="md" />` |
| Favicon | 32px | `<LogoIcon size={32} />` |
| Hero decoration | 120px+ | `<LogoAnimated />` |

---

## 14. Page Structure Patterns

### Landing Page Structure

```jsx
<div className="landing-page">
  {/* Background effects */}
  <div className="noise-overlay decorative-bg" data-decorative="true" />
  <div className="hero-gradient hero-glow" data-decorative="true" />

  {/* Skip link for accessibility */}
  <a href="#main-content" className="sr-only focus:not-sr-only ...">
    skip to main content
  </a>

  {/* Header */}
  <header className="relative">
    <div className="container mx-auto flex items-center justify-between px-6" style={{ height: "var(--space-10)" }}>
      <Logo size="lg" />
      <div className="flex items-center gap-4">
        <AccessibilityToolbar />
        <Link href="/login" className="btn-outline">sign in</Link>
      </div>
    </div>
  </header>

  {/* Main Content */}
  <main id="main-content">
    {/* Hero Section */}
    <section className="container mx-auto px-6 py-[var(--space-16)] lg:py-[var(--space-20)]">
      ...
    </section>

    {/* Other sections with reveal animations */}
    <section className="reveal">...</section>
  </main>

  {/* Footer */}
  <footer className="relative border-t" style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}>
    ...
  </footer>
</div>
```

### Dashboard Page Structure (To Be Implemented)

```jsx
<div className="dashboard-page">
  {/* Background - same as landing */}
  <div className="noise-overlay decorative-bg" data-decorative="true" />

  {/* Sidebar Navigation */}
  <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--bg-elevated)]">
    <Logo size="md" className="p-6" />
    <nav>...</nav>
  </aside>

  {/* Main Content Area */}
  <main className="ml-64 min-h-screen">
    {/* Top bar with user info */}
    <header className="sticky top-0 h-16 bg-[var(--bg-dark)] border-b">
      <AccessibilityToolbar />
    </header>

    {/* Page content */}
    <div className="container mx-auto px-6 py-8">
      ...
    </div>
  </main>
</div>
```

---

## 15. Component Patterns

### Stats Component Pattern
```jsx
<section className="container mx-auto px-6 py-[var(--space-12)]">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
    <div className="card-stat reveal">
      <div className="text-4xl font-bold" style={{ color: "var(--accent-primary)" }}>
        10 min
      </div>
      <div className="text-body mt-2">daily commitment</div>
    </div>
    {/* More stat cards */}
  </div>
</section>
```

### How It Works Pattern
```jsx
<section className="container mx-auto px-6 py-[var(--space-16)]">
  <div className="text-center mb-12">
    <span className="text-eyebrow">how it works</span>
    <h2 className="text-section-title mt-4">simple. effective. daily.</h2>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
    {steps.map((step, i) => (
      <div key={i} className="card-dark text-center reveal" style={{ animationDelay: `${i * 0.1}s` }}>
        <div className="icon-box-accent mx-auto mb-4">
          <step.icon className="h-6 w-6" />
        </div>
        <div className="text-sm font-mono" style={{ color: "var(--accent-primary)" }}>
          0{i + 1}
        </div>
        <h3 className="font-semibold mt-2">{step.title}</h3>
        <p className="text-body text-sm mt-2">{step.description}</p>
      </div>
    ))}
  </div>
</section>
```

### Testimonial Card Pattern
```jsx
<div className="card-elevated p-8 reveal">
  <div className="flex items-center gap-1 mb-4">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-[var(--accent-primary)] text-[var(--accent-primary)]" />
    ))}
  </div>
  <blockquote className="text-body-lg italic" style={{ color: "var(--text-white)" }}>
    "{quote}"
  </blockquote>
  <div className="mt-6 flex items-center gap-3">
    <div className="h-10 w-10 rounded-full bg-[var(--accent-glow)]" />
    <div>
      <div className="font-medium">{name}</div>
      <div className="text-muted-sm">{role}</div>
    </div>
  </div>
</div>
```

---

## 16. Applying to Other Pages

When rebuilding other pages (dashboard, onboarding, settings, etc.):

### Checklist

- [ ] Import and use `<Logo />` component for all logo instances
- [ ] Use CSS class system instead of inline styles
- [ ] Include `noise-overlay` and `hero-gradient` backgrounds
- [ ] Add `AccessibilityToolbar` in header
- [ ] Use `text-*` classes for typography
- [ ] Use `btn-*` classes for buttons
- [ ] Use `card-*` classes for cards
- [ ] Add `reveal` class for scroll animations
- [ ] Use `animate-fade-in-up` for entrance animations
- [ ] Maintain lowercase text throughout
- [ ] Use spacing variables (`var(--space-*)`)
- [ ] Include skip link for accessibility
- [ ] Test all accessibility toolbar options work

### Color Usage Quick Reference

| Element | Color Variable |
|---------|---------------|
| Page background | `var(--bg-dark)` |
| Cards | `var(--bg-card)` or `var(--bg-elevated)` |
| Primary text | `var(--text-white)` |
| Secondary text | `var(--text-gray)` |
| Muted text | `var(--text-muted)` |
| Accent/CTA | `var(--accent-primary)` |
| Hover states | `var(--accent-hover)` |
| Glows/shadows | `var(--accent-glow)` |

### Typography Quick Reference

| Element | Class | Font Size |
|---------|-------|-----------|
| Hero headline | `.text-hero` | 64-80px |
| Section title | `.text-section-title` | 32-40px |
| Eyebrow | `.text-eyebrow` | 12px uppercase |
| Body text | `.text-body` | 16px |
| Lead text | `.text-body-lg` | 18-20px |
| Small/caption | `.text-muted-sm` | 14px |

---

**Document Version:** 1.2
**Last Updated:** December 31, 2025
**Author:** DevOps Lab Design Team
**Updates:** Added implementation reference, logo guidelines, page structure patterns, component patterns

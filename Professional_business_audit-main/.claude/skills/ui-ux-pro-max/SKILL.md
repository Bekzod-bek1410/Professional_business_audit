---
name: ui-ux-pro-max
description: "UI/UX design intelligence. 50 styles, 21 palettes, 50 font pairings, 20 charts, 9 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui). Actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor, check UI/UX code. Projects: website, landing page, dashboard, admin panel, e-commerce, SaaS, portfolio, blog, mobile app, .html, .tsx, .vue, .svelte. Elements: button, modal, navbar, sidebar, card, table, form, chart. Styles: glassmorphism, claymorphism, minimalism, brutalism, neumorphism, bento grid, dark mode, responsive, skeuomorphism, flat design. Topics: color palette, accessibility, animation, layout, typography, font pairing, spacing, hover, shadow, gradient. Integrations: shadcn/ui MCP for component search and examples."
---

# UI/UX Pro Max - Design Intelligence

Comprehensive design guide for web and mobile applications. Contains 50+ styles, 97 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 9 technology stacks.

## When to Apply

Reference these guidelines when:
- Designing new UI components or pages
- Choosing color palettes and typography
- Reviewing code for UX issues
- Building landing pages or dashboards
- Implementing accessibility requirements

## Rule Categories by Priority

| Priority | Category | Impact | Domain |
|----------|----------|--------|--------|
| 1 | Accessibility | CRITICAL | `ux` |
| 2 | Touch & Interaction | CRITICAL | `ux` |
| 3 | Performance | HIGH | `ux` |
| 4 | Layout & Responsive | HIGH | `ux` |
| 5 | Typography & Color | MEDIUM | `typography`, `color` |
| 6 | Animation | MEDIUM | `ux` |
| 7 | Style Selection | MEDIUM | `style`, `product` |
| 8 | Charts & Data | LOW | `chart` |

## Quick Reference

### 1. Accessibility (CRITICAL)
- `color-contrast` - Minimum 4.5:1 ratio for normal text
- `focus-states` - Visible focus rings on interactive elements
- `alt-text` - Descriptive alt text for meaningful images
- `aria-labels` - aria-label for icon-only buttons
- `keyboard-nav` - Tab order matches visual order
- `form-labels` - Use label with for attribute

### 2. Touch & Interaction (CRITICAL)
- `touch-target-size` - Minimum 44x44px touch targets
- `hover-vs-tap` - Use click/tap for primary interactions
- `loading-buttons` - Disable button during async operations
- `error-feedback` - Clear error messages near problem
- `cursor-pointer` - Add cursor-pointer to clickable elements

### 3. Performance (HIGH)
- `image-optimization` - Use WebP, srcset, lazy loading
- `reduced-motion` - Check prefers-reduced-motion
- `content-jumping` - Reserve space for async content

### 4. Layout & Responsive (HIGH)
- `viewport-meta` - width=device-width initial-scale=1
- `readable-font-size` - Minimum 16px body text on mobile
- `horizontal-scroll` - Ensure content fits viewport width
- `z-index-management` - Define z-index scale (10, 20, 30, 50)

### 5. Typography & Color (MEDIUM)
- `line-height` - Use 1.5-1.75 for body text
- `line-length` - Limit to 65-75 characters per line
- `font-pairing` - Match heading/body font personalities

### 6. Animation (MEDIUM)
- `duration-timing` - Use 150-300ms for micro-interactions
- `transform-performance` - Use transform/opacity, not width/height
- `loading-states` - Skeleton screens or spinners

### 7. Style Selection (MEDIUM)
- `style-match` - Match style to product type
- `consistency` - Use same style across all pages
- `no-emoji-icons` - Use SVG icons, not emojis

### 8. Charts & Data (LOW)
- `chart-type` - Match chart type to data type
- `color-guidance` - Use accessible color palettes
- `data-table` - Provide table alternative for accessibility

## Design System: Professional Business Audit

### RECOMMENDED DESIGN SYSTEM
```
+----------------------------------------------------------------------------------------+
| TARGET: Professional Business Audit Tool                                               |
+----------------------------------------------------------------------------------------+
| PATTERN: Dashboard Analytics + Form-Driven Results                                     |
| Style: Minimalist Pro (Clean, Data-Forward, Corporate Trust)                          |
|                                                                                        |
| COLORS:                                                                                |
| Primary:    #0F172A (Slate 900) - Deep authority                                      |
| Secondary:  #1E293B (Slate 800) - Card backgrounds                                    |
| Accent:     #6366F1 (Indigo 500) - Interactive elements                               |
| Success:    #10B981 (Emerald 500)                                                      |
| Warning:    #F59E0B (Amber 500)                                                        |
| Danger:     #EF4444 (Red 500)                                                          |
| Background: #F8FAFC (Slate 50) - Light mode base                                      |
| Text:       #0F172A (Slate 900)                                                        |
| Muted:      #64748B (Slate 500)                                                        |
|                                                                                        |
| TYPOGRAPHY: Inter / DM Sans                                                            |
| Mood: Professional, clean, data-forward                                                |
| Google Fonts: Inter 300,400,500,600,700                                                |
|                                                                                        |
| KEY EFFECTS:                                                                           |
| Subtle shadows + Clean borders + Smooth transitions (200ms)                           |
| Progress animations + Number counting animations                                       |
|                                                                                        |
| AVOID:                                                                                 |
| Heavy gradients + Decorative emojis + Dark backgrounds only                           |
| Neon colors + Excessive animations                                                    |
+----------------------------------------------------------------------------------------+
```

## Common Rules for Professional UI

### Icons & Visual Elements
| Rule | Do | Don't |
|------|----|----- |
| **No emoji icons** | Use SVG icons (Lucide) | Use emojis as UI icons |
| **Stable hover states** | Color/opacity transitions | Scale transforms that shift layout |
| **Consistent icon sizing** | Fixed viewBox (24x24) | Mix different icon sizes |

### Interaction & Cursor
| Rule | Do | Don't |
|------|----|----- |
| **Cursor pointer** | Add to all clickable elements | Leave default cursor |
| **Hover feedback** | Visual feedback (color, shadow, border) | No indication |
| **Smooth transitions** | `transition: all 200ms ease` | Instant changes |

### Layout & Spacing
| Rule | Do | Don't |
|------|----|----- |
| **Content padding** | Account for fixed navbar | Let content hide behind elements |
| **Consistent max-width** | Same container width | Mix different widths |
| **Responsive** | Test 375px, 768px, 1024px, 1440px | Desktop only |

## Pre-Delivery Checklist

### Visual Quality
- [ ] No emojis used as icons (SVG only)
- [ ] All icons from consistent icon set (Lucide)
- [ ] Hover states don't cause layout shift
- [ ] Color contrast is 4.5:1 minimum

### Interaction
- [ ] All clickable elements have `cursor: pointer`
- [ ] Hover states provide visual feedback
- [ ] Transitions are smooth (150-300ms)
- [ ] Focus states visible for keyboard navigation

### Layout
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile
- [ ] Proper spacing and whitespace

### Accessibility
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] `prefers-reduced-motion` respected
- [ ] Sufficient color contrast

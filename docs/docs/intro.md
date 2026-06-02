---
id: intro
title: Davinci Design System
sidebar_label: Introduction
slug: /
---

# Davinci Design System

Davinci is a product design system built for the Davinci platform — a professional social and collaboration tool. It provides a complete, layered system from raw design tokens through reusable UI patterns, giving designers and engineers a shared language and a single source of truth.

## Who this is for

- **Product designers** — use the Figma library alongside these docs to understand every token, variant, and usage rule
- **Frontend engineers** — consume `colors_and_type.css` and `davinci.css` directly; reference these pages for intent and behavior
- **Design system contributors** — use the Storybook integration and these docs together to extend and document new components

## How the system is organized

The system is structured in four layers, each building on the one below:

| Layer | What it contains |
|---|---|
| **Foundations** | Design tokens — color scales, surfaces, type scale, spacing, radii, shadows, breakpoints |
| **Primitives** | Atomic building blocks — Button, Input, Avatar, Badge, Icons, and form atoms |
| **Components** | Composed, interactive, multi-part components — Card, Dialog, Tabs, Table, and the rest of the shadcn-based library |
| **Patterns** | Davinci app compositions — Panel, Post, Composer, Navigation, Feed, Profile, Rails |

## Quick navigation

### Foundations
- [Colors](/foundations/colors) — Radix-based sand/blue/yellow scales plus semantic tokens
- [Surfaces](/foundations/surfaces) — Layered surface variants and elevation context
- [Typography](/foundations/typography) — Type scale, font families, weights
- [Spacing](/foundations/spacing) — 4-px-based spacing scale with usage guidance
- [Shadows](/foundations/shadows) — Elevation system with 5 depth levels
- [Radii](/foundations/radii) — Border radius tokens from xs (2px) to full (9999px)
- [Breakpoints](/foundations/breakpoints) — Responsive breakpoints and layout insets

### Primitives
- [Icons](/primitives/icons) — Material Symbols Rounded integration
- [Button](/shadcn/button) — Variants and sizes on the skeuomorphic `.btn` chrome
- [Input](/shadcn/input) & [Textarea](/shadcn/textarea) — Form text fields
- [Avatar](/shadcn/avatar) & [Badge](/shadcn/badge) — Identity and status atoms

### Components
- [Component library overview](/shadcn/) — the full shadcn-based set
- [Card](/shadcn/card) — The primary container surface
- [Dialog](/shadcn/dialog) & [Sheet](/shadcn/sheet) — Overlays
- [Tabs](/shadcn/tabs) · [Dropdown Menu](/shadcn/dropdown-menu) · [Table](/shadcn/table)

### Patterns
- [Panel](/components/panel) — The primary card container for content sections
- [Post](/components/post) — Social post with reactions, media, and author info
- [Composer](/components/composer) — Rich text post input with toolbar
- [Navigation](/components/navigation) — TopNav and NavList patterns
- [Feed](/patterns/feed) · [Profile](/patterns/profile) · [Rails](/patterns/rails)

## Technology

| Tool | Purpose |
|---|---|
| CSS Custom Properties | All design tokens live as CSS variables |
| Radix Colors | Color scale foundation for all palettes |
| Radix UI + shadcn/ui | Headless primitives and the component library, wrapped as `@davinci/ui` |
| Material Symbols Rounded | Icon system via Google Fonts variable font |
| Inter | Primary body and display typeface |
| JetBrains Mono | Monospace code typeface |
| Storybook | Interactive component explorer |
| TinaCMS | Content editing for this documentation |

## Using the tokens

Import the two CSS files to get everything:

```html
<link rel="stylesheet" href="colors_and_type.css" />
<link rel="stylesheet" href="ui_kits/web_app/davinci.css" />
```

Then use tokens in your CSS:

```css
.my-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--s-7);
  box-shadow: var(--shadow-md);
  color: var(--fg);
}
```

## Theming

Davinci defaults to **dark mode**. The `:root` and `[data-theme="dark"]` selectors define dark values. Apply `[data-theme="light"]` to `<html>` to switch to the light palette — all semantic tokens update automatically.

```js
document.documentElement.setAttribute('data-theme', 'light');
```

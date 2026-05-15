# Davinci Design System — Contributor Guide

## Architecture overview

```
davinci/
├── package.json                ← npm workspaces root (Node ≥20, npm ≥10)
│
├── packages/
│   ├── tokens/                 ← @davinci/tokens — CSS design tokens
│   │   ├── palette.css         ← AUTO-GENERATED — Radix Colors (all 31 scales)
│   │   ├── colors_and_type.css ← Davinci semantic aliases + typography + spacing
│   │   ├── shadcn-bridge.css   ← Maps Davinci vars → shadcn/ui var names
│   │   └── all.css             ← Convenience bundle (imports all three)
│   │
│   └── ui/                     ← @davinci/ui — shadcn component library
│       ├── components.json     ← shadcn CLI configuration
│       ├── src/
│       │   ├── components/ui/  ← shadcn-generated components (source-owned)
│       │   ├── lib/utils.js    ← cn() utility (clsx + tailwind-merge)
│       │   └── styles/
│       │       └── globals.css ← Tailwind v4 @theme wiring Davinci → Tailwind
│       └── vite.config.js
│
├── storybook/                  ← Storybook 8 + Vite + React
│   └── src/stories/
│       ├── foundations/        ← Colors, Typography, Spacing…
│       ├── primitives/         ← Button, Avatar, Pill…
│       ├── components/         ← Panel, TopNav, Post…
│       ├── patterns/           ← Feed, ProfilePage…
│       └── shadcn/             ← AUTO-GENERATED stubs (fill in, never deleted)
│
├── docs/                       ← Docusaurus 3 + TinaCMS
│   └── docs/shadcn/            ← AUTO-GENERATED MDX stubs
│
└── scripts/
    ├── generate-palette.js     ← Reads Radix CSS → writes palette.css
    ├── sync-radix.js           ← Checks npm for @radix-ui/colors update
    ├── sync-shadcn.js          ← Checks shadcn registry, re-adds changed components
    ├── generate-stories.js     ← Creates missing Storybook stubs
    ├── generate-docs.js        ← Creates missing MDX doc stubs
    └── sync.js                 ← Master orchestrator (runs all of the above)
```

---

## Token layer order

```
palette.css              Radix Colors raw vars  (--blue-9, --sand-3, …)
    ↓  imported by
colors_and_type.css      Davinci semantic vars  (--accent, --fg-muted, …)
    ↓  imported by
shadcn-bridge.css        shadcn vars            (--primary, --background, …)
    ↓  read by
globals.css @theme       Tailwind v4 colors     (bg-primary, text-foreground, …)
    ↓  used by
shadcn components        Tailwind utilities     (bg-primary, text-muted-foreground)
```

**Rule:** Never hard-code a color value in a component. All colors must trace back to `palette.css` via this chain.

---

## Day-to-day workflows

### Add a shadcn component

```bash
# 1. Install the component into packages/ui
cd packages/ui
npx shadcn@latest add button

# 2. Generate a Storybook story and doc stub (from project root)
cd ../..
node scripts/generate-stories.js --components button
node scripts/generate-docs.js --components button

# 3. Storybook story is at: storybook/src/stories/shadcn/Button.stories.jsx
#    Doc stub is at:        docs/docs/shadcn/button.mdx
#    Edit both to your satisfaction — they are never overwritten.
```

### Update @radix-ui/colors

```bash
node scripts/sync-radix.js
# Installs latest, regenerates palette.css, shows diff summary
```

### Update all shadcn components

```bash
node scripts/sync-shadcn.js
# Fetches registry, re-adds changed components, triggers story/doc generators
```

### Full sync (CI equivalent)

```bash
node scripts/sync.js
# Runs: sync-radix → sync-shadcn → generate-stories → generate-docs
```

---

## CI/CD

The GitHub Actions workflow `.github/workflows/sync-design-system.yml` runs every **Monday at 08:00 UTC**. When changes are found, it:

1. Opens a PR titled `chore: sync design system dependencies`
2. Labels it `dependencies` + `automated`
3. Lists changed files in the PR body

The PR must be reviewed and merged manually. Stories and docs stubs are never overwritten once created, so you can safely merge and then fill in the stubs.

**Manual trigger:** Go to Actions → Sync Design System Dependencies → Run workflow.

---

## Adding a new color token

1. Edit `colors_and_type.css` — add the semantic var to both `:root/[data-theme="dark"]` and `[data-theme="light"]` blocks.
2. If the token should be accessible to shadcn components, add a mapping in `packages/tokens/shadcn-bridge.css`.
3. Palette vars (`palette.css`) are auto-generated — never edit that file directly.

---

## Upgrading @radix-ui/colors manually

```bash
cd storybook
npm install --save-dev @radix-ui/colors@latest
cd ..
node scripts/generate-palette.js
```

---

## Storybook

```bash
npm run storybook        # from project root (uses workspaces)
# or
cd storybook && npm run storybook
```

Runs on `http://localhost:6006`. Theme toggle (dark/light) is in the toolbar.

## Docs

```bash
npm run docs             # from project root
# or
cd docs && npm run start
```

Runs on `http://localhost:3002`.

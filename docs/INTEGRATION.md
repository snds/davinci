# Docusaurus ↔ Davinci Design System — Integration Reference

> Version: @docusaurus/theme-classic@3.10.0 · @davinci/ui@1.0.0
> Updated: 2026-04-19

This document catalogs every coupling point between Docusaurus and the Davinci design system. Use it when:
- Upgrading Docusaurus (check each "RISK" item against the changelog)
- Onboarding a new design system (replace token/component references listed here)
- Debugging a broken integration (trace symptoms to the relevant section)

---

## 1. Swizzled theme components

Each file in `src/theme/` overrides a Docusaurus built-in. They are listed by stability.

| File | Docusaurus API used | Stability | Breaking-change risk |
|---|---|---|---|
| `Root/index.jsx` | None (wraps `children`) | SAFE | None — pure React |
| `BackToTopButton/index.jsx` | None | SAFE | None |
| `EditThisPage/index.jsx` | `editUrl` prop | SAFE | Prop rename only |
| `Tag/index.jsx` | `label`, `permalink`, `count` props | SAFE | Prop rename only |
| `PaginatorNavLink/index.jsx` | `permalink`, `title`, `subLabel`, `isNext` props | SAFE | Prop rename only |
| `Admonition/index.jsx` | `type`, `title`, `children` props | SAFE | Prop rename only |
| `NotFound/index.jsx` | `PageMetadata`, `Layout`, `translate` | SAFE | Public APIs |
| `NotFound/Content/index.jsx` | None (full replacement) | SAFE | None |
| `DocBreadcrumbs/index.jsx` | `useSidebarBreadcrumbs()`, `useHomePageRoute()` | **RISK** | See §1.1 |

### 1.1 DocBreadcrumbs hook risk

`useSidebarBreadcrumbs` — from `@docusaurus/plugin-content-docs/client`. Documented but versioned with the plugin.

`useHomePageRoute` — from `@docusaurus/theme-common/internal`. **Internal API.** Not guaranteed stable. Wrapped in `BreadcrumbErrorBoundary` so if it throws, breadcrumbs fail silently instead of crashing.

**On Docusaurus upgrade:** Check if `@docusaurus/theme-common/internal` still exports `useHomePageRoute` with the same signature. If removed, change to `useBaseUrl('/')` as a fallback.

---

## 2. CSS token contract

### 2.1 IFM → Davinci mappings

Docusaurus uses `--ifm-*` variables internally. These are overridden in `src/css/custom.css` to map Davinci tokens. If a Docusaurus update adds new `--ifm-*` variables that aren't mapped, those elements will use default Infima styling.

Key mappings (from `custom.css`):

```css
--ifm-color-primary          → --accent (var(--accent))
--ifm-background-color       → --bg
--ifm-navbar-background-color → --bg-surface
--ifm-font-family-base       → --font-body
--ifm-font-family-monospace  → --font-mono
--ifm-code-font-size         → --text-sm (13px)
--ifm-toc-border-color       → --border-subtle
--ifm-hr-border-color        → --border
```

**On Docusaurus upgrade:** Search the changelog for new `--ifm-*` variables. Add corresponding overrides in `custom.css`.

### 2.2 Davinci token dependencies (custom.css + swizzled components)

The following Davinci tokens must be present for the integration to render correctly:

**Backgrounds**
- `--bg` `--bg-surface` `--bg-subtle` `--bg-raised`

**Foregrounds**
- `--fg` `--fg-muted` `--fg-subtle`

**Borders**
- `--border` `--border-subtle`

**Brand/accent**
- `--accent` `--accent-fg`

**Semantic**
- `--success` `--danger` `--danger-fg` `--warning` `--info`

**Typography**
- `--font-body` `--font-mono` `--font-display`
- `--text-2xs` through `--text-7xl`
- `--fw-regular` `--fw-medium` `--fw-semibold` `--fw-bold` `--fw-heavy`
- `--lh-tight` `--lh-snug` `--lh-normal` `--lh-loose`
- `--ls-tight` `--ls-snug` `--ls-normal` `--ls-wide` `--ls-wider`

**Spacing**
- `--s-1` through `--s-10`

**Layout**
- `--page-inset-x` `--container-doc` `--container-max`

**Breakpoints** (docs/JS reference only — cannot use in @media conditions)
- `--bp-sm` `--bp-md` `--bp-lg` `--bp-xl` `--bp-2xl`

**Shadows**
- `--shadow-sm` `--shadow-md` `--shadow-lg`

**Motion**
- `--duration-fast` `--duration-normal` `--ease-out`

---

## 3. CSS file load order

The following CSS files are loaded in order. Earlier files are overridden by later ones.

1. Infima base styles (Docusaurus internal)
2. `static/colors_and_type.css` — Davinci base tokens (fonts, type scale, color vars)
3. `static/davinci.css` — Davinci component classes (`.btn`, `.panel`, `.pill`, etc.)
4. `packages/ui/src/styles/globals.css` — Tailwind v4 + shadcn token mappings (injected via PostCSS plugin)
5. `src/css/custom.css` — Doc-site overrides: IFM remaps, Docusaurus-specific layout patches

**Critical:** `custom.css` must load last. The PostCSS/Tailwind plugin (`tailwindPlugin` in `docusaurus.config.js`) injects into Docusaurus's PostCSS pipeline — if this plugin is removed or the `configurePostCss` lifecycle changes, Tailwind classes stop working.

---

## 4. Tailwind v4 integration

Tailwind is wired via `@tailwindcss/postcss` injected in `docusaurus.config.js`:

```js
async function tailwindPlugin() {
  return {
    name: 'docusaurus-tailwindcss',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push(require('@tailwindcss/postcss'));
      return postcssOptions;
    },
  };
}
```

`globals.css` must be imported somewhere in the CSS chain for Tailwind's `@theme` block and `@source` directive to be processed. It's pulled in by `custom.css` via `@import`.

**Dark mode variant:** `@custom-variant dark (&:is(.dark *, [data-theme="dark"] *))` — supports both `.dark` class (shadcn components) and `[data-theme="dark"]` attribute (Docusaurus).

**On Tailwind v5 upgrade:** The `@custom-variant` syntax may change. Check the Tailwind changelog for breaking variant API changes.

---

## 5. Storybook integration

`StorybookEmbed.jsx` reads `siteConfig.customFields.storybookUrl` (falls back to `http://localhost:6006`).

`docusaurus.config.js` reads `process.env.STORYBOOK_URL` at build time:

```js
customFields: {
  storybookUrl: process.env.STORYBOOK_URL || 'http://localhost:6006',
}
```

Navbar and footer Storybook links also use `process.env.STORYBOOK_URL`.

**For CI/CD deployment:** Set `STORYBOOK_URL=https://your-storybook-host.com` in the build environment.

---

## 6. LivePreview CSS paths

`LivePreview.jsx` renders an `<iframe srcDoc>` and loads Davinci CSS via:

```js
const base = siteConfig.baseUrl.replace(/\/$/, '');
// → "/davinci" in production, "" when BASE_URL=/
href="${base}/colors_and_type.css"
href="${base}/davinci.css"
```

These files must be present in `docs/static/`. If the static directory structure changes, update the paths here.

---

## 7. Dependency versions

| Package | Version | Pinned? | Notes |
|---|---|---|---|
| `@docusaurus/core` | `^3.10.0` | Caret | Patch updates safe; minor updates need audit |
| `@docusaurus/preset-classic` | `^3.10.0` | Caret | Keep in sync with core |
| `@davinci/ui` | `^1.0.0` | Caret | Workspace package — pin to major |
| `@tailwindcss/postcss` | `^4.0.0` | Caret | v5 may change `@custom-variant` syntax |
| `react` / `react-dom` | `^18.0.0` | Caret | React 19 peer dep changes expected |

---

## 8. Breaking-change checklist

Run through this list when bumping `@docusaurus/core` or `@docusaurus/preset-classic`:

- [ ] `DocBreadcrumbs`: does `@docusaurus/theme-common/internal` still export `useHomePageRoute`?
- [ ] `DocBreadcrumbs`: does `@docusaurus/plugin-content-docs/client` still export `useSidebarBreadcrumbs`?
- [ ] Are there new `--ifm-*` variables in the release that need Davinci token overrides?
- [ ] Did the `configurePostCss` plugin lifecycle change? (check Docusaurus plugin API changelog)
- [ ] Are there new swizzlable components added that we should consider overriding?
- [ ] Did `@theme/NotFound` or `@theme/Root` component contracts change?
- [ ] Run `npm run build` — check for `Module not found` errors in swizzled files
- [ ] Visual regression: check dark mode, breadcrumbs, admonitions, paginators, tags, 404 page

---

## 9. Adding a new design system

To swap the Davinci design system for another:

1. Replace `static/colors_and_type.css` and `static/davinci.css` with the new system's tokens and component classes
2. Update all `--davinci` token references in `custom.css` to the new system's variable names (§2.2)
3. Update `packages/ui` (or replace with the new system's package) and update imports in swizzled components
4. Update the `@custom-variant dark` line in `globals.css` if the new system uses a different dark mode signal
5. Update `LivePreview.jsx` static CSS href paths if the files are at different locations

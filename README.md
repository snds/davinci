# Davinci Design System

A modern-tech design system with a softer, warmer flair — **blue primary**, **sand neutral**, **yellow alt brand**, built on Radix Colors and shadcn-style structure. Default theme is dark.

> **Origin note:** the "Davinci" name references the original design system that seeded LinkedIn's early aesthetic. This build is an original, forward-looking take — not a recreation of LinkedIn. The UI kit recreates *styles of surfaces* the original system influenced (feed, profile, company pages), not the specific LinkedIn product.

## Sources
- GitHub: `snds/davinci` (scaffolding-only repo at time of build — no prior tokens/components imported)
- Foundations: [Radix Colors](https://www.radix-ui.com/colors), shadcn/ui conventions, [Material Symbols](https://fonts.google.com/icons)

## Index
- `colors_and_type.css` — **all tokens**. Radix scales (blue, sand, yellow, + green/red/amber functional), semantic variables (`--bg`, `--fg`, `--accent`, `--border`, `--success`…), spacing, radii, shadows, motion, font stacks, and type classes (`h1`–`h4`, `.body`, `.caption`, `.eyebrow`, `code`). Scoped to `:root` (dark default) and `[data-theme="light"]`.
- `assets/` — logo marks (`logo-mark.svg`, `logo-wordmark.svg`). No raster assets — logo is a flat vector wordmark.
- `preview/` — Design System tab cards (type, colors, spacing, components, brand).
- `ui_kits/web_app/` — interactive click-through kit: Feed, Profile, Company page.
- `SKILL.md` — agent-invocable skill definition.

---

## Content fundamentals

**Voice.** Confident, plainspoken, mildly dry. Writes like a senior designer explaining things to another senior designer — specific, no fluff, no breathless enthusiasm.

**Pronouns.** "We" for the platform, "you" for the reader. Avoids "I" unless quoting a person.

**Casing.** Sentence case everywhere except proper nouns. No Title Case For Button Labels. Product names are always **Davinci**, never "DaVinci" or "DAVINCI."

**Length.** Headlines short and declarative. Body copy earns its length. Labels prefer one word ("Follow," "Message," "Saved") over two.

**Emoji.** None in product chrome. Reactions on posts use real glyph icons (❤ 👍 💡) because that's a content convention, not a UI one.

**Tone examples (do):**
- "Shipping a refresh of our component library today."
- "Design infrastructure for product teams."
- "A real system teaches you how to decide."

**Tone examples (don't):**
- "🚀 Level up your design game with Davinci!"
- "We're SO excited to share…"
- "Revolutionary AI-powered component library"

---

## Visual foundations

**Color vibe.** Warm even in dark mode — sand neutrals carry an almost-paper quality. Blue (`--blue-9` = `#0090ff`) is the workhorse: links, primary buttons, active states. Yellow (`--yellow-9` = `#ffe629`) is reserved for accent moments — "new," event badges, the wordmark dot — never for CTAs. Status colors (green success, red danger, amber warning) are Radix-tuned to read at a glance.

**Type.** Inter (Google Fonts) for both display and body, with JetBrains Mono for code and tabular data. Display sizes track tight (-0.02em) and lean on weight (800) more than scale. Body runs at 15px / 1.5; small text at 13px. No second body face — the system stays one-sans-plus-mono.

**Spacing.** 4px base, 14 named steps from `--s-1` (2px) up to `--s-14` (128px). Layout rhythm sits at `--s-5` (16px) / `--s-7` (24px).

**Radii.** `--radius-md` (6px) is default. 2/4/8/12/16 and full. Avatars and follow/message buttons go full (pill) to soften the rest of the UI.

**Shadows.** Five-step warm elevation. No colored shadows, no neon glows. `--shadow-sm` for cards, `--shadow-md` for popovers, `--shadow-lg` for menus, `--shadow-xl` for modals. Focus rings use `--shadow-focus` (40%-opacity blue-8 at 3px).

**Borders.** Two tiers: `--border-subtle` for internal dividers (often dashed), `--border` for container edges. Nothing in the system uses a 2px colored left border as an accent.

**Backgrounds.** Flat surfaces. No full-bleed imagery in chrome. Covers (profile/company hero strips) use a two-radial-gradient pattern mixing blue and yellow — the only place gradients appear, and always behind a foreground surface. No patterns, textures, or grain.

**Imagery.** Feed attachments use placeholder gradient tiles in brand colors until real content is provided. Avatars are solid-fill initials on gradient, five variants (blue / yellow / sand / magenta / teal / amber).

**Animation.** Restrained. `--dur-fast` (120ms) for hover, `--dur-base` (180ms) for panel show/hide, `--dur-slow` (280ms) for route changes. `--ease-out` for most things, `--ease-spring` reserved for playful moments (none in core chrome). No bounces, no attention-getting loops.

**Hover states.** Opacity stays 1. Surfaces move one step up the sand scale (`--bg-hover`). Primary buttons shift to `--accent-hover` (blue-10). Ghost buttons gain `--bg-hover` + full-opacity text.

**Press / active.** Brief color darken, no scale transform. Selected nav items go to `--bg-selected` (blue-4) with `--blue-12` text — not a border accent.

**Transparency & blur.** Rare. The overlay (`--overlay`) for modals is a flat black 70%; no `backdrop-filter`. Transparency only inside the color system itself (alpha variants like `--gray-a3`, `--green-a3`) for tinting badges.

**Layout rules.** Main page grid is 1180px max, 240 / 1fr / 320 three-column. The top nav is sticky; nothing else is fixed. No full-bleed sections inside the app — everything sits in centered, bordered panels.

**Cards.** 10px radius, 1px `--border-subtle`, `--shadow-sm`. Hoverable cards gain `--shadow-md` and `--border`. No tilt, no inner glow.

**Corner radii used on what.**
- Panels: 10px
- Buttons: 6px (pill for follow/message and pill-flagged)
- Inputs: 6px
- Badges / pills: 9999px
- Avatars: 50%
- Elevated logos / company marks: 8–14px

---

## Iconography

**Primary icon set: [Material Symbols Rounded](https://fonts.google.com/icons).** Loaded from Google Fonts directly in `colors_and_type.css`. Default axis settings: `wght 400`, `FILL 0`, `GRAD 0`, `opsz 24`.

**Usage rules:**
- Default to the outline (unfilled) variant. Add `.filled` to turn an icon "on" — e.g. active nav tab, filled bookmark, liked thumb-up.
- 18–22px in component contexts, 24px in prominent nav, 14–16px inside buttons next to text.
- Color follows `currentColor`, so icons pick up the parent text color automatically.
- **Never use emoji as icons.** Emoji are content (e.g. reactions), not UI.
- **Never hand-roll SVG icons** when Material Symbols covers the concept.

**CDN note.** This system loads Material Symbols via Google Fonts URL — no bundled icon font. If offline / air-gapped usage is required, self-host the font or swap to the npm package `@material-symbols/font-rounded`.

**Logo assets** in `assets/`:
- `logo-mark.svg` — square mark, blue field + white counter + yellow dot
- `logo-wordmark.svg` — mark + "davinci" wordmark (Inter 800, -0.02em)

Wordmark is a **placeholder**; swap in real brand asset when available.

---

## Caveats (for the user)
- **Fonts are Google-hosted.** No local `.ttf` / `.woff2` files copied into `fonts/`.
- **Logo is a placeholder.** A simple blue mark + yellow dot — meant to be replaced.
- **No existing Davinci product code was importable** (the repo was scaffolding-only). The system is built fresh against the constraints provided (blue + sand + yellow; shadcn + Radix; LinkedIn-style surfaces).
- **UI kit covers three surfaces** — Feed, Profile, Company — each as a real click-through. Messaging, notifications, and search overlays are intentionally stubs.

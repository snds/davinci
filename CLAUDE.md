# Davinci — engineering contract

This file is hand-maintained and checked into the repo. It governs every coding
effort in this project. It extends (does not replace) the compiled rules in the
home `~/CLAUDE.md`.

## Mantra

**Separation of concerns is the default, not the exception.** Every change lands
in the layer that owns it. Abstraction is what lets us scale gracefully and accept
upstream improvements without rework — so we protect the seams between layers
deliberately. When a change is hard to place, that difficulty is signal: find the
layer that should own it before writing code, rather than smearing the change
across layers.

Concretely, before editing, ask: *which layer owns this concern?* Behavior,
appearance, and product ergonomics are three different owners.

## The three-way contract (shadcn-backed components)

Components flow through three layers, each with a strict, non-overlapping job.

| Layer | Path | Owns | Rule |
|---|---|---|---|
| **Base** | `packages/ui/src/components/ui/` | Upstream behavior (a11y, Radix wiring, structure) | **Regenerable shadcn only. Never hand-edit.** |
| **Theme** | `ui_kits/web_app/davinci.css` + `packages/tokens/shadcn-bridge.css` | All appearance, incl. skeuomorphic chrome | Style via the var bridge and `[data-slot][data-variant][data-size]` selectors — never by editing base className strings. |
| **Wrapper / native** | `packages/ui/src/components/davinci/` | Product ergonomics: new variants, new props, defaults, Davinci-native primitives | Additive only. Composes the base; never edits it. App code imports from here. |

### Where a change goes

- **Styling an existing variant** → Theme layer. Key off the `data-*` attributes the
  base already emits. The base className stays stock.
- **A new variant, size, or prop** → Wrapper layer. `cva` must emit the class, so it
  cannot live in pure CSS — it belongs in `components/davinci/`, not the base.
- **A bug in upstream behavior** → fix upstream / regenerate, don't patch the base.
- **A Davinci-native primitive** (no shadcn origin) → `components/davinci/`, never the
  base folder.

### Hard rules

1. **Never hand-edit `components/ui/`.** It must always equal `shadcn add --overwrite`
   output. If you're tempted to edit it, the change belongs in Theme or Wrapper.
2. **Tokens are the single source of truth for appearance.** No hardcoded colors,
   radii, spacing, or gradients in components or stories — reference tokens. The
   bridge maps shadcn var names → Davinci tokens; that is the only place shadcn vars
   are defined.
3. **The base must stay regenerable.** A change that can only be expressed by editing
   the base is a design smell — rework it into Theme + Wrapper.
4. **App and docs import from the Wrapper layer**, never the base directly, so the
   base stays free to track upstream.

### Safety net (must stay green)

- `.shadcn-registry.json` records the tracked version of every base component.
- CI re-adds each tracked component to a temp dir and diffs against
  `components/ui/`; **divergence fails the build.** This is what keeps the base
  pristine over time — treat a failure as "this edit is in the wrong layer," not as
  a guard to silence.

### Adding or changing a component (checklist)

1. Is it shadcn-backed or Davinci-native? Native → `components/davinci/` only.
2. Pure restyle? → Theme layer (`data-*` selectors). Confirm base regenerates with
   zero diff.
3. New variant/size/prop? → Wrapper layer. Base untouched.
4. Add a story, an axe test, and a docs entry (per home `~/CLAUDE.md`).
5. Run the regenerate-diff guard before claiming done.

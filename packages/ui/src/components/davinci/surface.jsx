import * as React from "react"

import { cn } from "@davinci/ui/lib/utils"

/**
 * Surface — the modern mapping of the original DaVinci "Containers".
 *
 * These are not visual components so much as semantic surfaces defined by
 * their role in a containment hierarchy. Each variant references the Davinci
 * token layer (the source of truth) — no hardcoded colors.
 *
 *   canvas    → root page background (textured)  → --bg + --bg-pattern
 *   container → raised content region            → --bg-surface (+ border, elevation)
 *   module    → quiet same-tone grouping         → --bg-subtle
 *   bristol   → inverse / contrast grouping       → --bg-inverse (polarity flips per theme)
 *
 * Punchcut (the textured inset/outset surface) was intentionally retired in
 * the modern system — flat surfaces + elevation cover its use cases.
 *
 * Intended nesting: Canvas › Container › (Module | Bristol) › content.
 * The hierarchy is enforced softly via dev-only console warnings — never fatal.
 */

const SURFACE_VARIANTS = {
  canvas:
    "[background-color:var(--bg)] [background-image:var(--bg-pattern)] bg-repeat [color:var(--fg)]",
  container:
    "rounded-xl border border-[var(--border)] [background-color:var(--bg-surface)] [color:var(--fg)] shadow-sm",
  module:
    "rounded-xl [background-color:var(--bg-subtle)] [color:var(--fg)]",
  bristol:
    "rounded-xl [background-color:var(--bg-inverse)] [color:var(--fg-on-inverse)]",
}

// Ancestor surface chain, used only to validate nesting in development.
const SurfaceContext = React.createContext([])

function warnHierarchy(variant, ancestors) {
  if (process.env.NODE_ENV === "production") return
  const parent = ancestors[ancestors.length - 1]
  const hasContainerAncestor = ancestors.includes("container")

  if (variant === "canvas" && ancestors.length > 0) {
    console.warn(
      `[Davinci Surface] variant="canvas" is the root surface and should not be nested (found inside "${parent}").`
    )
  }
  if (variant === "container" && (parent === "module" || parent === "bristol")) {
    console.warn(
      `[Davinci Surface] variant="container" should sit on a Canvas, not inside a grouping surface ("${parent}").`
    )
  }
  if ((variant === "module" || variant === "bristol") && !hasContainerAncestor) {
    console.warn(
      `[Davinci Surface] variant="${variant}" is meant to group content inside a Container, but no Container ancestor was found.`
    )
  }
}

const Surface = React.forwardRef(function Surface(
  { variant = "container", className, ...props },
  ref
) {
  const ancestors = React.useContext(SurfaceContext)
  warnHierarchy(variant, ancestors)

  const nextAncestors = React.useMemo(
    () => [...ancestors, variant],
    [ancestors, variant]
  )

  return (
    <SurfaceContext.Provider value={nextAncestors}>
      <div
        ref={ref}
        data-slot="surface"
        data-surface={variant}
        className={cn(SURFACE_VARIANTS[variant], className)}
        {...props}
      />
    </SurfaceContext.Provider>
  )
})

export { Surface, SURFACE_VARIANTS }

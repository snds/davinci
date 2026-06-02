import * as React from "react";

import {
  Avatar as BaseAvatar,
  AvatarImage,
  AvatarFallback,
} from "@davinci/ui/components/ui/avatar";

/* Avatar — the Davinci entity avatar.
 *
 * Wraps the base (Radix) Avatar with the system's identity treatment:
 *   `shape`   "circle" (default) | "rounded" (rounded-rectangle, e.g. logos)
 *   `ring`    bg-surface "sticker" stroke, drawn as an OUTER box-shadow so it
 *             never crops the photo — invisible on a matching surface, visible
 *             over a cover/colored backdrop. Larger sizes also get a soft lift.
 *   `variant` g1–g6 gradient/solid fallback background, or `bg` to override.
 *   `photo`   resolved image src (string) | null/undefined for initials only.
 *
 * Photo *resolution* (seeded demo portraits, etc.) is intentionally NOT here —
 * callers pass an already-resolved `photo` src.
 */
const VARIANT_BG = {
  g1: "var(--blue-9)", g2: "var(--teal-9)", g3: "var(--grass-9)",
  g4: "var(--violet-9)", g5: "var(--amber-9)", g6: "var(--tomato-9)",
};

function roundedRadius(size) { return Math.max(6, Math.round(size * 0.2)); }
function ringShadow(size) {
  const w = size >= 96 ? 4 : size >= 44 ? 3 : 2;
  const lift = size >= 72 ? ", var(--shadow-md)" : "";
  return `0 0 0 ${w}px var(--bg-surface)${lift}`;
}

function Avatar({ initials, size = 40, variant = "g1", photo, bg, shape = "circle", ring = true, style, className = "" }) {
  const radius = style && style.borderRadius != null
    ? style.borderRadius
    : shape === "rounded" ? roundedRadius(size) : "50%";
  const boxShadow = style && style.boxShadow != null
    ? style.boxShadow
    : ring ? ringShadow(size) : undefined;
  return (
    <BaseAvatar
      className={className}
      style={{ width: size, height: size, borderRadius: radius, flexShrink: 0, boxShadow, ...style }}
    >
      {photo && <AvatarImage src={photo} alt="" style={{ borderRadius: "inherit" }} />}
      <AvatarFallback
        style={{
          background: bg || VARIANT_BG[variant] || "var(--bg-active)",
          color: "#fff", borderRadius: "inherit",
          fontSize: Math.round(size * 0.38), fontWeight: 600,
        }}
      >
        {initials}
      </AvatarFallback>
    </BaseAvatar>
  );
}

export { Avatar, VARIANT_BG };

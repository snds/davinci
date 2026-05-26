import * as React from "react";

import { Badge } from "@davinci/ui/components/ui/badge";

/* Pill — the Davinci status/label chip.
 *
 * A fully-rounded Badge with the system's tonal variants (accent / success /
 * alt) layered on the base secondary badge. No variant → neutral secondary.
 */
const PILL_STYLE = {
  accent: { background: "var(--accent-subtle)", color: "var(--accent-fg)", borderColor: "transparent" },
  success: { background: "var(--success)", color: "#fff", borderColor: "transparent" },
  alt: { background: "var(--alt-subtle)", color: "var(--alt-fg)", borderColor: "transparent" },
};

function Pill({ children, variant, style }) {
  return (
    <Badge variant="secondary" className="rounded-full" style={{ ...(PILL_STYLE[variant] || {}), ...style }}>
      {children}
    </Badge>
  );
}

export { Pill, PILL_STYLE };

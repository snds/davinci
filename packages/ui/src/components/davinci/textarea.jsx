import * as React from "react";

import { Textarea as BaseTextarea } from "@davinci/ui/components/ui/textarea";

/* Textarea — Davinci wrapper.
 *
 * Adds the `size` ergonomic (sm / default / lg) on top of the pristine shadcn
 * base. The base stays stock and emits data-slot="textarea"; the solid-surface
 * fill and the size ramp live in the theme (davinci.css), keyed off
 * data-slot / data-size.
 */
function Textarea({ size = "default", ...props }) {
  return <BaseTextarea data-size={size} {...props} />;
}

export { Textarea };

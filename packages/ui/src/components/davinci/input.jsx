import * as React from "react";

import { Input as BaseInput } from "@davinci/ui/components/ui/input";

/* Input — Davinci wrapper.
 *
 * Adds the `size` ergonomic (sm / default / lg) on top of the pristine shadcn
 * base. The base stays stock and emits data-slot="input"; the solid-surface
 * fill and the size ramp live in the theme (davinci.css), keyed off
 * data-slot / data-size. The wrapper intercepts `size` so it is never spread
 * onto the native <input> as the (numeric) HTML size attribute.
 */
function Input({ size = "default", ...props }) {
  return <BaseInput data-size={size} {...props} />;
}

export { Input };

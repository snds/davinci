import * as React from "react";

/* Icon — Material Symbols Rounded glyph.
 *
 * The Davinci icon system. `size` maps to the .icon--{sm,md,lg} sizing classes
 * (small 12 / medium 20 / large 24); omit it to inherit the ambient
 * .material-symbols-rounded size. `filled` toggles the FILL axis. Material
 * Symbols Rounded is loaded by the host (see globals / font links).
 */
const ICON_SIZE_CLASS = { sm: "icon--sm", md: "icon--md", lg: "icon--lg" };

function Icon({ name, filled, size, style, className = "" }) {
  return (
    <span
      data-slot="icon"
      className={`material-symbols-rounded ${filled ? "filled" : ""} ${size ? ICON_SIZE_CLASS[size] : ""} ${className}`}
      style={style}
      aria-hidden
    >
      {name}
    </span>
  );
}

export { Icon };

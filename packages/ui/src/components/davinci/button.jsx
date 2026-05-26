import * as React from "react";

import { Button as BaseButton } from "@davinci/ui/components/ui/button";
import { Icon } from "@davinci/ui/components/davinci/icon";

/* Button — the Davinci button.
 *
 * Adds the system's product ergonomics on top of the base (shadcn-backed,
 * .btn-chrome) Button: `pill` for the fully-rounded shape, and `icon` /
 * `iconRight` to render a leading / trailing Material Symbols glyph with the
 * correct optical padding (.btn--icon-leading / .btn--icon-trailing).
 *
 * Defaults to the `secondary` variant — the resting product button.
 */
function Button({
  variant = "secondary",
  size,
  pill,
  children,
  icon,
  iconRight,
  className = "",
  ...rest
}) {
  return (
    <BaseButton
      variant={variant}
      size={size || "default"}
      className={`${pill ? "btn--pill" : ""} ${icon && children ? "btn--icon-leading" : ""} ${iconRight && children ? "btn--icon-trailing" : ""} ${className}`.trim()}
      {...rest}
    >
      {icon && <Icon name={icon} size="md" />}
      {children}
      {iconRight && <Icon name={iconRight} size="md" />}
    </BaseButton>
  );
}

export { Button };

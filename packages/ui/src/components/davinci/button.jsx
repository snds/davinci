import * as React from "react";

import { Button as BaseButton } from "@davinci/ui/components/ui/button";
import { Icon } from "@davinci/ui/components/davinci/icon";

/* Button — the Davinci button.
 *
 * Adds the system's product ergonomics on top of the base (pristine shadcn)
 * Button: `pill` for the fully-rounded shape, and `icon` / `iconRight` to
 * render a leading / trailing Material Symbols glyph with the correct optical
 * padding.
 *
 * The base stays stock and emits data-slot/data-variant/data-size; the
 * skeuomorphic chrome lives in the theme (davinci.css), keyed off those
 * attributes. This wrapper only forwards intent (variant/size) and adds
 * ergonomic hooks (data-pill / data-icon / data-icon-right) the theme reads.
 *
 * Defaults to the `secondary` variant — the resting product button.
 */
function Button({
  variant = "secondary",
  size = "default",
  pill,
  children,
  icon,
  iconRight,
  className = "",
  ...rest
}) {
  const hasLeadingIcon = Boolean(icon && children);
  const hasTrailingIcon = Boolean(iconRight && children);

  return (
    <BaseButton
      variant={variant}
      size={size}
      className={className}
      data-pill={pill ? "" : undefined}
      data-icon={hasLeadingIcon ? "" : undefined}
      data-icon-right={hasTrailingIcon ? "" : undefined}
      {...rest}
    >
      {icon && <Icon name={icon} size="md" />}
      {children}
      {iconRight && <Icon name={iconRight} size="md" />}
    </BaseButton>
  );
}

export { Button };

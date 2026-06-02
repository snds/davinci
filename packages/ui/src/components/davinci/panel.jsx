import * as React from "react";

import { Card } from "@davinci/ui/components/ui/card";

/* Panel — the primary content container.
 *
 * A Card with the system's panel chrome: an optional .panel__header (title +
 * trailing action) and a padded .panel__body. `bare` skips the body padding
 * for content that carries its own (composer, post). `bodyStyle`/`className`
 * and any extra props pass through.
 */
function Panel({ title, action, children, style, bodyStyle, className = "", bare = false, ...rest }) {
  return (
    <Card className={`gap-0 overflow-hidden py-0 ${className}`.trim()} style={style} {...rest}>
      {(title || action) && (
        <header className="panel__header">
          {title ? <span>{title}</span> : <span />}
          {action}
        </header>
      )}
      {bare ? children : <div className="panel__body" style={bodyStyle}>{children}</div>}
    </Card>
  );
}

export { Panel };

import * as React from "react"

import { cn } from "@davinci/ui/lib/utils"

/**
 * InputGroup — pairs an Input with an inline addon on the same row (the DaVinci
 * "Input Field" + "I'm Small" pattern). The Input grows to fill; any trailing
 * (or leading) element — a Button, Select, or plain text — keeps its intrinsic
 * width beside it.
 *
 *   <InputGroup>
 *     <Input placeholder="Coupon code" />
 *     <Button size="sm">Apply</Button>
 *   </InputGroup>
 *
 * A small gap is used rather than flush seams so the skeuomorphic .btn chrome
 * (gradient + border + shadow) reads correctly. Pass attached for a joined,
 * search-bar style group instead.
 */
function InputGroup({
  className,
  attached = false,
  ...props
}) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "flex w-full items-center [&>[data-slot=input]]:min-w-0 [&>[data-slot=input]]:flex-1",
        attached
          ? // joined seams: collapse adjacent radii and overlap borders
            "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:-ms-px"
          : "gap-2",
        className
      )}
      {...props} />
  );
}

export { InputGroup }

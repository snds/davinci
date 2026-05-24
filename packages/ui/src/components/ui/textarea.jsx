import * as React from "react"

import { cn } from "@davinci/ui/lib/utils"

const textareaSizes = {
  sm:      "min-h-12 px-2.5 py-1.5 text-sm",
  default: "min-h-16 px-3 py-2 text-base md:text-sm",
  lg:      "min-h-24 px-3.5 py-2.5 text-base",
}

function Textarea({
  className,
  size = "default",
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      data-size={size}
      className={cn(
        // Aligned to davinci.css `.textarea`: solid surface fill, hover border.
        "flex field-sizing-content w-full rounded-md border border-input bg-[var(--bg-surface)] shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground hover:border-[var(--border-strong)] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--bg-subtle)] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        textareaSizes[size],
        className
      )}
      {...props} />
  );
}

export { Textarea }

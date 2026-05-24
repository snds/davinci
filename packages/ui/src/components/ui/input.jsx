import * as React from "react"

import { cn } from "@davinci/ui/lib/utils"

// Sizes mirror the DaVinci `.input` / `.input--sm` / `.input--lg` ramp.
const inputSizes = {
  sm:      "h-8 px-2.5 text-sm",
  default: "h-9 px-3 text-base md:text-sm",
  lg:      "h-11 px-3.5 text-base",
}

function Input({
  className,
  type,
  size = "default",
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(
        // Aligned to davinci.css `.input`: solid surface fill, hover border,
        // 6px radius, token-driven colors (no transparent fill).
        "flex w-full min-w-0 rounded-md border border-input bg-[var(--bg-surface)] py-1 shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:border-[var(--border-strong)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--bg-subtle)]",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        inputSizes[size],
        className
      )}
      {...props} />
  );
}

export { Input }

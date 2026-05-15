import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@davinci/ui/lib/utils"

/* Davinci skeuomorphic chrome is defined in ui_kits/web_app/davinci.css
   under .btn / .btn--primary / .btn--secondary / .btn--alt. The shadcn
   Button composes those classes so visuals stay in sync with the
   davinci.css source of truth (gradient + inner highlight + drop
   shadow + engraved text-shadow + pressed/disabled states).

   Base utility list keeps shadcn invariants (svg sizing, focus ring,
   aria-invalid) without overriding the .btn chrome. */
const buttonVariants = cva(
  "btn inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap outline-none aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:     "btn--primary",
        primary:     "btn--primary",
        alt:         "btn--alt",
        warning:     "btn--alt",
        destructive: "btn--alt",
        secondary:   "btn--secondary",
        outline:     "btn--outline",
        ghost:       "btn--ghost",
        link:        "text-primary underline-offset-4 hover:underline !shadow-none !bg-transparent !border-transparent",
      },
      size: {
        default:    "",
        xs:         "btn--sm !px-2 !text-xs",
        sm:         "btn--sm",
        lg:         "btn--lg",
        icon:       "btn--icon",
        "icon-xs":  "btn--icon !p-1 !w-6 !h-6",
        "icon-sm":  "btn--icon !w-8 !h-8",
        "icon-lg":  "btn--icon !w-10 !h-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }

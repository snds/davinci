"use client";
import * as React from "react"
import { Slot } from "radix-ui"
import { Controller, FormProvider, useFormContext, useFormState } from "react-hook-form";

import { cn } from "@davinci/ui/lib/utils"
import { Label } from "@davinci/ui/components/ui/label"

const Form = FormProvider

const FormFieldContext = React.createContext({})

const FormField = (
  {
    ...props
  }
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id, orientation, messagePlacement } = itemContext

  return {
    id,
    orientation,
    messagePlacement,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

const FormItemContext = React.createContext({})

/**
 * FormItem layout.
 *   orientation="vertical"   (default) — label above the control (DaVinci "Top Aligned")
 *   orientation="horizontal"           — label beside the control (DaVinci "Left Aligned")
 *
 * In horizontal mode the label column width is driven by --form-label-width
 * (default 8rem). messagePlacement="inline" puts the error/hint to the right of
 * the control (the sheet's "Error - Alternate"); the default stacks it below.
 */
function FormItem({
  className,
  orientation = "vertical",
  messagePlacement = "stacked",
  ...props
}) {
  const id = React.useId()
  const horizontal = orientation === "horizontal"

  return (
    <FormItemContext.Provider value={{ id, orientation, messagePlacement }}>
      <div
        data-slot="form-item"
        data-orientation={orientation}
        className={cn(
          horizontal
            ? messagePlacement === "inline"
              ? "grid grid-cols-[var(--form-label-width,8rem)_minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-1.5"
              : "grid grid-cols-[var(--form-label-width,8rem)_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1.5"
            : "grid gap-2",
          className
        )}
        {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}) {
  const { error, formItemId, orientation } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn(
        "data-[error=true]:text-destructive",
        orientation === "horizontal" && "justify-self-end text-right",
        className
      )}
      htmlFor={formItemId}
      {...props} />
  );
}

function FormControl({
  ...props
}) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot.Root
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props} />
  );
}

function FormDescription({
  className,
  ...props
}) {
  const { formDescriptionId, orientation } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn(
        "text-sm text-muted-foreground",
        orientation === "horizontal" && "col-start-2",
        className
      )}
      {...props} />
  );
}

function FormMessage({
  className,
  ...props
}) {
  const { error, formMessageId, orientation, messagePlacement } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn(
        "text-sm text-destructive",
        orientation === "horizontal" &&
          (messagePlacement === "inline" ? "col-start-3 self-baseline" : "col-start-2"),
        className
      )}
      {...props}>
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}

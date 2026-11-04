"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"

type TextareaFieldProps = Omit<React.ComponentProps<"textarea">, "id"> & {
  label: string
  error?: string
  hint?: React.ReactNode
}

// Área de texto de los formularios del sitio, con el mismo aspecto que TextField.
export function TextareaField({ label, error, hint, className, rows = 3, ...props }: TextareaFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        {...props}
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "w-full resize-y rounded-lg border border-border bg-background/70 px-4 py-3 text-base shadow-[0_1px_2px_0_rgb(26_26_26/0.04)] transition-[border-color,box-shadow] duration-300 ease-premium outline-none sm:text-[15px]",
          "placeholder:text-muted-foreground/70 hover:border-foreground/20 focus:border-foreground/30 focus:ring-4 focus:ring-ring/15",
          "aria-invalid:border-destructive/60 aria-invalid:focus:ring-destructive/15",
          className
        )}
      />
      {error && (
        <p id={errorId} role="alert" className="text-[13px] text-destructive">
          {error}
        </p>
      )}
      {hint && <div id={hintId}>{hint}</div>}
    </div>
  )
}

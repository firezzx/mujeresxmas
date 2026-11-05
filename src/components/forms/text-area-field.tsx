"use client"

import { useId } from "react"

type TextAreaFieldProps = Omit<React.ComponentProps<"textarea">, "id"> & {
  label: string
  error?: string
  hint?: string
}

// Campo de texto largo, con el mismo estilo que TextField.
export function TextAreaField({ label, error, hint, ...props }: TextAreaFieldProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        className="w-full resize-y rounded-lg border border-border bg-background/70 px-4 py-3 text-[15px] shadow-[0_1px_2px_0_rgb(26_26_26/0.04)] transition-[border-color,box-shadow] duration-300 ease-premium outline-none placeholder:text-muted-foreground/70 hover:border-foreground/20 focus:border-foreground/30 focus:ring-4 focus:ring-ring/15 aria-invalid:border-destructive/60"
        {...props}
      />
      {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

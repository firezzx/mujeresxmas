"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"

type SelectFieldProps = Omit<React.ComponentProps<"select">, "id"> & {
  label: string
  error?: string
}

// Lista desplegable de los formularios del sitio, con el mismo aspecto que TextField.
export function SelectField({ label, error, className, children, ...props }: SelectFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          {...props}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-12 w-full cursor-pointer appearance-none truncate rounded-lg border border-border bg-background/70 pr-10 pl-4 text-[15px] shadow-[0_1px_2px_0_rgb(26_26_26/0.04)] transition-[border-color,box-shadow] duration-300 ease-premium outline-none",
            "hover:border-foreground/20 focus:border-foreground/30 focus:ring-4 focus:ring-ring/15",
            "aria-invalid:border-destructive/60 aria-invalid:focus:ring-destructive/15",
            className
          )}
        >
          {children}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-4 size-2 -translate-y-[70%] rotate-45 border-r-[1.5px] border-b-[1.5px] border-foreground/50"
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-[13px] text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

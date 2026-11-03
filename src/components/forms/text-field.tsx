"use client"

import { AnimatePresence, motion } from "motion/react"
import { useId } from "react"

import { cn } from "@/lib/utils"

type TextFieldProps = Omit<React.ComponentProps<"input">, "id"> & {
  label: string
  error?: string
  // Contenido a la derecha dentro del campo (p. ej. mostrar/ocultar contraseña)
  trailing?: React.ReactNode
  // Contenido debajo del campo, conectado por aria-describedby
  hint?: React.ReactNode
}

// Campo de texto de los formularios del sitio: etiqueta arriba, error animado debajo.
export function TextField({ label, error, trailing, hint, className, ...props }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-12 w-full rounded-lg border border-border bg-background/70 px-4 text-[15px] shadow-[0_1px_2px_0_rgb(26_26_26/0.04)] transition-[border-color,box-shadow] duration-300 ease-premium outline-none",
            "placeholder:text-muted-foreground/70 hover:border-foreground/20 focus:border-foreground/30 focus:ring-4 focus:ring-ring/15",
            "aria-invalid:border-destructive/60 aria-invalid:focus:ring-destructive/15",
            trailing && "pr-12",
            className
          )}
        />
        {trailing && <div className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</div>}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-[13px] text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && <div id={hintId}>{hint}</div>}
    </div>
  )
}

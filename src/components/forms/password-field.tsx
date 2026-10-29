"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

import { TextField } from "@/components/forms/text-field"
import { PASSWORD_MAX } from "@/lib/validations/auth"

type PasswordFieldProps = Omit<React.ComponentProps<typeof TextField>, "type" | "trailing" | "label"> & {
  label?: string
}

// Campo de contraseña con botón para mostrarla u ocultarla.
export function PasswordField({ label = "Contraseña", ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      label={label}
      name="password"
      autoCapitalize="none"
      spellCheck={false}
      maxLength={PASSWORD_MAX}
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          className="flex size-9 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
        </button>
      }
    />
  )
}

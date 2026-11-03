"use client"

import { useState } from "react"

import { TextField } from "@/components/forms/text-field"
import { EyeIcon } from "@/components/icons/eye"
import { EyeOffIcon } from "@/components/icons/eye-off"
import { useIconAnimation } from "@/hooks/use-icon-animation"
import { PASSWORD_MAX } from "@/lib/validations/auth"

type PasswordFieldProps = Omit<React.ComponentProps<typeof TextField>, "type" | "trailing" | "label"> & {
  label?: string
}

// Campo de contraseña con botón para mostrarla u ocultarla.
export function PasswordField({ label = "Contraseña", ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const { iconRef, triggerProps } = useIconAnimation()

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
          {...triggerProps}
          onClick={() => {
            setVisible((v) => !v)
            // Al cambiar de ícono, el nuevo se dibuja con su animación
            requestAnimationFrame(() => iconRef.current?.startAnimation())
          }}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          className="flex size-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          {visible ? (
            <EyeOffIcon ref={iconRef} size={18} className="pointer-events-none" />
          ) : (
            <EyeIcon ref={iconRef} size={18} className="pointer-events-none" />
          )}
        </button>
      }
    />
  )
}

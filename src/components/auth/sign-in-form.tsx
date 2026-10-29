"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { z } from "zod"

import { signIn, type SignInState } from "@/app/actions/auth"
import { ResendConfirmationForm } from "@/components/auth/resend-confirmation-form"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { FormMessage } from "@/components/forms/form-message"
import { PasswordField } from "@/components/forms/password-field"
import { TextField } from "@/components/forms/text-field"
import { ROUTES } from "@/config/navigation"
import { HONEYPOT_FIELD, signInSchema } from "@/lib/validations/auth"

type FieldErrors = { email?: string[]; password?: string[] }

// Formulario de inicio de sesión. Si la cuenta no está confirmada, ofrece reenviar el link.
export function SignInForm() {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signIn, { status: "idle" })
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [clientErrors, setClientErrors] = useState<FieldErrors>({})

  const error = state.status === "error" ? state : undefined
  const fieldError = (field: keyof FieldErrors) =>
    (clientErrors[field] ?? error?.fieldErrors?.[field])?.[0]

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const parsed = signInSchema.safeParse({ email, password })
    if (!parsed.success) {
      event.preventDefault()
      setClientErrors(z.flattenError(parsed.error).fieldErrors)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* Campo trampa anti-bots: invisible para personas y lectores de pantalla */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            No completar
            <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        <TextField
          label="Correo"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="nombre@correo.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setClientErrors((prev) => ({ ...prev, email: undefined }))
          }}
          error={fieldError("email")}
        />

        <div className="flex flex-col gap-2.5">
          <PasswordField
            autoComplete="current-password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setClientErrors((prev) => ({ ...prev, password: undefined }))
            }}
            error={fieldError("password")}
          />
          <Link
            href={ROUTES.recuperar}
            className="self-end text-[13px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <FormMessage message={error?.message} />

        <ShimmerSubmit pending={pending} pendingLabel="Ingresando…" className="w-full">
          Iniciar sesión
        </ShimmerSubmit>
      </form>

      {error?.unconfirmedEmail && (
        <ResendConfirmationForm key={error.unconfirmedEmail} email={error.unconfirmedEmail} />
      )}

      <p className="text-center text-sm text-muted-foreground">
        ¿Todavía no tenés cuenta?{" "}
        <Link href={ROUTES.registro} className="font-medium text-foreground underline-offset-4 hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  )
}

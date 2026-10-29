"use client"

import Link from "next/link"
import { Eye, EyeOff, MailCheck } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useActionState, useState } from "react"
import { z } from "zod"

import { signUp, type SignUpState } from "@/app/actions/auth"
import { PasswordChecklist } from "@/components/auth/password-checklist"
import { ResendConfirmationForm } from "@/components/auth/resend-confirmation-form"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { TextField } from "@/components/forms/text-field"
import { ROUTES } from "@/config/navigation"
import { HONEYPOT_FIELD, PASSWORD_MAX, signUpSchema } from "@/lib/validations/auth"

const ease = [0.22, 1, 0.36, 1] as const

type FieldErrors = { email?: string[]; password?: string[] }

// Formulario de registro: correo y contraseña. Valida en el navegador con el mismo esquema
// que el servidor y, al terminar, muestra el aviso para confirmar el correo.
export function SignUpForm() {
  const [state, formAction, pending] = useActionState<SignUpState, FormData>(signUp, { status: "idle" })
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [clientErrors, setClientErrors] = useState<FieldErrors>({})
  // Estado de éxito descartado con "Usar otro correo"
  const [dismissed, setDismissed] = useState<SignUpState | null>(null)

  const serverErrors = state.status === "error" ? state.fieldErrors : undefined
  const fieldError = (field: keyof FieldErrors) =>
    (clientErrors[field] ?? serverErrors?.[field])?.[0]

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const parsed = signUpSchema.safeParse({ email, password })
    if (!parsed.success) {
      event.preventDefault()
      setClientErrors(z.flattenError(parsed.error).fieldErrors)
    }
  }

  const success = state.status === "success" && dismissed !== state

  return (
    <AnimatePresence mode="wait" initial={false}>
      {success ? (
        <motion.div
          key="check-email"
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease }}
          className="flex flex-col items-center text-center"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-brand-soft text-foreground">
            <MailCheck className="size-6" strokeWidth={1.75} />
          </span>
          <h2 className="mt-5 font-heading text-2xl font-semibold tracking-[-0.02em]">Revisá tu correo</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-pretty text-muted-foreground">
            Te enviamos un link a <span className="font-medium break-all text-foreground">{state.email}</span> para
            confirmar tu cuenta. Si no lo ves en unos minutos, buscalo en spam o promociones.
          </p>
          <ResendConfirmationForm email={state.email} justSent className="mt-6 w-full" />
          <button
            type="button"
            onClick={() => {
              setDismissed(state)
              setPassword("")
            }}
            className="cursor-pointer text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Usar otro correo
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          action={formAction}
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease }}
          className="flex flex-col gap-5"
        >
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

          <TextField
            label="Contraseña"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={PASSWORD_MAX}
            placeholder="Creá una contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setClientErrors((prev) => ({ ...prev, password: undefined }))
            }}
            error={fieldError("password")}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={showPassword}
                className="flex size-9 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
              </button>
            }
            hint={<PasswordChecklist value={password} />}
          />

          <AnimatePresence initial={false}>
            {state.status === "error" && state.message && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl bg-destructive/[0.07] px-4 py-3 text-sm text-destructive"
              >
                {state.message}
              </motion.p>
            )}
          </AnimatePresence>

          <ShimmerSubmit pending={pending} pendingLabel="Creando tu cuenta…" className="mt-1 w-full">
            Crear mi cuenta
          </ShimmerSubmit>

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link
              href={ROUTES.login}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Iniciá sesión
            </Link>
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

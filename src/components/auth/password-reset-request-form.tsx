"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { useActionState, useState } from "react"

import { requestPasswordReset, type PasswordResetState } from "@/app/actions/auth"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { HoverIcon } from "@/components/icons/hover-icon"
import { FormMessage } from "@/components/forms/form-message"
import { TextField } from "@/components/forms/text-field"
import { ROUTES } from "@/config/navigation"
import { emailSchema, HONEYPOT_FIELD } from "@/lib/validations/auth"

const ease = [0.22, 1, 0.36, 1] as const

// Pide el link para elegir una contraseña nueva.
export function PasswordResetRequestForm() {
  const [state, formAction, pending] = useActionState<PasswordResetState, FormData>(requestPasswordReset, {
    status: "idle",
  })
  const [email, setEmail] = useState("")
  const [clientError, setClientError] = useState<string>()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const parsed = emailSchema.safeParse(email)
    if (!parsed.success) {
      event.preventDefault()
      setClientError(parsed.error.issues[0]?.message)
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-brand-soft">
            <HoverIcon name="mail-check" size={24} autoPlay />
          </span>
          <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em]">Revisá tu correo</h2>
          <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">
            Si <span className="font-medium break-all text-foreground">{state.email}</span> tiene una cuenta, te
            enviamos un link para elegir una contraseña nueva. Vence en 1 hora.
          </p>
          <Link
            href={ROUTES.login}
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Volver a iniciar sesión
          </Link>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          action={formAction}
          onSubmit={handleSubmit}
          noValidate
          exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
          transition={{ duration: 0.3, ease }}
          className="flex flex-col gap-5"
        >
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
              setClientError(undefined)
            }}
            error={clientError}
          />

          <FormMessage trigger={state} message={state.status === "error" ? state.message : undefined} />

          <ShimmerSubmit pending={pending} pendingLabel="Enviando…" className="w-full">
            Enviarme el link
          </ShimmerSubmit>

          <Link
            href={ROUTES.login}
            className="text-center text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Volver a iniciar sesión
          </Link>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

"use client"

import Link from "next/link"
import { BadgeCheck } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useActionState, useState } from "react"

import { updatePassword, type UpdatePasswordState } from "@/app/actions/auth"
import { PasswordChecklist } from "@/components/auth/password-checklist"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { FormMessage } from "@/components/forms/form-message"
import { PasswordField } from "@/components/forms/password-field"
import { ROUTES } from "@/config/navigation"
import { newPasswordSchema } from "@/lib/validations/auth"

const ease = [0.22, 1, 0.36, 1] as const

// Elige la contraseña nueva. Funciona con la sesión que abre el link del correo de recuperación.
export function NewPasswordForm() {
  const [state, formAction, pending] = useActionState<UpdatePasswordState, FormData>(updatePassword, {
    status: "idle",
  })
  const [password, setPassword] = useState("")
  const [clientError, setClientError] = useState<string>()

  const error = state.status === "error" ? state : undefined

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const parsed = newPasswordSchema.safeParse({ password })
    if (!parsed.success) {
      event.preventDefault()
      setClientError(parsed.error.issues[0]?.message)
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === "success" ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-brand-soft">
            <BadgeCheck className="size-6" strokeWidth={1.75} />
          </span>
          <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em]">Listo, ya la cambiaste</h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Tu contraseña nueva ya está activa y tu sesión sigue iniciada.
          </p>
          <ShimmerLink href="/" size="md" className="mt-1 h-12 w-full">
            Ir al inicio
          </ShimmerLink>
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
          <PasswordField
            label="Contraseña nueva"
            autoComplete="new-password"
            placeholder="Creá una contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setClientError(undefined)
            }}
            error={clientError ?? error?.fieldErrors?.password?.[0]}
            hint={<PasswordChecklist value={password} />}
          />

          <FormMessage
            message={
              error?.message && (
                <>
                  {error.message}
                  {error.expired && (
                    <>
                      {" "}
                      <Link href={ROUTES.recuperar} className="font-medium underline underline-offset-4">
                        Pedir un link nuevo
                      </Link>
                    </>
                  )}
                </>
              )
            }
          />

          <ShimmerSubmit pending={pending} pendingLabel="Guardando…" className="w-full">
            Guardar contraseña
          </ShimmerSubmit>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

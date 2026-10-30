"use client"

import { useActionState, useEffect, useState } from "react"

import { resendConfirmation, type ResendState } from "@/app/actions/auth"
import { FormMessage } from "@/components/forms/form-message"
import { TextField } from "@/components/forms/text-field"
import { cn } from "@/lib/utils"

// Debe coincidir con max_frequency de [auth.email] en supabase/config.toml
const COOLDOWN_SECONDS = 60

type ResendConfirmationFormProps = {
  // Si ya conocemos el correo (recién registrada) no se vuelve a pedir
  email?: string
  // true cuando acabamos de enviar un correo: arranca con la espera activa
  justSent?: boolean
  className?: string
}

// Reenvía el correo de confirmación, con espera entre envíos para no saturar.
export function ResendConfirmationForm({ email, justSent = false, className }: ResendConfirmationFormProps) {
  const [secondsLeft, setSecondsLeft] = useState(justSent ? COOLDOWN_SECONDS : 0)
  const [typedEmail, setTypedEmail] = useState("")

  const [state, formAction, pending] = useActionState(
    async (prev: ResendState, formData: FormData) => {
      const result = await resendConfirmation(prev, formData)
      if (result.status === "sent") setSecondsLeft(COOLDOWN_SECONDS)
      return result
    },
    { status: "idle" }
  )

  const counting = secondsLeft > 0
  useEffect(() => {
    if (!counting) return
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [counting])

  return (
    <form action={formAction} className={cn("flex flex-col gap-3", className)}>
      {email ? (
        <input type="hidden" name="email" value={email} />
      ) : (
        <TextField
          label="Tu correo"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          placeholder="nombre@correo.com"
          value={typedEmail}
          onChange={(e) => setTypedEmail(e.target.value)}
        />
      )}

      <button
        type="submit"
        disabled={pending || secondsLeft > 0}
        className="h-12 w-full cursor-pointer rounded-full border border-border bg-background/70 text-sm font-medium transition-colors duration-300 hover:border-foreground/20 hover:bg-foreground/[0.03] disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:border-border disabled:hover:bg-background/70"
      >
        {pending ? "Enviando…" : secondsLeft > 0 ? `Podés reenviarlo en ${secondsLeft} s` : "Reenviar el correo"}
      </button>

      <FormMessage
        trigger={state}
        tone="success"
        message={state.status === "sent" ? "Te lo enviamos de nuevo." : undefined}
      />
      <FormMessage trigger={state} message={state.status === "error" ? state.message : undefined} />
    </form>
  )
}

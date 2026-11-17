"use client"

import { AnimatePresence, motion } from "motion/react"
import { useActionState } from "react"

import { registerMaterialLead, type MaterialLeadState } from "@/app/actions/material-leads"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { FormMessage } from "@/components/forms/form-message"
import { SelectField } from "@/components/forms/select-field"
import { TextField } from "@/components/forms/text-field"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon } from "@/components/icons/hover-icon"
import { COUNTRIES, SIGNUP_PAGE } from "@/content/sumate"
import { HONEYPOT_FIELD } from "@/lib/validations/auth"

const ease = [0.22, 1, 0.36, 1] as const

// Formulario de /sumate: nombre y apellido, email y país. Al enviarlo se guarda el contacto y le
// muestra el agradecimiento (el correo sale solo si el envío está configurado).
export function SignupForm() {
  const [state, formAction, pending] = useActionState<MaterialLeadState, FormData>(registerMaterialLead, {
    status: "idle",
  })
  const errors = state.status === "error" ? state.fieldErrors : undefined

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease }}
          className="flex flex-col items-center gap-4 py-10 text-center"
        >
          <IconBadge size="lg" tone="green">
            <HoverIcon name="circle-check" size={24} autoPlay />
          </IconBadge>
          <h3 className="font-heading text-2xl font-semibold tracking-[-0.01em]">{SIGNUP_PAGE.sentTitle}</h3>
          <p className="max-w-sm text-[15px] leading-relaxed text-pretty text-muted-foreground">
            {SIGNUP_PAGE.sentText}
          </p>{" "}
        </motion.div>
      ) : (
        <motion.form
          key="form"
          action={formAction}
          noValidate
          exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
          transition={{ duration: 0.3, ease }}
          className="relative flex flex-col gap-5"
        >
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              No completar
              <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
            </label>
          </div>

          <TextField
            label="Nombre y apellido"
            name="fullName"
            autoComplete="name"
            placeholder="Nombre y apellido"
            required
            error={errors?.fullName?.[0]}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="nombre@correo.com"
            required
            error={errors?.email?.[0]}
          />
          <SelectField label="País" name="country" defaultValue="" required error={errors?.country?.[0]}>
            <option value="" disabled>
              Elegí tu país
            </option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </SelectField>

          <FormMessage trigger={state} message={state.status === "error" ? state.message : undefined} />

          <ShimmerSubmit pending={pending} pendingLabel="Enviando…" className="w-full">
            {SIGNUP_PAGE.submit}
          </ShimmerSubmit>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

"use client"

import { AnimatePresence, motion } from "motion/react"
import { useActionState, useEffect, useState } from "react"

import { requestCompanyProposal, type CompanyLeadState } from "@/app/actions/company-leads"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { FormMessage } from "@/components/forms/form-message"
import { SelectField } from "@/components/forms/select-field"
import { TextField } from "@/components/forms/text-field"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon } from "@/components/icons/hover-icon"
import { COMPANIES_FORM, COMPANIES_FORM_ID, COMPANY_AUDIENCES } from "@/content/empresas"
import { HONEYPOT_FIELD } from "@/lib/validations/auth"

const ease = [0.22, 1, 0.36, 1] as const

// Formulario de pedido de propuesta de la página de Empresas. Valida en el servidor y, si sale
// bien, muestra el agradecimiento en lugar del formulario.
export function CompanyLeadForm() {
  const [state, formAction, pending] = useActionState<CompanyLeadState, FormData>(requestCompanyProposal, {
    status: "idle",
  })
  const errors = state.status === "error" ? state.fieldErrors : undefined
  const [audience, setAudience] = useState("")

  // Las tarjetas de "¿A quiénes querés impulsar?" llevan a #propuesta-<opción>: se elige sola
  useEffect(() => {
    const prefix = `#${COMPANIES_FORM_ID}-`
    function onHashChange() {
      const value = window.location.hash.startsWith(prefix) ? window.location.hash.slice(prefix.length) : ""
      if (COMPANY_AUDIENCES.some((option) => option.value === value)) setAudience(value)
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease }}
          className="flex flex-col items-center gap-4 py-8 text-center"
        >
          <IconBadge size="lg" tone="green">
            <HoverIcon name="mail-check" size={24} autoPlay />
          </IconBadge>
          <h3 className="font-heading text-2xl font-semibold tracking-[-0.01em]">{COMPANIES_FORM.sentTitle}</h3>
          <p className="max-w-sm text-[15px] leading-relaxed text-pretty text-muted-foreground">
            {COMPANIES_FORM.sentText}
          </p>
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

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Nombre y apellido"
              name="fullName"
              autoComplete="name"
              placeholder="Nombre y apellido"
              required
              error={errors?.fullName?.[0]}
            />
            <TextField
              label="Empresa u organización"
              name="company"
              autoComplete="organization"
              placeholder="Nombre de la organización"
              required
              error={errors?.company?.[0]}
            />
          </div>
          <TextField
            label="Email laboral"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="nombre@empresa.com"
            required
            error={errors?.email?.[0]}
          />
          <SelectField
            label="¿A quiénes querés impulsar?"
            name="audience"
            value={audience}
            onChange={(event) => setAudience(event.target.value)}
            required
            error={errors?.audience?.[0]}
          >
            <option value="" disabled>
              Elegí una opción
            </option>
            {COMPANY_AUDIENCES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>

          <FormMessage trigger={state} message={state.status === "error" ? state.message : undefined} />

          <ShimmerSubmit pending={pending} pendingLabel="Enviando…" className="w-full sm:w-auto sm:self-start">
            {COMPANIES_FORM.submit}
          </ShimmerSubmit>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

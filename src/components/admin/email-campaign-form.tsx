"use client"

import { useActionState, useState } from "react"
import { z } from "zod"

import { sendEmailCampaign, type EmailCampaignState } from "@/app/actions/email-campaigns"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { FormMessage } from "@/components/forms/form-message"
import { SelectField } from "@/components/forms/select-field"
import { TextField } from "@/components/forms/text-field"
import { TextareaField } from "@/components/forms/textarea-field"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { ALL_AUDIENCE } from "@/content/sumate"
import { type EmailCampaignField, emailCampaignSchema } from "@/lib/validations/material-lead"

type FieldErrors = Partial<Record<EmailCampaignField, string[]>>

const EMPTY = { subject: "", body: "", audience: ALL_AUDIENCE as string }

function successMessage(state: EmailCampaignState) {
  if (state.status === "test-sent") return `Te mandamos la prueba a ${state.to}.`
  if (state.status !== "sent") return undefined
  const sent = `Listo: el correo salió para ${state.sent} ${state.sent === 1 ? "persona" : "personas"}.`
  return state.failed ? `${sent} ${state.failed} no se pudieron enviar.` : sent
}

// Correo masivo a los contactos de /sumate. {nombre} se reemplaza por el nombre de cada una.
// "Enviarme una prueba" lo manda solo a la administradora para revisarlo antes.
export function EmailCampaignForm({
  audiences,
  emailReady,
}: {
  // Cuántas personas suscriptas hay en total y por país
  audiences: { value: string; label: string; count: number }[]
  emailReady: boolean
}) {
  const [values, setValues] = useState(EMPTY)
  const [clientErrors, setClientErrors] = useState<FieldErrors>({})
  const [state, formAction, pending] = useActionState<EmailCampaignState, FormData>(
    async (prev, formData) => {
      const result = await sendEmailCampaign(prev, formData)
      if (result.status === "sent") setValues(EMPTY)
      return result
    },
    { status: "idle" }
  )

  const serverErrors = state.status === "error" ? state.fieldErrors : undefined
  const errorFor = (field: EmailCampaignField) => (clientErrors[field] ?? serverErrors?.[field])?.[0]
  const count = audiences.find((option) => option.value === values.audience)?.count ?? 0

  function update(field: EmailCampaignField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setClientErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const parsed = emailCampaignSchema.safeParse(values)
    if (!parsed.success) {
      event.preventDefault()
      setClientErrors(z.flattenError(parsed.error).fieldErrors)
      return
    }
    // El envío masivo no se puede deshacer: se confirma antes
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    if (submitter?.value !== "test") {
      const ok = window.confirm(
        `Vas a enviar "${values.subject}" a ${count} ${count === 1 ? "persona" : "personas"}. ¿Confirmás el envío?`
      )
      if (!ok) event.preventDefault()
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {!emailReady && (
        <div className="rounded-lg bg-brand-soft/40 px-4 py-3 text-sm leading-relaxed">
          El envío todavía no está configurado: falta cargar el SMTP (<code>SMTP_USER</code>, <code>SMTP_PASSWORD</code>
          ) y <code>EMAIL_FROM</code> en las variables de entorno. Podés armar el correo igual.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <TextField
          label="Asunto"
          name="subject"
          placeholder="Ej.: {nombre}, te contamos lo nuevo de la comunidad"
          maxLength={160}
          value={values.subject}
          onChange={(e) => update("subject", e.target.value)}
          error={errorFor("subject")}
        />
        <SelectField
          label="Para"
          name="audience"
          value={values.audience}
          onChange={(e) => update("audience", e.target.value)}
        >
          {audiences.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} ({option.count})
            </option>
          ))}
        </SelectField>
      </div>

      <TextareaField
        label="Mensaje"
        name="body"
        rows={10}
        maxLength={20000}
        placeholder={
          "Hola {nombre}:\n\nEscribí acá tu mensaje. Dejá una línea en blanco entre párrafos.\n\nLos links (https://…) se convierten solos."
        }
        value={values.body}
        onChange={(e) => update("body", e.target.value)}
        error={errorFor("body")}
        hint={
          <p className="text-sm text-muted-foreground">
            Escribí <code className="rounded bg-foreground/[0.06] px-1">{"{nombre}"}</code> donde quieras el nombre de
            cada persona. Al pie va solo el link para darse de baja.
          </p>
        }
      />

      <FormMessage trigger={state} message={state.status === "error" ? state.message : undefined} />
      <FormMessage trigger={state} tone="success" message={successMessage(state)} />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <IconHoverArea>
          <button
            type="submit"
            name="mode"
            value="test"
            disabled={pending}
            className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium ring-1 ring-border transition-colors hover:bg-brand-soft disabled:cursor-wait disabled:opacity-60 sm:w-auto"
          >
            <HoverIcon name="eye" size={16} />
            Enviarme una prueba
          </button>
        </IconHoverArea>
        <ShimmerSubmit
          name="mode"
          value="all"
          pending={pending}
          pendingLabel="Enviando…"
          disabled={!count}
          className="w-full sm:w-auto"
        >
          Enviar a {count} {count === 1 ? "persona" : "personas"}
        </ShimmerSubmit>
      </div>
    </form>
  )
}

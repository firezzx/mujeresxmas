"use client"

import { useActionState, useState } from "react"
import { z } from "zod"

import { sendNotification, type SendNotificationState } from "@/app/actions/notifications"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { FormMessage } from "@/components/forms/form-message"
import { TextAreaField } from "@/components/forms/text-area-field"
import { TextField } from "@/components/forms/text-field"
import { type NotificationField, notificationSchema } from "@/lib/validations/notification"

type FieldErrors = Partial<Record<NotificationField, string[]>>

const EMPTY = { title: "", body: "", link: "" }

// Formulario para mandar un aviso a todas las usuarias.
export function NotificationForm() {
  const [values, setValues] = useState(EMPTY)
  // Al enviarse bien, el formulario queda vacío para la próxima
  const [state, formAction, pending] = useActionState<SendNotificationState, FormData>(
    async (prev, formData) => {
      const result = await sendNotification(prev, formData)
      if (result.status === "sent") setValues(EMPTY)
      return result
    },
    { status: "idle" }
  )
  const [clientErrors, setClientErrors] = useState<FieldErrors>({})

  const serverErrors = state.status === "error" ? state.fieldErrors : undefined
  const errorFor = (field: NotificationField) => (clientErrors[field] ?? serverErrors?.[field])?.[0]

  function update(field: NotificationField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setClientErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const parsed = notificationSchema.safeParse(values)
    if (!parsed.success) {
      event.preventDefault()
      setClientErrors(z.flattenError(parsed.error).fieldErrors)
      return
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <TextField
        label="Título"
        name="title"
        placeholder="Ej.: Abrimos inscripciones al taller de marca"
        maxLength={120}
        value={values.title}
        onChange={(e) => update("title", e.target.value)}
        error={errorFor("title")}
      />

      <TextAreaField
        label="Mensaje (opcional)"
        name="body"
        rows={3}
        maxLength={600}
        placeholder="Contá en pocas líneas de qué se trata."
        value={values.body}
        onChange={(e) => update("body", e.target.value)}
        error={errorFor("body")}
      />

      <TextField
        label="Link (opcional)"
        name="link"
        placeholder="/kiero o https://…"
        inputMode="url"
        value={values.link}
        onChange={(e) => update("link", e.target.value)}
        error={errorFor("link")}
        hint={
          <p className="text-sm text-muted-foreground">Al tocar la notificación, el usuario va a esta página.</p>
        }
      />

      <FormMessage trigger={state} message={state.status === "error" ? state.message : undefined} />
      <FormMessage
        trigger={state}
        tone="success"
        message={state.status === "sent" ? "La notificación ya les llegó a todos." : undefined}
      />

      <ShimmerSubmit pending={pending} pendingLabel="Enviando…" className="w-full sm:w-auto sm:self-end">
        Enviar a todos
      </ShimmerSubmit>
    </form>
  )
}

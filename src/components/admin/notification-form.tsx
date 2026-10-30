"use client"

import { useActionState, useId, useState } from "react"
import { z } from "zod"

import { sendNotification, type SendNotificationState } from "@/app/actions/notifications"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { FormMessage } from "@/components/forms/form-message"
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
  const [dirty, setDirty] = useState(false)
  const bodyId = useId()

  const serverErrors = state.status === "error" ? state.fieldErrors : undefined
  const errorFor = (field: NotificationField) => (clientErrors[field] ?? serverErrors?.[field])?.[0]

  function update(field: NotificationField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setClientErrors((prev) => ({ ...prev, [field]: undefined }))
    setDirty(true)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const parsed = notificationSchema.safeParse(values)
    if (!parsed.success) {
      event.preventDefault()
      setClientErrors(z.flattenError(parsed.error).fieldErrors)
      return
    }
    setDirty(false)
  }

  const bodyError = errorFor("body")

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

      <div className="flex flex-col gap-2">
        <label htmlFor={bodyId} className="text-sm font-medium">
          Mensaje (opcional)
        </label>
        <textarea
          id={bodyId}
          name="body"
          rows={3}
          maxLength={600}
          placeholder="Contá en pocas líneas de qué se trata."
          value={values.body}
          onChange={(e) => update("body", e.target.value)}
          aria-invalid={bodyError ? true : undefined}
          className="w-full resize-y rounded-2xl border border-border bg-background/70 px-4 py-3 text-[15px] shadow-[0_1px_2px_0_rgb(40_20_40/0.04)] transition-[border-color,box-shadow] duration-300 ease-premium outline-none placeholder:text-muted-foreground/70 hover:border-foreground/20 focus:border-foreground/30 focus:ring-4 focus:ring-ring/15 aria-invalid:border-destructive/60"
        />
        {bodyError && <p className="text-[13px] text-destructive">{bodyError}</p>}
      </div>

      <TextField
        label="Link (opcional)"
        name="link"
        placeholder="/quiero o https://…"
        inputMode="url"
        value={values.link}
        onChange={(e) => update("link", e.target.value)}
        error={errorFor("link")}
        hint={
          <p className="text-[13px] text-muted-foreground">Al tocar la notificación, el usuario va a esta página.</p>
        }
      />

      <FormMessage message={state.status === "error" ? state.message : undefined} />
      <FormMessage
        tone="success"
        message={state.status === "sent" && !dirty ? "La notificación ya les llegó a todos." : undefined}
      />

      <ShimmerSubmit pending={pending} pendingLabel="Enviando…" className="w-full sm:w-auto sm:self-end">
        Enviar a todos
      </ShimmerSubmit>
    </form>
  )
}

"use client"

import { useActionState, useState } from "react"
import { z } from "zod"

import { updateProfile, type ProfileState } from "@/app/actions/profile"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { FormMessage } from "@/components/forms/form-message"
import { TextField } from "@/components/forms/text-field"
import { cn } from "@/lib/utils"
import { PROFILE_FIELDS, profileSchema, type ProfileField } from "@/lib/validations/profile"

type FieldErrors = Partial<Record<ProfileField, string[]>>

// Formulario de datos del perfil. Los campos salen de PROFILE_FIELDS.
export function ProfileForm({ initialValues }: { initialValues: Record<ProfileField, string> }) {
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(updateProfile, { status: "idle" })
  const [values, setValues] = useState(initialValues)
  const [clientErrors, setClientErrors] = useState<FieldErrors>({})

  const serverErrors = state.status === "error" ? state.fieldErrors : undefined

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const parsed = profileSchema.safeParse(values)
    if (!parsed.success) {
      event.preventDefault()
      setClientErrors(z.flattenError(parsed.error).fieldErrors)
      return
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {PROFILE_FIELDS.map((field) => (
          <div key={field.name} className={cn(!field.half && "sm:col-span-2")}>
            <TextField
              label={field.optional ? `${field.label} (opcional)` : field.label}
              name={field.name}
              type={field.type ?? "text"}
              inputMode={field.inputMode}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={(e) => {
                setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                setClientErrors((prev) => ({ ...prev, [field.name]: undefined }))
              }}
              error={(clientErrors[field.name] ?? serverErrors?.[field.name])?.[0]}
            />
          </div>
        ))}
      </div>

      <FormMessage trigger={state} message={state.status === "error" ? state.message : undefined} />
      <FormMessage
        trigger={state}
        tone="success"
        message={state.status === "saved" ? "Guardamos tus cambios." : undefined}
      />

      <ShimmerSubmit pending={pending} pendingLabel="Guardando…" className="w-full sm:w-auto sm:self-end">
        Guardar cambios
      </ShimmerSubmit>
    </form>
  )
}

"use client"

import { useActionState } from "react"

import { saveSignupIntro, type SignupIntroState } from "@/app/actions/site-texts"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { FormMessage } from "@/components/forms/form-message"
import { TextField } from "@/components/forms/text-field"
import { TextareaField } from "@/components/forms/textarea-field"
import type { SignupIntro, SignupIntroField } from "@/lib/validations/site-text"

// Edita el título, la descripción y los puntos de la página de registro (/sumate).
export function SignupIntroForm({ intro }: { intro: SignupIntro }) {
  const [state, formAction, pending] = useActionState<SignupIntroState, FormData>(saveSignupIntro, {
    status: "idle",
  })
  const errorFor = (field: SignupIntroField) => (state.status === "error" ? state.fieldErrors?.[field]?.[0] : undefined)

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <TextField label="Título" name="title" defaultValue={intro.title} maxLength={80} error={errorFor("title")} />
        <TextField
          label="Palabra en verde"
          name="titleHighlight"
          defaultValue={intro.titleHighlight}
          maxLength={40}
          error={errorFor("titleHighlight")}
        />
      </div>
      <TextareaField
        label="Descripción"
        name="description"
        rows={3}
        maxLength={400}
        defaultValue={intro.description}
        error={errorFor("description")}
      />
      <TextareaField
        label="Puntos con tilde"
        name="bullets"
        rows={4}
        defaultValue={intro.bullets.join("\n")}
        error={errorFor("bullets")}
        hint={
          <p className="text-sm text-muted-foreground">Uno por línea, hasta 6. Dejalo vacío para no mostrar ninguno.</p>
        }
      />

      <FormMessage trigger={state} message={state.status === "error" ? state.message : undefined} />
      <FormMessage
        trigger={state}
        tone="success"
        message={state.status === "saved" ? "Listo: la página de registro ya muestra los textos nuevos." : undefined}
      />

      <ShimmerSubmit pending={pending} pendingLabel="Guardando…" className="w-full sm:w-auto sm:self-end">
        Guardar textos
      </ShimmerSubmit>
    </form>
  )
}

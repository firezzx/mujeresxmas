"use client"

import { useActionState, useState } from "react"
import { z } from "zod"

import { updatePlan, type UpdatePlanState } from "@/app/actions/plans"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { FormMessage } from "@/components/forms/form-message"
import { TextAreaField } from "@/components/forms/text-area-field"
import { TextField } from "@/components/forms/text-field"
import type { Plan } from "@/lib/plans"
import { FREE_PLAN_ID, type PlanField, planSchema } from "@/lib/validations/plan"

type FieldErrors = Partial<Record<PlanField, string[]>>

const PRICE_FORMAT = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 })

// Formulario para editar un plan. El precio del plan gratuito no se puede cambiar.
export function PlanForm({ plan }: { plan: Plan }) {
  const isFree = plan.id === FREE_PLAN_ID
  const [values, setValues] = useState({
    name: plan.name,
    description: plan.description ?? "",
    price: PRICE_FORMAT.format(plan.priceArs),
    features: plan.features.join("\n"),
  })
  const [state, formAction, pending] = useActionState<UpdatePlanState, FormData>(updatePlan.bind(null, plan.id), {
    status: "idle",
  })
  const [clientErrors, setClientErrors] = useState<FieldErrors>({})

  const serverErrors = state.status === "error" ? state.fieldErrors : undefined
  const errorFor = (field: PlanField) => (clientErrors[field] ?? serverErrors?.[field])?.[0]

  function update(field: PlanField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setClientErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const parsed = planSchema.safeParse(values)
    if (!parsed.success) {
      event.preventDefault()
      setClientErrors(z.flattenError(parsed.error).fieldErrors)
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Nombre"
          name="name"
          maxLength={40}
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          error={errorFor("name")}
        />
        <TextField
          label="Precio por mes (en pesos)"
          name="price"
          inputMode="numeric"
          disabled={isFree}
          className="disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:hover:border-border"
          value={values.price}
          onChange={(e) => update("price", e.target.value)}
          error={errorFor("price")}
          hint={
            isFree ? (
              <p className="text-sm text-muted-foreground">Es el plan que reciben todos al registrarse.</p>
            ) : undefined
          }
        />
      </div>

      <TextAreaField
        label="Descripción"
        name="description"
        rows={2}
        maxLength={200}
        value={values.description}
        onChange={(e) => update("description", e.target.value)}
        error={errorFor("description")}
      />

      <TextAreaField
        label="Beneficios"
        name="features"
        rows={6}
        hint="Escribí un beneficio por línea, en el orden en que querés mostrarlos. Empezá la línea con * para destacarla."
        value={values.features}
        onChange={(e) => update("features", e.target.value)}
        error={errorFor("features")}
      />

      <FormMessage trigger={state} message={state.status === "error" ? state.message : undefined} />
      <FormMessage
        trigger={state}
        tone="success"
        message={state.status === "saved" ? "Los cambios ya quedaron guardados." : undefined}
      />

      <ShimmerSubmit pending={pending} pendingLabel="Guardando…" className="w-full sm:w-auto sm:self-end">
        Guardar cambios
      </ShimmerSubmit>
    </form>
  )
}

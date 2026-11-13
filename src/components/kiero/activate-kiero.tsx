"use client"

import { useActionState } from "react"

import { activateMyKiero, type KieroActionState } from "@/app/actions/kiero"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { FormMessage } from "@/components/forms/form-message"

// Botón para que la usuaria con plan Crecer active su tienda en Kiero
export function ActivateKiero({ label }: { label: string }) {
  const [state, formAction, pending] = useActionState<KieroActionState>(activateMyKiero, { status: "idle" })
  return (
    <form action={formAction} className="w-full">
      <ShimmerSubmit pending={pending} pendingLabel="Activando…" size="md" className="h-12 w-full">
        {label}
      </ShimmerSubmit>
      <FormMessage trigger={state} message={state.status === "error" ? state.message : undefined} />
    </form>
  )
}

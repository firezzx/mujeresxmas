"use client"

import { useActionState } from "react"

import { setMemberKiero, type KieroActionState } from "@/app/actions/kiero"
import { FormMessage } from "@/components/forms/form-message"
import { cn } from "@/lib/utils"

// Estado de Kiero de una usuaria y el botón para darla de alta o de baja
export function KieroToggle({ userId, label, active }: { userId: string; label: string | null; active: boolean }) {
  const [state, formAction, pending] = useActionState<KieroActionState>(setMemberKiero.bind(null, userId, !active), {
    status: "idle",
  })
  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      {label && (
        <span
          className={cn(
            "inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-xs font-medium whitespace-nowrap",
            active ? "bg-brand-green/15 text-brand-green-strong" : "text-muted-foreground ring-1 ring-border"
          )}
        >
          <span aria-hidden className={cn("size-1.5 rounded-full", active ? "bg-brand-green" : "bg-foreground/30")} />
          {label}
        </span>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-7 cursor-pointer rounded-md px-2.5 text-xs font-medium ring-1 ring-border transition-colors outline-none hover:bg-foreground/[0.04] focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "…" : active ? "Dar de baja" : "Dar de alta"}
      </button>
      <FormMessage trigger={state} message={state.status === "error" ? state.message : undefined} />
    </form>
  )
}

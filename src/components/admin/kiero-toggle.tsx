"use client"

import { Dialog } from "@base-ui/react/dialog"
import { useActionState, useEffect, useState } from "react"

import { setMemberKiero, type KieroActionState } from "@/app/actions/kiero"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { cn } from "@/lib/utils"

type KieroToggleProps = {
  userId: string
  label: string | null
  active: boolean
  // Para que la confirmación diga a quién se da de alta o de baja
  name: string
  email: string
}

const BUTTON_BASE =
  "inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-wait disabled:opacity-60"

// Estado de Kiero de una usuaria y el botón para darla de alta o de baja. Como el cambio llega a
// Kiero de verdad (alta = correo de invitación), antes pide confirmar en una ventana.
export function KieroToggle({ userId, label, active, name, email }: KieroToggleProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState<KieroActionState>(setMemberKiero.bind(null, userId, !active), {
    status: "idle",
  })

  // Al terminar bien, se cierra la ventana; si falla, queda abierta con el error
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- responde al resultado de la acción
    if (state.status === "done") setOpen(false)
  }, [state])

  const who = name || email

  return (
    <div className="flex flex-wrap items-center gap-2">
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

      <Dialog.Root open={open} onOpenChange={(next) => !pending && setOpen(next)}>
        <Dialog.Trigger className={cn(BUTTON_BASE, "h-7 px-2.5 text-xs ring-1 ring-border hover:bg-foreground/[0.04]")}>
          {active ? "Dar de baja" : "Dar de alta"}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-[3px] transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none" />
          <Dialog.Popup className="fixed inset-x-3 top-1/2 z-[60] mx-auto w-auto max-w-md -translate-y-1/2 overflow-hidden rounded-xl bg-background shadow-[0_24px_64px_-16px_rgb(26_26_26/0.4)] transition-[opacity,transform] duration-300 ease-premium outline-none data-[ending-style]:translate-y-[calc(-50%+1rem)] data-[ending-style]:opacity-0 data-[starting-style]:translate-y-[calc(-50%+1rem)] data-[starting-style]:opacity-0 motion-reduce:transition-none">
            <header className="flex items-start justify-between gap-4 border-b border-border/70 bg-mesh-soft p-5 sm:px-6">
              <Dialog.Title className="font-heading text-xl leading-tight font-semibold tracking-[-0.01em]">
                {active ? "¿Dar de baja en Kiero?" : "¿Dar de alta en Kiero?"}
              </Dialog.Title>
              <IconHoverArea className="inline-flex">
                <Dialog.Close
                  aria-label="Cerrar"
                  disabled={pending}
                  className="-m-2 inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground/60 transition-colors outline-none hover:bg-foreground/[0.05] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  <HoverIcon name="x" size={18} />
                </Dialog.Close>
              </IconHoverArea>
            </header>

            <form action={formAction} className="flex flex-col gap-5 p-5 sm:px-6">
              <div className="rounded-lg bg-foreground/[0.03] px-4 py-3">
                <p className="truncate font-medium">{who}</p>
                {name && <p className="truncate text-sm text-muted-foreground">{email}</p>}
              </div>
              <Dialog.Description className="text-sm text-muted-foreground">
                {active
                  ? "Le vamos a avisar a Kiero que deje de tener acceso. Después la podés volver a dar de alta."
                  : "Kiero le va a mandar a ese correo la invitación para entrar a la plataforma."}
              </Dialog.Description>

              {state.status === "error" && !pending && (
                <p role="alert" className="rounded-lg bg-destructive/[0.06] px-4 py-3 text-sm text-destructive">
                  {state.message}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Dialog.Close
                  type="button"
                  disabled={pending}
                  className={cn(BUTTON_BASE, "h-11 px-4 text-sm ring-1 ring-border hover:bg-foreground/[0.04]")}
                >
                  Cancelar
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={pending}
                  className={cn(
                    BUTTON_BASE,
                    "h-11 px-4 text-sm",
                    active
                      ? "bg-foreground text-background hover:bg-foreground/85"
                      : "bg-brand-strong font-semibold text-white hover:bg-brand-strong/90"
                  )}
                >
                  {pending ? "Enviando…" : active ? "Sí, dar de baja" : "Sí, dar de alta"}
                </button>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

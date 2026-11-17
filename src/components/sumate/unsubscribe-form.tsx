"use client"

import { useActionState } from "react"

import { unsubscribe, type UnsubscribeState } from "@/app/actions/unsubscribe"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon } from "@/components/icons/hover-icon"
import { HEADING_CLASS } from "@/components/landing/landing-ui"
import { UNSUBSCRIBE_PAGE } from "@/content/sumate"
import { cn } from "@/lib/utils"

// Confirmación de baja. Se pide un clic para que los antivirus que abren los links de los
// correos no den de baja a nadie sin querer.
export function UnsubscribeForm({ token }: { token: string | null }) {
  const [state, formAction, pending] = useActionState<UnsubscribeState, FormData>(unsubscribe, {
    status: token ? "idle" : "invalid",
  })

  const copy =
    state.status === "done"
      ? { title: UNSUBSCRIBE_PAGE.doneTitle, text: UNSUBSCRIBE_PAGE.doneText }
      : state.status === "invalid"
        ? { title: UNSUBSCRIBE_PAGE.invalidTitle, text: UNSUBSCRIBE_PAGE.invalidText }
        : { title: UNSUBSCRIBE_PAGE.confirmTitle, text: UNSUBSCRIBE_PAGE.confirmText }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center">
      <IconBadge size="lg" tone={state.status === "invalid" ? "pink" : "green"}>
        <HoverIcon
          key={state.status}
          name={state.status === "done" ? "mail-check" : state.status === "invalid" ? "badge-alert" : "bell"}
          size={24}
          autoPlay
        />
      </IconBadge>
      <h1 className={cn(HEADING_CLASS, "text-3xl leading-tight sm:text-4xl")}>{copy.title}</h1>
      <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">{copy.text}</p>
      {state.status === "idle" && token && (
        <form action={formAction}>
          <input type="hidden" name="token" value={token} />
          <ShimmerSubmit pending={pending} pendingLabel="Procesando…">
            {UNSUBSCRIBE_PAGE.confirm}
          </ShimmerSubmit>
        </form>
      )}
    </div>
  )
}

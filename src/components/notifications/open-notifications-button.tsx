"use client"

import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { setNotificationsOpen } from "@/components/notifications/notifications-store"

// Botón de Mi cuenta para abrir el panel con todas las notificaciones.
export function OpenNotificationsButton({ label }: { label: string }) {
  return (
    <IconHoverArea>
      <button
        type="button"
        onClick={() => setNotificationsOpen(true)}
        className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium ring-1 ring-border transition-[background-color,box-shadow] duration-300 outline-none hover:bg-foreground/[0.04] hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        <HoverIcon name="bell" size={16} />
        {label}
      </button>
    </IconHoverArea>
  )
}

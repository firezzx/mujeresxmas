"use client"

import { BellIcon } from "@/components/icons/bell"
import { setNotificationsOpen } from "@/components/notifications/notifications-store"
import { useIconAnimation } from "@/hooks/use-icon-animation"

const MAX_SHOWN = 9

// Campana del header: abre el panel de notificaciones y muestra cuántas hay sin leer.
export function NotificationsBell({ unread }: { unread: number }) {
  const { iconRef, triggerProps } = useIconAnimation()
  return (
    <button
      type="button"
      {...triggerProps}
      onClick={() => setNotificationsOpen(true)}
      aria-label={unread ? `Abrir notificaciones (${unread} sin leer)` : "Abrir notificaciones"}
      className="relative flex size-10 cursor-pointer items-center justify-center rounded-lg ring-1 ring-border transition-[background-color,box-shadow] duration-300 outline-none hover:bg-foreground/[0.04] hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/40"
    >
      <BellIcon ref={iconRef} size={18} className="pointer-events-none" />
      {unread > 0 && (
        <span
          aria-hidden
          className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-md bg-brand-strong px-1 text-[11px] leading-none font-semibold text-brand-foreground ring-2 ring-background"
        >
          {unread > MAX_SHOWN ? `${MAX_SHOWN}+` : unread}
        </span>
      )}
    </button>
  )
}

"use client"

import { Dialog } from "@base-ui/react/dialog"
import { AnimatePresence } from "motion/react"
import Link from "next/link"
import { useOptimistic, useState, useTransition } from "react"

import { markNotificationsRead } from "@/app/actions/notifications"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { setNotificationsOpen, useNotificationsOpen } from "@/components/notifications/notifications-store"
import { AnimatedListItem } from "@/components/ui/animated-list"
import type { UserNotification } from "@/lib/notifications"
import { cn } from "@/lib/utils"

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "unread", label: "Sin leer" },
] as const

type Filter = (typeof FILTERS)[number]["key"]

const EMPTY_TEXT: Record<Filter, { title: string; text: string }> = {
  all: { title: "Estás al día", text: "Cuando haya novedades para vos, te avisamos acá." },
  unread: { title: "No tenés nada sin leer", text: "Ya viste todas tus notificaciones." },
}

// Panel lateral con las notificaciones (Dialog de Base UI y la entrada de Animated List de Magic UI).
// Marcar como leída se ve al instante: la lista cambia sin esperar la respuesta del servidor.
export function NotificationsDrawer({ notifications }: { notifications: UserNotification[] }) {
  const open = useNotificationsOpen()
  const [filter, setFilter] = useState<Filter>("all")
  const [, startTransition] = useTransition()
  const [justRead, addJustRead] = useOptimistic(new Set<string>(), (current, ids: string[]) => {
    return new Set([...current, ...ids])
  })

  const isUnread = (notification: UserNotification) => !notification.read && !justRead.has(notification.id)
  const unreadIds = notifications.filter(isUnread).map((notification) => notification.id)
  const visible = filter === "unread" ? notifications.filter(isUnread) : notifications

  const markRead = (ids: string[]) => {
    startTransition(async () => {
      addJustRead(ids)
      await markNotificationsRead(ids)
    })
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => setNotificationsOpen(next)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-foreground/25 backdrop-blur-[3px] transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-background shadow-[-24px_0_64px_-24px_rgb(26_26_26/0.35)] transition-transform duration-500 ease-premium outline-none data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full motion-reduce:transition-none sm:rounded-l-xl">
          <header className="flex flex-col gap-4 border-b border-border/70 bg-mesh-soft p-4 sm:rounded-tl-xl sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Dialog.Title className="font-heading text-2xl leading-none font-semibold tracking-[-0.01em]">
                  Notificaciones
                </Dialog.Title>
                {unreadIds.length > 0 && (
                  <span className="rounded-md bg-brand-strong px-2 py-1 text-xs leading-none font-semibold text-brand-foreground">
                    {unreadIds.length}
                    <span className="sr-only"> sin leer</span>
                  </span>
                )}
              </div>
              <IconHoverArea>
                <Dialog.Close
                  aria-label="Cerrar notificaciones"
                  className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-background ring-1 ring-border transition-shadow duration-300 outline-none hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  <HoverIcon name="x" size={18} />
                </Dialog.Close>
              </IconHoverArea>
            </div>

            <div role="group" aria-label="Filtrar notificaciones" className="flex gap-1">
              {FILTERS.map(({ key, label }) => {
                const active = filter === key
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(key)}
                    className={cn(
                      "flex h-9 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                      active ? "bg-brand-soft" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {active && <span aria-hidden className="size-1.5 rounded-full bg-brand" />}
                    {label}
                  </button>
                )
              })}
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
            {visible.length ? (
              <ul className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {visible.map((notification) => (
                    <li key={notification.id}>
                      <AnimatedListItem>
                        <NotificationItem
                          notification={notification}
                          unread={isUnread(notification)}
                          onRead={() => markRead([notification.id])}
                        />
                      </AnimatedListItem>
                    </li>
                  ))}
                </AnimatePresence>
              </ul>
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <IconBadge tone="pink">
                  <HoverIcon name="bell" size={20} />
                </IconBadge>
                <p className="mt-4 font-heading text-lg font-semibold tracking-[-0.01em]">{EMPTY_TEXT[filter].title}</p>
                <p className="mt-1 max-w-[30ch] text-sm leading-relaxed text-pretty text-muted-foreground">
                  {EMPTY_TEXT[filter].text}
                </p>
              </div>
            )}
          </div>

          {unreadIds.length > 0 && (
            <footer className="border-t border-border/70 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4">
              <IconHoverArea>
                <button
                  type="button"
                  onClick={() => markRead(unreadIds)}
                  className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium ring-1 ring-border transition-[background-color,box-shadow] duration-300 outline-none hover:bg-foreground/[0.04] hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  <HoverIcon name="check-check" size={16} />
                  Marcar todas como leídas
                </button>
              </IconHoverArea>
            </footer>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// Una notificación: al tocarla queda leída y, si tiene link, lleva a su destino.
function NotificationItem({
  notification,
  unread,
  onRead,
}: {
  notification: UserNotification
  unread: boolean
  onRead: () => void
}) {
  const className = cn(
    "relative flex w-full items-start gap-3 rounded-lg border p-3 pr-9 text-left transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
    unread ? "border-brand/25 bg-brand-soft/25" : "border-border/70 bg-background",
    (notification.link || unread) && "cursor-pointer hover:border-foreground/25"
  )
  const content = (
    <>
      <IconBadge size="sm" tone="pink">
        <HoverIcon name="bell" size={16} />
      </IconBadge>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm leading-snug", unread ? "font-semibold" : "font-medium")}>
          {notification.title}
        </span>
        {notification.body && (
          <span className="mt-1 block text-sm leading-relaxed text-pretty text-muted-foreground">
            {notification.body}
          </span>
        )}
        <span className="mt-1.5 block text-xs text-muted-foreground">{notification.timeAgo}</span>
      </span>
      {unread && (
        <span className="absolute top-3.5 right-3.5 size-2 rounded-full bg-brand">
          <span className="sr-only">Sin leer</span>
        </span>
      )}
    </>
  )

  if (notification.link) {
    return (
      <IconHoverArea>
        <Link
          href={notification.link}
          className={className}
          onClick={() => {
            if (unread) onRead()
            setNotificationsOpen(false)
          }}
        >
          {content}
        </Link>
      </IconHoverArea>
    )
  }
  if (unread) {
    return (
      <IconHoverArea>
        <button type="button" onClick={onRead} className={className}>
          {content}
        </button>
      </IconHoverArea>
    )
  }
  return <div className={className}>{content}</div>
}

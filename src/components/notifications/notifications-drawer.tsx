"use client"

import { Dialog } from "@base-ui/react/dialog"
import { AnimatePresence, motion, MotionConfig } from "motion/react"
import Link from "next/link"
import { useOptimistic, useState, useTransition } from "react"

import { markNotificationsRead } from "@/app/actions/notifications"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { setNotificationsOpen, useNotificationsOpen } from "@/components/notifications/notifications-store"
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

const FOCUS_CLASS = "outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
const EASE = [0.22, 1, 0.36, 1] as const

// Panel lateral con las notificaciones. Marcar como leída se ve al instante: la lista cambia sin
// esperar la respuesta del servidor y cada aviso pasa solo de "Nuevas" a "Anteriores".
export function NotificationsDrawer({ notifications }: { notifications: UserNotification[] }) {
  const open = useNotificationsOpen()
  const [filter, setFilter] = useState<Filter>("all")
  const [, startTransition] = useTransition()
  const [justRead, addJustRead] = useOptimistic(new Set<string>(), (current, ids: string[]) => {
    return new Set([...current, ...ids])
  })

  const isUnread = (notification: UserNotification) => !notification.read && !justRead.has(notification.id)
  const unread = notifications.filter(isUnread)
  const read = notifications.filter((notification) => !isUnread(notification))
  const showGroups = filter === "all" && unread.length > 0 && read.length > 0

  const markRead = (ids: string[]) => {
    startTransition(async () => {
      addJustRead(ids)
      await markNotificationsRead(ids)
    })
  }

  const listItem = (notification: UserNotification, index: number) => (
    <motion.li
      key={notification.id}
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.35, ease: EASE, delay: Math.min(index, 8) * 0.04 }}
    >
      <NotificationItem
        notification={notification}
        unread={isUnread(notification)}
        onRead={() => markRead([notification.id])}
      />
    </motion.li>
  )

  const groupTitle = (title: string) => (
    <motion.li key={title} layout="position" className="px-3 pt-4 pb-1 first:pt-1">
      <h3 className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">{title}</h3>
    </motion.li>
  )

  const isEmpty = filter === "unread" ? !unread.length : !notifications.length
  // Lista plana: AnimatePresence solo anima a sus hijos directos
  const entries =
    filter === "unread"
      ? unread.map(listItem)
      : [
          showGroups && groupTitle("Nuevas"),
          ...unread.map(listItem),
          showGroups && groupTitle("Anteriores"),
          ...read.map((notification, index) => listItem(notification, unread.length + index)),
        ]

  return (
    <Dialog.Root open={open} onOpenChange={(next) => setNotificationsOpen(next)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-[3px] transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-[60] flex w-full flex-col overflow-hidden bg-background shadow-[0_24px_64px_-16px_rgb(26_26_26/0.4)] transition-transform duration-500 ease-premium outline-none data-[ending-style]:translate-x-[calc(100%+0.75rem)] data-[starting-style]:translate-x-[calc(100%+0.75rem)] motion-reduce:transition-none sm:inset-y-3 sm:right-3 sm:w-[26.5rem] sm:rounded-xl">
          <MotionConfig reducedMotion="user">
            <header className="flex flex-col gap-5 border-b border-border/70 bg-mesh-soft p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Dialog.Title className="font-heading text-2xl leading-tight font-semibold tracking-[-0.01em]">
                    Notificaciones
                  </Dialog.Title>
                  {notifications.length > 0 && (
                    <Dialog.Description className="mt-0.5 text-sm text-muted-foreground">
                      {unread.length ? `Tenés ${unread.length} sin leer` : "Ya viste todas"}
                    </Dialog.Description>
                  )}
                </div>
                <IconHoverArea>
                  <Dialog.Close
                    aria-label="Cerrar notificaciones"
                    className={cn(
                      "flex size-10 cursor-pointer items-center justify-center rounded-lg bg-background ring-1 ring-border transition-shadow duration-300 hover:ring-foreground/20",
                      FOCUS_CLASS
                    )}
                  >
                    <HoverIcon name="x" size={18} />
                  </Dialog.Close>
                </IconHoverArea>
              </div>

              <div className="flex items-center justify-between gap-2">
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
                          "relative flex h-9 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors duration-300",
                          FOCUS_CLASS,
                          !active && "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="filtro-notificaciones"
                            transition={{ duration: 0.35, ease: EASE }}
                            className="absolute inset-0 rounded-lg bg-brand-soft"
                          />
                        )}
                        {active && <span aria-hidden className="relative size-1.5 rounded-full bg-brand" />}
                        <span className="relative">{label}</span>
                      </button>
                    )
                  })}
                </div>
                {unread.length > 0 && (
                  <IconHoverArea>
                    <button
                      type="button"
                      onClick={() => markRead(unread.map((notification) => notification.id))}
                      className={cn(
                        "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-sm font-medium transition-colors duration-300 hover:bg-foreground/[0.05]",
                        FOCUS_CLASS
                      )}
                    >
                      <HoverIcon name="check-check" size={16} />
                      Marcar todas
                    </button>
                  </IconHoverArea>
                )}
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:p-3">
              {isEmpty ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <IconBadge tone="pink" size="lg">
                    <HoverIcon name="bell" size={24} />
                  </IconBadge>
                  <p className="mt-4 font-heading text-lg font-semibold tracking-[-0.01em]">
                    {EMPTY_TEXT[filter].title}
                  </p>
                  <p className="mt-1 max-w-[30ch] text-sm leading-relaxed text-pretty text-muted-foreground">
                    {EMPTY_TEXT[filter].text}
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-1">
                  <AnimatePresence mode="popLayout">{entries}</AnimatePresence>
                </ul>
              )}
            </div>
          </MotionConfig>
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
    "relative flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors duration-300",
    FOCUS_CLASS,
    unread ? "bg-brand-soft/25" : "bg-background",
    notification.link && (unread ? "hover:bg-brand-soft/40" : "hover:bg-foreground/[0.04]"),
    !notification.link && unread && "hover:bg-brand-soft/40",
    (notification.link || unread) && "cursor-pointer"
  )
  const content = (
    <>
      <IconBadge size="sm" tone={unread ? "brand" : "pink"}>
        <HoverIcon name="bell" size={16} />
      </IconBadge>
      <span className="min-w-0 flex-1">
        <span className={cn("block pr-4 text-sm leading-snug", unread ? "font-semibold" : "font-medium")}>
          {notification.title}
        </span>
        {notification.body && (
          <span className="mt-1 block text-sm leading-relaxed text-pretty text-muted-foreground">
            {notification.body}
          </span>
        )}
        <span className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          {notification.timeAgo}
          {notification.link && (
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              Ver más
              <HoverIcon name="arrow-right" size={14} />
            </span>
          )}
        </span>
      </span>
      {unread && (
        <span className="absolute top-4 right-3.5 size-2 rounded-full bg-brand">
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

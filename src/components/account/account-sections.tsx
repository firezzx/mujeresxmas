import Link from "next/link"

import { markNotificationsRead } from "@/app/actions/notifications"
import { AccountCard, EmptySection } from "@/components/account/account-card"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import type { CommunityEvent, Course } from "@/lib/content"
import { formatDateTime, formatDay } from "@/lib/format"
import { countUnread, type UserNotification } from "@/lib/notifications"
import { cn } from "@/lib/utils"

// Secciones de Mi cuenta. Sin datos muestran su estado vacío; con datos, la lista.

function SectionCard({
  icon,
  title,
  badge,
  action,
  children,
}: {
  icon: "book-text" | "calendar-days" | "bell"
  title: string
  badge?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <IconHoverArea className="h-full">
      <AccountCard className="flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <HoverIcon name={icon} size={16} />
            {title}
            {badge}
          </h2>
          {action}
        </div>
        <ul className="mt-5 flex flex-col gap-2">{children}</ul>
      </AccountCard>
    </IconHoverArea>
  )
}

function ItemRow({ title, detail, unread }: { title: string; detail?: string | null; unread?: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-foreground/[0.03]">
      <span
        aria-hidden
        className={cn("mt-2 size-1.5 shrink-0 rounded-full", unread === false ? "bg-foreground/15" : "bg-brand")}
      />
      <div className="min-w-0">
        <p className="text-[15px] leading-snug font-medium">{title}</p>
        {detail && <p className="mt-0.5 line-clamp-2 text-[13px] text-muted-foreground">{detail}</p>}
      </div>
    </div>
  )
}

export function MyCourses({ courses }: { courses: Course[] }) {
  if (!courses.length) {
    return (
      <EmptySection
        icon="book-text"
        title="Mis cursos"
        emptyTitle="Todavía no tenés cursos"
        emptyText="Cuando te sumes a un curso, lo vas a encontrar acá."
      />
    )
  }
  return (
    <SectionCard icon="book-text" title="Mis cursos">
      {courses.map((course) => (
        <li key={course.id}>
          <ItemRow
            title={course.title}
            detail={course.startsAt ? `Empieza el ${formatDay(course.startsAt)}` : course.summary}
          />
        </li>
      ))}
    </SectionCard>
  )
}

export function MyEvents({ events }: { events: CommunityEvent[] }) {
  if (!events.length) {
    return (
      <EmptySection
        icon="calendar-days"
        title="Mis eventos"
        emptyTitle="No tenés eventos próximos"
        emptyText="Los eventos a los que te anotes van a aparecer acá."
      />
    )
  }
  return (
    <SectionCard icon="calendar-days" title="Mis eventos">
      {events.map((event) => (
        <li key={event.id}>
          <ItemRow
            title={event.title}
            detail={[formatDateTime(event.startsAt), event.location ?? (event.onlineUrl && "Online")]
              .filter(Boolean)
              .join(" · ")}
          />
        </li>
      ))}
    </SectionCard>
  )
}

// Cuántas se muestran en Mi cuenta (las demás quedan para una página propia más adelante)
const VISIBLE_NOTIFICATIONS = 5

export function MyNotifications({ notifications }: { notifications: UserNotification[] }) {
  if (!notifications.length) {
    return (
      <EmptySection
        icon="bell"
        title="Notificaciones"
        emptyTitle="Estás al día"
        emptyText="Cuando haya novedades para vos, te avisamos acá."
      />
    )
  }

  const visible = notifications.slice(0, VISIBLE_NOTIFICATIONS)
  const unread = countUnread(notifications)
  const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)

  return (
    <SectionCard
      icon="bell"
      title="Notificaciones"
      badge={
        unread > 0 && (
          <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] leading-none font-semibold text-brand-foreground">
            {unread}
            <span className="sr-only"> sin leer</span>
          </span>
        )
      }
      action={
        unread > 0 && (
          <form action={markNotificationsRead.bind(null, unreadIds)}>
            <button
              type="submit"
              className="cursor-pointer rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-foreground/[0.05]"
            >
              Marcar como leídas
            </button>
          </form>
        )
      }
    >
      {visible.map((notification) => {
        const row = <ItemRow title={notification.title} detail={notification.body} unread={!notification.read} />
        return (
          <li key={notification.id}>
            {notification.link ? (
              <Link
                href={notification.link}
                className="block rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                {row}
              </Link>
            ) : (
              row
            )}
          </li>
        )
      })}
    </SectionCard>
  )
}

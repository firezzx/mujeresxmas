import Link from "next/link"

import { markNotificationsRead } from "@/app/actions/notifications"
import { AccountCard, EmptySection } from "@/components/account/account-card"
import { IconBadge, type IconBadgeTone } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import { AnimatedList } from "@/components/ui/animated-list"
import type { CommunityEvent, Course } from "@/lib/content"
import { formatDateTime, formatDay } from "@/lib/format"
import { countUnread, type UserNotification } from "@/lib/notifications"
import { cn } from "@/lib/utils"

// Secciones de Mi cuenta. Sin datos muestran su estado vacío; con datos, la lista entra con
// Animated List de Magic UI (cada tarjeta aparece con un rebote suave, la más nueva arriba).

function SectionCard({
  title,
  badge,
  footer,
  children,
}: {
  title: string
  badge?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <AccountCard className="flex flex-col">
      <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {title}
        {badge}
      </h2>
      <div className="mt-5 flex-1">{children}</div>
      {footer && <div className="mt-5">{footer}</div>}
    </AccountCard>
  )
}

// Lista animada. Animated List muestra primero el primer hijo y apila los siguientes arriba,
// así que se le pasan en orden inverso para que lo más reciente quede primero.
function ItemList({ children }: { children: React.ReactNode[] }) {
  return (
    <AnimatedList delay={180} className="items-stretch gap-2">
      {[...children].reverse()}
    </AnimatedList>
  )
}

type ItemCardProps = {
  icon: IconName
  tone: IconBadgeTone
  title: string
  meta?: string | null
  detail?: string | null
  unread?: boolean
  href?: string | null
}

// Tarjeta de un curso, evento o notificación, al estilo de las notificaciones de Magic UI.
function ItemCard({ icon, tone, title, meta, detail, unread = false, href }: ItemCardProps) {
  const card = (
    <IconHoverArea>
      <figure
        className={cn(
          "relative flex items-start gap-3 rounded-lg border p-3 pr-8 transition-[translate,box-shadow,border-color] duration-500 ease-premium",
          unread ? "border-brand/25 bg-brand-soft/40" : "border-border/70 bg-background",
          href && "hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_rgb(26_26_26/0.35)]"
        )}
      >
        <IconBadge size="sm" tone={tone}>
          <HoverIcon name={icon} size={16} />
        </IconBadge>
        <figcaption className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm leading-snug font-medium">{title}</p>
          {meta && <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>}
          {detail && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>}
        </figcaption>
        {unread && (
          <span className="absolute top-3.5 right-3.5 size-2 rounded-full bg-brand">
            <span className="sr-only">Sin leer</span>
          </span>
        )}
      </figure>
    </IconHoverArea>
  )

  if (!href) return card
  return (
    <Link href={href} className="block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
      {card}
    </Link>
  )
}

export function MyCourses({ courses }: { courses: Course[] }) {
  if (!courses.length) {
    return (
      <EmptySection
        icon="book-text"
        tone="brand"
        title="Mis cursos"
        emptyTitle="Todavía no tenés cursos"
        emptyText="Cuando te sumes a un curso, lo vas a encontrar acá."
      />
    )
  }
  return (
    <SectionCard title="Mis cursos">
      <ItemList>
        {courses.map((course) => (
          <ItemCard
            key={course.id}
            icon="book-text"
            tone="brand"
            title={course.title}
            meta={course.startsAt ? `Empieza el ${formatDay(course.startsAt)}` : null}
            detail={course.summary}
          />
        ))}
      </ItemList>
    </SectionCard>
  )
}

export function MyEvents({ events }: { events: CommunityEvent[] }) {
  if (!events.length) {
    return (
      <EmptySection
        icon="calendar-days"
        tone="green"
        title="Mis eventos"
        emptyTitle="No tenés eventos próximos"
        emptyText="Los eventos a los que te anotes van a aparecer acá."
      />
    )
  }
  return (
    <SectionCard title="Mis eventos">
      <ItemList>
        {events.map((event) => (
          <ItemCard
            key={event.id}
            icon="calendar-days"
            tone="green"
            title={event.title}
            meta={[formatDateTime(event.startsAt), event.location ?? (event.onlineUrl && "Online")]
              .filter(Boolean)
              .join(" · ")}
            href={event.onlineUrl}
          />
        ))}
      </ItemList>
    </SectionCard>
  )
}

// Cuántas se muestran en Mi cuenta (las demás quedan para una página propia más adelante)
const VISIBLE_NOTIFICATIONS = 4

export function MyNotifications({ notifications }: { notifications: UserNotification[] }) {
  if (!notifications.length) {
    return (
      <EmptySection
        icon="bell"
        tone="pink"
        title="Notificaciones"
        emptyTitle="Estás al día"
        emptyText="Cuando haya novedades para vos, te avisamos acá."
      />
    )
  }

  const unread = countUnread(notifications)
  const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)

  return (
    <SectionCard
      title="Notificaciones"
      badge={
        unread > 0 && (
          <span className="rounded-md bg-brand-strong px-2 py-0.5 text-xs leading-none font-semibold text-brand-foreground">
            {unread}
            <span className="sr-only"> sin leer</span>
          </span>
        )
      }
      footer={
        unread > 0 && (
          <form action={markNotificationsRead.bind(null, unreadIds)}>
            <IconHoverArea>
              <button
                type="submit"
                className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium ring-1 ring-border transition-[background-color,box-shadow] duration-300 hover:bg-foreground/[0.04] hover:ring-foreground/20"
              >
                <HoverIcon name="check-check" size={16} />
                Marcar todas como leídas
              </button>
            </IconHoverArea>
          </form>
        )
      }
    >
      <ItemList>
        {notifications.slice(0, VISIBLE_NOTIFICATIONS).map((notification) => (
          <ItemCard
            key={notification.id}
            icon="bell"
            tone="pink"
            title={notification.title}
            meta={notification.timeAgo}
            detail={notification.body}
            unread={!notification.read}
            href={notification.link}
          />
        ))}
      </ItemList>
    </SectionCard>
  )
}

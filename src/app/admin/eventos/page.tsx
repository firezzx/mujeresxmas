import type { Metadata } from "next"
import { Suspense } from "react"

import {
  AdminEmpty,
  AdminList,
  AdminLoadError,
  AdminRow,
  AdminSection,
  AdminSectionSkeleton,
  ComingSoonButton,
  StatusBadge,
} from "@/components/admin/admin-ui"
import { listEventsForAdmin } from "@/lib/content"
import { formatDateTime } from "@/lib/format"

export const metadata: Metadata = {
  title: "Eventos · Administración",
  robots: { index: false },
}

// Sección Eventos. La base ya está lista (tabla events y anotadas); falta el formulario de
// carga, que se suma cuando la clienta defina qué datos lleva cada evento.
export default function AdminEventsPage() {
  return (
    <AdminSection
      title="Eventos"
      description="Encuentros presenciales y online, con la cantidad de anotados."
      action={<ComingSoonButton icon="calendar-days">Nuevo evento</ComingSoonButton>}
    >
      <Suspense fallback={<AdminSectionSkeleton />}>
        <EventsList />
      </Suspense>
    </AdminSection>
  )
}

async function EventsList() {
  const events = await listEventsForAdmin()
  if (!events) return <AdminLoadError />
  if (!events.length) {
    return (
      <AdminEmpty
        icon="calendar-days"
        title="Todavía no hay eventos"
        text="Muy pronto vas a poder crearlos desde acá. Los usuarios anotados los van a ver en su panel."
      />
    )
  }

  return (
    <AdminList>
      {events.map((event) => (
        <AdminRow
          key={event.id}
          title={event.title}
          detail={[event.location, event.onlineUrl && "Online"].filter(Boolean).join(" · ") || event.summary}
          aside={
            <>
              <span>{formatDateTime(event.startsAt)}</span>
              <span>
                {event.registered} {event.registered === 1 ? "anotado" : "anotados"}
              </span>
              <StatusBadge status={event.status} />
            </>
          }
        />
      ))}
    </AdminList>
  )
}

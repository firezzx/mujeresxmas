import type { Metadata } from "next"
import { Suspense } from "react"

import {
  AdminEmpty,
  AdminList,
  AdminLoadError,
  AdminRow,
  AdminSection,
  AdminSectionSkeleton,
} from "@/components/admin/admin-ui"
import { NotificationForm } from "@/components/admin/notification-form"
import { formatDateTime } from "@/lib/format"
import { listSentNotifications } from "@/lib/notifications"

export const metadata: Metadata = {
  title: "Notificaciones · Administración",
  robots: { index: false },
}

// Sección Notificaciones: enviar un aviso a todas las usuarias y ver cuántas lo leyeron.
export default function AdminNotificationsPage() {
  return (
    <>
      <AdminSection
        title="Nueva notificación"
        description="Le llega a todos los usuarios en su panel y en la campanita del menú."
      >
        <NotificationForm />
      </AdminSection>

      <AdminSection title="Enviadas">
        <Suspense fallback={<AdminSectionSkeleton />}>
          <SentList />
        </Suspense>
      </AdminSection>
    </>
  )
}

async function SentList() {
  const notifications = await listSentNotifications()
  if (!notifications) return <AdminLoadError />
  if (!notifications.length) {
    return (
      <AdminEmpty
        icon="bell"
        tone="pink"
        title="Todavía no enviaste notificaciones"
        text="Las que mandes van a aparecer acá, con cuántos usuarios las leyeron."
      />
    )
  }

  return (
    <AdminList>
      {notifications.map((notification) => (
        <AdminRow
          key={notification.id}
          title={notification.title}
          detail={notification.body}
          aside={
            <>
              <span>{formatDateTime(notification.createdAt)}</span>
              <span>{notification.forEveryone ? "A todos" : "Personal"}</span>
              <span className="rounded-md bg-brand-soft px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                {notification.reads} {notification.reads === 1 ? "lectura" : "lecturas"}
              </span>
            </>
          }
        />
      ))}
    </AdminList>
  )
}

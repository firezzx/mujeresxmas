import { MemberViewBar } from "@/components/admin/member-view-bar"
import { SiteHeader } from "@/components/site-header/site-header"
import { NewNotificationsToast } from "@/components/toast/new-notifications-toast"
import { getAdminView } from "@/lib/admin"
import { getMyNotifications } from "@/lib/notifications"
import { getCurrentUser } from "@/lib/supabase/user"

// Lee la sesión en el servidor y entrega el header con la usuaria resuelta.
// Va dentro de <Suspense>; el fallback es el mismo header en estado "pending".
// Si hay notificaciones sin leer, también dispara el aviso flotante.
// A una administradora en "Ver como usuaria" le suma la barra para volver.
export async function SiteHeaderWithSession() {
  const [user, adminView] = await Promise.all([getCurrentUser(), getAdminView()])
  const unread = user ? (await getMyNotifications(user.id)).filter((n) => !n.read) : []
  return (
    <>
      <SiteHeader user={user} adminView={adminView} unread={unread.length} />
      <NewNotificationsToast unread={unread.map(({ id, title }) => ({ id, title }))} />
      {adminView === "member" && <MemberViewBar />}
    </>
  )
}

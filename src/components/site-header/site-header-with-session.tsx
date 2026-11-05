import { MemberViewBar } from "@/components/admin/member-view-bar"
import { NotificationsDrawer } from "@/components/notifications/notifications-drawer"
import { SessionHintSync } from "@/components/session/session-hint"
import { SiteHeader } from "@/components/site-header/site-header"
import { NewNotificationsToast } from "@/components/toast/new-notifications-toast"
import { getAdminView } from "@/lib/admin"
import { getMyNotifications } from "@/lib/notifications"
import { getCurrentUser } from "@/lib/supabase/user"

// Lee la sesión en el servidor y entrega el header con la usuaria resuelta.
// Va dentro de <Suspense>; el fallback es el mismo header en estado "pending".
// Con sesión suma el panel de notificaciones y, si hay sin leer, dispara el aviso flotante.
// A una administradora en "Ver como usuaria" le suma la barra para volver.
export async function SiteHeaderWithSession() {
  const [user, adminView] = await Promise.all([getCurrentUser(), getAdminView()])
  const notifications = user ? await getMyNotifications(user.id) : []
  const unread = notifications.filter((n) => !n.read)
  return (
    <>
      <SessionHintSync signedIn={Boolean(user)} />
      <SiteHeader user={user} adminView={adminView} unread={unread.length} />
      {user && <NotificationsDrawer notifications={notifications} />}
      <NewNotificationsToast unread={unread.map(({ id, title }) => ({ id, title }))} />
      {adminView === "member" && <MemberViewBar />}
    </>
  )
}

import { MemberViewBar } from "@/components/admin/member-view-bar"
import { SiteHeader } from "@/components/site-header/site-header"
import { getAdminView } from "@/lib/admin"
import { countUnread, getMyNotifications } from "@/lib/notifications"
import { getCurrentUser } from "@/lib/supabase/user"

// Lee la sesión en el servidor y entrega el header con la usuaria resuelta.
// Va dentro de <Suspense>; el fallback es el mismo header en estado "pending".
// A una administradora en "Ver como usuaria" le suma la barra para volver.
export async function SiteHeaderWithSession() {
  const [user, adminView] = await Promise.all([getCurrentUser(), getAdminView()])
  const unread = user ? countUnread(await getMyNotifications(user.id)) : 0
  return (
    <>
      <SiteHeader user={user} adminView={adminView} unread={unread} />
      {adminView === "member" && <MemberViewBar />}
    </>
  )
}

import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { AccountSkeleton, AccountView } from "@/components/account/account-view"
import { ROUTES } from "@/config/navigation"
import { ACCOUNT_SECTIONS } from "@/content/mi-cuenta"
import { getAccountSummary, getEditableProfile } from "@/lib/account"
import { getMyCourses, getMyUpcomingEvents } from "@/lib/content"
import { getMyNotifications } from "@/lib/notifications"

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false },
}

export default function MiCuentaPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <Suspense fallback={<AccountSkeleton />}>
        <AccountDashboard />
      </Suspense>
    </main>
  )
}

async function AccountDashboard() {
  const [summary, profile] = await Promise.all([getAccountSummary(), getEditableProfile()])
  // El proxy ya protege la ruta; esto cubre una sesión que venció en el medio
  if (!summary || !profile) redirect(`${ROUTES.login}?next=${ROUTES.miCuenta}`)

  const [courses, events, notifications] = await Promise.all([
    // Las secciones ocultas no se consultan
    ACCOUNT_SECTIONS.courses.hidden ? [] : getMyCourses(summary.user.id),
    ACCOUNT_SECTIONS.events.hidden ? [] : getMyUpcomingEvents(summary.user.id),
    getMyNotifications(summary.user.id),
  ])

  return (
    <AccountView
      {...summary}
      values={profile.values}
      coverUrl={profile.coverUrl}
      courses={courses}
      events={events}
      notifications={notifications}
    />
  )
}

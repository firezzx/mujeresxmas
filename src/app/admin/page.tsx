import type { Metadata } from "next"
import { Suspense } from "react"

import { AccountCard } from "@/components/account/account-card"
import { AdminLoadError, AdminSectionSkeleton } from "@/components/admin/admin-ui"
import { MembersTable, type MemberRow } from "@/components/admin/members-table"
import { BlurFade } from "@/components/ui/blur-fade"
import { NumberTicker } from "@/components/ui/number-ticker"
import { listMembers, memberStats } from "@/lib/admin"
import { formatShortDate } from "@/lib/format"

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false },
}

// Sección Usuarias: números de la comunidad y lista con buscador. El acceso lo valida el layout.
export default function AdminMembersPage() {
  return (
    <Suspense fallback={<AdminSectionSkeleton />}>
      <MembersDashboard />
    </Suspense>
  )
}

async function MembersDashboard() {
  const members = await listMembers()
  if (!members) return <AdminLoadError />

  const stats = memberStats(members)
  const rows: MemberRow[] = members.map((member) => ({
    ...member,
    joinedLabel: formatShortDate(member.joinedAt),
    lastSeenLabel: member.lastSignInAt ? formatShortDate(member.lastSignInAt) : null,
  }))

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map((stat, i) => (
          <BlurFade key={stat.label} delay={0.1 + i * 0.05} inView>
            <AccountCard className="p-5 sm:p-6">
              <p className="text-[13px] leading-snug text-muted-foreground">{stat.label}</p>
              <p className="mt-3 font-heading text-4xl leading-none font-semibold tracking-[-0.03em]">
                {stat.value === 0 ? 0 : <NumberTicker value={stat.value} />}
              </p>
            </AccountCard>
          </BlurFade>
        ))}
      </div>

      <BlurFade delay={0.3} inView>
        <AccountCard>
          <h2 className="mb-5 text-sm font-medium text-muted-foreground">Usuarias</h2>
          <MembersTable members={rows} />
        </AccountCard>
      </BlurFade>
    </>
  )
}

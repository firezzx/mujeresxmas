import type { Metadata } from "next"
import { Suspense } from "react"

import { AccountCard } from "@/components/account/account-card"
import { AdminLoadError, AdminSectionSkeleton } from "@/components/admin/admin-ui"
import { MembersTable, type MemberRow } from "@/components/admin/members-table"
import { Band } from "@/components/page-band"
import { BlurFade } from "@/components/ui/blur-fade"
import { NumberTicker } from "@/components/ui/number-ticker"
import { listMembers, memberStats } from "@/lib/admin"
import { formatShortDate } from "@/lib/format"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false },
}

const STAT_TONES = ["bg-brand", "bg-brand-soft", "bg-brand-green", "bg-primary text-primary-foreground"]

// Sección Usuarias: números de la comunidad y lista con buscador. El acceso lo valida el layout.
export default function AdminMembersPage() {
  return (
    <Suspense
      fallback={
        <Band className="py-3 md:py-3">
          <AdminSectionSkeleton />
        </Band>
      }
    >
      <MembersDashboard />
    </Suspense>
  )
}

async function MembersDashboard() {
  const members = await listMembers()
  if (!members) {
    return (
      <Band className="py-3 md:py-3">
        <AdminLoadError />
      </Band>
    )
  }

  const stats = memberStats(members)
  const rows: MemberRow[] = members.map((member) => ({
    ...member,
    joinedLabel: formatShortDate(member.joinedAt),
    lastSeenLabel: member.lastSignInAt ? formatShortDate(member.lastSignInAt) : null,
  }))

  return (
    <Band className="flex flex-col gap-4 py-3 pb-16 md:py-3 md:pb-20">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {stats.map((stat, i) => (
          <BlurFade key={stat.label} delay={0.1 + i * 0.05} inView className="h-full">
            <div
              className={cn(
                "flex h-full flex-col justify-between gap-4 rounded-xl p-5 sm:p-6",
                STAT_TONES[i % STAT_TONES.length]
              )}
            >
              <p className="text-[13px] leading-snug opacity-85">{stat.label}</p>
              <p className="font-heading text-5xl leading-none font-semibold tracking-[-0.03em]">
                {stat.value === 0 ? 0 : <NumberTicker value={stat.value} className="text-inherit" />}
              </p>
            </div>
          </BlurFade>
        ))}
      </div>

      <BlurFade delay={0.3} inView>
        <AccountCard>
          <h2 className="mb-5 text-sm font-medium text-muted-foreground">Usuarios</h2>
          <MembersTable members={rows} />
        </AccountCard>
      </BlurFade>
    </Band>
  )
}

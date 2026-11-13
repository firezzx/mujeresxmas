import type { Metadata } from "next"
import { connection } from "next/server"
import { Suspense } from "react"

import { AccountCard } from "@/components/account/account-card"
import { AdminLoadError, AdminSectionSkeleton } from "@/components/admin/admin-ui"
import { MembersTable, type MemberRow } from "@/components/admin/members-table"
import { cn } from "@/lib/utils"
import { Band } from "@/components/page-band"
import { BlurFade } from "@/components/ui/blur-fade"
import { NumberTicker } from "@/components/ui/number-ticker"
import { listMembers, memberStats } from "@/lib/admin"
import { isKieroLive } from "@/lib/kiero"
import { kieroStatusLabel, listKieroAccounts } from "@/lib/kiero-accounts"
import { formatShortDate } from "@/lib/format"

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false },
}

const STAT_TONES = ["bg-brand-green/15", "bg-brand-soft/35", "bg-foreground/5", "bg-brand-green/15"]

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
  // Los números de la semana usan la hora actual: se calculan con cada pedido, no en el prerender
  await connection()
  const [members, kiero] = await Promise.all([listMembers(), listKieroAccounts()])
  if (!members) {
    return (
      <Band className="py-3 md:py-3">
        <AdminLoadError />
      </Band>
    )
  }

  const stats = memberStats(members)
  const rows: MemberRow[] = members.map((member) => {
    const account = kiero.get(member.id)
    return {
      ...member,
      kieroLabel: account ? kieroStatusLabel(account) : null,
      kieroActive: Boolean(account && !account.canceledAt),
      joinedLabel: formatShortDate(member.joinedAt),
      lastSeenLabel: member.lastSignInAt ? formatShortDate(member.lastSignInAt) : null,
    }
  })

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
              <p className="text-sm leading-snug">{stat.label}</p>
              <p className="font-heading text-5xl leading-none font-semibold tracking-[-0.01em]">
                {stat.value === 0 ? 0 : <NumberTicker value={stat.value} className="text-inherit" />}
              </p>
            </div>
          </BlurFade>
        ))}
      </div>

      <BlurFade delay={0.3} inView>
        <AccountCard>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-medium text-muted-foreground">Usuarios</h2>
            {!isKieroLive() && (
              <p className="inline-flex items-center gap-2 rounded-md bg-foreground/[0.05] px-3 py-1.5 text-xs text-muted-foreground">
                <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                Kiero en modo prueba: el alta y la baja son simuladas
              </p>
            )}
          </div>
          <MembersTable members={rows} />
        </AccountCard>
      </BlurFade>
    </Band>
  )
}

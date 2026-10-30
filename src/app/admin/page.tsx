import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Eye } from "lucide-react"

import { setMemberView } from "@/app/actions/admin"
import NotFound from "@/app/not-found"
import { AccountCard } from "@/components/account/account-card"
import { MembersTable, type MemberRow } from "@/components/admin/members-table"
import { Eyebrow } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { NumberTicker } from "@/components/ui/number-ticker"
import { type AdminMember, getAdminView, listMembers, memberStats } from "@/lib/admin"
import { formatShortDate } from "@/lib/format"

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false },
}

const MAIN_CLASS = "relative mx-auto w-full max-w-5xl flex-1 px-4 pt-28 pb-20 sm:px-6 md:pt-36"

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main className={MAIN_CLASS}>
          <AdminSkeleton />
        </main>
      }
    >
      <AdminDashboard />
    </Suspense>
  )
}

async function AdminDashboard() {
  const view = await getAdminView()
  // Para quien no es administradora la página no existe
  if (!view) notFound()
  // En "Ver como usuaria" se muestra la misma 404 pero sin notFound(): así, al volver a la
  // vista de admin desde esta misma URL, la página se vuelve a renderizar.
  if (view === "member") return <NotFound />

  const members = await listMembers()

  return (
    <main className={MAIN_CLASS}>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-4">
            <BlurFade delay={0.05} inView>
              <Eyebrow>Administración</Eyebrow>
            </BlurFade>
            <BlurFade delay={0.12} inView>
              <h1 className="font-heading text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
                Panel de la comunidad
              </h1>
            </BlurFade>
            <BlurFade delay={0.19} inView>
              <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                Quiénes se registraron, cómo vienen sus perfiles y en qué plan está cada una.
              </p>
            </BlurFade>
          </div>
          <BlurFade delay={0.19} inView>
            <form action={setMemberView.bind(null, true)}>
              <button
                type="submit"
                className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-sm font-medium ring-1 ring-border transition-[background-color,box-shadow] duration-300 hover:bg-foreground/[0.04] hover:ring-foreground/20"
              >
                <Eye className="size-4" />
                Ver como usuaria
              </button>
            </form>
          </BlurFade>
        </header>

        {members ? <Dashboard members={members} /> : <LoadError />}
      </div>
    </main>
  )
}

function Dashboard({ members }: { members: AdminMember[] }) {
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
          <BlurFade key={stat.label} delay={0.26 + i * 0.05} inView>
            <AccountCard className="p-5 sm:p-6">
              <p className="text-[13px] leading-snug text-muted-foreground">{stat.label}</p>
              <p className="mt-3 font-heading text-4xl leading-none font-semibold tracking-[-0.03em]">
                {stat.value === 0 ? 0 : <NumberTicker value={stat.value} />}
              </p>
            </AccountCard>
          </BlurFade>
        ))}
      </div>

      <BlurFade delay={0.45} inView>
        <AccountCard>
          <h2 className="mb-5 text-sm font-medium text-muted-foreground">Usuarias</h2>
          <MembersTable members={rows} />
        </AccountCard>
      </BlurFade>
    </>
  )
}

function LoadError() {
  return (
    <AccountCard>
      <p className="font-heading text-lg font-semibold tracking-[-0.01em]">No pudimos cargar las usuarias</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Revisá que la migración de administradoras esté cargada en Supabase y volvé a intentar.
      </p>
    </AccountCard>
  )
}

function AdminSkeleton() {
  const block = "animate-pulse rounded-[28px] bg-foreground/[0.05]"
  return (
    <div aria-hidden className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="h-7 w-32 animate-pulse rounded-full bg-foreground/[0.05]" />
        <div className="h-12 w-72 animate-pulse rounded-2xl bg-foreground/[0.06]" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={`${block} h-28`} />
        ))}
      </div>
      <div className={`${block} h-96`} />
    </div>
  )
}

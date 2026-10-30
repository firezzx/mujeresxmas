import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"

import { AccountCard, EmptySection } from "@/components/account/account-card"
import { SignOutButton } from "@/components/account/sign-out-button"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { Eyebrow, PAGE_TITLE_CLASS, PageTitle } from "@/components/page-hero"
import { UserAvatar } from "@/components/site-header/user-menu"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { ROUTES } from "@/config/navigation"
import { getAccountSummary } from "@/lib/account"
import { formatDay, formatMonth } from "@/lib/format"

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false },
}

export default function MiCuentaPage() {
  return (
    <main className="relative mx-auto w-full max-w-5xl flex-1 px-4 pt-28 pb-20 sm:px-6 md:pt-36">
      <Suspense fallback={<AccountSkeleton />}>
        <AccountDashboard />
      </Suspense>
    </main>
  )
}

async function AccountDashboard() {
  const summary = await getAccountSummary()
  // El proxy ya protege la ruta; esto cubre una sesión que venció en el medio
  if (!summary) redirect(`${ROUTES.login}?next=${ROUTES.miCuenta}`)

  const { user, membership, memberSince } = summary
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ")

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col items-start gap-4">
        <BlurFade delay={0.05} inView>
          <Eyebrow>Mi cuenta</Eyebrow>
        </BlurFade>
        <PageTitle delay={0.12} className={PAGE_TITLE_CLASS}>
          {user.firstName ? `Hola, ${user.firstName}` : "Hola"}
        </PageTitle>
        <BlurFade delay={0.19} inView>
          <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Acá están tu membresía, tus cursos, tus eventos y tus avisos.
          </p>
        </BlurFade>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {/* Membresía */}
        <BlurFade delay={0.26} inView className="md:col-span-3">
          <section className="relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-[28px] bg-primary p-6 text-primary-foreground shadow-[0_24px_64px_-28px_rgb(40_20_40/0.6)] sm:p-7">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-brand/35 blur-3xl"
            />
            <div className="relative flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-primary-foreground/70">Tu membresía</h2>
              {membership && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
                  <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                  Activa
                </span>
              )}
            </div>
            {membership ? (
              <div className="relative mt-10">
                <p className="font-heading text-5xl leading-none font-semibold tracking-[-0.03em] sm:text-6xl">
                  {membership.planName}
                </p>
                {membership.planDescription && (
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/70">
                    {membership.planDescription}
                  </p>
                )}
                <p className="mt-4 text-sm text-primary-foreground/70">Desde el {formatDay(membership.startedAt)}</p>
              </div>
            ) : (
              <p className="relative mt-10 text-sm text-primary-foreground/70">
                No encontramos una membresía activa. Escribinos y lo revisamos.
              </p>
            )}
            <BorderBeam size={140} duration={9} colorFrom="var(--brand)" colorTo="oklch(1 0 0 / 0.8)" />
          </section>
        </BlurFade>

        {/* Perfil */}
        <BlurFade delay={0.33} inView className="md:col-span-2">
          <AccountCard className="flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-muted-foreground">Tus datos</h2>
              <IconHoverArea className="inline-flex">
                <Link
                  href={ROUTES.perfil}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-foreground/[0.05]"
                >
                  <HoverIcon name="square-pen" size={14} />
                  Editar
                </Link>
              </IconHoverArea>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <UserAvatar user={user} className="size-16 text-lg" />
              <div className="min-w-0">
                {fullName ? (
                  <p className="truncate font-heading text-xl font-semibold tracking-[-0.01em]">{fullName}</p>
                ) : (
                  <Link
                    href={ROUTES.perfil}
                    className="font-heading text-lg font-semibold tracking-[-0.01em] underline decoration-brand underline-offset-4"
                  >
                    Completá tu perfil
                  </Link>
                )}
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            {memberSince && (
              <p className="mt-5 text-sm text-muted-foreground">
                En la comunidad desde <span className="text-foreground">{formatMonth(memberSince)}</span>
              </p>
            )}
            <SignOutButton className="mt-6 md:mt-auto md:pt-6" />
          </AccountCard>
        </BlurFade>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <BlurFade delay={0.4} inView>
          <EmptySection
            icon="book-text"
            title="Mis cursos"
            emptyTitle="Todavía no tenés cursos"
            emptyText="Cuando te sumes a un curso, lo vas a encontrar acá."
          />
        </BlurFade>
        <BlurFade delay={0.47} inView>
          <EmptySection
            icon="calendar-days"
            title="Mis eventos"
            emptyTitle="No tenés eventos próximos"
            emptyText="Los eventos a los que te anotes van a aparecer acá."
          />
        </BlurFade>
        <BlurFade delay={0.54} inView>
          <EmptySection
            icon="bell"
            title="Notificaciones"
            emptyTitle="Estás al día"
            emptyText="Cuando haya novedades para vos, te avisamos acá."
          />
        </BlurFade>
      </div>
    </div>
  )
}

function AccountSkeleton() {
  const block = "animate-pulse rounded-[28px] bg-foreground/[0.05]"
  return (
    <div aria-hidden className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="h-7 w-28 animate-pulse rounded-full bg-foreground/[0.05]" />
        <div className="h-12 w-64 animate-pulse rounded-2xl bg-foreground/[0.06]" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className={`${block} h-56 md:col-span-3`} />
        <div className={`${block} h-56 md:col-span-2`} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={`${block} h-60`} />
        <div className={`${block} h-60`} />
        <div className={`${block} h-60`} />
      </div>
    </div>
  )
}

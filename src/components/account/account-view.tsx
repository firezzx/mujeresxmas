import Link from "next/link"

import { AccountCard } from "@/components/account/account-card"
import { MyCourses, MyEvents, MyNotifications } from "@/components/account/account-sections"
import { SignOutButton } from "@/components/account/sign-out-button"
import { GRID_CELLS_CLASS, GridSection, HeroGlow } from "@/components/grid-section"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { BrandHighlight, Eyebrow, PAGE_TITLE_CLASS, PageTitle } from "@/components/page-hero"
import { UserAvatar } from "@/components/site-header/user-menu"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { ROUTES } from "@/config/navigation"
import type { getAccountSummary } from "@/lib/account"
import type { CommunityEvent, Course } from "@/lib/content"
import { formatDay, formatMonth } from "@/lib/format"
import type { UserNotification } from "@/lib/notifications"
import { cn } from "@/lib/utils"

type AccountViewProps = NonNullable<Awaited<ReturnType<typeof getAccountSummary>>> & {
  courses: Course[]
  events: CommunityEvent[]
  notifications: UserNotification[]
}

// Mi cuenta dentro de la retícula: encabezado, membresía y datos, y una celda por sección.
export function AccountView({ user, membership, memberSince, courses, events, notifications }: AccountViewProps) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ")

  return (
    <>
      <GridSection first>
        <header className="relative flex flex-col items-start gap-4 overflow-hidden px-5 pt-28 pb-10 sm:px-10 md:pt-36 md:pb-14">
          <HeroGlow />
          <BlurFade delay={0.05} inView className="relative">
            <Eyebrow>Mi cuenta</Eyebrow>
          </BlurFade>
          <div className="relative">
            <PageTitle delay={0.12} className={PAGE_TITLE_CLASS}>
              {user.firstName ? (
                <>
                  Hola, <BrandHighlight>{user.firstName}</BrandHighlight>
                </>
              ) : (
                "Hola"
              )}
            </PageTitle>
          </div>
          <BlurFade delay={0.19} inView className="relative">
            <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Acá están tu membresía, tus cursos, tus eventos y tus avisos.
            </p>
          </BlurFade>
        </header>
      </GridSection>

      <GridSection>
        <div className={cn(GRID_CELLS_CLASS, "grid-cols-1 md:grid-cols-5")}>
          {/* Membresía */}
          <div className="bg-background md:col-span-3">
            <BlurFade delay={0.26} inView className="h-full">
              <section className="relative flex h-full min-h-56 flex-col justify-between overflow-hidden bg-primary p-6 text-primary-foreground sm:p-10">
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
                    <p className="mt-4 text-sm text-primary-foreground/70">
                      Desde el {formatDay(membership.startedAt)}
                    </p>
                  </div>
                ) : (
                  <p className="relative mt-10 text-sm text-primary-foreground/70">
                    No encontramos una membresía activa. Escribinos y lo revisamos.
                  </p>
                )}
                <BorderBeam size={140} duration={9} colorFrom="var(--brand)" colorTo="oklch(1 0 0 / 0.8)" />
              </section>
            </BlurFade>
          </div>

          {/* Perfil */}
          <div className="bg-background md:col-span-2">
            <BlurFade delay={0.33} inView className="h-full">
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
        </div>
      </GridSection>

      <GridSection>
        <div className={cn(GRID_CELLS_CLASS, "grid-cols-1 md:grid-cols-3")}>
          <div className="bg-background">
            <BlurFade delay={0.4} inView className="h-full">
              <MyCourses courses={courses} />
            </BlurFade>
          </div>
          <div className="bg-background">
            <BlurFade delay={0.47} inView className="h-full">
              <MyEvents events={events} />
            </BlurFade>
          </div>
          <div className="bg-background">
            <BlurFade delay={0.54} inView className="h-full">
              {/* Destino de "Notificaciones" en el menú de la cuenta */}
              <div id="notificaciones" className="h-full scroll-mt-28">
                <MyNotifications notifications={notifications} />
              </div>
            </BlurFade>
          </div>
        </div>
      </GridSection>
    </>
  )
}

export function AccountSkeleton() {
  const cell = "h-60 animate-pulse bg-background"
  return (
    <div aria-hidden>
      <GridSection first>
        <div className="flex flex-col gap-4 px-5 pt-28 pb-10 sm:px-10 md:pt-36 md:pb-14">
          <div className="h-7 w-28 animate-pulse rounded-full bg-foreground/[0.05]" />
          <div className="h-12 w-64 animate-pulse rounded-2xl bg-foreground/[0.06]" />
        </div>
      </GridSection>
      <GridSection>
        <div className={cn(GRID_CELLS_CLASS, "grid-cols-1 md:grid-cols-5")}>
          <div className={cn(cell, "md:col-span-3")} />
          <div className={cn(cell, "md:col-span-2")} />
        </div>
      </GridSection>
      <GridSection>
        <div className={cn(GRID_CELLS_CLASS, "grid-cols-1 md:grid-cols-3")}>
          <div className={cell} />
          <div className={cell} />
          <div className={cell} />
        </div>
      </GridSection>
    </div>
  )
}

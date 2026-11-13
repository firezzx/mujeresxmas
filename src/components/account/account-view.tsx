import Link from "next/link"

import { AccountCard } from "@/components/account/account-card"
import { MyCourses, MyEvents, MyNotifications } from "@/components/account/account-sections"
import { SignOutButton } from "@/components/account/sign-out-button"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { DarkBackdrop } from "@/components/landing/landing-ui"
import { PageIntro } from "@/components/landing/screen"
import { PAGE_WIDTH_CLASS } from "@/components/page-band"
import { UserAvatar } from "@/components/site-header/user-menu"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import type { getAccountSummary } from "@/lib/account"
import type { CommunityEvent, Course } from "@/lib/content"
import { parsePlanFeature } from "@/lib/plan-features"
import { formatDay, formatMonth, formatPrice } from "@/lib/format"
import type { UserNotification } from "@/lib/notifications"
import { cn } from "@/lib/utils"

type AccountViewProps = NonNullable<Awaited<ReturnType<typeof getAccountSummary>>> & {
  courses: Course[]
  events: CommunityEvent[]
  notifications: UserNotification[]
}

// Mi cuenta, con el estilo del inicio: portada clara con el saludo, el plan en una tarjeta negra con
// textura, los datos al lado y una tarjeta por sección.
export function AccountView({ user, membership, memberSince, courses, events, notifications }: AccountViewProps) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ")

  return (
    <>
      <PageIntro
        eyebrow="Mi cuenta"
        title={
          user.firstName ? (
            <>
              Hola, <span className="text-brand-green-strong">{user.firstName}</span>
            </>
          ) : (
            "Hola"
          )
        }
        description="Acá están tu plan, tus cursos, tus eventos y tus avisos."
      />

      <div className={cn(PAGE_WIDTH_CLASS, "flex flex-col gap-4 pb-20 md:pb-28")}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {/* Plan */}
          <div className="min-w-0 md:col-span-3">
            <BlurFade delay={0.26} inView className="h-full">
              <section className="relative isolate flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground sm:p-10">
                <DarkBackdrop />
                <div className="relative flex items-center justify-between gap-3">
                  <h2 className="text-sm font-medium text-primary-foreground/70">Tu plan</h2>
                  {membership && (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
                      <span className="size-1.5 rounded-full bg-brand-green" aria-hidden />
                      Activa
                    </span>
                  )}
                </div>
                {membership ? (
                  <div className="relative mt-10">
                    <p className="font-heading text-5xl leading-none font-semibold tracking-[-0.01em] sm:text-6xl">
                      {membership.planName}
                    </p>
                    {membership.planDescription && (
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/70">
                        {membership.planDescription}
                      </p>
                    )}
                    <p className="mt-4 text-sm text-primary-foreground/70">
                      {membership.planPriceArs > 0
                        ? `${formatPrice(membership.planPriceArs)} por mes · `
                        : "Sin costo · "}
                      desde el {formatDay(membership.startedAt)}
                    </p>
                    {membership.planFeatures.length > 0 && (
                      <IconHoverArea className="mt-6 border-t border-primary-foreground/15 pt-6">
                        <h3 className="text-sm font-medium text-primary-foreground/70">Qué incluye</h3>
                        <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                          {membership.planFeatures.map(parsePlanFeature).map((feature) => (
                            <li
                              key={feature.text}
                              className={cn(
                                "flex items-start gap-2 text-sm leading-relaxed",
                                feature.highlighted && "font-heading font-semibold"
                              )}
                            >
                              <HoverIcon
                                name="circle-check"
                                size={16}
                                className={cn(
                                  "mt-0.5 shrink-0",
                                  feature.highlighted ? "text-brand" : "text-brand-green"
                                )}
                              />
                              {feature.text}
                            </li>
                          ))}
                        </ul>
                      </IconHoverArea>
                    )}
                    <IconHoverArea className="mt-6 w-fit">
                      <Link
                        href={ROUTES.membresia}
                        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors duration-300 outline-none hover:bg-brand-soft focus-visible:ring-3 focus-visible:ring-ring/40"
                      >
                        <HoverIcon name="sparkles" size={16} />
                        Ver las membresías
                      </Link>
                    </IconHoverArea>
                  </div>
                ) : (
                  <p className="relative mt-10 text-sm text-primary-foreground/70">
                    No encontramos una membresía activa. Escribinos y lo revisamos.
                  </p>
                )}
              </section>
            </BlurFade>
          </div>

          {/* Perfil */}
          <div className="min-w-0 md:col-span-2">
            <BlurFade delay={0.33} inView className="h-full">
              <AccountCard className="flex flex-col">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-medium text-muted-foreground">Tus datos</h2>
                  <IconHoverArea className="inline-flex">
                    <Link
                      href={ROUTES.perfil}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-foreground/[0.05]"
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <BlurFade delay={0.4} inView className="h-full min-w-0">
            <MyCourses courses={courses} />
          </BlurFade>
          <BlurFade delay={0.47} inView className="h-full min-w-0">
            <MyEvents events={events} />
          </BlurFade>
          <BlurFade delay={0.54} inView className="h-full min-w-0">
            <MyNotifications notifications={notifications} />
          </BlurFade>
        </div>
      </div>
    </>
  )
}

export function AccountSkeleton() {
  const cell = "h-60 animate-pulse rounded-xl bg-foreground/[0.05]"
  return (
    <div aria-hidden>
      <div className={cn(PAGE_WIDTH_CLASS, "flex flex-col gap-5 pt-32 pb-10 md:pt-40 md:pb-12")}>
        <div className="h-7 w-28 animate-pulse rounded-md bg-foreground/[0.05]" />
        <div className="h-16 w-80 max-w-full animate-pulse rounded-lg bg-foreground/[0.05]" />
      </div>
      <div className={cn(PAGE_WIDTH_CLASS, "flex flex-col gap-4 pb-20")}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className={cn(cell, "md:col-span-3")} />
          <div className={cn(cell, "md:col-span-2")} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className={cell} />
          <div className={cell} />
          <div className={cell} />
        </div>
      </div>
    </div>
  )
}

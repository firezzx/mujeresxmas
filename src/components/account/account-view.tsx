import Link from "next/link"

import { BrandCard } from "@/components/account/account-card"
import { MyCourses, MyEvents, MyNotifications } from "@/components/account/account-sections"
import { SignOutButton } from "@/components/account/sign-out-button"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { DarkBackdrop, HEADING_CLASS } from "@/components/landing/landing-ui"
import { HeroLights, PAGE_INTRO_OVERLAP_CLASS } from "@/components/landing/screen"
import { PAGE_WIDTH_CLASS } from "@/components/page-band"
import { UserAvatar } from "@/components/site-header/user-menu"
import { BlurFade } from "@/components/ui/blur-fade"
import { PLANS_ANCHOR, ROUTES } from "@/config/navigation"
import { ACCOUNT_INTRO, ACCOUNT_SECTIONS, ACCOUNT_SHORTCUTS, UPGRADE_PLAN_LABEL } from "@/content/mi-cuenta"
import type { AccountSummary, getAccountSummary } from "@/lib/account"
import type { CommunityEvent, Course } from "@/lib/content"
import { formatDay, formatMonth, formatPrice } from "@/lib/format"
import type { UserNotification } from "@/lib/notifications"
import { parsePlanFeature } from "@/lib/plan-features"
import { cn } from "@/lib/utils"

type AccountViewProps = NonNullable<Awaited<ReturnType<typeof getAccountSummary>>> & {
  courses: Course[]
  events: CommunityEvent[]
  notifications: UserNotification[]
}

// Mi cuenta como panel: saludo con la foto y el plan, una fila de accesos rápidos de colores y
// debajo la membresía en una tarjeta negra con textura junto a los avisos.
export function AccountView({ user, membership, memberSince, courses, events, notifications }: AccountViewProps) {
  const showCourses = !ACCOUNT_SECTIONS.courses.hidden
  const showEvents = !ACCOUNT_SECTIONS.events.hidden
  const status = [
    membership ? `Plan ${membership.planName} · activa` : null,
    memberSince ? `en la comunidad desde ${formatMonth(memberSince)}` : null,
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <>
      {/* Saludo */}
      <section className="relative isolate overflow-hidden">
        <HeroLights />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-background"
        />
        <div
          className={cn(
            PAGE_WIDTH_CLASS,
            "flex flex-col gap-6 pt-28 pb-24 sm:flex-row sm:items-end sm:justify-between md:pt-36 md:pb-32"
          )}
        >
          <BlurFade className="min-w-0">
            <div className="flex items-center gap-4 sm:gap-6">
              <UserAvatar
                user={user}
                className="size-16 shrink-0 shadow-[0_16px_32px_-16px_rgb(26_26_26/0.4)] ring-4 ring-background sm:size-24 **:data-[slot=avatar-fallback]:text-xl sm:**:data-[slot=avatar-fallback]:text-3xl"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{ACCOUNT_INTRO.eyebrow}</p>
                <h1 className={cn(HEADING_CLASS, "mt-1 text-4xl leading-none break-words sm:text-6xl")}>
                  Hola
                  {user.firstName && (
                    <>
                      , <span className="text-brand-green-strong">{user.firstName}</span>
                    </>
                  )}
                </h1>
                {status && (
                  <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground sm:text-base">
                    {membership && (
                      <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-green sm:mt-2" />
                    )}
                    <span>{status}</span>
                  </p>
                )}
              </div>
            </div>
          </BlurFade>
          <BlurFade delay={0.08} className="shrink-0">
            <SignOutButton />
          </BlurFade>
        </div>
      </section>

      <div className={cn(PAGE_WIDTH_CLASS, PAGE_INTRO_OVERLAP_CLASS, "flex flex-col gap-4 pb-20 md:pb-28")}>
        {/* Accesos rápidos */}
        <nav aria-label="Accesos rápidos" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {ACCOUNT_SHORTCUTS.map((shortcut, index) => (
            <BlurFade key={shortcut.href} delay={0.12 + index * 0.05} inView className="h-full min-w-0">
              <BrandCard>
                <IconHoverArea className="h-full">
                  <Link
                    href={shortcut.href}
                    className="group flex h-full flex-col gap-4 rounded-xl p-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/40 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <IconBadge tone={shortcut.tone}>
                        <HoverIcon name={shortcut.icon} size={22} />
                      </IconBadge>
                      <HoverIcon
                        name="arrow-right"
                        size={18}
                        className="text-foreground/30 transition-colors group-hover:text-foreground"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading text-lg leading-tight font-semibold tracking-[-0.01em]">
                        {shortcut.label}
                      </p>
                      <p className="mt-1 text-sm text-pretty text-muted-foreground">{shortcut.description}</p>
                    </div>
                  </Link>
                </IconHoverArea>
              </BrandCard>
            </BlurFade>
          ))}
        </nav>

        {/* Membresía y avisos */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <BlurFade delay={0.32} inView className="h-full min-w-0 md:col-span-3">
            <PlanCard membership={membership} />
          </BlurFade>
          <BlurFade delay={0.38} inView className="h-full min-w-0 md:col-span-2">
            <MyNotifications notifications={notifications} />
          </BlurFade>
        </div>

        {(showCourses || showEvents) && (
          <div className={cn("grid grid-cols-1 gap-4", showCourses && showEvents && "md:grid-cols-2")}>
            {showCourses && (
              <BlurFade delay={0.44} inView className="h-full min-w-0">
                <MyCourses courses={courses} />
              </BlurFade>
            )}
            {showEvents && (
              <BlurFade delay={0.5} inView className="h-full min-w-0">
                <MyEvents events={events} />
              </BlurFade>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function PlanCard({ membership }: { membership: AccountSummary["membership"] }) {
  return (
    <section className="relative isolate flex h-full min-h-56 flex-col overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground sm:p-10">
      <DarkBackdrop />
      <div className="relative flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-primary-foreground/70">Tu membresía</h2>
        {membership && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
            <span className="size-1.5 rounded-full bg-brand-green" aria-hidden />
            Activa
          </span>
        )}
      </div>
      {membership ? (
        <div className="relative mt-8 flex flex-1 flex-col">
          <p className="font-heading text-5xl leading-none font-semibold tracking-[-0.01em] sm:text-6xl">
            {membership.planName}
          </p>
          {membership.planDescription && (
            <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/70">
              {membership.planDescription}
            </p>
          )}
          <p className="mt-4 text-sm text-primary-foreground/70">
            {membership.planPriceArs > 0 ? `${formatPrice(membership.planPriceArs)} por mes · ` : "Sin costo · "}
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
                      className={cn("mt-0.5 shrink-0", feature.highlighted ? "text-brand" : "text-brand-green")}
                    />
                    {feature.text}
                  </li>
                ))}
              </ul>
            </IconHoverArea>
          )}
          <IconHoverArea className="mt-8 w-full sm:w-fit md:mt-auto md:pt-8">
            <Link
              href={`${ROUTES.membresia}#${PLANS_ANCHOR}`}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-strong px-5 py-2 text-sm font-semibold text-white transition-opacity outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <HoverIcon name="trending-up" size={16} />
              {UPGRADE_PLAN_LABEL}
            </Link>
          </IconHoverArea>
        </div>
      ) : (
        <p className="relative mt-10 text-sm text-primary-foreground/70">
          No encontramos una membresía activa. Escribinos y lo revisamos.
        </p>
      )}
    </section>
  )
}

export function AccountSkeleton() {
  const cell = "animate-pulse rounded-xl bg-foreground/[0.05]"
  return (
    <div aria-hidden>
      <div className={cn(PAGE_WIDTH_CLASS, "flex items-center gap-5 pt-28 pb-24 md:pt-36 md:pb-32")}>
        <div className={cn(cell, "size-16 rounded-lg sm:size-24")} />
        <div className="flex flex-col gap-3">
          <div className="h-4 w-20 animate-pulse rounded-md bg-foreground/[0.05]" />
          <div className="h-12 w-64 max-w-full animate-pulse rounded-lg bg-foreground/[0.05]" />
        </div>
      </div>
      <div className={cn(PAGE_WIDTH_CLASS, PAGE_INTRO_OVERLAP_CLASS, "flex flex-col gap-4 pb-20")}>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {ACCOUNT_SHORTCUTS.map((shortcut) => (
            <div key={shortcut.href} className={cn(cell, "h-40")} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className={cn(cell, "h-96 md:col-span-3")} />
          <div className={cn(cell, "h-96 md:col-span-2")} />
        </div>
      </div>
    </div>
  )
}

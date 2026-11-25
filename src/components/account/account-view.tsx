import Link from "next/link"

import { AvatarUploader } from "@/components/account/avatar-uploader"
import { CoverUploader } from "@/components/account/cover-uploader"
import { MyCourses, MyEvents, MyNotifications } from "@/components/account/account-sections"
import { ProfileEditDialog } from "@/components/account/profile-edit-dialog"
import { SignOutButton } from "@/components/account/sign-out-button"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { DarkBackdrop, HEADING_CLASS } from "@/components/landing/landing-ui"
import { BandBackdrop, PAGE_WIDTH_CLASS } from "@/components/page-band"
import { BlurFade } from "@/components/ui/blur-fade"
import { PLANS_ANCHOR, ROUTES } from "@/config/navigation"
import { ACCOUNT_SECTIONS, UPGRADE_PLAN_LABEL } from "@/content/mi-cuenta"
import type { AccountSummary } from "@/lib/account"
import type { CommunityEvent, Course } from "@/lib/content"
import { formatDay, formatMonth, formatPrice } from "@/lib/format"
import type { UserNotification } from "@/lib/notifications"
import { parsePlanFeature } from "@/lib/plan-features"
import { cn } from "@/lib/utils"
import type { ProfileField } from "@/lib/validations/profile"

type AccountViewProps = AccountSummary & {
  values: Record<ProfileField, string>
  coverUrl: string | null
  courses: Course[]
  events: CommunityEvent[]
  notifications: UserNotification[]
}

// Mi cuenta es también el perfil: portada a todo el ancho, la foto montada sobre su borde con el
// nombre y el emprendimiento, y "Editar perfil" abre una ventana. Debajo, la membresía en una
// tarjeta negra con textura junto a los avisos.
export function AccountView({
  user,
  membership,
  memberSince,
  values,
  coverUrl,
  courses,
  events,
  notifications,
}: AccountViewProps) {
  const showCourses = !ACCOUNT_SECTIONS.courses.hidden
  const showEvents = !ACCOUNT_SECTIONS.events.hidden
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ")
  const details = [
    values.business_name.trim(),
    memberSince ? `En la comunidad desde ${formatMonth(memberSince)}` : null,
  ].filter(Boolean)

  return (
    <>
      <CoverUploader userId={user.id} coverUrl={coverUrl} fallback={<BandBackdrop tone="green" />} />

      <div className={cn(PAGE_WIDTH_CLASS, "flex flex-col gap-10 pb-20 md:pb-28")}>
        <AvatarUploader
          user={user}
          variant="cover"
          heading={
            <>
              <h1 className={cn(HEADING_CLASS, "text-3xl leading-tight break-words sm:text-4xl")}>
                {fullName || "Tu perfil"}
              </h1>
              {details.length > 0 && (
                <p className="mt-1 text-base text-muted-foreground sm:text-lg">{details.join(" · ")}</p>
              )}
            </>
          }
          aside={
            <div className="flex w-full gap-2 sm:w-auto">
              <ProfileEditDialog user={user} values={values} className="flex-1 sm:flex-none" />
              <SignOutButton className="flex-1 sm:flex-none" />
            </div>
          }
        />

        <div className="flex flex-col gap-4">
          {/* Membresía y avisos */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <BlurFade delay={0.1} inView className="h-full min-w-0 md:col-span-3">
              <PlanCard membership={membership} />
            </BlurFade>
            <BlurFade delay={0.16} inView className="h-full min-w-0 md:col-span-2">
              <MyNotifications notifications={notifications} />
            </BlurFade>
          </div>

          {(showCourses || showEvents) && (
            <div className={cn("grid grid-cols-1 gap-4", showCourses && showEvents && "md:grid-cols-2")}>
              {showCourses && (
                <BlurFade delay={0.22} inView className="h-full min-w-0">
                  <MyCourses courses={courses} />
                </BlurFade>
              )}
              {showEvents && (
                <BlurFade delay={0.28} inView className="h-full min-w-0">
                  <MyEvents events={events} />
                </BlurFade>
              )}
            </div>
          )}
        </div>
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
      <div className="relative h-60 sm:h-72 lg:h-80">
        <BandBackdrop tone="green" />
      </div>
      <div className={cn(PAGE_WIDTH_CLASS, "flex flex-col gap-10 pb-20")}>
        <div className="relative -mt-16 size-28 animate-pulse rounded-lg bg-foreground/[0.06] sm:-mt-20 sm:size-36" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className={cn(cell, "h-96 md:col-span-3")} />
          <div className={cn(cell, "h-96 md:col-span-2")} />
        </div>
      </div>
    </div>
  )
}

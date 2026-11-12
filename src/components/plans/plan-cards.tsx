import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import { DarkBackdrop } from "@/components/landing/landing-ui"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import { PLANS_PAGE } from "@/content/planes"
import { formatPrice } from "@/lib/format"
import { parsePlanFeature, type PlanFeature } from "@/lib/plan-features"
import type { Plan } from "@/lib/plans"
import { cn } from "@/lib/utils"

type PlanCardsProps = {
  plans: Plan[]
  // Plan activo de la usuaria; null para visitantes o si no tiene ninguno
  currentPlanId: string | null
  signedIn: boolean
}

// Tarjetas de los planes: una por plan, en el orden que trae la base.
export function PlanCards({ plans, currentPlanId, signedIn }: PlanCardsProps) {
  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
      {plans.map((plan, index) => (
        <BlurFade key={plan.id} inView delay={0.2 + index * 0.08} className="h-full min-w-0">
          <PlanCard
            plan={plan}
            level={index + 1}
            levels={plans.length}
            isCurrent={plan.id === currentPlanId}
            signedIn={signedIn}
          />
        </BlurFade>
      ))}
    </div>
  )
}

// El plan gratuito va en una tarjeta blanca con el ícono en rosa; el pago, en negro con la textura
// de las franjas oscuras y el verde, para que se distinga como el más completo.
const CARD_CLASS = {
  free: "bg-background ring-1 ring-foreground/[0.08] shadow-[0_1px_2px_rgb(26_26_26/0.04),0_16px_40px_-20px_rgb(26_26_26/0.18)]",
  paid: "surface-dark isolate bg-primary text-primary-foreground shadow-[0_28px_60px_-28px_rgb(26_26_26/0.6)]",
}

const PLAN_ICON: Record<"free" | "paid", IconName> = { free: "compass", paid: "rocket" }

type PlanCardProps = { plan: Plan; level: number; levels: number; isCurrent: boolean; signedIn: boolean }

function PlanCard({ plan, level, levels, isCurrent, signedIn }: PlanCardProps) {
  const isPaid = plan.priceArs > 0
  const kind = isPaid ? "paid" : "free"
  const features = plan.features.map(parsePlanFeature)
  return (
    <IconHoverArea
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-xl p-6 transition-transform duration-500 ease-premium hover:-translate-y-1",
        CARD_CLASS[kind]
      )}
    >
      {isPaid && <DarkBackdrop />}
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1.5", isPaid ? "bg-brand-green" : "bg-brand-soft")} />

      <div className="flex items-center justify-between gap-3">
        <LevelMeter level={level} levels={levels} kind={kind} />
        {isCurrent ? (
          <Tag dot="bg-brand" className={isPaid ? "bg-white/10" : "bg-brand-soft/50"}>
            {PLANS_PAGE.currentBadge}
          </Tag>
        ) : (
          isPaid && (
            <Tag dot="bg-brand-green" className="bg-brand-green/20 text-brand-green">
              {PLANS_PAGE.featuredBadge}
            </Tag>
          )
        )}
      </div>

      <h3 className="mt-4 font-heading text-4xl leading-none font-semibold tracking-[-0.02em]">{plan.name}</h3>
      {plan.description && (
        <p
          className={cn(
            "mt-2 text-[15px] leading-relaxed text-pretty",
            isPaid ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {plan.description}
        </p>
      )}

      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="font-heading text-[2.5rem] leading-none font-semibold tracking-[-0.03em]">
          {isPaid ? formatPrice(plan.priceArs) : PLANS_PAGE.free}
        </span>
        {isPaid && <span className="text-sm text-white/60">/ {PLANS_PAGE.perMonth}</span>}
      </p>

      <div className={cn("mt-5 border-t pt-5", isPaid ? "border-white/12" : "border-foreground/[0.08]")}>
        <ul className="flex flex-col gap-2.5">
          {features.map((feature) => (
            <FeatureItem key={feature.text} feature={feature} dark={isPaid} />
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-6 empty:hidden">
        <PlanAction isCurrent={isCurrent} isPaid={isPaid} signedIn={signedIn} />
      </div>
    </IconHoverArea>
  )
}

// Nivel del plan, como un rango: ícono, "Nivel N" y una barrita por nivel, llena hasta el de este plan
function LevelMeter({ level, levels, kind }: { level: number; levels: number; kind: "free" | "paid" }) {
  const paid = kind === "paid"
  return (
    <div className="flex items-center gap-3">
      <IconBadge tone={paid ? "green" : "pink"} size="sm" className={cn(paid && "bg-brand-green/20 text-brand-green")}>
        <HoverIcon name={PLAN_ICON[kind]} size={18} />
      </IconBadge>
      <div className="flex flex-col gap-1.5">
        <span
          className={cn(
            "font-heading text-sm leading-none font-bold tracking-[0.12em] uppercase",
            paid ? "text-brand-green" : "text-brand-pink-strong"
          )}
        >
          {PLANS_PAGE.levelLabel} {level}
        </span>
        <span aria-hidden className="flex gap-1.5">
          {Array.from({ length: levels }, (_, index) => (
            <span
              key={index}
              className={cn(
                "h-2 w-9 rounded-full",
                index < level
                  ? paid
                    ? "bg-brand-green"
                    : "bg-brand-pink-strong"
                  : paid
                    ? "bg-white/15"
                    : "bg-foreground/10"
              )}
            />
          ))}
        </span>
      </div>
    </div>
  )
}

function Tag({ dot, className, children }: { dot: string; className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-heading text-xs font-semibold tracking-[0.06em] uppercase",
        className
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", dot)} />
      {children}
    </span>
  )
}

// Cada beneficio con su tilde. El destacado (p. ej. Kiero) va en un recuadro naranja suave que resalta.
function FeatureItem({ feature, dark }: { feature: PlanFeature; dark: boolean }) {
  if (feature.highlighted) {
    return (
      <li
        className={cn(
          "-mx-1 flex items-center gap-3 rounded-lg p-3 font-heading text-[15px] leading-snug font-semibold ring-1",
          dark ? "bg-brand/15 ring-brand/40" : "bg-brand/8 ring-brand/25"
        )}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand text-brand-foreground">
          <HoverIcon name="sparkles" size={15} />
        </span>
        {feature.text}
      </li>
    )
  }
  return (
    <li className={cn("flex items-start gap-3 text-[15px] leading-snug", dark && "text-white/85")}>
      <span
        className={cn(
          "mt-px flex size-5 shrink-0 items-center justify-center rounded-md",
          dark ? "bg-brand-green/20 text-brand-green" : "bg-brand-green/18 text-brand-green-strong"
        )}
      >
        <HoverIcon name="check" size={13} />
      </span>
      {feature.text}
    </li>
  )
}

const STATIC_ACTION_CLASS =
  "flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2 text-center text-sm font-medium"

// Qué se puede hacer con cada plan. Cuando estén los cobros, el botón de contratar va en lugar de
// "Próximamente"; un plan gratuito no se muestra como opción a quien ya tiene uno pago.
function PlanAction({ isCurrent, isPaid, signedIn }: { isCurrent: boolean; isPaid: boolean; signedIn: boolean }) {
  if (isCurrent) {
    return (
      <p className={cn(STATIC_ACTION_CLASS, isPaid ? "bg-white/10" : "bg-brand-soft/40")}>{PLANS_PAGE.currentAction}</p>
    )
  }
  if (isPaid) {
    return <p className={cn(STATIC_ACTION_CLASS, "text-white/70 ring-1 ring-white/20")}>{PLANS_PAGE.comingSoon}</p>
  }
  if (signedIn) return null
  return (
    <ShimmerLink href={ROUTES.registro} size="md" className="min-h-11 w-full">
      {PLANS_PAGE.guestCta}
    </ShimmerLink>
  )
}

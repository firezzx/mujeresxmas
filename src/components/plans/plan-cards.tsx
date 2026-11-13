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
    <div
      className={cn(
        "mx-auto grid w-full grid-cols-1 gap-5",
        plans.length >= 3 ? "max-w-6xl md:grid-cols-2 lg:grid-cols-3" : "max-w-4xl md:grid-cols-2"
      )}
    >
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

// El plan gratuito va en blanco con rosa; el destacado (la más elegida), en negro con la textura de
// las franjas oscuras; los demás pagos, en blanco con verde.
type CardKind = "free" | "featured" | "paid"

const WHITE_CARD =
  "bg-background ring-1 ring-foreground/[0.08] shadow-[0_1px_2px_rgb(26_26_26/0.04),0_16px_40px_-20px_rgb(26_26_26/0.18)]"

const CARD_CLASS: Record<CardKind, string> = {
  free: WHITE_CARD,
  featured: "surface-dark isolate bg-primary text-primary-foreground shadow-[0_28px_60px_-28px_rgb(26_26_26/0.6)]",
  paid: WHITE_CARD,
}

const STRIPE_CLASS: Record<CardKind, string> = {
  free: "bg-brand-soft",
  featured: "bg-brand-green",
  paid: "bg-brand-green",
}

const PLAN_ICON: Record<CardKind, IconName> = { free: "compass", featured: "trending-up", paid: "rocket" }

type PlanCardProps = { plan: Plan; level: number; levels: number; isCurrent: boolean; signedIn: boolean }

function PlanCard({ plan, level, levels, isCurrent, signedIn }: PlanCardProps) {
  const isPaid = plan.priceArs !== 0
  const kind: CardKind = !isPaid ? "free" : plan.id === PLANS_PAGE.featuredPlanId ? "featured" : "paid"
  const dark = kind === "featured"
  const tagline = PLANS_PAGE.taglines[plan.id]
  const features = plan.features.map(parsePlanFeature)
  return (
    <IconHoverArea
      data-plan-card={plan.id}
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-xl p-6 transition-[translate,opacity,scale,box-shadow,filter] duration-500 ease-premium hover:-translate-y-1",
        CARD_CLASS[kind]
      )}
    >
      {dark && <DarkBackdrop />}
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1.5", STRIPE_CLASS[kind])} />

      <div className="flex items-center justify-between gap-3">
        <LevelMeter level={level} levels={levels} kind={kind} />
        {isCurrent ? (
          <Tag dot="bg-brand" className={dark ? "bg-white/10" : "bg-brand-soft/50"}>
            {PLANS_PAGE.currentBadge}
          </Tag>
        ) : (
          dark && (
            <Tag dot="bg-brand-green" className="bg-brand-green/20 text-brand-green">
              {PLANS_PAGE.featuredBadge}
            </Tag>
          )
        )}
      </div>

      <div className="mt-5 flex min-h-6 items-center justify-between gap-3">
        {tagline && (
          <p
            className={cn(
              "font-hand text-2xl leading-none font-semibold",
              dark ? "text-brand-soft" : kind === "free" ? "text-brand-pink-strong" : "text-brand-green-strong"
            )}
          >
            {tagline}
          </p>
        )}
        {/* Se muestra cuando la visitante elige su momento en la página de Membresía */}
        <span data-recommended className="hidden">
          <Tag dot="bg-white" className="bg-brand-green text-primary">
            {PLANS_PAGE.recommendedBadge}
          </Tag>
        </span>
      </div>
      <h3 className="mt-1.5 font-heading text-4xl leading-none font-semibold tracking-[-0.02em]">{plan.name}</h3>
      {plan.description && (
        <p
          className={cn(
            "mt-2 text-[15px] leading-relaxed text-pretty",
            dark ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {plan.description}
        </p>
      )}

      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="font-heading text-[2.5rem] leading-none font-semibold tracking-[-0.03em]">
          {!isPaid ? PLANS_PAGE.free : plan.priceArs === null ? PLANS_PAGE.priceToConfirm : formatPrice(plan.priceArs)}
        </span>
        {isPaid && plan.priceArs !== null && (
          <span className={cn("text-sm", dark ? "text-white/60" : "text-muted-foreground")}>
            / {PLANS_PAGE.perMonth}
          </span>
        )}
      </p>

      <div className={cn("mt-5 border-t pt-5", dark ? "border-white/12" : "border-foreground/[0.08]")}>
        <ul className="flex flex-col gap-2.5">
          {features.map((feature) => (
            <FeatureItem key={feature.text} feature={feature} dark={dark} />
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-6 empty:hidden">
        <PlanAction isCurrent={isCurrent} isPaid={isPaid} dark={dark} signedIn={signedIn} />
      </div>
    </IconHoverArea>
  )
}

// Nivel del plan, como un rango: ícono, "Nivel N" y una barrita por nivel, llena hasta el de este plan
function LevelMeter({ level, levels, kind }: { level: number; levels: number; kind: CardKind }) {
  const paid = kind !== "free"
  const dark = kind === "featured"
  return (
    <div className="flex items-center gap-3">
      <IconBadge tone={paid ? "green" : "pink"} size="sm" className={cn(dark && "bg-brand-green/20 text-brand-green")}>
        <HoverIcon name={PLAN_ICON[kind]} size={18} />
      </IconBadge>
      <div className="flex flex-col gap-1.5">
        <span
          className={cn(
            "font-heading text-sm leading-none font-bold tracking-[0.12em] uppercase",
            dark ? "text-brand-green" : paid ? "text-brand-green-strong" : "text-brand-pink-strong"
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
                  : dark
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
function PlanAction({
  isCurrent,
  isPaid,
  dark,
  signedIn,
}: {
  isCurrent: boolean
  isPaid: boolean
  dark: boolean
  signedIn: boolean
}) {
  if (isCurrent) {
    return (
      <p className={cn(STATIC_ACTION_CLASS, dark ? "bg-white/10" : "bg-brand-soft/40")}>{PLANS_PAGE.currentAction}</p>
    )
  }
  if (isPaid) {
    return (
      <p
        className={cn(
          STATIC_ACTION_CLASS,
          dark ? "text-white/70 ring-1 ring-white/20" : "text-muted-foreground ring-1 ring-border"
        )}
      >
        {PLANS_PAGE.comingSoon}
      </p>
    )
  }
  if (signedIn) return null
  return (
    <ShimmerLink href={ROUTES.registro} size="md" className="min-h-11 w-full">
      {PLANS_PAGE.guestCta}
    </ShimmerLink>
  )
}

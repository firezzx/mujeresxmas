import { AccountCard } from "@/components/account/account-card"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { ROUTES } from "@/config/navigation"
import { PLANS_PAGE } from "@/content/planes"
import { formatPrice } from "@/lib/format"
import type { Plan } from "@/lib/plans"
import { cn } from "@/lib/utils"

type PlanCardsProps = {
  plans: Plan[]
  // Plan activo de la usuaria; null para visitantes o si no tiene ninguno
  currentPlanId: string | null
  signedIn: boolean
}

// Tarjetas de la página de planes: una por plan, en el orden que trae la base.
export function PlanCards({ plans, currentPlanId, signedIn }: PlanCardsProps) {
  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
      {plans.map((plan, index) => (
        <BlurFade key={plan.id} inView delay={0.2 + index * 0.08} className="h-full min-w-0">
          <PlanCard plan={plan} isCurrent={plan.id === currentPlanId} signedIn={signedIn} />
        </BlurFade>
      ))}
    </div>
  )
}

function PlanCard({ plan, isCurrent, signedIn }: { plan: Plan; isCurrent: boolean; signedIn: boolean }) {
  const isPaid = plan.priceArs > 0
  return (
    <AccountCard className="flex flex-col rounded-xl">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-heading text-2xl font-semibold tracking-[-0.01em]">{plan.name}</h2>
        {isCurrent && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-brand-soft px-2.5 py-1 text-xs font-medium">
            <span aria-hidden className="size-1.5 rounded-full bg-brand" />
            {PLANS_PAGE.currentBadge}
          </span>
        )}
      </div>
      {plan.description && (
        <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{plan.description}</p>
      )}

      <p className="mt-6 flex items-baseline gap-2">
        <span className="font-heading text-4xl leading-none font-semibold tracking-[-0.01em]">
          {formatPrice(plan.priceArs)}
        </span>
        <span className="text-sm text-muted-foreground">{PLANS_PAGE.perMonth}</span>
      </p>

      <IconHoverArea className="mt-6 flex-1 border-t border-border/70 pt-6">
        <ul className="flex flex-col gap-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm leading-relaxed">
              <HoverIcon name="circle-check" size={18} className="mt-0.5 shrink-0 text-brand-green-strong" />
              {feature}
            </li>
          ))}
        </ul>
      </IconHoverArea>

      <div className="mt-8">
        <PlanAction isCurrent={isCurrent} isPaid={isPaid} signedIn={signedIn} />
      </div>
      {isPaid && <BorderBeam size={140} duration={9} colorFrom="var(--brand-green)" colorTo="var(--brand-soft)" />}
    </AccountCard>
  )
}

const STATIC_ACTION_CLASS =
  "flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2 text-center text-sm font-medium"

// Qué se puede hacer con cada plan. Cuando estén los cobros, el botón de contratar va en lugar de
// "Próximamente"; un plan gratuito no se muestra como opción a quien ya tiene uno pago.
function PlanAction({ isCurrent, isPaid, signedIn }: { isCurrent: boolean; isPaid: boolean; signedIn: boolean }) {
  if (isCurrent) {
    return <p className={cn(STATIC_ACTION_CLASS, "bg-brand-soft/40")}>{PLANS_PAGE.currentAction}</p>
  }
  if (isPaid) {
    return (
      <p className={cn(STATIC_ACTION_CLASS, "text-muted-foreground ring-1 ring-border")}>{PLANS_PAGE.comingSoon}</p>
    )
  }
  if (signedIn) return null
  return (
    <ShimmerLink href={ROUTES.registro} size="md" className="min-h-11 w-full">
      {PLANS_PAGE.guestCta}
    </ShimmerLink>
  )
}

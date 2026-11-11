import { PlanCards } from "@/components/plans/plan-cards"
import { getAccountSummary } from "@/lib/account"
import { listPlans } from "@/lib/plans"

// Planes cargados en el admin, marcando el de la usuaria si tiene sesión. Va dentro de <Suspense>.
export async function PlansList() {
  const [plans, summary] = await Promise.all([listPlans(), getAccountSummary()])
  if (!plans) {
    return (
      <p className="mx-auto max-w-4xl rounded-xl bg-background p-6 text-center">
        No pudimos cargar los planes. Volvé a intentar en un rato.
      </p>
    )
  }
  return <PlanCards plans={plans} currentPlanId={summary?.membership?.planId ?? null} signedIn={Boolean(summary)} />
}

export function PlansListSkeleton() {
  return <div aria-hidden className="mx-auto h-[32rem] max-w-4xl animate-pulse rounded-xl bg-muted" />
}

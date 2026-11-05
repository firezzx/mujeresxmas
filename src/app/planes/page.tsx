import type { Metadata } from "next"
import { Suspense } from "react"

import { Band, ColorHero, OVERLAP_CLASS } from "@/components/page-band"
import { BrandHighlight } from "@/components/page-hero"
import { PlanCards } from "@/components/plans/plan-cards"
import { PLANS_PAGE } from "@/content/planes"
import { getAccountSummary } from "@/lib/account"
import { listPlans } from "@/lib/plans"

export const metadata: Metadata = {
  title: "Planes",
  description: PLANS_PAGE.description,
}

// Página de planes: abierta a todo el mundo y, con sesión, marca el plan que tiene la usuaria.
// Acá se va a contratar y pagar cuando estén los cobros.
export default function PlansPage() {
  const { title } = PLANS_PAGE
  return (
    <main className="relative flex flex-1 flex-col">
      <ColorHero
        overlap
        eyebrow={PLANS_PAGE.eyebrow}
        title={
          <>
            {title.start}
            <BrandHighlight>{title.highlight}</BrandHighlight>
            {title.end}
          </>
        }
        description={PLANS_PAGE.description}
      />
      <Band className={OVERLAP_CLASS}>
        <Suspense
          fallback={<div aria-hidden className="mx-auto h-[32rem] max-w-4xl animate-pulse rounded-xl bg-muted" />}
        >
          <PlansContent />
        </Suspense>
      </Band>
    </main>
  )
}

async function PlansContent() {
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

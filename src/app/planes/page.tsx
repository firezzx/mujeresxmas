import type { Metadata } from "next"
import { Suspense } from "react"

import { Band, ColorHero, OVERLAP_CLASS } from "@/components/page-band"
import { BrandHighlight } from "@/components/page-hero"
import { PlansList, PlansListSkeleton } from "@/components/plans/plans-list"
import { PLANS_PAGE } from "@/content/planes"

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
        <Suspense fallback={<PlansListSkeleton />}>
          <PlansList />
        </Suspense>
      </Band>
    </main>
  )
}

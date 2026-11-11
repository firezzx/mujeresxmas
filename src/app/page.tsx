import { Suspense } from "react"

import { FloatingRegisterCta } from "@/components/cta/register-cta"
import {
  LandingClosing,
  LandingHero,
  LandingMoments,
  LandingPillars,
  LandingPlans,
  LandingRibbons,
  LandingStatement,
  LandingSteps,
  LandingStory,
} from "@/components/landing/landing-sections"
import { LandingShowcase, LandingShowcaseSkeleton } from "@/components/landing/landing-showcase"
import { HOME_CLOSING_CTA_ID } from "@/content/home"

const HERO_CTA_ID = "cta-registro"

// Inicio estilo startup: portada centrada, mosaico de fotos y cifras, cintas y grillas bento con color.
// Los textos viven en src/content/home.ts y src/content/pilares.ts.
export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col">
      <LandingHero ctaId={HERO_CTA_ID} />
      <LandingRibbons />
      <LandingPillars />
      <LandingMoments />
      <LandingSteps />
      <LandingPlans />

      <Suspense fallback={<LandingShowcaseSkeleton />}>
        <LandingShowcase />
      </Suspense>

      <LandingStatement />
      <LandingStory />
      <LandingClosing />

      <FloatingRegisterCta watchId={HERO_CTA_ID} hideWhileVisibleId={HOME_CLOSING_CTA_ID} />
    </main>
  )
}

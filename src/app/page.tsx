import { Suspense } from "react";

import { FloatingRegisterCta } from "@/components/cta/register-cta";
import {
  HomeClosing,
  HomeHero,
  HomeRibbons,
  HomeShowcase,
  HomeShowcaseSkeleton,
} from "@/components/home/home-sections";
import {
  HomeEvolution,
  HomeImpact,
  HomeMoments,
  HomePillars,
  HomePlans,
  HomeSteps,
} from "@/components/home/home-membership";
import { HOME_CLOSING_CTA_ID } from "@/content/home";

const HERO_CTA_ID = "cta-registro";

// Home: presenta la membresía (pilares, planes del admin y cómo empezar) y lo que hay adentro con
// datos reales. Los textos viven en src/content/home.ts y src/content/pilares.ts.
export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col">
      <HomeHero ctaId={HERO_CTA_ID} />
      <HomeRibbons />
      <HomeImpact />
      <HomePillars />
      <HomeMoments />
      <HomePlans />
      <HomeSteps />

      <Suspense fallback={<HomeShowcaseSkeleton />}>
        <HomeShowcase />
      </Suspense>

      <HomeEvolution />
      <HomeClosing />

      <FloatingRegisterCta
        watchId={HERO_CTA_ID}
        hideWhileVisibleId={HOME_CLOSING_CTA_ID}
      />
    </main>
  );
}

import { Suspense } from "react";

import { FloatingRegisterCta } from "@/components/cta/register-cta";
import {
  HomeClosing,
  HomeHero,
  HomeRibbons,
  HomeShowcase,
  HomeShowcaseSkeleton,
} from "@/components/home/home-sections";
import { HOME_CLOSING_CTA_ID } from "@/content/home";

const HERO_CTA_ID = "cta-registro";

// Home como vidriera de la comunidad: muestra lo que hay adentro con datos reales, y los textos
// provisorios y ejemplos viven en src/content/home.ts.
export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col">
      <HomeHero ctaId={HERO_CTA_ID} />
      <HomeRibbons />

      <Suspense fallback={<HomeShowcaseSkeleton />}>
        <HomeShowcase />
      </Suspense>

      <HomeClosing />

      <FloatingRegisterCta
        watchId={HERO_CTA_ID}
        hideWhileVisibleId={HOME_CLOSING_CTA_ID}
      />
    </main>
  );
}

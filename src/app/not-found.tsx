import type { Metadata } from "next"

import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { HEADING_CLASS, Pill } from "@/components/landing/landing-ui"
import { HeroLights, ScreenSection } from "@/components/landing/screen"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Página no encontrada",
}

// 404 propia con el estilo del inicio: pantalla completa clara y centrada. Reemplaza la de Next.js,
// que inyecta estilos de modo oscuro que quedaban aplicados al volver al sitio.
export default function NotFound() {
  return (
    <main className="relative flex flex-1 flex-col">
      <ScreenSection
        backdrop={<HeroLights />}
        className="flex min-h-svh flex-col"
        innerClassName="my-auto pt-32 lg:pt-24"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <BlurFade>
            <Pill>Error 404</Pill>
          </BlurFade>
          <BlurFade delay={0.06}>
            <h1 className={cn(HEADING_CLASS, "mt-7 text-[2.9rem] leading-[0.98] sm:text-7xl xl:text-[5.5rem]")}>
              Esta página <span className="text-brand-green-strong">no existe</span>
            </h1>
          </BlurFade>
          <BlurFade delay={0.12}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
              Puede que el link esté mal escrito o que la página se haya movido. Volvé al inicio y seguí recorriendo.
            </p>
          </BlurFade>
          <BlurFade delay={0.18} className="mt-9 w-full sm:w-auto">
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <ShimmerLink href="/" className="w-full sm:w-auto">
                Volver al inicio
              </ShimmerLink>
              <HoverRevealLink href="/quiero" className="w-full sm:w-auto">
                Conocé QUIERO
              </HoverRevealLink>
            </div>
          </BlurFade>
        </div>
      </ScreenSection>
    </main>
  )
}

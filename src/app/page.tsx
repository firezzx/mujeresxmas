import { Eyebrow, PageHero } from "@/components/page-hero";
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link";
import { ShimmerLink } from "@/components/buttons/shimmer-link";
import { ROUTES } from "@/config/navigation";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { DotPattern } from "@/components/ui/dot-pattern";

// Home provisoria: estructura y CTAs listos, a la espera de textos, colores e imágenes de la clienta.
export default function Home() {
  return (
    <main className="relative flex min-h-svh flex-1 flex-col items-center justify-center overflow-hidden px-5 pt-32 pb-20">
      <DotPattern className="text-foreground/15 [mask-image:radial-gradient(520px_circle_at_center,white,transparent)]" />

      <PageHero
        eyebrow={
          <Eyebrow>
            <AnimatedShinyText className="mx-0">
              Capacitar · Relacionar · Incluir
            </AnimatedShinyText>
          </Eyebrow>
        }
        title={
          <>
            Mujeres <span className="text-brand">x</span> Más
          </>
        }
        description="Una comunidad que capacita y conecta a mujeres y emprendedoras. Sumate y crecé con otras."
        actions={
          <>
            <ShimmerLink href={ROUTES.registro} className="w-full sm:w-auto">
              Registrarme en Mujeres x Más
            </ShimmerLink>
            <HoverRevealLink href="/quiero" className="w-full sm:w-auto">
              Conocé QUIERO
            </HoverRevealLink>
          </>
        }
      />
    </main>
  );
}

import { Eyebrow, PageHero } from "@/components/page-hero";
import { PillArrow, PillLink } from "@/components/pill-link";
import { RegistroCta } from "@/components/registro-cta";
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
            <RegistroCta className="h-14 w-full px-7 sm:w-auto" />
            <PillLink href="/quiero" variant="outline" size="xl" className="w-full sm:w-auto">
              Conocé QUIERO
              <PillArrow />
            </PillLink>
          </>
        }
      />
    </main>
  );
}

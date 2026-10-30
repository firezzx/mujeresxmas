import { BrandHighlight, Eyebrow, PageHero } from "@/components/page-hero";
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link";
import { FloatingRegisterCta, RegisterCta } from "@/components/cta/register-cta";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Particles } from "@/components/ui/particles";
import { BRAND_HEX } from "@/config/brand-effects";

const HERO_CTA_ID = "cta-registro";

// Home provisoria: estructura y CTAs listos, a la espera de textos, colores e imágenes de la clienta.
export default function Home() {
  return (
    <main className="relative flex min-h-svh flex-1 flex-col items-center justify-center overflow-hidden px-5 pt-32 pb-20">
      <DotPattern className="text-foreground/15 [mask-image:radial-gradient(520px_circle_at_center,white,transparent)]" />
      {/* Partículas de marca que reaccionan suave al mouse */}
      <Particles className="absolute inset-0" quantity={70} staticity={40} ease={60} size={0.6} color={BRAND_HEX.brand} />

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
            Mujeres <BrandHighlight>x</BrandHighlight> Más
          </>
        }
        description="Una comunidad que capacita y conecta a mujeres y emprendedoras. Sumate y crecé con otras."
        actions={
          <>
            <RegisterCta id={HERO_CTA_ID} className="w-full sm:w-auto" />
            <HoverRevealLink href="/quiero" className="w-full sm:w-auto">
              Conocé QUIERO
            </HoverRevealLink>
          </>
        }
      />

      <FloatingRegisterCta watchId={HERO_CTA_ID} />
    </main>
  );
}

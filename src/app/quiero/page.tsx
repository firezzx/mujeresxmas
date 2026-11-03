import type { Metadata } from "next";

import { GridSection, HeroGlow } from "@/components/grid-section";
import { Eyebrow, PageHero } from "@/components/page-hero";
import { SessionCta } from "@/components/cta/session-cta";
import { CoolMode } from "@/components/ui/cool-mode";
import { Ripple } from "@/components/ui/ripple";
import { SparklesText } from "@/components/ui/sparkles-text";
import { CONFETTI_COLORS, SPARKLE_COLORS } from "@/config/brand-effects";
import { ROUTES } from "@/config/navigation";

export const metadata: Metadata = {
  title: "QUIERO",
  description:
    "QUIERO acompaña a emprendedoras y feriantes a pasar de vender por redes a tener su tienda online.",
};

// Página provisoria: falta el contenido de la clienta.
// Sin sesión, QUIERO lleva al registro (y al confirmar el correo vuelve acá); con sesión, a la solicitud.
export default function QuieroPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <GridSection first last>
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pt-32 pb-20">
          <HeroGlow />
          <Ripple
            mainCircleSize={260}
            mainCircleOpacity={0.14}
            numCircles={6}
            className="[mask-image:radial-gradient(560px_circle_at_center,white,transparent)]"
          />

          <PageHero
            eyebrow={<Eyebrow>Un producto de Mujeres x Más</Eyebrow>}
            title={
              <SparklesText
                colors={SPARKLE_COLORS}
                sparklesCount={8}
                className="text-[length:inherit] font-[inherit]"
              >
                QUIERO
              </SparklesText>
            }
            description="De vender por redes a tener tu tienda online. Te acompañamos en cada paso."
            actions={
              // Al tocar QUIERO salen partículas con los colores de la marca (Cool Mode de Magic UI)
              <CoolMode
                options={{ colors: CONFETTI_COLORS, particleCount: 24 }}
                className="w-full sm:w-auto"
              >
                <SessionCta
                  className="w-full px-12 sm:w-auto"
                  guest={{
                    href: `${ROUTES.registro}?next=${ROUTES.quiero}`,
                    label: "QUIERO",
                  }}
                  member={{ href: ROUTES.quieroSolicitud, label: "QUIERO" }}
                />
              </CoolMode>
            }
          />
        </div>
      </GridSection>
    </main>
  );
}

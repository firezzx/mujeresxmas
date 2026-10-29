import Link from "next/link";

import { RegistroCta } from "@/components/registro-cta";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

const PILARES = ["Capacitar", "Relacionar", "Incluir"];

// Home provisoria: estructura y CTAs listos, a la espera de textos, colores e imágenes de la clienta.
export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        )}
      />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-8 text-center">
        <BlurFade delay={0.1} inView>
          <div className="rounded-full border px-4 py-1 text-sm">
            <AnimatedShinyText>{PILARES.join(" · ")}</AnimatedShinyText>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Mujeres x Más
          </h1>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <p className="text-lg text-muted-foreground">
            Una comunidad que capacita y conecta a mujeres y emprendedoras.
            Sumate y crecé con otras.
          </p>
        </BlurFade>

        <BlurFade delay={0.4} inView>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <RegistroCta />
            <Link
              href="/quiero"
              className="text-base font-medium underline-offset-4 hover:underline"
            >
              Conocé QUIERO →
            </Link>
          </div>
        </BlurFade>
      </div>
    </main>
  );
}

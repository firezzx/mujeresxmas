import type { Metadata } from "next";

import { SessionCta } from "@/components/cta/session-cta";
import { Band, GhostWord, PhotoDuo, PhotoTile, SectionTitle } from "@/components/page-band";
import { BrandHighlight, Eyebrow, HERO_TITLE_CLASS } from "@/components/page-hero";
import { BlurFade } from "@/components/ui/blur-fade";
import { CoolMode } from "@/components/ui/cool-mode";
import { Ripple } from "@/components/ui/ripple";
import { SparklesText } from "@/components/ui/sparkles-text";
import { BRAND_HEX, CONFETTI_COLORS } from "@/config/brand-effects";
import { ROUTES } from "@/config/navigation";
import { QUIERO_PAGE } from "@/content/quiero";

export const metadata: Metadata = {
  title: "QUIERO",
  description:
    "QUIERO acompaña a emprendedoras y feriantes a pasar de vender por redes a tener su tienda online.",
};

// Al tocar QUIERO salen partículas con los colores de la marca (Cool Mode de Magic UI).
// Sin sesión lleva al registro (y al confirmar el correo vuelve acá); con sesión, a la solicitud.
function QuieroCta() {
  return (
    <CoolMode
      options={{ colors: CONFETTI_COLORS, particleCount: 24 }}
      className="w-full sm:w-auto"
    >
      <SessionCta
        className="w-full px-12 sm:w-auto"
        guest={{
          href: `${ROUTES.registro}?next=${ROUTES.quiero}`,
          label: QUIERO_PAGE.cta,
        }}
        member={{ href: ROUTES.quieroSolicitud, label: QUIERO_PAGE.cta }}
      />
    </CoolMode>
  );
}

// Página provisoria: falta el contenido de la clienta (ver src/content/quiero.ts).
export default function QuieroPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <section className="relative overflow-hidden bg-brand">
        <Ripple
          mainCircleSize={320}
          mainCircleOpacity={0.12}
          numCircles={5}
          className="[mask-image:radial-gradient(70%_70%_at_50%_50%,white,transparent)]"
        />
        <GhostWord word={QUIERO_PAGE.title} />
        <div className="relative mx-auto grid w-full max-w-content items-center gap-14 px-5 pt-28 pb-24 sm:px-8 md:grid-cols-2 md:pt-36 md:pb-32 lg:px-9">
          <div className="flex flex-col items-start gap-6">
            <BlurFade inView>
              <Eyebrow>{QUIERO_PAGE.eyebrow}</Eyebrow>
            </BlurFade>
            <BlurFade inView delay={0.06}>
              <h1 className="font-heading text-7xl leading-none font-semibold tracking-[-0.03em] sm:text-8xl xl:text-[8.5rem]">
                <SparklesText
                  colors={{ first: BRAND_HEX.white, second: BRAND_HEX.pink }}
                  sparklesCount={8}
                  className="text-[length:inherit] font-[inherit]"
                >
                  {QUIERO_PAGE.title}
                </SparklesText>
              </h1>
            </BlurFade>
            <BlurFade inView delay={0.12}>
              <p className="max-w-lg text-lg leading-relaxed text-pretty sm:text-xl">
                {QUIERO_PAGE.description}
              </p>
            </BlurFade>
            <BlurFade inView delay={0.18} className="w-full">
              <QuieroCta />
            </BlurFade>
          </div>
          <BlurFade inView delay={0.1}>
            <PhotoDuo {...QUIERO_PAGE.photos} priority />
          </BlurFade>
        </div>
      </section>

      <Band>
        <SectionTitle
          title={QUIERO_PAGE.stepsTitle}
          highlight={QUIERO_PAGE.stepsHighlight}
          highlightStyle={{ action: "underline", color: BRAND_HEX.brand }}
        />
        <ul className="grid auto-rows-[15rem] grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3 lg:auto-rows-[20rem]">
          {QUIERO_PAGE.steps.map((step, index) => (
            <li key={step.title} className="min-w-0">
              <PhotoTile {...step} index={index} />
            </li>
          ))}
        </ul>
      </Band>

      <Band tone="pink" dots className="flex flex-col items-center gap-8 text-center">
        <BlurFade inView>
          <h2 className={HERO_TITLE_CLASS}>
            {QUIERO_PAGE.closingTitle}{" "}
            <BrandHighlight>{QUIERO_PAGE.closingHighlight}</BrandHighlight>
          </h2>
        </BlurFade>
        <QuieroCta />
      </Band>
    </main>
  );
}

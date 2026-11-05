import type { Metadata } from "next";

import { SessionCta } from "@/components/cta/session-cta";
import { cycleTone, IconBadge } from "@/components/icon-badge";
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon";
import { Band, Photo, SectionTitle, ZigzagEdge } from "@/components/page-band";
import { Eyebrow, HERO_TITLE_CLASS } from "@/components/page-hero";
import { BlurFade } from "@/components/ui/blur-fade";
import { ROUTES } from "@/config/navigation";
import { QUIERO_PAGE } from "@/content/quiero";

export const metadata: Metadata = {
  title: "QUIERO",
  description:
    "QUIERO acompaña a emprendedoras y feriantes a pasar de vender por redes a tener su tienda online.",
};

// Sin sesión lleva al registro (y al confirmar el correo vuelve acá); con sesión, a la solicitud.
function QuieroCta() {
  return (
    <SessionCta
      className="w-full px-12 sm:w-auto"
      guest={{
        href: `${ROUTES.registro}?next=${ROUTES.quiero}`,
        label: QUIERO_PAGE.cta,
      }}
      member={{ href: ROUTES.quieroSolicitud, label: QUIERO_PAGE.cta }}
    />
  );
}

// Página provisoria: falta el contenido de la clienta (ver src/content/quiero.ts).
export default function QuieroPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <section className="relative overflow-hidden bg-brand-green">
        <ZigzagEdge />
        <div className="relative mx-auto grid w-full max-w-content items-center gap-14 px-5 pt-28 pb-24 sm:px-8 md:grid-cols-2 md:pt-36 md:pb-32 lg:px-9">
          <div className="flex flex-col items-start gap-6">
            <BlurFade inView>
              <Eyebrow>{QUIERO_PAGE.eyebrow}</Eyebrow>
            </BlurFade>
            <BlurFade inView delay={0.06}>
              <h1 className="font-heading text-6xl leading-none font-semibold tracking-[-0.01em] sm:text-7xl">
                {QUIERO_PAGE.title}
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
            <Photo src={QUIERO_PAGE.image} alt={QUIERO_PAGE.imageAlt} priority sizes="(min-width: 768px) 45vw, 100vw" />
          </BlurFade>
        </div>
      </section>

      <Band>
        <SectionTitle title={`${QUIERO_PAGE.stepsTitle} ${QUIERO_PAGE.stepsHighlight}`} />
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-10 md:grid-cols-3">
          {QUIERO_PAGE.steps.map((step, index) => (
            <li key={step.title} className="min-w-0">
              <BlurFade inView delay={index * 0.06}>
                <IconHoverArea className="flex flex-col gap-4">
                  <IconBadge tone={cycleTone(index + 1)}>
                    <HoverIcon name={step.icon} size={22} />
                  </IconBadge>
                  <h3 className="font-heading text-2xl leading-[1.1] font-semibold">{step.title}</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">{step.text}</p>
                </IconHoverArea>
              </BlurFade>
            </li>
          ))}
        </ul>
      </Band>

      <Band tone="pink" className="flex flex-col items-center gap-8 text-center">
        <BlurFade inView>
          <h2 className={HERO_TITLE_CLASS}>
            {QUIERO_PAGE.closingTitle} {QUIERO_PAGE.closingHighlight}
          </h2>
        </BlurFade>
        <QuieroCta />
      </Band>
    </main>
  );
}

import type { Metadata } from "next"
import Image from "next/image"

import { SessionCta } from "@/components/cta/session-cta"
import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { HEADING_CLASS, Pill, SectionHeading } from "@/components/landing/landing-ui"
import { ProductCollage } from "@/components/landing/product-collage"
import { HeroLights, ScreenClosing, ScreenSection } from "@/components/landing/screen"
import { BandBackdrop } from "@/components/page-band"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import { KIERO_PAGE } from "@/content/kiero"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Kiero",
  description: "Kiero acompaña a emprendedoras y feriantes a pasar de vender por redes a tener su tienda online.",
}

// Sin sesión lleva al registro (y al confirmar el correo vuelve acá); con sesión, a la solicitud.
function KieroCta() {
  return (
    <SessionCta
      className="w-full px-12 sm:w-auto"
      guest={{ href: `${ROUTES.registro}?next=${ROUTES.kiero}`, label: KIERO_PAGE.cta }}
      member={{ href: ROUTES.kieroSolicitud, label: KIERO_PAGE.cta }}
    />
  )
}

// Paso del camino: foto alta con el número, el ícono y el texto sobre un velo
function StepCard({ step, index }: { step: (typeof KIERO_PAGE.steps)[number]; index: number }) {
  return (
    <IconHoverArea className="group relative isolate flex h-80 flex-col justify-between overflow-hidden rounded-xl p-5 text-white lg:h-full lg:p-6">
      <Image
        src={step.image}
        alt=""
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className="-z-20 object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-primary/85 via-primary/30 to-transparent"
      />
      <div className="flex items-start justify-between gap-4">
        <span className="surface-light w-fit rounded-xl bg-background p-1.5">
          <IconBadge tone={cycleTone(index)}>
            <HoverIcon name={step.icon} size={22} />
          </IconBadge>
        </span>
        <span className={cn(HEADING_CLASS, "text-6xl leading-none text-white/90")}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className={cn(HEADING_CLASS, "text-3xl lg:text-4xl")}>{step.title}</h3>
        <p className="text-base leading-snug text-pretty text-white/85">{step.text}</p>
      </div>
    </IconHoverArea>
  )
}

// Kiero con el estilo del inicio, una pantalla por bloque. Los textos son provisorios hasta tener
// el contenido de la clienta (ver src/content/kiero.ts).
export default function KieroPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <ScreenSection backdrop={<HeroLights />} innerClassName="pt-32 lg:pt-28">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start">
            <BlurFade>
              <Pill className="bg-brand text-brand-foreground">{KIERO_PAGE.eyebrow}</Pill>
            </BlurFade>
            <BlurFade delay={0.06}>
              <h1 className={cn(HEADING_CLASS, "mt-7 text-7xl leading-none sm:text-8xl xl:text-9xl")}>
                {KIERO_PAGE.title}
              </h1>
            </BlurFade>
            <BlurFade delay={0.12}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
                {KIERO_PAGE.description}
              </p>
            </BlurFade>
            <BlurFade delay={0.18} className="mt-9 w-full sm:w-auto">
              <KieroCta />
            </BlurFade>
          </div>
          <BlurFade delay={0.1}>
            <ProductCollage ringClass="ring-background" priority />
          </BlurFade>
        </div>
      </ScreenSection>

      <ScreenSection backdrop={<BandBackdrop tone="soft" />}>
        <SectionHeading title={KIERO_PAGE.stepsTitle} accent={KIERO_PAGE.stepsHighlight} className="lg:mb-12" />
        <ol className="grid gap-4 md:grid-cols-3 lg:h-[min(32rem,56svh)]">
          {KIERO_PAGE.steps.map((step, index) => (
            <li key={step.title} className="min-w-0">
              <BlurFade inView delay={index * 0.08} className="h-full">
                <StepCard step={step} index={index} />
              </BlurFade>
            </li>
          ))}
        </ol>
      </ScreenSection>

      <ScreenClosing title={KIERO_PAGE.closingTitle} highlight={KIERO_PAGE.closingHighlight}>
        <KieroCta />
      </ScreenClosing>
    </main>
  )
}

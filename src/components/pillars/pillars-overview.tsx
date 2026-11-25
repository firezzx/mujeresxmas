import Image from "next/image"

import { ArrowLink, HEADING_CLASS, Pill, SectionHeading } from "@/components/landing/landing-ui"
import { HeroLights, JoinActions, ScreenClosing, ScreenSection } from "@/components/landing/screen"
import { BandBackdrop, PAGE_WIDTH_CLASS } from "@/components/page-band"
import { Academy, PillarCard, PillarTag, ServiceGrid } from "@/components/pillars/pillar-blocks"
import { BlurFade } from "@/components/ui/blur-fade"
import { PILLAR_CLOSING, PILLARS, PILLAR_LIST, PILLARS_PAGE, type Pillar } from "@/content/pilares"
import { cn } from "@/lib/utils"

// Página de los pilares con el estilo del inicio: portada centrada con las tres fotos, una pantalla
// por pilar (foto grande y servicios en tarjetas de color), la Academia y el cierre en negro.

function Hero() {
  return (
    <section className="relative isolate flex flex-col overflow-hidden lg:h-svh lg:min-h-[46rem] lg:max-h-[68rem]">
      <HeroLights />
      <div className={cn(PAGE_WIDTH_CLASS, "flex flex-col items-center pt-32 text-center md:pt-36")}>
        <BlurFade>
          <Pill>{PILLARS_PAGE.eyebrow}</Pill>
        </BlurFade>
        <BlurFade delay={0.06}>
          <h1 className={cn(HEADING_CLASS, "mt-7 max-w-4xl text-[2.9rem] leading-[0.98] sm:text-7xl xl:text-[5.5rem]")}>
            {PILLARS_PAGE.titleStart} <span className="text-brand-green-strong">{PILLARS_PAGE.titleHighlight}</span>
          </h1>
        </BlurFade>
        <BlurFade delay={0.12}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
            {PILLARS_PAGE.description}
          </p>
        </BlurFade>
        <BlurFade delay={0.18} className="mt-9 w-full sm:w-auto">
          <JoinActions />
        </BlurFade>
      </div>

      {/* Las tres fotos, cada una lleva a su pilar más abajo */}
      <div className={cn(PAGE_WIDTH_CLASS, "mt-14 pb-6 lg:mt-12 lg:min-h-0 lg:flex-1 lg:pb-8")}>
        <ul className="grid gap-4 md:grid-cols-3 lg:h-full">
          {PILLAR_LIST.map((pillar, index) => (
            <li key={pillar.slug} className="min-w-0">
              <BlurFade delay={0.2 + index * 0.06} className="h-full">
                <PillarCard pillar={pillar} href={`#${pillar.slug}`} priority className="lg:min-h-64" />
              </BlurFade>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// Foto grande del pilar: en escritorio toma el alto de las tarjetas de al lado
function PillarPhoto({ pillar, children }: { pillar: Pillar; children?: React.ReactNode }) {
  return (
    <BlurFade inView className="h-full">
      <div className="relative aspect-[4/3] h-full overflow-hidden rounded-xl lg:aspect-auto lg:min-h-80">
        <Image
          src={pillar.image}
          alt={pillar.imageAlt}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
        <PillarTag pillar={pillar} className="absolute bottom-4 left-4" />
        {children}
      </div>
    </BlurFade>
  )
}

function PillarScreen({
  pillar,
  number,
  reverse = false,
  backdrop,
  children,
}: {
  pillar: Pillar
  number: number
  reverse?: boolean
  backdrop?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <ScreenSection id={pillar.slug} backdrop={backdrop}>
      <SectionHeading
        align="left"
        className="lg:mb-10"
        eyebrow={`${PILLARS_PAGE.pillarEyebrow} ${String(number).padStart(2, "0")} · ${pillar.name}`}
        title={pillar.hero.titleStart}
        accent={pillar.hero.titleHighlight}
        description={pillar.hero.description}
        action={
          <ArrowLink href={pillar.href}>
            {PILLARS_PAGE.moreLabel} {pillar.name}
          </ArrowLink>
        }
      />
      <div
        className={cn(
          "grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-6",
          reverse && "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
        )}
      >
        <div className={cn(reverse && "lg:order-last")}>
          <PillarPhoto pillar={pillar}>{children}</PillarPhoto>
        </div>
        <ServiceGrid items={pillar.services.items} />
      </div>
    </ScreenSection>
  )
}

// El dato de la red de Conexión: tarjeta blanca sobre la foto, con el número en naranja
function NetworkStat() {
  const { value, label } = PILLARS_PAGE.networkStat
  return (
    <div className="absolute top-4 left-4 flex max-w-[15rem] flex-col gap-1 rounded-xl bg-background p-4 shadow-[0_24px_48px_-20px_rgb(26_26_26/0.5)] sm:p-5">
      <p className={cn(HEADING_CLASS, "text-5xl leading-none text-brand")}>{value}</p>
      <p className="text-sm leading-snug text-pretty">{label}</p>
    </div>
  )
}

export function PillarsOverview() {
  const { desarrollo, bienestar, conexion } = PILLARS
  return (
    <main className="relative flex flex-1 flex-col">
      <Hero />
      <PillarScreen pillar={desarrollo} number={1} />
      <Academy pillar={desarrollo} />
      <PillarScreen pillar={bienestar} number={2} reverse backdrop={<BandBackdrop tone="soft" />} />
      <PillarScreen pillar={conexion} number={3}>
        <NetworkStat />
      </PillarScreen>
      <ScreenClosing
        hand={PILLARS_PAGE.closingHand}
        title={PILLARS_PAGE.closingTitle}
        highlight={PILLARS_PAGE.closingHighlight}
        description={PILLAR_CLOSING.description}
      >
        <JoinActions />
      </ScreenClosing>
    </main>
  )
}

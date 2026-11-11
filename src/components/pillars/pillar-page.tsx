import Image from "next/image"

import { HEADING_CLASS, Pill, SectionHeading } from "@/components/landing/landing-ui"
import { HeroLights, JoinActions, ScreenClosing, ScreenSection } from "@/components/landing/screen"
import { BandBackdrop, PAGE_WIDTH_CLASS } from "@/components/page-band"
import { Academy, PillarCard, PillarTag, ServiceGrid } from "@/components/pillars/pillar-blocks"
import { BlurFade } from "@/components/ui/blur-fade"
import { HOME_PILLARS } from "@/content/home"
import { PILLAR_CLOSING, PILLAR_LIST, PILLARS_PAGE, type Pillar } from "@/content/pilares"
import { cn } from "@/lib/utils"

// Página de un pilar con el estilo del inicio, una pantalla por bloque: portada con la foto grande,
// los servicios en tarjetas de color, la Academia (solo Desarrollo), los otros pilares y el cierre.

function Hero({ pillar }: { pillar: Pillar }) {
  return (
    <section className="relative isolate overflow-hidden lg:h-svh lg:min-h-[44rem] lg:max-h-[64rem]">
      <HeroLights />
      <div
        className={cn(
          PAGE_WIDTH_CLASS,
          "grid h-full gap-12 pt-32 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:pt-28 lg:pb-12"
        )}
      >
        <div className="flex flex-col items-start">
          <BlurFade>
            <Pill>
              {PILLARS_PAGE.pillarEyebrow} · {pillar.name}
            </Pill>
          </BlurFade>
          <BlurFade delay={0.06}>
            <h1 className={cn(HEADING_CLASS, "mt-7 text-[2.9rem] leading-[0.98] sm:text-7xl xl:text-[5.25rem]")}>
              {pillar.hero.titleStart} <span className="text-brand-green-strong">{pillar.hero.titleHighlight}</span>
            </h1>
          </BlurFade>
          <BlurFade delay={0.12}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
              {pillar.hero.description}
            </p>
          </BlurFade>
          <BlurFade delay={0.18} className="mt-9 w-full sm:w-auto">
            <JoinActions plansLabel={PILLAR_CLOSING.plansCta} className="sm:justify-start" />
          </BlurFade>
        </div>

        {/* Foto grande con el rótulo y para quién es */}
        <BlurFade delay={0.15} className="h-full lg:max-h-[42rem]">
          <div className="relative aspect-[4/5] h-full overflow-hidden rounded-xl sm:aspect-[4/3] lg:aspect-auto">
            <Image
              src={pillar.image}
              alt={pillar.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <PillarTag pillar={pillar} className="absolute top-4 left-4" />
            <div className="absolute right-4 bottom-4 left-4 max-w-sm rounded-xl bg-background p-5 shadow-[0_24px_48px_-20px_rgb(26_26_26/0.5)] sm:left-auto">
              <p className="font-hand text-2xl leading-none font-semibold text-brand-green-strong">
                {HOME_PILLARS.forYouLabel}…
              </p>
              <p className="mt-2 text-base leading-snug text-pretty">{pillar.forYou}</p>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

export function PillarPage({ pillar }: { pillar: Pillar }) {
  const others = PILLAR_LIST.filter((other) => other.slug !== pillar.slug)
  return (
    <main className="relative flex flex-1 flex-col">
      <Hero pillar={pillar} />

      <ScreenSection backdrop={<BandBackdrop tone="soft" />}>
        <SectionHeading
          eyebrow={`${PILLARS_PAGE.pillarEyebrow} ${pillar.name}`}
          title={pillar.services.title}
          description={pillar.services.description}
          className="lg:mb-12"
        />
        <ServiceGrid items={pillar.services.items} full />
      </ScreenSection>

      <Academy pillar={pillar} showLink={false} />

      {/* Los otros dos pilares, en fotos grandes */}
      <ScreenSection>
        <SectionHeading align="left" title={PILLAR_CLOSING.othersTitle} className="lg:mb-10" />
        <ul className="grid gap-4 md:grid-cols-2 lg:h-[min(36rem,58svh)]">
          {others.map((other, index) => (
            <li key={other.slug} className="min-w-0">
              <BlurFade inView delay={index * 0.08} className="h-full">
                <PillarCard pillar={other} summary className="h-96" />
              </BlurFade>
            </li>
          ))}
        </ul>
      </ScreenSection>

      <ScreenClosing
        hand={PILLAR_CLOSING.hand}
        title={PILLAR_CLOSING.title}
        highlight={PILLAR_CLOSING.titleHighlight}
        description={PILLAR_CLOSING.description}
      >
        <JoinActions plansLabel={PILLAR_CLOSING.plansCta} />
      </ScreenClosing>
    </main>
  )
}

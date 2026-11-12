import { Suspense } from "react"

import { RegisterCta } from "@/components/cta/register-cta"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { cardClass, HEADING_CLASS, Pill, SectionHeading } from "@/components/landing/landing-ui"
import { HeroLights, ScreenClosing, ScreenSection } from "@/components/landing/screen"
import { BandBackdrop } from "@/components/page-band"
import { PillarCard } from "@/components/pillars/pillar-blocks"
import { PlansList, PlansListSkeleton } from "@/components/plans/plans-list"
import { BlurFade } from "@/components/ui/blur-fade"
import { HOME_PILLARS, HOME_PLANS } from "@/content/home"
import { PILLAR_CLOSING, PILLAR_LIST } from "@/content/pilares"
import { PLANS_PAGE } from "@/content/planes"
import { cn } from "@/lib/utils"

// Página de planes con el estilo del inicio, una pantalla por bloque: título y planes, los
// beneficios de la membresía, qué incluye (los tres pilares) y el cierre en negro.

function Hero() {
  const { title } = PLANS_PAGE
  return (
    <ScreenSection backdrop={<HeroLights />} innerClassName="pt-32 lg:pt-20 lg:pb-8">
      <div className="mx-auto mb-12 flex max-w-4xl flex-col items-center text-center lg:mb-5">
        <BlurFade>
          <Pill>{PLANS_PAGE.eyebrow}</Pill>
        </BlurFade>
        <BlurFade delay={0.06}>
          <h1 className={cn(HEADING_CLASS, "mt-5 text-[2.75rem] leading-[0.98] sm:text-6xl xl:text-[3.5rem]")}>
            {title.start}
            <span className="text-brand-green-strong">{title.highlight}</span>
            {title.end}
          </h1>
        </BlurFade>
        <BlurFade delay={0.12}>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {PLANS_PAGE.description}
          </p>
        </BlurFade>
      </div>
      <Suspense fallback={<PlansListSkeleton />}>
        <PlansList />
      </Suspense>
    </ScreenSection>
  )
}

// Beneficios de la membresía: el título a la izquierda y las dos tarjetas grandes a la derecha
function Perks() {
  return (
    <ScreenSection backdrop={<BandBackdrop tone="soft" />}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow={HOME_PLANS.eyebrow}
          title={HOME_PLANS.title}
          accent={HOME_PLANS.titleHighlight}
          description={HOME_PLANS.description}
          className="mb-0 md:mb-0"
        />
        <ul className="flex flex-col gap-4">
          {HOME_PLANS.perks.map((perk, index) => (
            <li key={perk.title} className="min-w-0">
              <BlurFade inView delay={index * 0.08}>
                <IconHoverArea
                  className={cardClass(
                    index === 0 ? "orange" : "green",
                    "flex flex-col gap-5 p-7 transition-transform duration-500 ease-premium hover:-translate-y-1 sm:flex-row sm:p-8"
                  )}
                >
                  <IconBadge tone={index === 0 ? "brand" : "green"} size="lg">
                    <HoverIcon name={perk.icon} size={24} />
                  </IconBadge>
                  <div className="flex min-w-0 flex-col gap-2">
                    <p className="font-hand text-2xl leading-none font-semibold">{perk.hand}</p>
                    <h3 className={cn(HEADING_CLASS, "text-2xl sm:text-3xl")}>{perk.title}</h3>
                    <p className="text-base leading-relaxed text-pretty">{perk.text}</p>
                  </div>
                </IconHoverArea>
              </BlurFade>
            </li>
          ))}
        </ul>
      </div>
    </ScreenSection>
  )
}

// Qué incluye: los tres pilares en fotos grandes que llevan a su página
function Included() {
  return (
    <ScreenSection>
      <SectionHeading
        eyebrow={HOME_PILLARS.eyebrow}
        title={HOME_PILLARS.title}
        accent={HOME_PILLARS.titleHighlight}
        description={HOME_PILLARS.description}
        className="lg:mb-12"
      />
      <ul className="grid gap-4 md:grid-cols-3 lg:h-[min(30rem,50svh)]">
        {PILLAR_LIST.map((pillar, index) => (
          <li key={pillar.slug} className="min-w-0">
            <BlurFade inView delay={index * 0.08} className="h-full">
              <PillarCard pillar={pillar} />
            </BlurFade>
          </li>
        ))}
      </ul>
    </ScreenSection>
  )
}

export function PlansPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <Hero />
      <Perks />
      <Included />
      <ScreenClosing
        hand={PILLAR_CLOSING.hand}
        title={PILLAR_CLOSING.title}
        highlight={PILLAR_CLOSING.titleHighlight}
        description={PILLAR_CLOSING.description}
      >
        <RegisterCta className="w-full sm:w-auto" />
      </ScreenClosing>
    </main>
  )
}

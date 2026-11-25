import { Suspense } from "react"

import { RegisterCta } from "@/components/cta/register-cta"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { ArrowLink, cardClass, HEADING_CLASS, SectionHeading } from "@/components/landing/landing-ui"
import { HeroLights, ScreenClosing, ScreenSection } from "@/components/landing/screen"
import { BandBackdrop, PAGE_WIDTH_CLASS } from "@/components/page-band"
import { FaqAccordion } from "@/components/faq-accordion"
import { ComparisonTabs } from "@/components/plans/comparison-tabs"
import { MomentChooser } from "@/components/plans/moment-chooser"
import { PlansList, PlansListSkeleton } from "@/components/plans/plans-list"
import { BlurFade } from "@/components/ui/blur-fade"
import { PLANS_ANCHOR } from "@/config/navigation"
import {
  MEMBERSHIP_CLOSING,
  MEMBERSHIP_COMPARISON,
  MEMBERSHIP_FAQ,
  MEMBERSHIP_PAGE,
  MEMBERSHIP_PERKS,
} from "@/content/membresia"
import { cn } from "@/lib/utils"

// Página de Membresía. El recorrido: elegir según el momento (resalta la tarjeta recomendada),
// comparar pilar por pilar, ver los beneficios extra, sacarse las dudas y crear la cuenta.

function Hero() {
  return (
    <ScreenSection backdrop={<HeroLights />} innerClassName="pt-32 lg:pt-24 lg:pb-10">
      <div className="mx-auto mb-8 flex max-w-3xl flex-col items-center text-center">
        <BlurFade>
          <p className="font-hand text-3xl leading-none font-semibold text-brand-green-strong sm:text-4xl">
            {MEMBERSHIP_PAGE.hand}
          </p>
        </BlurFade>
        <BlurFade delay={0.06}>
          <h1 className={cn(HEADING_CLASS, "mt-4 text-[2.75rem] leading-[0.98] sm:text-6xl xl:text-[3.75rem]")}>
            {MEMBERSHIP_PAGE.title} <span className="text-brand-green-strong">{MEMBERSHIP_PAGE.titleHighlight}</span>
          </h1>
        </BlurFade>
        <BlurFade delay={0.12}>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {MEMBERSHIP_PAGE.description}
          </p>
        </BlurFade>
      </div>
      {/* Destino de todos los "Sumate a MX+" del sitio */}
      <div id={PLANS_ANCHOR} className="scroll-mt-28" />
      <BlurFade delay={0.18}>
        <MomentChooser>
          <Suspense fallback={<PlansListSkeleton />}>
            <PlansList />
          </Suspense>
        </MomentChooser>
      </BlurFade>
    </ScreenSection>
  )
}

function Comparison() {
  return (
    <ScreenSection id="comparativa" backdrop={<BandBackdrop tone="soft" />}>
      <SectionHeading
        eyebrow={MEMBERSHIP_COMPARISON.eyebrow}
        title={MEMBERSHIP_COMPARISON.title}
        accent={MEMBERSHIP_COMPARISON.titleHighlight}
        description={MEMBERSHIP_COMPARISON.description}
        className="lg:mb-10"
      />
      <BlurFade inView className="mx-auto w-full max-w-5xl">
        <ComparisonTabs />
      </BlurFade>
    </ScreenSection>
  )
}

// Franja corta: los tres beneficios en una sola tarjeta, separados por líneas finas
function Perks() {
  return (
    <section className={cn(PAGE_WIDTH_CLASS, "relative py-20 md:py-24")}>
      <BlurFade inView>
        <h2 className={cn(HEADING_CLASS, "text-3xl sm:text-4xl")}>
          {MEMBERSHIP_PERKS.title} <span className="text-brand-green-strong">{MEMBERSHIP_PERKS.titleHighlight}</span>
        </h2>
      </BlurFade>
      <BlurFade inView delay={0.08}>
        <ul
          className={cardClass(
            "white",
            "mt-8 grid divide-y divide-foreground/[0.07] md:grid-cols-3 md:divide-x md:divide-y-0"
          )}
        >
          {MEMBERSHIP_PERKS.items.map((perk) => (
            <li key={perk.title} className="min-w-0">
              <IconHoverArea className="flex h-full flex-col gap-4 p-7">
                <div className="flex items-center gap-3">
                  <IconBadge tone={perk.tone}>
                    <HoverIcon name={perk.icon} size={22} />
                  </IconBadge>
                  <p className="font-hand text-2xl leading-none font-semibold">{perk.hand}</p>
                </div>
                <h3 className={cn(HEADING_CLASS, "text-2xl")}>{perk.title}</h3>
                <p className="flex-1 text-[15px] leading-relaxed text-pretty text-muted-foreground">{perk.text}</p>
                {"link" in perk && perk.link && <ArrowLink href={perk.link.href}>{perk.link.label}</ArrowLink>}
              </IconHoverArea>
            </li>
          ))}
        </ul>
      </BlurFade>
    </section>
  )
}

// Preguntas frecuentes: se abren de a una, con animación
function Faq() {
  if (MEMBERSHIP_FAQ.hidden) return null
  return (
    <ScreenSection backdrop={<BandBackdrop tone="green" />}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <SectionHeading
          align="left"
          title={MEMBERSHIP_FAQ.title}
          accent={MEMBERSHIP_FAQ.titleHighlight}
          description={MEMBERSHIP_FAQ.description}
          className="mb-0 md:mb-0 lg:mb-0 lg:self-start"
        />
        <FaqAccordion items={MEMBERSHIP_FAQ.items} />
      </div>
    </ScreenSection>
  )
}

export function MembershipPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <Hero />
      <Comparison />
      <Perks />
      <Faq />
      <ScreenClosing
        hand={MEMBERSHIP_CLOSING.hand}
        title={MEMBERSHIP_CLOSING.title}
        highlight={MEMBERSHIP_CLOSING.titleHighlight}
        description={MEMBERSHIP_CLOSING.description}
      >
        <RegisterCta className="w-full sm:w-auto" />
      </ScreenClosing>
    </main>
  )
}

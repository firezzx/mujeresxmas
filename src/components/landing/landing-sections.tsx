import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

import { LogoSeal } from "@/components/brand/logo"
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { CountUp } from "@/components/count-up"
import { RegisterCta } from "@/components/cta/register-cta"
import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import {
  ArrowBadge,
  ArrowLink,
  cardClass,
  DarkSection,
  HEADING_CLASS,
  Pill,
  Section,
  SectionHeading,
  type CardTone,
} from "@/components/landing/landing-ui"
import { LatestMembers } from "@/components/latest-members"
import { ScreenSection } from "@/components/landing/screen"
import { BandBackdrop, PAGE_WIDTH_CLASS } from "@/components/page-band"
import { BrandHighlight } from "@/components/page-hero"
import { PlansList, PlansListSkeleton } from "@/components/plans/plans-list"
import { BlurFade } from "@/components/ui/blur-fade"
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity"
import { TextReveal } from "@/components/ui/text-reveal"
import { ROUTES } from "@/config/navigation"
import {
  HOME_CLOSING,
  HOME_CLOSING_CTA_ID,
  HOME_EVOLUTION,
  HOME_HERO,
  HOME_IMPACT,
  HOME_MOMENTS,
  HOME_PILLARS,
  HOME_PLANS,
  HOME_SECTION_IDS,
  HOME_STATEMENT,
  HOME_STEPS,
} from "@/content/home"
import { PILLARS, type Pillar } from "@/content/pilares"
import { cn } from "@/lib/utils"

// ─── Portada ─────────────────────────────────────────────────────────────────────────────

// Portada centrada: aviso, título enorme, bajada, botones y prueba social; abajo, un mosaico parejo
// que mezcla fotos con las cifras de la comunidad. En escritorio ocupa justo el alto de la pantalla:
// el mosaico toma la altura que sobra debajo del texto.
export function LandingHero({ ctaId }: { ctaId: string }) {
  const [first, second, third] = HOME_HERO.photos
  const [women, places, countries] = HOME_IMPACT.stats
  return (
    <section className="relative isolate flex flex-col overflow-hidden lg:h-svh lg:min-h-[50rem] lg:max-h-[72rem]">
      {/* Luces de marca detrás del título */}
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[46rem]">
        <div className="absolute -top-40 left-[8%] size-[36rem] rounded-full bg-brand-green/25 blur-[120px]" />
        <div className="absolute -top-24 right-[6%] size-[32rem] rounded-full bg-brand-soft/45 blur-[120px]" />
        <div className="absolute top-40 left-1/2 size-[18rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[100px]" />
      </div>

      <div className={cn(PAGE_WIDTH_CLASS, "flex shrink-0 flex-col items-center pt-32 text-center lg:pt-32")}>
        <BlurFade>
          <IconHoverArea className="inline-flex">
            <Link
              href={ROUTES.quiero}
              className="inline-flex items-center gap-3 rounded-lg bg-background/80 py-1.5 pr-3 pl-1.5 text-sm shadow-[0_8px_24px_-12px_rgb(26_26_26/0.25)] ring-1 ring-foreground/[0.08] backdrop-blur-sm transition-shadow duration-300 outline-none hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <span className="rounded-md bg-brand px-2 py-0.5 text-xs font-semibold text-brand-foreground">
                {HOME_HERO.noticeTag}
              </span>
              <span className="min-w-0 text-left">{HOME_HERO.notice}</span>
              <HoverIcon name="arrow-right" size={14} />
            </Link>
          </IconHoverArea>
        </BlurFade>

        <BlurFade delay={0.06}>
          <h1 className={cn(HEADING_CLASS, "mt-7 max-w-5xl text-[2.9rem] leading-[0.98] sm:text-7xl xl:text-[5.5rem]")}>
            {HOME_HERO.titleStart} <span className="text-brand-green-strong">{HOME_HERO.titleHighlight}</span>
          </h1>
        </BlurFade>

        <BlurFade delay={0.12}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
            {HOME_HERO.description}
          </p>
        </BlurFade>

        <BlurFade delay={0.18} className="w-full sm:w-auto">
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <RegisterCta id={ctaId} className="w-full sm:w-auto" />
            <HoverRevealLink href={`#${HOME_SECTION_IDS.pillars}`} className="w-full sm:w-auto">
              {HOME_HERO.secondaryCta}
            </HoverRevealLink>
          </div>
        </BlurFade>

        <BlurFade delay={0.24}>
          <div className="mt-7 flex flex-col items-center gap-3">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {HOME_HERO.checks.map((check) => (
                <li key={check} className="flex items-center gap-2">
                  <span className="flex size-4 items-center justify-center text-brand-green-strong">
                    <HoverIcon name="check" size={16} />
                  </span>
                  {check}
                </li>
              ))}
            </ul>
          </div>
        </BlurFade>
      </div>

      {/* Mosaico: fotos y cifras, todas a la misma altura */}
      <BlurFade delay={0.2} className={cn(PAGE_WIDTH_CLASS, "mt-14 pb-6 lg:min-h-0 lg:flex-1 lg:pb-8")}>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5 lg:h-full">
          <div className="relative h-56 overflow-hidden rounded-xl md:h-72 lg:h-full">
            <Image
              src={first.src}
              alt={first.alt}
              fill
              priority
              sizes="(min-width: 768px) 20vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className={cardClass("green", "flex h-56 flex-col justify-between p-5 md:h-72 lg:h-full lg:p-6")}>
            <span className="font-heading text-sm font-semibold">{HOME_IMPACT.label}</span>
            <div>
              <p className={cn(HEADING_CLASS, "text-4xl leading-none lg:text-5xl")}>
                {women.prefix}
                <CountUp value={women.value} delay={0.4} className="tabular-nums" />
              </p>
              <p className="mt-2 text-sm">{women.label}</p>
            </div>
          </div>
          <div className="relative col-span-2 h-72 overflow-hidden rounded-xl md:col-span-1 lg:h-full">
            <Image
              src={second.src}
              alt={second.alt}
              fill
              priority
              sizes="(min-width: 768px) 20vw, 100vw"
              className="object-cover"
            />
            <span className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-lg bg-background/85 px-3 py-2 text-sm font-medium backdrop-blur-md">
              <span aria-hidden className="size-2 rounded-full bg-brand" />
              {countries.value} {countries.label}
            </span>
          </div>
          <div className={cardClass("pink", "flex h-56 flex-col justify-between p-5 md:h-72 lg:h-full lg:p-6")}>
            <p className="font-hand text-2xl leading-tight font-semibold">{HOME_IMPACT.hand}</p>
            <div>
              <p className={cn(HEADING_CLASS, "text-4xl leading-none lg:text-5xl")}>
                {places.prefix}
                <CountUp value={places.value} delay={0.5} className="tabular-nums" />
              </p>
              <p className="mt-2 text-sm">{places.label}</p>
            </div>
          </div>
          <div className="relative h-56 overflow-hidden rounded-xl md:h-72 lg:h-full">
            <Image
              src={third.src}
              alt={third.alt}
              fill
              priority
              sizes="(min-width: 768px) 20vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </BlurFade>
    </section>
  )
}

// ─── Cintas con palabras (las de antes) ──────────────────────────────────────────────────

function RibbonWords({ words, dotClass }: { words: string[]; dotClass: string }) {
  return (
    <span className="flex items-center">
      {[...words, ...words].map((word, index) => (
        <span key={index} className="flex items-center">
          <span className="px-5 font-heading text-2xl font-semibold tracking-[-0.01em] sm:px-8 sm:text-4xl">
            {word}
          </span>
          <span aria-hidden className={cn("size-2.5 rounded-full sm:size-3", dotClass)} />
        </span>
      ))}
    </span>
  )
}

// Dos cintas cruzadas que aceleran al bajar
export function LandingRibbons() {
  return (
    <div aria-hidden className="relative h-40 overflow-x-clip sm:h-52">
      <ScrollVelocityContainer className="absolute inset-0">
        <div className="absolute top-1/2 -left-[5%] w-[110%] -translate-y-1/2 rotate-2 bg-brand-strong py-2.5 text-brand-foreground sm:py-3.5">
          <ScrollVelocityRow baseVelocity={2} direction={-1}>
            <RibbonWords words={HOME_HERO.ribbonBottom} dotClass="bg-background" />
          </ScrollVelocityRow>
        </div>
        <div className="absolute top-1/2 -left-[5%] w-[110%] -translate-y-1/2 -rotate-2 bg-foreground py-2.5 text-background shadow-[0_18px_36px_-16px_rgb(26_26_26/0.6)] sm:py-3.5">
          <ScrollVelocityRow baseVelocity={2}>
            <RibbonWords words={HOME_HERO.ribbonTop} dotClass="bg-brand" />
          </ScrollVelocityRow>
        </div>
      </ScrollVelocityContainer>
    </div>
  )
}

// ─── Pilares (bento) ─────────────────────────────────────────────────────────────────────

function SmallPillarCard({ pillar, tone }: { pillar: Pillar; tone: CardTone }) {
  return (
    <IconHoverArea className="h-full">
      <Link
        href={pillar.href}
        className={cardClass(
          tone,
          "group grid h-full grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-4 p-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/40 sm:p-5"
        )}
      >
        <div className="flex min-w-0 flex-col gap-3 p-1">
          <IconBadge tone={pillar.badgeTone} className="bg-background">
            <HoverIcon name={pillar.icon} size={22} />
          </IconBadge>
          <h3 className={cn(HEADING_CLASS, "mt-auto text-2xl sm:text-3xl")}>{pillar.name}</h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-pretty sm:text-[15px] lg:line-clamp-2">
            {pillar.summary}
          </p>
          <ArrowBadge className="mt-1" />
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src={pillar.image}
            alt={pillar.imageAlt}
            fill
            sizes="(min-width: 768px) 15vw, 40vw"
            className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
          />
        </div>
      </Link>
    </IconHoverArea>
  )
}

export function LandingPillars() {
  const { desarrollo, bienestar, conexion } = PILLARS
  return (
    <Section id={HOME_SECTION_IDS.pillars} className="lg:pt-20 lg:pb-8">
      <SectionHeading
        eyebrow={HOME_PILLARS.eyebrow}
        title={HOME_PILLARS.title}
        accent={HOME_PILLARS.titleHighlight}
        description={HOME_PILLARS.description}
      />
      <div className="grid gap-4 md:grid-cols-2 md:grid-rows-[repeat(2,minmax(18rem,auto))] lg:grid-rows-[repeat(2,minmax(15rem,auto))] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <BlurFade inView className="md:row-span-2">
          <IconHoverArea className="h-full">
            <Link
              href={desarrollo.href}
              className="group relative flex h-full min-h-[26rem] flex-col justify-end lg:min-h-0 overflow-hidden rounded-xl p-6 text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/40 sm:p-8"
            >
              <Image
                src={desarrollo.image}
                alt={desarrollo.imageAlt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="-z-20 object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-linear-to-t from-primary/90 via-primary/40 to-transparent"
              />
              <Pill className="bg-brand-green text-primary">{desarrollo.tag}</Pill>
              <div className="mt-4 flex items-end justify-between gap-6">
                <div className="flex max-w-md flex-col gap-3">
                  <h3 className={cn(HEADING_CLASS, "text-4xl sm:text-5xl")}>{desarrollo.name}</h3>
                  <p className="text-base leading-relaxed text-pretty text-white/85">{desarrollo.summary}</p>
                </div>
                <ArrowBadge />
              </div>
            </Link>
          </IconHoverArea>
        </BlurFade>
        <BlurFade inView delay={0.08} className="h-full">
          <SmallPillarCard pillar={bienestar} tone="pink" />
        </BlurFade>
        <BlurFade inView delay={0.14} className="h-full">
          <SmallPillarCard pillar={conexion} tone="orange" />
        </BlurFade>
      </div>
    </Section>
  )
}

// ─── Momentos ────────────────────────────────────────────────────────────────────────────

const MOMENT_TONES: CardTone[] = ["green", "pink", "orange", "paper"]

export function LandingMoments() {
  return (
    <Section>
      <SectionHeading
        eyebrow={HOME_MOMENTS.eyebrow}
        title={HOME_MOMENTS.title}
        accent={HOME_MOMENTS.titleHighlight}
        description={HOME_MOMENTS.description}
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HOME_MOMENTS.items.map((item, index) => (
          <li key={item.title} className="min-w-0">
            <BlurFade inView delay={index * 0.06} className="h-full">
              <IconHoverArea
                className={cardClass(
                  MOMENT_TONES[index],
                  "flex h-full min-h-64 flex-col gap-4 p-6 transition-transform duration-500 ease-premium hover:-translate-y-1 sm:p-7"
                )}
              >
                <IconBadge tone={cycleTone(index)} className="bg-background">
                  <HoverIcon name={item.icon} size={22} />
                </IconBadge>
                <h3 className={cn(HEADING_CLASS, "mt-auto text-2xl")}>{item.title}</h3>
                <p className="text-[15px] leading-relaxed text-pretty">{item.text}</p>
              </IconHoverArea>
            </BlurFade>
          </li>
        ))}
      </ul>
    </Section>
  )
}

// ─── Cómo funciona ───────────────────────────────────────────────────────────────────────

// Franja oscura: los pasos unidos por un hilo punteado
export function LandingSteps() {
  return (
    <DarkSection>
      <SectionHeading eyebrow={HOME_STEPS.eyebrow} title={HOME_STEPS.title} accent={HOME_STEPS.titleHighlight} />
      <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        {/* Hilo que une los pasos en escritorio */}
        <span
          aria-hidden
          className="absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-brand-green/50 md:block"
        />
        {HOME_STEPS.items.map((step, index) => (
          <li key={step.title} className="relative min-w-0">
            <BlurFade inView delay={0.08 * index} className="flex flex-col items-center gap-4 text-center">
              <IconHoverArea className="flex flex-col items-center gap-4">
                <span className="surface-light relative rounded-xl bg-background p-1.5 shadow-[0_12px_28px_-14px_rgb(26_26_26/0.35)] ring-1 ring-border">
                  <IconBadge tone={cycleTone(index)}>
                    <HoverIcon name={step.icon} size={22} />
                  </IconBadge>
                  <span className="absolute -top-2.5 -right-2.5 flex size-6 items-center justify-center rounded-full bg-foreground font-heading text-xs font-semibold text-background">
                    {index + 1}
                  </span>
                </span>
                <h3 className={cn(HEADING_CLASS, "text-2xl")}>{step.title}</h3>
              </IconHoverArea>
              <p className="max-w-xs text-base leading-relaxed text-pretty text-muted-foreground">{step.text}</p>
            </BlurFade>
          </li>
        ))}
      </ol>
      <BlurFade inView delay={0.1} className="mt-12 flex justify-center">
        <RegisterCta className="w-full sm:w-auto" />
      </BlurFade>
    </DarkSection>
  )
}

// ─── Planes ──────────────────────────────────────────────────────────────────────────────

export function LandingPlans() {
  return (
    <Section id={HOME_SECTION_IDS.plans}>
      {/* En escritorio: título y beneficios a la izquierda, los planes a la derecha */}
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
        <SectionHeading
          align="left"
          eyebrow={HOME_PLANS.eyebrow}
          title={HOME_PLANS.title}
          accent={HOME_PLANS.titleHighlight}
          description={HOME_PLANS.description}
          className="mb-0 md:mb-0 lg:mb-0 lg:self-end"
        />
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Suspense fallback={<PlansListSkeleton />}>
            <PlansList />
          </Suspense>
        </div>
        <div className="flex flex-col gap-4 lg:self-start">
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {HOME_PLANS.perks.map((perk, index) => (
              <li key={perk.title} className="min-w-0">
                <BlurFade inView delay={index * 0.06} className="h-full">
                  <IconHoverArea
                    className={cardClass(index === 0 ? "orange" : "green", "flex h-full gap-4 p-6 lg:p-5")}
                  >
                    <IconBadge tone={index === 0 ? "brand" : "green"} className="bg-background">
                      <HoverIcon name={perk.icon} size={22} />
                    </IconBadge>
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="font-hand text-2xl leading-none font-semibold">{perk.hand}</p>
                      <h3 className={cn(HEADING_CLASS, "text-xl")}>{perk.title}</h3>
                      <p className="text-sm leading-relaxed text-pretty">{perk.text}</p>
                    </div>
                  </IconHoverArea>
                </BlurFade>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-center lg:justify-start">
            <ArrowLink href={ROUTES.planes}>{HOME_PLANS.moreCta}</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ─── Frase que se enciende al bajar ──────────────────────────────────────────────────────

export function LandingStatement() {
  return (
    <section className="relative">
      <div className="sticky top-0 -mb-[100dvh] h-dvh">
        <BandBackdrop tone="soft" />
      </div>
      <TextReveal highlightWords={HOME_STATEMENT.highlightWords}>{HOME_STATEMENT.text}</TextReveal>
    </section>
  )
}

// ─── Nuestra historia ────────────────────────────────────────────────────────────────────

const STORY_DOTS = ["bg-brand-soft", "bg-brand-green", "bg-brand"]

// Franja verde: el título y el sello a la izquierda, lo que se mantiene y lo que crece a la derecha
export function LandingStory() {
  return (
    <ScreenSection backdrop={<BandBackdrop tone="green" />}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            align="left"
            className="mb-0 md:mb-0"
            eyebrow={HOME_EVOLUTION.eyebrow}
            title={HOME_EVOLUTION.title}
            accent={HOME_EVOLUTION.titleHighlight}
            hand={HOME_EVOLUTION.hand}
          />
          {/* Sello oficial: blanco sobre negro y fijo, como pide el manual */}
          <BlurFade inView delay={0.18}>
            <div className="size-28 rounded-full bg-foreground p-1.5 text-background shadow-[0_16px_32px_-12px_rgb(26_26_26/0.6)] sm:size-32">
              <LogoSeal className="size-full" />
            </div>
          </BlurFade>
        </div>
        <ol className="flex flex-col gap-4">
          {HOME_EVOLUTION.items.map((item, index) => (
            <li key={item.title}>
              <BlurFade inView delay={0.08 * index}>
                <div className="flex gap-4 rounded-xl bg-background/85 p-5 shadow-[0_16px_40px_-24px_rgb(26_26_26/0.35)] backdrop-blur-sm sm:p-6">
                  <span aria-hidden className={cn("mt-2 size-2.5 shrink-0 rounded-full", STORY_DOTS[index])} />
                  <div className="flex flex-col gap-1">
                    <h3 className={cn(HEADING_CLASS, "text-xl")}>{item.title}</h3>
                    <p className="text-base leading-relaxed text-pretty text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              </BlurFade>
            </li>
          ))}
        </ol>
      </div>
    </ScreenSection>
  )
}

// ─── Cierre ──────────────────────────────────────────────────────────────────────────────

// Franja oscura con textura a todo el ancho; el contenido queda centrado con el ancho de siempre
export function LandingClosing() {
  return (
    <DarkSection className="text-center">
      <BlurFade inView className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <p className="font-hand text-3xl leading-none font-semibold text-brand-soft sm:text-4xl">
          {HOME_CLOSING.hashtag}
        </p>
        <h2 className={cn(HEADING_CLASS, "text-4xl leading-[1.02] sm:text-6xl lg:text-7xl")}>
          {HOME_CLOSING.title} <BrandHighlight>{HOME_CLOSING.titleHighlight}</BrandHighlight>
        </h2>
        <p className="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">{HOME_CLOSING.description}</p>
        <RegisterCta id={HOME_CLOSING_CTA_ID} label={HOME_CLOSING.cta} className="mt-2 w-full sm:w-auto" />
        <div className="mt-2">
          <LatestMembers />
        </div>
      </BlurFade>
    </DarkSection>
  )
}

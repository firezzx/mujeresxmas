import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

import { BrandCard } from "@/components/account/account-card"
import { CountUp } from "@/components/count-up"
import { LogoSeal } from "@/components/brand/logo"
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { Band, PHOTO_FRAME_CLASS } from "@/components/page-band"
import { BrandHighlight, Eyebrow } from "@/components/page-hero"
import { PlansList, PlansListSkeleton } from "@/components/plans/plans-list"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import {
  HOME_EVOLUTION,
  HOME_IMPACT,
  HOME_MOMENTS,
  HOME_PILLARS,
  HOME_PLANS,
  HOME_SECTION_IDS,
  HOME_STEPS,
} from "@/content/home"
import { PILLAR_LIST } from "@/content/pilares"
import { cn } from "@/lib/utils"

// Secciones del inicio que presentan la membresía: cifras, pilares, momentos, planes, pasos e historia.

const SECTION_TITLE_CLASS =
  "font-heading text-[2rem] leading-[1.1] font-semibold tracking-[-0.01em] text-balance sm:text-5xl"

// Rótulo, título con la parte destacada subrayada, frase manuscrita y bajada.
function SectionIntro({
  eyebrow,
  title,
  highlight,
  hand,
  description,
  center = false,
  className,
}: {
  eyebrow: string
  title: string
  highlight: string
  hand?: string
  description?: string
  center?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-4", center && "mx-auto max-w-2xl items-center text-center", className)}>
      <BlurFade inView>
        <Eyebrow>{eyebrow}</Eyebrow>
      </BlurFade>
      <BlurFade inView delay={0.06}>
        <h2 className={SECTION_TITLE_CLASS}>
          {title} <BrandHighlight>{highlight}</BrandHighlight>
        </h2>
      </BlurFade>
      {hand && (
        <BlurFade inView delay={0.1}>
          <p className="font-hand text-3xl leading-none font-semibold text-brand-green-strong sm:text-4xl">{hand}</p>
        </BlurFade>
      )}
      {description && (
        <BlurFade inView delay={0.14}>
          <p className="max-w-xl text-base leading-relaxed text-pretty sm:text-lg">{description}</p>
        </BlurFade>
      )}
    </div>
  )
}

// ─── La comunidad en números ─────────────────────────────────────────────────────────────

const STAT_COLORS = ["text-brand-green-strong", "text-brand-pink-strong", "text-brand"]

export function HomeImpact() {
  return (
    <Band className="pt-10 pb-16 md:pt-14 md:pb-24">
      <section aria-label={HOME_IMPACT.label} className="flex flex-col gap-10">
        <BlurFade inView>
          <Eyebrow>{HOME_IMPACT.label}</Eyebrow>
        </BlurFade>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.1fr)] lg:items-end">
          {HOME_IMPACT.stats.map((stat, index) => (
            <BlurFade key={stat.label} inView delay={0.06 * index}>
              <div className="flex flex-col gap-2 border-l-2 border-dashed border-border pl-5">
                <span
                  className={cn(
                    "font-heading text-5xl leading-none font-semibold tracking-[-0.02em] sm:text-6xl",
                    STAT_COLORS[index]
                  )}
                >
                  {stat.prefix}
                  <CountUp value={stat.value} delay={0.15 + index * 0.1} className="tabular-nums" />
                </span>
                <span className="text-base text-muted-foreground">{stat.label}</span>
              </div>
            </BlurFade>
          ))}
          <BlurFade inView delay={0.24} className="sm:col-span-3 lg:col-span-1">
            <p className="font-hand text-3xl leading-tight font-semibold sm:text-4xl lg:text-right">
              {HOME_IMPACT.hand}
            </p>
          </BlurFade>
        </div>
      </section>
    </Band>
  )
}

// ─── Los tres pilares ────────────────────────────────────────────────────────────────────

const CARD_TILT = ["-rotate-2", "rotate-1", "-rotate-1"]

export function HomePillars() {
  return (
    <Band id={HOME_SECTION_IDS.pillars} tone="soft">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
        <SectionIntro
          eyebrow={HOME_PILLARS.eyebrow}
          title={HOME_PILLARS.title}
          highlight={HOME_PILLARS.titleHighlight}
          hand={HOME_PILLARS.hand}
        />
        <BlurFade inView delay={0.16}>
          <p className="text-base leading-relaxed text-pretty sm:text-lg">{HOME_PILLARS.description}</p>
        </BlurFade>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-6 md:mt-16 lg:grid-cols-3">
        {PILLAR_LIST.map((pillar, index) => (
          <li key={pillar.slug} className="min-w-0">
            <BlurFade inView delay={0.08 * index} className="h-full">
              <IconHoverArea className="h-full">
                <Link
                  href={pillar.href}
                  className="group block h-full rounded-xl outline-none transition-transform duration-500 ease-premium hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  <BrandCard contentClassName="flex flex-col gap-5 p-4 pb-6 sm:p-5 sm:pb-7">
                    <span className="relative block pt-2">
                      <span className={cn(PHOTO_FRAME_CLASS, "block aspect-[16/11]", CARD_TILT[index])}>
                        <Image
                          src={pillar.image}
                          alt={pillar.imageAlt}
                          fill
                          sizes="(min-width: 1024px) 28vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
                        />
                      </span>
                      <span className="absolute -bottom-3 left-4 z-10 rounded-lg bg-background px-3 py-1.5 font-hand text-xl leading-none font-semibold shadow-[0_12px_28px_-10px_rgb(26_26_26/0.4)] sm:text-2xl">
                        {pillar.tag}
                      </span>
                    </span>
                    <span className="mt-2 flex items-center gap-3 px-1">
                      <IconBadge tone={pillar.badgeTone}>
                        <HoverIcon name={pillar.icon} size={22} />
                      </IconBadge>
                      <span className="font-heading text-3xl font-semibold tracking-[-0.01em]">{pillar.name}</span>
                    </span>
                    <span className="px-1 text-base leading-relaxed text-pretty">{pillar.summary}</span>
                    <span className="mx-1 rounded-lg bg-brand-soft/25 px-4 py-3 text-sm leading-relaxed text-pretty">
                      <strong className="font-semibold">{HOME_PILLARS.forYouLabel}</strong> {pillar.forYou}
                    </span>
                    <span className="mt-auto inline-flex items-center gap-1.5 px-1 font-medium">
                      {HOME_PILLARS.linkLabel} {pillar.name}
                      <HoverIcon name="arrow-right" size={18} />
                    </span>
                  </BrandCard>
                </Link>
              </IconHoverArea>
            </BlurFade>
          </li>
        ))}
      </ul>
    </Band>
  )
}

// ─── Momentos ────────────────────────────────────────────────────────────────────────────

// Franja oscura con textura: las tarjetas toman el tema oscuro
export function HomeMoments() {
  return (
    <Band tone="ink">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
        <SectionIntro
          eyebrow={HOME_MOMENTS.eyebrow}
          title={HOME_MOMENTS.title}
          highlight={HOME_MOMENTS.titleHighlight}
          description={HOME_MOMENTS.description}
          className="lg:sticky lg:top-28 lg:self-start"
        />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {HOME_MOMENTS.items.map((item, index) => (
            <li key={item.title} className={cn("min-w-0", index % 2 === 1 && "sm:translate-y-10")}>
              <BlurFade inView delay={0.06 * index} className="h-full">
                <IconHoverArea className="h-full">
                  <BrandCard contentClassName="flex flex-col gap-4 p-6 sm:p-7">
                    <IconBadge tone={cycleTone(index)} size="lg">
                      <HoverIcon name={item.icon} size={24} />
                    </IconBadge>
                    <h3 className="font-heading text-2xl font-semibold tracking-[-0.01em]">{item.title}</h3>
                    <p className="text-base leading-relaxed text-pretty text-muted-foreground">{item.text}</p>
                  </BrandCard>
                </IconHoverArea>
              </BlurFade>
            </li>
          ))}
        </ul>
      </div>
    </Band>
  )
}

// ─── Planes ──────────────────────────────────────────────────────────────────────────────

export function HomePlans() {
  return (
    <Band id={HOME_SECTION_IDS.plans} tone="pink" className="lg:pb-28">
      <SectionIntro
        center
        eyebrow={HOME_PLANS.eyebrow}
        title={HOME_PLANS.title}
        highlight={HOME_PLANS.titleHighlight}
        description={HOME_PLANS.description}
        className="mb-12 md:mb-16"
      />
      <Suspense fallback={<PlansListSkeleton />}>
        <PlansList />
      </Suspense>

      <ul className="mx-auto mt-6 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
        {HOME_PLANS.perks.map((perk, index) => (
          <li key={perk.title} className="min-w-0">
            <BlurFade inView delay={0.06 * index} className="h-full">
              <IconHoverArea className="h-full">
                <div className="flex h-full gap-4 rounded-xl border border-dashed border-foreground/25 bg-background/70 p-5 backdrop-blur-sm sm:p-6">
                  <IconBadge tone={index === 0 ? "brand" : "green"}>
                    <HoverIcon name={perk.icon} size={22} />
                  </IconBadge>
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="font-hand text-2xl leading-none font-semibold text-brand-pink-strong">{perk.hand}</p>
                    <h3 className="font-heading text-xl font-semibold tracking-[-0.01em]">{perk.title}</h3>
                    <p className="text-sm leading-relaxed text-pretty">{perk.text}</p>
                  </div>
                </div>
              </IconHoverArea>
            </BlurFade>
          </li>
        ))}
      </ul>

      <BlurFade inView delay={0.1} className="mt-10 flex justify-center">
        <HoverRevealLink href={ROUTES.planes}>{HOME_PLANS.moreCta}</HoverRevealLink>
      </BlurFade>
    </Band>
  )
}

// ─── Cómo funciona ───────────────────────────────────────────────────────────────────────

// Sobre foto con velo oscuro, para cortar la seguidilla de franjas claras
export function HomeSteps() {
  return (
    <Band image={HOME_STEPS.image}>
      <SectionIntro
        center
        eyebrow={HOME_STEPS.eyebrow}
        title={HOME_STEPS.title}
        highlight={HOME_STEPS.titleHighlight}
      />
      <ol className="relative mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
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
                <h3 className="font-heading text-2xl font-semibold tracking-[-0.01em]">{step.title}</h3>
              </IconHoverArea>
              <p className="max-w-xs text-base leading-relaxed text-pretty text-muted-foreground">{step.text}</p>
            </BlurFade>
          </li>
        ))}
      </ol>
    </Band>
  )
}

// ─── Nuestra historia ────────────────────────────────────────────────────────────────────

export function HomeEvolution() {
  return (
    <Band tone="green">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionIntro
            eyebrow={HOME_EVOLUTION.eyebrow}
            title={HOME_EVOLUTION.title}
            highlight={HOME_EVOLUTION.titleHighlight}
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
                  <span
                    aria-hidden
                    className={cn(
                      "mt-2 size-2.5 shrink-0 rounded-full",
                      ["bg-brand-soft", "bg-brand-green", "bg-brand"][index]
                    )}
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-heading text-xl font-semibold tracking-[-0.01em]">{item.title}</h3>
                    <p className="text-base leading-relaxed text-pretty text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              </BlurFade>
            </li>
          ))}
        </ol>
      </div>
    </Band>
  )
}

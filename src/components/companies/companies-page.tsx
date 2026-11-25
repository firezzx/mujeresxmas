import Image from "next/image"
import Link from "next/link"

import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { CompanyLeadForm } from "@/components/companies/company-lead-form"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { cardClass, DarkSection, HEADING_CLASS, SectionHeading } from "@/components/landing/landing-ui"
import { HeroLights, ScreenSection } from "@/components/landing/screen"
import { BandBackdrop } from "@/components/page-band"
import { BlurFade } from "@/components/ui/blur-fade"
import {
  COMPANIES_AUDIENCES,
  COMPANIES_DASHBOARD,
  COMPANIES_FORM,
  COMPANIES_FORM_ID,
  COMPANIES_PACKAGES,
  COMPANIES_PAGE,
  COMPANIES_STEPS,
  COMPANY_AUDIENCES,
} from "@/content/empresas"
import { COMMUNITY_PORTRAITS } from "@/content/retratos"
import { cn } from "@/lib/utils"

// Página de Empresas (membresías patrocinadas). El recorrido: a quiénes impulsar (cada público
// abre el formulario con esa opción), cómo funciona, qué impacto se reporta, cuánto cuesta y el
// pedido de propuesta.

const STEPS_ID = "como-funciona"
const PACKAGES_ID = "paquetes"

function Hero() {
  return (
    <ScreenSection backdrop={<HeroLights />} innerClassName="pt-32 lg:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div className="flex flex-col items-start">
          <BlurFade>
            <p className="flex items-center gap-2 font-heading text-sm font-semibold tracking-[0.14em] text-brand-green-strong uppercase">
              <span aria-hidden className="size-1.5 rounded-full bg-brand-green" />
              {COMPANIES_PAGE.eyebrow}
            </p>
          </BlurFade>
          <BlurFade delay={0.06}>
            <h1 className={cn(HEADING_CLASS, "mt-4 text-[2.75rem] leading-[0.98] sm:text-6xl xl:text-[4.25rem]")}>
              {COMPANIES_PAGE.title} <span className="text-brand-green-strong">{COMPANIES_PAGE.titleHighlight}</span>
            </h1>
          </BlurFade>
          <BlurFade delay={0.12}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
              {COMPANIES_PAGE.description}
            </p>
          </BlurFade>
          <BlurFade delay={0.18} className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ShimmerLink href={`#${COMPANIES_FORM_ID}`} className="w-full sm:w-auto">
              {COMPANIES_PAGE.primaryCta}
            </ShimmerLink>
            <HoverRevealLink href={`#${STEPS_ID}`} className="w-full sm:w-auto">
              {COMPANIES_PAGE.secondaryCta}
            </HoverRevealLink>
          </BlurFade>
        </div>
        <BlurFade delay={0.2}>
          {/* Collage de retratos de la comunidad, con las dos cifras sobre el borde de abajo */}
          <div className="relative">
            <div aria-hidden className="grid grid-cols-3 gap-3 sm:gap-4">
              {COMMUNITY_PORTRAITS.slice(10, 16).map((src, index) => (
                <div
                  key={src}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-xl bg-muted shadow-[0_24px_48px_-28px_rgb(26_26_26/0.5)] ring-1 ring-foreground/10",
                    index % 3 === 1 && "translate-y-6"
                  )}
                >
                  <Image src={src} alt="" fill sizes="(min-width: 1024px) 13vw, 30vw" className="object-cover" />
                </div>
              ))}
            </div>
            <div className="relative z-10 mx-3 -mt-4 grid grid-cols-2 gap-3 sm:mx-6">
              {COMPANIES_PAGE.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-1.5 rounded-xl bg-background/90 p-4 shadow-[0_24px_48px_-24px_rgb(26_26_26/0.35)] ring-1 ring-foreground/[0.08] backdrop-blur-md sm:p-5"
                >
                  <span className="font-heading text-3xl leading-none font-semibold tracking-[-0.03em] text-brand-green-strong sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="text-xs leading-snug text-muted-foreground sm:text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </BlurFade>
      </div>
    </ScreenSection>
  )
}

// A quiénes impulsar: cada tarjeta lleva al formulario con ese público ya elegido
function Audiences() {
  return (
    <ScreenSection backdrop={<BandBackdrop tone="soft" />}>
      <SectionHeading
        eyebrow={COMPANIES_AUDIENCES.eyebrow}
        title={COMPANIES_AUDIENCES.title}
        accent={COMPANIES_AUDIENCES.titleHighlight}
      />
      <ul className="grid gap-4 md:grid-cols-3">
        {COMPANIES_AUDIENCES.items.map((item, index) => (
          <li key={item.audience} className="min-w-0">
            <BlurFade inView delay={index * 0.08} className="h-full">
              <IconHoverArea className="h-full">
                <Link
                  href={`#${COMPANIES_FORM_ID}-${item.audience}`}
                  className={cardClass(
                    "white",
                    "group flex h-full flex-col gap-5 p-7 transition-[translate,box-shadow] duration-500 ease-premium outline-none hover:-translate-y-1 hover:shadow-[0_32px_64px_-32px_rgb(26_26_26/0.35)] focus-visible:ring-3 focus-visible:ring-ring/40"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <IconBadge tone={item.tone} size="lg">
                      <HoverIcon name={item.icon} size={24} />
                    </IconBadge>
                    <p className="font-hand text-2xl leading-none font-semibold text-muted-foreground">{item.hand}</p>
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <h3 className={cn(HEADING_CLASS, "text-2xl")}>{item.title}</h3>
                    <p className="text-base leading-relaxed text-pretty text-muted-foreground">{item.text}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 border-t border-foreground/[0.07] pt-5 text-sm font-semibold text-brand-green-strong">
                    {COMPANIES_AUDIENCES.cta}
                    <HoverIcon name="arrow-right" size={14} />
                  </span>
                </Link>
              </IconHoverArea>
            </BlurFade>
          </li>
        ))}
      </ul>
    </ScreenSection>
  )
}

// Línea de tiempo: en escritorio los cuatro pasos unidos por una línea; en el celular, en columna
function Steps() {
  return (
    <ScreenSection id={STEPS_ID}>
      <SectionHeading
        eyebrow={COMPANIES_STEPS.eyebrow}
        title={COMPANIES_STEPS.title}
        accent={COMPANIES_STEPS.titleHighlight}
        className="lg:mb-14"
      />
      <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
        <span
          aria-hidden
          className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px bg-gradient-to-r from-brand-green via-brand-soft to-brand lg:block"
        />
        <span
          aria-hidden
          className="absolute top-7 bottom-7 left-7 w-px bg-gradient-to-b from-brand-green via-brand-soft to-brand lg:hidden"
        />
        {COMPANIES_STEPS.items.map((step, index) => (
          <li key={step.title} className="relative">
            <BlurFade inView delay={index * 0.1} className="flex gap-5 lg:flex-col lg:items-center lg:text-center">
              <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-background font-heading text-xl font-semibold text-brand-green-strong shadow-[0_12px_28px_-14px_rgb(26_26_26/0.35)] ring-1 ring-foreground/[0.08]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2 pt-2 lg:pt-0">
                <h3 className={cn(HEADING_CLASS, "text-xl")}>{step.title}</h3>
                <p className="max-w-64 text-base leading-relaxed text-pretty text-muted-foreground">{step.text}</p>
              </div>
            </BlurFade>
          </li>
        ))}
      </ol>
    </ScreenSection>
  )
}

// El impacto antes del precio: tablero de ejemplo en la franja oscura
function Dashboard() {
  return (
    <DarkSection>
      <SectionHeading
        eyebrow={COMPANIES_DASHBOARD.eyebrow}
        title={COMPANIES_DASHBOARD.title}
        accent={COMPANIES_DASHBOARD.titleHighlight}
        description={COMPANIES_DASHBOARD.description}
      />
      <BlurFade inView>
        <div className="mx-auto max-w-6xl overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <span aria-hidden className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-brand" />
                <span className="size-2.5 rounded-full bg-brand-soft" />
                <span className="size-2.5 rounded-full bg-brand-green" />
              </span>
              <span className="text-sm text-white/70">{COMPANIES_DASHBOARD.windowTitle}</span>
            </div>
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white/70 uppercase">
              {COMPANIES_DASHBOARD.sample}
            </span>
          </div>
          <ul className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {COMPANIES_DASHBOARD.items.map((item, index) => (
              <li key={item.label}>
                <BlurFade inView delay={index * 0.05} className="h-full">
                  <IconHoverArea className="flex h-full items-center gap-4 bg-primary/95 p-6">
                    <IconBadge tone={index % 2 ? "pink" : "green"}>
                      <HoverIcon name={item.icon} size={20} />
                    </IconBadge>
                    <div className="flex flex-col gap-1">
                      <span className="font-heading text-3xl font-semibold tracking-[-0.02em]">
                        {COMPANIES_DASHBOARD.value}
                      </span>
                      <span className="text-sm text-white/70">{item.label}</span>
                    </div>
                    {/* Barritas decorativas de tendencia */}
                    <span aria-hidden className="ml-auto flex h-10 items-end gap-1">
                      {[40, 65, 50, 80, 100].map((height, bar) => (
                        <span
                          key={bar}
                          style={{ height: `${height}%` }}
                          className={cn(
                            "w-1.5 rounded-sm",
                            bar === 4 ? (index % 2 ? "bg-brand-soft" : "bg-brand-green") : "bg-white/15"
                          )}
                        />
                      ))}
                    </span>
                  </IconHoverArea>
                </BlurFade>
              </li>
            ))}
          </ul>
        </div>
      </BlurFade>
      <p className="mt-8 text-center text-sm text-white/55">{COMPANIES_DASHBOARD.note}</p>
    </DarkSection>
  )
}

function Packages() {
  return (
    <ScreenSection id={PACKAGES_ID} backdrop={<BandBackdrop tone="green" />}>
      <SectionHeading
        eyebrow={COMPANIES_PACKAGES.eyebrow}
        title={COMPANIES_PACKAGES.title}
        accent={COMPANIES_PACKAGES.titleHighlight}
      />
      <ul className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3 md:items-stretch">
        {COMPANIES_PACKAGES.items.map((pack, index) => {
          const featured = pack.name === COMPANIES_PACKAGES.featured
          return (
            <li key={pack.name} className="min-w-0">
              <BlurFade inView delay={index * 0.08} className="h-full">
                <IconHoverArea
                  className={cn(
                    "relative flex h-full flex-col gap-6 rounded-xl p-7",
                    featured
                      ? "surface-dark bg-primary text-foreground shadow-[0_24px_60px_-24px_rgb(26_26_26/0.55)] md:-my-3 md:py-10"
                      : cardClass("white")
                  )}
                >
                  {featured && (
                    <span className="absolute -top-3 left-7 rounded-lg bg-brand-strong px-3 py-1 text-xs font-semibold text-white">
                      {COMPANIES_PACKAGES.featuredBadge}
                    </span>
                  )}
                  <div className="flex flex-col gap-2">
                    <h3 className={cn(HEADING_CLASS, "text-3xl")}>{pack.name}</h3>
                    <p className={cn("text-base", featured ? "text-white/75" : "text-muted-foreground")}>
                      {pack.summary}
                    </p>
                  </div>
                  <ul className="flex flex-1 flex-col gap-3">
                    {pack.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-[15px]">
                        <HoverIcon
                          name="check"
                          size={16}
                          className={cn("mt-0.5 shrink-0", featured ? "text-brand-soft" : "text-brand-green-strong")}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div
                    className={cn(
                      "flex items-end justify-between gap-4 border-t pt-5",
                      featured ? "border-white/15" : "border-foreground/10"
                    )}
                  >
                    <p className="font-heading text-2xl font-semibold">{pack.price}</p>
                    <Link
                      href={`#${COMPANIES_FORM_ID}`}
                      className={cn(
                        "inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 outline-none hover:underline focus-visible:underline",
                        featured ? "text-brand-soft" : "text-brand-green-strong"
                      )}
                    >
                      {COMPANIES_PACKAGES.cta}
                      <HoverIcon name="arrow-right" size={14} />
                    </Link>
                  </div>
                </IconHoverArea>
              </BlurFade>
            </li>
          )
        })}
      </ul>
    </ScreenSection>
  )
}

function ProposalForm() {
  return (
    <ScreenSection id={COMPANIES_FORM_ID} backdrop={<HeroLights />}>
      {/* Anclas para llegar con un público ya elegido (#propuesta-<opción>) */}
      {COMPANY_AUDIENCES.map((option) => (
        <span key={option.value} id={`${COMPANIES_FORM_ID}-${option.value}`} className="absolute top-0" />
      ))}
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            align="left"
            title={COMPANIES_FORM.title}
            accent={COMPANIES_FORM.titleHighlight}
            hand={COMPANIES_FORM.hand}
            description={COMPANIES_FORM.description}
            className="mb-0 md:mb-0 lg:mb-0"
          />
          <BlurFade inView>
            <div className="flex flex-col gap-4">
              <p className="font-heading text-sm font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {COMPANIES_FORM.nextTitle}
              </p>
              <ol className="flex flex-col gap-3">
                {COMPANIES_FORM.next.map((item, index) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-green/15 font-heading text-sm font-semibold text-brand-green-strong">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </BlurFade>
        </div>
        <BlurFade inView>
          <div className={cardClass("white", "p-6 sm:p-8")}>
            <CompanyLeadForm />
          </div>
        </BlurFade>
      </div>
    </ScreenSection>
  )
}

export function CompaniesPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <Hero />
      <Audiences />
      <Steps />
      {!COMPANIES_DASHBOARD.hidden && <Dashboard />}
      {!COMPANIES_PACKAGES.hidden && <Packages />}
      <ProposalForm />
    </main>
  )
}

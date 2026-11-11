import Image from "next/image"

import { BrandCard } from "@/components/account/account-card"
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { RegisterCta } from "@/components/cta/register-cta"
import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { Band, BandBackdrop, ColorHero, PHOTO_FRAME_CLASS } from "@/components/page-band"
import { BrandHighlight, Eyebrow } from "@/components/page-hero"
import { AccessTag } from "@/components/pillars/pillar-page"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import {
  ACCESS_LABELS,
  PILLAR_CLOSING,
  PILLARS,
  PILLAR_LIST,
  PILLARS_PAGE,
  type Pillar,
  type PillarItem,
} from "@/content/pilares"
import { cn } from "@/lib/utils"

// Página general de los pilares: cada pilar tiene su propia composición para que la página no se
// sienta repetida. Desarrollo: intro fija y grilla de servicios, más la Academia. Bienestar: título
// centrado y la foto en el medio de los servicios. Conexión: foto panorámica, el dato de la red y
// los espacios.

const SECTION_TITLE_CLASS =
  "font-heading text-[2rem] leading-[1.1] font-semibold tracking-[-0.01em] text-balance sm:text-5xl"

function PillarHeading({ pillar, centered = false }: { pillar: Pillar; centered?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-4", centered && "items-center text-center")}>
      <BlurFade inView>
        <Eyebrow>
          {PILLARS_PAGE.pillarEyebrow} · {pillar.name}
        </Eyebrow>
      </BlurFade>
      <BlurFade inView delay={0.06}>
        <h2 className={SECTION_TITLE_CLASS}>
          {pillar.hero.titleStart} <BrandHighlight>{pillar.hero.titleHighlight}</BrandHighlight>
        </h2>
      </BlurFade>
      <BlurFade inView delay={0.1}>
        <p className={cn("max-w-xl text-base leading-relaxed text-pretty sm:text-lg", centered && "mx-auto")}>
          {pillar.hero.description}
        </p>
      </BlurFade>
    </div>
  )
}

function FramedPhoto({ pillar, className, sizes }: { pillar: Pillar; className?: string; sizes: string }) {
  return (
    <div className="relative">
      <div className={cn(PHOTO_FRAME_CLASS, className)}>
        <Image src={pillar.image} alt={pillar.imageAlt} fill sizes={sizes} className="object-cover" />
      </div>
      <span className="absolute -bottom-4 left-5 z-10 rounded-lg bg-background px-3 py-1.5 font-hand text-2xl leading-none font-semibold shadow-[0_12px_28px_-10px_rgb(26_26_26/0.4)]">
        {pillar.tag}
      </span>
    </div>
  )
}

// Tarjeta de un servicio. `wide` la pone en horizontal (para la destacada de una grilla).
function ServiceCard({ item, index, wide = false }: { item: PillarItem; index: number; wide?: boolean }) {
  return (
    <BlurFade inView delay={(index % 4) * 0.06} className="h-full">
      <IconHoverArea className="h-full">
        <BrandCard
          contentClassName={cn("flex gap-4 p-5 sm:p-6", wide ? "flex-col sm:flex-row sm:items-start" : "flex-col")}
        >
          <IconBadge tone={cycleTone(index)}>
            <HoverIcon name={item.icon} size={22} />
          </IconBadge>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h3 className="font-heading text-lg leading-snug font-semibold tracking-[-0.01em]">{item.title}</h3>
            <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">{item.text}</p>
            <div className="mt-auto pt-1">
              <AccessTag access={item.access} />
            </div>
          </div>
        </BrandCard>
      </IconHoverArea>
    </BlurFade>
  )
}

function MoreLink({ pillar, className }: { pillar: Pillar; className?: string }) {
  return (
    <HoverRevealLink href={pillar.href} className={cn("w-full sm:w-auto", className)}>
      {PILLARS_PAGE.moreLabel} {pillar.name}
    </HoverRevealLink>
  )
}

// Desarrollo: intro con foto fija a la izquierda y los servicios en grilla; abajo, la Academia.
function DesarrolloSection({ pillar }: { pillar: Pillar }) {
  const [featured, ...rest] = pillar.services.items
  return (
    <Band id={pillar.slug} tone="white">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
          <PillarHeading pillar={pillar} />
          <BlurFade inView delay={0.14} className="mr-2 mb-4">
            <FramedPhoto pillar={pillar} className="aspect-[16/10] -rotate-1" sizes="(min-width: 1024px) 38vw, 100vw" />
          </BlurFade>
          <BlurFade inView delay={0.18}>
            <MoreLink pillar={pillar} />
          </BlurFade>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          <li className="sm:col-span-2">
            <ServiceCard item={featured} index={0} wide />
          </li>
          {rest.map((item, i) => (
            <li key={item.title}>
              <ServiceCard item={item} index={i + 1} />
            </li>
          ))}
        </ul>
      </div>

      {pillar.extra && (
        <BlurFade inView delay={0.08} className="mt-14 sm:mt-20">
          <div className="surface-dark relative overflow-hidden rounded-xl px-6 py-8 sm:px-10 sm:py-10">
            <BandBackdrop tone="ink" />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
              <div className="flex flex-col gap-3">
                <span className="w-fit rounded-md bg-brand-soft px-2.5 py-1 font-heading text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  {PILLARS_PAGE.academyLabel}
                </span>
                <h3 className="font-heading text-2xl leading-tight font-semibold tracking-[-0.01em] text-balance sm:text-3xl">
                  {pillar.extra.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-pretty sm:text-base">{pillar.extra.description}</p>
              </div>
              <ul className="flex flex-wrap gap-2.5">
                {pillar.extra.items.map((item, i) => (
                  <li key={item.title}>
                    <IconHoverArea className="surface-light flex items-center gap-2.5 rounded-lg bg-background py-1.5 pr-3.5 pl-1.5 shadow-[0_8px_24px_-14px_rgb(0_0_0/0.6)]">
                      <IconBadge tone={cycleTone(i)} size="sm">
                        <HoverIcon name={item.icon} size={16} />
                      </IconBadge>
                      <span className="font-heading text-sm font-medium">{item.title}</span>
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 rounded-full",
                          item.access === "free" ? "bg-brand-green-strong" : "bg-brand"
                        )}
                      />
                      <span className="sr-only">{ACCESS_LABELS[item.access]}</span>
                    </IconHoverArea>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </BlurFade>
      )}
    </Band>
  )
}

// Bienestar: título centrado y la foto en el medio, con dos servicios a cada lado.
function BienestarSection({ pillar }: { pillar: Pillar }) {
  const items = pillar.services.items
  const half = Math.ceil(items.length / 2)
  const column = (list: PillarItem[], offset: number) => (
    <ul className="flex flex-col gap-4">
      {list.map((item, i) => (
        <li key={item.title}>
          <ServiceCard item={item} index={offset + i} />
        </li>
      ))}
    </ul>
  )
  return (
    <Band id={pillar.slug} tone="pink">
      <PillarHeading pillar={pillar} centered />
      <div className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center lg:gap-8">
        {column(items.slice(0, half), 0)}
        <BlurFade inView delay={0.1} className="mx-auto mb-4 w-full max-w-sm max-lg:order-first">
          <FramedPhoto pillar={pillar} className="aspect-[4/5] rotate-1" sizes="(min-width: 1024px) 28vw, 90vw" />
        </BlurFade>
        {column(items.slice(half), half)}
      </div>
      <BlurFade inView delay={0.12} className="mt-10 flex justify-center">
        <MoreLink pillar={pillar} />
      </BlurFade>
    </Band>
  )
}

// Conexión: foto panorámica con la presentación encima, el dato de la red y los espacios.
function ConexionSection({ pillar }: { pillar: Pillar }) {
  return (
    <Band id={pillar.slug} tone="soft">
      <BlurFade inView>
        <div className={cn(PHOTO_FRAME_CLASS, "aspect-[4/3] sm:aspect-[21/9]")}>
          <Image
            src={pillar.image}
            alt={pillar.imageAlt}
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
          />
        </div>
      </BlurFade>
      <div className="relative z-10 -mt-14 px-3 sm:-mt-24 sm:px-8 lg:-mt-32 lg:px-12">
        <BlurFade inView delay={0.06}>
          <div className="max-w-2xl rounded-xl bg-background p-6 shadow-[0_24px_48px_-24px_rgb(26_26_26/0.35)] ring-1 ring-border sm:p-9">
            <PillarHeading pillar={pillar} />
          </div>
        </BlurFade>
      </div>

      <div className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)]">
        <BlurFade inView delay={0.08} className="h-full">
          <div className="flex h-full flex-col gap-3 rounded-xl bg-background/80 p-6 ring-1 ring-foreground/10 backdrop-blur-sm sm:p-7">
            <span className="font-hand text-2xl leading-none font-semibold">{pillar.tag}</span>
            <span className="font-heading text-6xl leading-none font-semibold tracking-[-0.03em] text-brand sm:text-7xl">
              {PILLARS_PAGE.networkStat.value}
            </span>
            <span className="text-base leading-snug text-pretty">{PILLARS_PAGE.networkStat.label}</span>
            <MoreLink pillar={pillar} className="mt-auto sm:w-full" />
          </div>
        </BlurFade>
        <ul className="grid gap-4 sm:grid-cols-2">
          {pillar.services.items.map((item, i) => (
            <li key={item.title}>
              <ServiceCard item={item} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </Band>
  )
}

export function PillarsOverview() {
  return (
    <main className="relative flex flex-1 flex-col">
      <ColorHero
        eyebrow={PILLARS_PAGE.eyebrow}
        title={
          <>
            {PILLARS_PAGE.titleStart} <BrandHighlight>{PILLARS_PAGE.titleHighlight}</BrandHighlight>
          </>
        }
        description={PILLARS_PAGE.description}
        actions={
          <nav aria-label="Ir a un pilar">
            <ul className="flex flex-wrap gap-2.5">
              {PILLAR_LIST.map((pillar) => (
                <li key={pillar.slug}>
                  <IconHoverArea>
                    <a
                      href={`#${pillar.slug}`}
                      className="inline-flex items-center gap-2.5 rounded-lg bg-background/85 py-1.5 pr-4 pl-1.5 font-heading text-[15px] font-medium shadow-[0_8px_24px_-14px_rgb(26_26_26/0.45)] ring-1 ring-foreground/10 backdrop-blur-sm transition-shadow duration-300 outline-none hover:ring-foreground/25 focus-visible:ring-3 focus-visible:ring-ring/40"
                    >
                      <IconBadge tone={pillar.badgeTone} size="sm">
                        <HoverIcon name={pillar.icon} size={16} />
                      </IconBadge>
                      {pillar.name}
                    </a>
                  </IconHoverArea>
                </li>
              ))}
            </ul>
          </nav>
        }
        aside={
          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4">
            {PILLAR_LIST.map((pillar, index) => (
              <div
                key={pillar.slug}
                className={cn(
                  PHOTO_FRAME_CLASS,
                  index === 0 ? "col-span-2 aspect-[16/9] -rotate-1" : "aspect-square",
                  index === 1 && "rotate-2",
                  index === 2 && "-rotate-2"
                )}
              >
                <Image
                  src={pillar.image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 28vw, 60vw"
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-md bg-background px-2 py-1 font-heading text-xs font-semibold">
                  {pillar.name}
                </span>
              </div>
            ))}
          </div>
        }
      />

      <DesarrolloSection pillar={PILLARS.desarrollo} />
      <BienestarSection pillar={PILLARS.bienestar} />
      <ConexionSection pillar={PILLARS.conexion} />

      <Band image={PILLARS_PAGE.closingImage}>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <BlurFade inView>
            <p className="font-hand text-3xl leading-none font-semibold sm:text-4xl">{PILLARS_PAGE.closingHand}</p>
          </BlurFade>
          <BlurFade inView delay={0.06}>
            <h2 className={SECTION_TITLE_CLASS}>
              {PILLARS_PAGE.closingTitle} <BrandHighlight>{PILLARS_PAGE.closingHighlight}</BrandHighlight>
            </h2>
          </BlurFade>
          <BlurFade inView delay={0.1}>
            <p className="text-base leading-relaxed text-pretty sm:text-lg">{PILLAR_CLOSING.description}</p>
          </BlurFade>
          <BlurFade inView delay={0.14} className="mt-3 w-full">
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <RegisterCta className="w-full sm:w-auto" />
              <HoverRevealLink href={ROUTES.planes} className="w-full sm:w-auto">
                {PILLAR_CLOSING.plansCta}
              </HoverRevealLink>
            </div>
          </BlurFade>
        </div>
      </Band>
    </main>
  )
}

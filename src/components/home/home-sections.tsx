import Image from "next/image"

import { BrandCard } from "@/components/account/account-card"
import { Logo } from "@/components/brand/logo"
import { cycleTone, IconBadge, type IconBadgeTone } from "@/components/icon-badge"
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { RegisterCta } from "@/components/cta/register-cta"
import { GRID_CELLS_CLASS, GridSection } from "@/components/grid-section"
import { SectionHeading } from "@/components/home/section-heading"
import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import { BrandHighlight } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { Marquee } from "@/components/ui/marquee"
import { NumberTicker } from "@/components/ui/number-ticker"
import { OrbitingCircles } from "@/components/ui/orbiting-circles"
import { Particles } from "@/components/ui/particles"
import { BRAND_HEX } from "@/config/brand-effects"
import {
  HOME_ABOUT,
  HOME_AREAS,
  HOME_AREAS_ID,
  HOME_CLOSING,
  HOME_CLOSING_CTA_ID,
  HOME_COMMUNITY,
  HOME_PHOTOS,
  HOME_STATS,
} from "@/content/home"
import { cn } from "@/lib/utils"

// Margen del encabezado de cada sección, arriba de sus celdas
const HEADING_CELL_CLASS = "border-b border-border px-5 py-14 sm:px-10 md:py-20"

// Celda de la retícula con el brillo de Magic Card al pasar el mouse. Sin borde, sombra ni curvas
// propias: la separan las líneas de la grilla. El ícono se anima al pasar por cualquier parte.
function GridCard({
  className,
  contentClassName,
  children,
}: {
  className?: string
  contentClassName?: string
  children: React.ReactNode
}) {
  return (
    <IconHoverArea className={cn("h-full bg-background", className)}>
      <BrandCard className="rounded-none border-0 shadow-none" contentClassName={contentClassName}>
        {children}
      </BrandCard>
    </IconHoverArea>
  )
}

type FeatureCardProps = { icon: IconName; tone: IconBadgeTone; title: string; text: string }

function FeatureText({ icon, tone, title, text }: FeatureCardProps) {
  return (
    <>
      <IconBadge tone={tone}>
        <HoverIcon name={icon} size={22} />
      </IconBadge>
      <div className="flex flex-col gap-2">
        <h3 className="font-heading text-xl leading-snug font-semibold tracking-[-0.02em] text-balance">{title}</h3>
        <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">{text}</p>
      </div>
    </>
  )
}

// Franja de fotos de la comunidad en movimiento (Marquee de Magic UI), de lado a lado del marco.
export function HomePhotoStrip() {
  return (
    <GridSection>
      <div aria-hidden className="py-3 sm:py-4">
        <Marquee
          pauseOnHover
          repeat={3}
          className="[--duration:60s] [--gap:0.75rem] [mask-image:linear-gradient(to_right,transparent,white_6%,white_94%,transparent)]"
        >
          {HOME_PHOTOS.map((src) => (
            <div key={src} className="relative h-56 w-72 overflow-hidden rounded-[20px] bg-muted sm:h-72 sm:w-96">
              <Image src={src} alt="" fill sizes="(min-width: 640px) 384px, 288px" className="object-cover" />
            </div>
          ))}
        </Marquee>
      </div>
    </GridSection>
  )
}

export function HomeAbout() {
  return (
    <GridSection>
      <div className={HEADING_CELL_CLASS}>
        <SectionHeading
          eyebrow={HOME_ABOUT.eyebrow}
          titleStart={HOME_ABOUT.titleStart}
          titleHighlight={HOME_ABOUT.titleHighlight}
          description={HOME_ABOUT.description}
        />
      </div>
      <div className={cn(GRID_CELLS_CLASS, "grid-cols-1 md:grid-cols-3")}>
        {HOME_ABOUT.items.map((item, index) => (
          <GridCard key={item.title}>
            <BlurFade inView delay={index * 0.08} className="flex flex-col gap-5 p-6 sm:p-8">
              <FeatureText {...item} tone={cycleTone(index)} />
            </BlurFade>
          </GridCard>
        ))}
      </div>
    </GridSection>
  )
}

// Cifras de la comunidad: cuentan hacia arriba con Number Ticker al entrar en pantalla.
export function HomeStats() {
  return (
    <GridSection>
      <dl className={cn(GRID_CELLS_CLASS, "grid-cols-1 sm:grid-cols-3")}>
        {HOME_STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 bg-background px-6 py-10 text-center sm:py-14"
          >
            <dt className="order-last text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="font-heading text-5xl leading-none font-semibold tracking-[-0.03em] md:text-6xl">
              {stat.prefix}
              <NumberTicker
                value={stat.value}
                decimalPlaces={stat.decimals}
                className="tracking-[-0.03em] text-foreground"
              />
              {stat.suffix}
            </dd>
          </div>
        ))}
      </dl>
    </GridSection>
  )
}

const ORBIT_ICONS: IconName[] = ["book-text", "graduation-cap", "sparkles"]
const ORBIT_ICONS_INNER: IconName[] = ["users-round", "rocket"]

function OrbitIcon({ icon }: { icon: IconName }) {
  return (
    <span className="flex size-full items-center justify-center rounded-full border border-border bg-background shadow-[0_8px_20px_-10px_rgb(26_26_26/0.3)]">
      <HoverIcon name={icon} size={18} />
    </span>
  )
}

export function HomeCommunity() {
  return (
    <GridSection>
      <div className={cn(GRID_CELLS_CLASS, "grid-cols-1 md:grid-cols-2")}>
        <div className="flex flex-col items-start gap-7 bg-background px-5 py-14 sm:px-10 md:py-20">
          <SectionHeading
            align="left"
            eyebrow={HOME_COMMUNITY.eyebrow}
            titleStart={HOME_COMMUNITY.titleStart}
            titleHighlight={HOME_COMMUNITY.titleHighlight}
            description={HOME_COMMUNITY.description}
          />
          <BlurFade inView delay={0.16}>
            <ul className="flex flex-col gap-3">
              {HOME_COMMUNITY.items.map((item, index) => (
                <li key={item.text}>
                  <IconHoverArea className="flex items-center gap-3 text-[15px]">
                    <IconBadge size="sm" tone={cycleTone(index)}>
                      <HoverIcon name={item.icon} size={16} />
                    </IconBadge>
                    {item.text}
                  </IconHoverArea>
                </li>
              ))}
            </ul>
          </BlurFade>
          <BlurFade inView delay={0.22} className="w-full sm:w-auto">
            <HoverRevealLink href={`#${HOME_AREAS_ID}`} className="w-full sm:w-auto">
              {HOME_COMMUNITY.cta}
            </HoverRevealLink>
          </BlurFade>
        </div>

        {/* Orbiting Circles de Magic UI alrededor del logo */}
        <div className="bg-background">
          <div
            aria-hidden
            className="relative flex h-full min-h-[22rem] items-center justify-center overflow-hidden bg-brand-soft/30 sm:min-h-[26rem]"
          >
            <Logo className="h-8" />
            <OrbitingCircles iconSize={44} radius={142} duration={36}>
              {ORBIT_ICONS.map((icon) => (
                <OrbitIcon key={icon} icon={icon} />
              ))}
            </OrbitingCircles>
            <OrbitingCircles iconSize={38} radius={102} duration={26} reverse>
              {ORBIT_ICONS_INNER.map((icon) => (
                <OrbitIcon key={icon} icon={icon} />
              ))}
            </OrbitingCircles>
          </div>
        </div>
      </div>
    </GridSection>
  )
}

export function HomeAreas() {
  return (
    <GridSection id={HOME_AREAS_ID}>
      <div className={HEADING_CELL_CLASS}>
        <SectionHeading
          eyebrow={HOME_AREAS.eyebrow}
          titleStart={HOME_AREAS.titleStart}
          titleHighlight={HOME_AREAS.titleHighlight}
          description={HOME_AREAS.description}
        />
      </div>
      {/* Dos celdas grandes arriba y tres abajo; la foto llega hasta las líneas y hace un zoom suave */}
      <div className={cn(GRID_CELLS_CLASS, "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6")}>
        {HOME_AREAS.items.map(({ image, imageAlt, ...item }, index) => (
          <GridCard
            key={item.title}
            className={cn(
              index < 2 ? "lg:col-span-3" : "lg:col-span-2",
              index === HOME_AREAS.items.length - 1 && "sm:max-lg:col-span-2"
            )}
          >
            <div className="relative h-48 overflow-hidden bg-muted sm:h-52 lg:h-64">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <BlurFade inView delay={index * 0.06} className="flex flex-col gap-5 p-6 sm:p-8">
              <FeatureText {...item} tone={cycleTone(index)} />
            </BlurFade>
          </GridCard>
        ))}
      </div>
    </GridSection>
  )
}

// Cierre con una foto de la comunidad bajo un velo oscuro, partículas y la invitación a sumarse,
// con el botón en naranja de la marca. Ocupa todo el ancho del marco.
export function HomeClosing() {
  return (
    <GridSection last>
      <div className="relative isolate overflow-hidden bg-primary px-6 py-20 text-center text-primary-foreground sm:px-12 sm:py-32">
        <Image
          src={HOME_CLOSING.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 1232px, 100vw"
          className="-z-10 object-cover object-top"
        />
        <div className="absolute inset-0 -z-10 bg-primary/75" />
        <Particles
          className="absolute inset-0 -z-10 motion-reduce:hidden"
          quantity={60}
          staticity={40}
          ease={60}
          size={0.7}
          color={BRAND_HEX.brand}
        />
        <BlurFade inView>
          <h2 className="mx-auto max-w-3xl font-heading text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl">
            {HOME_CLOSING.titleStart} <BrandHighlight>{HOME_CLOSING.titleHighlight}</BrandHighlight>
          </h2>
        </BlurFade>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-pretty text-primary-foreground/85 sm:text-lg">
          {HOME_CLOSING.description}
        </p>
        <div className="mt-8 flex justify-center">
          <RegisterCta id={HOME_CLOSING_CTA_ID} label={HOME_CLOSING.cta} tone="brand" className="w-full sm:w-auto" />
        </div>
      </div>
    </GridSection>
  )
}

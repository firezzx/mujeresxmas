import Image from "next/image"

import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import { Eyebrow, HERO_TITLE_CLASS, PAGE_TITLE_CLASS, PageTitle } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { DotPattern } from "@/components/ui/dot-pattern"
import { Highlighter } from "@/components/ui/highlighter"
import { ScrollVelocityRow } from "@/components/ui/scroll-based-velocity"
import { BRAND_HEX } from "@/config/brand-effects"
import { cn } from "@/lib/utils"

// Piezas del estilo del sitio: franjas de color a todo el ancho, fotos como copias pegadas, títulos
// marcados a mano y mosaicos con foto. Las usan el inicio y todas las demás páginas.

export const PAGE_WIDTH_CLASS = "mx-auto w-full max-w-content px-5 sm:px-8 lg:px-9"
// Marco blanco y sombra de las fotos, como copias pegadas sobre el color de la sección
export const PHOTO_FRAME_CLASS =
  "relative overflow-hidden rounded-xl border-4 border-background bg-background shadow-[0_24px_48px_-20px_rgb(26_26_26/0.45)] sm:border-[6px]"
// Puntos de fondo que se desvanecen hacia los bordes (Dot Pattern de Magic UI)
export const DOTS_MASK_CLASS = "[mask-image:radial-gradient(70%_70%_at_50%_50%,white,transparent)]"
// Para el contenido que se monta sobre el borde inferior de un ColorHero con `overlap`
export const OVERLAP_CLASS = "z-10 -mt-12 pt-0 md:-mt-16 md:pt-0"

const BAND_TONES = {
  white: "bg-background",
  soft: "bg-brand-soft/25",
  pink: "bg-brand-soft",
  green: "bg-brand-green",
  ink: "bg-primary text-primary-foreground",
}

const DOT_TONES: Record<keyof typeof BAND_TONES, string> = {
  white: "text-foreground/15",
  soft: "text-brand-pink-strong/25",
  pink: "text-foreground/15",
  green: "text-background/30",
  ink: "text-background/20",
}

export type BandTone = keyof typeof BAND_TONES

// Corte en zigzag de la portada del manual de marca: rosa contra el verde, siempre irregular.
const ZIGZAG_POINTS = "0,39 138,84 298,10 459,64 619,0 802,57 962,12 1123,50 1283,5 1467,41 1467,90 0,90"

export function ZigzagEdge({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1467 90"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-x-0 -bottom-px block h-10 w-full fill-brand-soft sm:h-14 md:h-20",
        className
      )}
    >
      <polygon points={ZIGZAG_POINTS} />
    </svg>
  )
}

// Franja a todo el ancho con el contenido centrado.
export function Band({
  id,
  tone = "white",
  dots,
  zigzag,
  className,
  children,
}: {
  id?: string
  tone?: BandTone
  dots?: boolean
  // Termina abajo con el corte en zigzag rosa (para las franjas verdes)
  zigzag?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={cn("relative flow-root scroll-mt-20", BAND_TONES[tone], dots && "overflow-hidden")}>
      {dots && <DotPattern width={22} height={22} cr={1.2} className={cn(DOT_TONES[tone], DOTS_MASK_CLASS)} />}
      {zigzag && <ZigzagEdge />}
      <div className={cn(PAGE_WIDTH_CLASS, "relative py-12 md:py-20", className)}>{children}</div>
    </section>
  )
}

// Encabezado de página: franja de color con puntos, título marcado y, opcional, algo al costado.
export function ColorHero({
  tone = "green",
  eyebrow,
  title,
  description,
  actions,
  aside,
  compact,
  overlap,
}: {
  tone?: BandTone
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  aside?: React.ReactNode
  // Título más chico, para las páginas de trabajo (cuenta y panel)
  compact?: boolean
  // Deja lugar abajo para montar el contenido siguiente sobre el borde
  overlap?: boolean
}) {
  return (
    <Band
      tone={tone}
      dots
      zigzag={tone === "green"}
      className={cn(
        "grid items-center gap-10 pt-28 pb-20 md:pt-36 md:pb-28",
        aside && "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16",
        overlap && "pb-24 md:pb-32"
      )}
    >
      <div className="flex min-w-0 flex-col items-start gap-5">
        {eyebrow && <BlurFade inView>{typeof eyebrow === "string" ? <Eyebrow>{eyebrow}</Eyebrow> : eyebrow}</BlurFade>}
        <PageTitle delay={0.06} className={compact ? PAGE_TITLE_CLASS : HERO_TITLE_CLASS}>
          {title}
        </PageTitle>
        {description && (
          <BlurFade inView delay={0.12}>
            <p className="max-w-2xl text-base leading-relaxed text-pretty opacity-80 sm:text-lg">{description}</p>
          </BlurFade>
        )}
        {actions && (
          <BlurFade inView delay={0.18} className="w-full">
            {actions}
          </BlurFade>
        )}
      </div>
      {aside && (
        <BlurFade inView delay={0.1} className="min-w-0">
          {aside}
        </BlurFade>
      )}
    </Band>
  )
}

type HighlightStyle = { action: "underline" | "highlight" | "circle" | "box"; color: string }

// Título de sección con una parte marcada a mano (Highlighter de Magic UI) cuando entra en pantalla.
export function SectionTitle({
  title,
  highlight,
  highlightStyle,
  description,
  action,
}: {
  title: string
  highlight: string
  highlightStyle: HighlightStyle
  description?: string
  action?: React.ReactNode
}) {
  return (
    <BlurFade
      inView
      className="mb-8 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-10"
    >
      <div className="flex min-w-0 flex-col gap-3">
        <h2 className="relative font-heading text-[2rem] leading-[1.1] font-semibold tracking-[-0.01em] text-balance sm:text-5xl">
          {title}{" "}
          <Highlighter isView {...highlightStyle} strokeWidth={3} iterations={2} padding={4} animationDuration={900}>
            {highlight}
          </Highlighter>
        </h2>
        {description && <p className="text-base leading-relaxed text-pretty opacity-70 sm:text-lg">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </BlurFade>
  )
}

const TILE_TONES = {
  ink: "from-foreground via-foreground/55",
  pink: "from-brand-soft via-brand-soft/70",
  green: "from-brand-green via-brand-green/70",
}

// Mosaico de foto con degradé de marca, para las grillas tipo bento (Bento Grid de Magic UI).
export function PhotoTile({
  image,
  tone,
  icon,
  index,
  title,
  text,
  href,
}: {
  image: string
  tone: keyof typeof TILE_TONES
  icon: IconName
  index: number
  title: string
  text: string
  href?: string
}) {
  const content = (
    <>
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
      />
      <span
        aria-hidden
        className={cn("absolute inset-0 bg-linear-to-t from-20% via-45% to-transparent to-75%", TILE_TONES[tone])}
      />
      <span className="relative w-fit rounded-lg bg-background text-foreground">
        <IconBadge tone={cycleTone(index)}>
          <HoverIcon name={icon} size={22} />
        </IconBadge>
      </span>
      <span className={cn("relative flex flex-col gap-1", tone === "ink" && "text-background")}>
        <span className="font-heading text-2xl leading-tight font-semibold tracking-[-0.01em] sm:text-4xl">
          {title}
        </span>
        <span className="text-sm leading-snug text-pretty sm:text-base">{text}</span>
      </span>
    </>
  )
  const className =
    "group relative flex h-full flex-col justify-between overflow-hidden rounded-xl p-4 outline-none transition-transform duration-500 ease-premium hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring/40 sm:p-6"

  return (
    <BlurFade inView delay={index * 0.06} className="h-full">
      <IconHoverArea className="h-full">
        {href ? (
          <a href={href} className={className}>
            {content}
          </a>
        ) : (
          <div className={className}>{content}</div>
        )}
      </IconHoverArea>
    </BlurFade>
  )
}

// Dos fotos superpuestas con una etiqueta flotante.
export function PhotoDuo({
  image,
  imageAlt,
  secondImage,
  secondImageAlt,
  chip,
  priority,
}: {
  image: string
  imageAlt: string
  secondImage: string
  secondImageAlt: string
  chip: string
  priority?: boolean
}) {
  return (
    <div className="relative mr-6 mb-8 md:mr-10">
      <div className={cn(PHOTO_FRAME_CLASS, "aspect-[4/3] -rotate-2")}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />
        <BorderBeam size={140} duration={8} colorFrom={BRAND_HEX.green} colorTo={BRAND_HEX.pink} />
      </div>
      <div className={cn(PHOTO_FRAME_CLASS, "absolute -right-6 -bottom-8 aspect-square w-2/5 rotate-3 md:-right-10")}>
        <Image
          src={secondImage}
          alt={secondImageAlt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 18vw, 40vw"
          className="object-cover"
        />
      </div>
      <span className="absolute -top-3 -left-2 z-10 flex animate-float items-center gap-2 rounded-lg bg-background px-3 py-1.5 font-hand text-xl leading-none font-semibold text-foreground shadow-[0_12px_28px_-10px_rgb(26_26_26/0.4)] motion-reduce:animate-none sm:text-2xl">
        <span aria-hidden className="size-2 rounded-full bg-brand-green" />
        {chip}
      </span>
    </div>
  )
}

// Palabra gigante pasando de fondo (Scroll Based Velocity de Magic UI).
export function GhostWord({ word }: { word: string }) {
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-0 text-foreground/10">
      <ScrollVelocityRow baseVelocity={1}>
        {Array.from({ length: 4 }, (_, index) => (
          <span
            key={index}
            className="px-6 font-heading text-[7rem] leading-[0.85] font-semibold tracking-[-0.01em] md:text-[14rem]"
          >
            {word}
          </span>
        ))}
      </ScrollVelocityRow>
    </div>
  )
}

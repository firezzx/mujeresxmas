import Image from "next/image"

import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import { Eyebrow, HERO_TITLE_CLASS, PAGE_TITLE_CLASS, PageTitle } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { DotPattern } from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"

// Piezas del estilo del sitio: franjas con gradientes de marca, textura de puntos y fotos, nunca un
// color plano a todo el ancho. El corte en zigzag del manual cierra las franjas verdes.

export const PAGE_WIDTH_CLASS = "mx-auto w-full max-w-content px-5 sm:px-8 lg:px-9"
// Marco blanco y sombra de las fotos, como copias pegadas sobre la franja
export const PHOTO_FRAME_CLASS =
  "relative overflow-hidden rounded-xl border-4 border-background bg-background shadow-[0_24px_48px_-20px_rgb(26_26_26/0.45)] sm:border-[6px]"
// Para el contenido que se monta sobre el borde inferior de un ColorHero con `overlap`
export const OVERLAP_CLASS = "z-10 -mt-12 pt-0 md:-mt-16 md:pt-0"

const TONES = {
  white: { bg: "bg-background", text: "", dots: "" },
  soft: { bg: "bg-mesh-soft", text: "", dots: "text-brand-pink-strong/25" },
  pink: { bg: "bg-mesh-pink", text: "", dots: "text-foreground/15" },
  green: { bg: "bg-mesh-green", text: "", dots: "text-background/30" },
  ink: { bg: "bg-mesh-ink", text: "text-primary-foreground", dots: "text-background/20" },
}

export type BandTone = keyof typeof TONES

// Fondo de una franja: gradiente, textura de puntos y, opcional, una foto teñida con el color.
export function BandBackdrop({ tone, image }: { tone: BandTone; image?: string }) {
  const { bg, dots } = TONES[tone]
  return (
    <div aria-hidden className={cn("absolute inset-0 isolate overflow-hidden", bg)}>
      {image && (
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          className={cn(
            "object-cover",
            tone === "ink" ? "opacity-30 mix-blend-luminosity" : "opacity-30 brightness-125 contrast-75 mix-blend-multiply"
          )}
        />
      )}
      {dots && (
        <DotPattern
          width={22}
          height={22}
          cr={1.2}
          className={cn(dots, "[mask-image:radial-gradient(70%_70%_at_50%_50%,white,transparent)]")}
        />
      )}
    </div>
  )
}

// Corte en zigzag de la portada del manual de marca: rosa contra el verde, siempre irregular. El rosa
// se funde hacia abajo con el fondo de la página.
const ZIGZAG_POINTS = "0,39 138,84 298,10 459,64 619,0 802,57 962,12 1123,50 1283,5 1467,41 1467,90 0,90"

export function ZigzagEdge({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1467 90"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-x-0 -bottom-px block h-10 w-full sm:h-14 md:h-20", className)}
    >
      <defs>
        <linearGradient id="zigzag-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--brand-soft)" />
          <stop offset="1" stopColor="var(--brand-soft)" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <polygon points={ZIGZAG_POINTS} fill="var(--background)" />
      <polygon points={ZIGZAG_POINTS} fill="url(#zigzag-fill)" />
    </svg>
  )
}

// Franja a todo el ancho con el contenido centrado.
export function Band({
  id,
  tone = "white",
  image,
  zigzag,
  className,
  children,
}: {
  id?: string
  tone?: BandTone
  // Foto de fondo, teñida con el color de la franja
  image?: string
  // Termina abajo con el corte en zigzag rosa (para las franjas verdes)
  zigzag?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={cn("relative flow-root scroll-mt-20", TONES[tone].text)}>
      <BandBackdrop tone={tone} image={image} />
      {zigzag && <ZigzagEdge />}
      <div className={cn(PAGE_WIDTH_CLASS, "relative py-16 md:py-24", className)}>{children}</div>
    </section>
  )
}

// Encabezado de página: franja con gradiente y foto, título y, opcional, algo al costado.
export function ColorHero({
  tone = "green",
  image,
  eyebrow,
  title,
  description,
  actions,
  aside,
  compact,
  overlap,
}: {
  tone?: BandTone
  image?: string
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
      image={image}
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
            <p className="max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">{description}</p>
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

// Título de sección, con una bajada y una acción opcionales.
export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <BlurFade
      inView
      className="mb-8 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-10"
    >
      <div className="flex min-w-0 flex-col gap-3">
        <h2 className="font-heading text-[2rem] leading-[1.1] font-semibold tracking-[-0.01em] text-balance sm:text-5xl">
          {title}
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

// Mosaico de foto con degradé de marca, para las grillas tipo bento.
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

// Dos fotos superpuestas con un rótulo manuscrito.
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
      <span className="absolute -top-3 -left-2 z-10 flex items-center gap-2 rounded-lg bg-background px-3 py-1.5 font-hand text-xl leading-none font-semibold text-foreground shadow-[0_12px_28px_-10px_rgb(26_26_26/0.4)] sm:text-2xl">
        <span aria-hidden className="size-2 rounded-full bg-brand-green" />
        {chip}
      </span>
    </div>
  )
}

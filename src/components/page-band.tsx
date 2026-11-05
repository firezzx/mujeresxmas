import Image from "next/image"

import { Eyebrow, HERO_TITLE_CLASS, PAGE_TITLE_CLASS, PageTitle } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

// Piezas del estilo del sitio, minimalista: franjas lisas a todo el ancho, mucho aire, fotos sin
// adornos y el corte en zigzag del manual de marca como único recurso gráfico.

export const PAGE_WIDTH_CLASS = "mx-auto w-full max-w-content px-5 sm:px-8 lg:px-9"
export const PHOTO_FRAME_CLASS = "relative overflow-hidden rounded-xl"
// Para el contenido que se monta sobre el borde inferior de un ColorHero con `overlap`
export const OVERLAP_CLASS = "z-10 -mt-12 pt-0 md:-mt-16 md:pt-0"

const BAND_TONES = {
  white: "bg-background",
  pink: "bg-brand-soft",
  green: "bg-brand-green",
  ink: "bg-primary text-primary-foreground",
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
  zigzag,
  className,
  children,
}: {
  id?: string
  tone?: BandTone
  // Termina abajo con el corte en zigzag rosa (para las franjas verdes)
  zigzag?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={cn("relative flow-root scroll-mt-20", BAND_TONES[tone])}>
      {zigzag && <ZigzagEdge />}
      <div className={cn(PAGE_WIDTH_CLASS, "relative py-16 md:py-28", className)}>{children}</div>
    </section>
  )
}

// Encabezado de página: franja de color, título y, opcional, algo al costado.
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
      className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-10"
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

// Foto sin adornos.
export function Photo({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string
  alt: string
  sizes: string
  priority?: boolean
  className?: string
}) {
  return (
    <div className={cn(PHOTO_FRAME_CLASS, "aspect-[4/3]", className)}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
    </div>
  )
}

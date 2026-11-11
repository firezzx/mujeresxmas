import Image from "next/image"

import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import { Eyebrow, HERO_TITLE_CLASS, PAGE_TITLE_CLASS, PageTitle } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { DotPattern } from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"

// Piezas del estilo del sitio: franjas con gradientes suaves de marca y textura de puntos, nunca un
// color plano ni una foto teñida a todo el ancho; las fotos van siempre enmarcadas. El corte en zigzag del manual va solo en el hero del inicio.

export const PAGE_WIDTH_CLASS = "mx-auto w-full max-w-content px-5 sm:px-8 lg:px-9"
// Marco blanco y sombra de las fotos, como copias pegadas sobre la franja
export const PHOTO_FRAME_CLASS =
  "relative overflow-hidden rounded-xl border-4 border-background bg-background shadow-[0_24px_48px_-20px_rgb(26_26_26/0.45)] sm:border-[6px]"
// Para el contenido que se monta sobre el borde inferior de un ColorHero con `overlap`
export const OVERLAP_CLASS = "z-10 -mt-12 pt-0 md:-mt-16 md:pt-0"

const TONES = {
  white: { bg: "bg-background", text: "", dots: "" },
  soft: { bg: "bg-mesh-soft", text: "", dots: "text-brand-pink-strong/25" },
  pink: { bg: "bg-mesh-pink", text: "", dots: "text-foreground/10" },
  green: { bg: "bg-mesh-green", text: "", dots: "text-foreground/10" },
  ink: { bg: "bg-mesh-ink", text: "surface-dark", dots: "text-background/20" },
}

export type BandTone = keyof typeof TONES

// Fondo de una franja: gradiente y textura de puntos.
export function BandBackdrop({ tone }: { tone: BandTone }) {
  const { bg, dots } = TONES[tone]
  return (
    <div aria-hidden className={cn("absolute inset-0 isolate overflow-hidden", bg)}>
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

function ZigzagEdge({ className }: { className?: string }) {
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

// Fondo de foto para las franjas de contraste: la imagen a todo el ancho con un velo oscuro de
// marca y la textura de puntos encima, para que el texto blanco se lea siempre.
function PhotoBackdrop({ image }: { image: string }) {
  return (
    <div aria-hidden className="absolute inset-0 isolate overflow-hidden bg-primary">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-primary/80 to-primary/70" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_100%,color-mix(in_srgb,var(--brand-green)_30%,transparent),transparent_70%)]" />
      <DotPattern
        width={22}
        height={22}
        cr={1.2}
        className="text-background/20 [mask-image:radial-gradient(70%_70%_at_50%_50%,white,transparent)]"
      />
    </div>
  )
}

// Franja a todo el ancho con el contenido centrado. Con `image`, es una franja de contraste: la foto
// de fondo con velo oscuro y el texto en blanco.
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
  image?: string
  // Termina abajo con el corte en zigzag rosa (solo el hero del inicio)
  zigzag?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={cn("relative flow-root scroll-mt-20", image ? "surface-dark" : TONES[tone].text)}>
      {image ? <PhotoBackdrop image={image} /> : <BandBackdrop tone={tone} />}
      {zigzag && <ZigzagEdge />}
      <div className={cn(PAGE_WIDTH_CLASS, "relative py-16 md:py-24", className)}>{children}</div>
    </section>
  )
}

// Encabezado de página: franja con gradiente, título y, opcional, algo al costado.
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
// Mosaico de foto con una sombra suave abajo para el texto, para las grillas tipo bento.
export function PhotoTile({
  image,
  icon,
  index,
  title,
  text,
  href,
}: {
  image: string
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
        className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/35 via-35% to-transparent to-70%"
      />
      <span className="relative w-fit rounded-lg bg-background text-foreground">
        <IconBadge tone={cycleTone(index)}>
          <HoverIcon name={icon} size={22} />
        </IconBadge>
      </span>
      <span className="relative flex flex-col gap-1 text-background">
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

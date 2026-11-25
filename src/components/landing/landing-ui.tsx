import Link from "next/link"

import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { PAGE_WIDTH_CLASS } from "@/components/page-band"
import { BrandHighlight } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { BRAND_HEX } from "@/config/brand-effects"
import { cn } from "@/lib/utils"

// Piezas del inicio: cada sección ocupa la pantalla en escritorio. Secciones blancas y el color en las tarjetas (grilla tipo bento). El título
// lleva la parte destacada subrayada en naranja, como en el resto del sitio.

// Con `fit`, la sección mide lo que su contenido (para las que tienen poco y quedarían vacías).
export function Section({
  id,
  fit = false,
  className,
  children,
}: {
  id?: string
  fit?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-0", !fit && "lg:flex lg:min-h-svh lg:flex-col")}>
      <div
        className={cn(PAGE_WIDTH_CLASS, "py-20 md:py-24", !fit && "md:py-28 lg:my-auto lg:pt-24 lg:pb-12", className)}
      >
        {children}
      </div>
    </section>
  )
}

// Etiqueta chica arriba de los títulos
export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-md bg-brand-green/15 px-3 py-1 font-heading text-xs font-semibold tracking-[0.08em] text-brand-green-strong uppercase",
        className
      )}
    >
      {children}
    </span>
  )
}

export const HEADING_CLASS = "font-heading font-semibold tracking-[-0.025em] text-balance"

export function SectionHeading({
  eyebrow,
  title,
  accent,
  hand,
  description,
  action,
  align = "center",
  className,
}: {
  eyebrow?: string
  title: string
  accent?: string
  // Frase manuscrita debajo del título
  hand?: string
  description?: string
  action?: React.ReactNode
  align?: "center" | "left"
  className?: string
}) {
  const center = align === "center"
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-5 md:mb-16 lg:mb-10",
        center ? "mx-auto max-w-3xl items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn("flex flex-col gap-5", center && "items-center")}>
        {eyebrow && (
          <BlurFade inView>
            <Pill>{eyebrow}</Pill>
          </BlurFade>
        )}
        <BlurFade inView delay={0.05}>
          <h2 className={cn(HEADING_CLASS, "text-4xl leading-[1.05] sm:text-5xl lg:text-6xl")}>
            {title} {accent && <BrandHighlight>{accent}</BrandHighlight>}
          </h2>
        </BlurFade>
        {hand && (
          <BlurFade inView delay={0.08}>
            <p className="font-hand text-3xl leading-none font-semibold text-brand-green-strong sm:text-4xl">{hand}</p>
          </BlurFade>
        )}
        {description && (
          <BlurFade inView delay={0.1}>
            <p className={cn("text-lg leading-relaxed text-pretty text-muted-foreground", center && "max-w-2xl")}>
              {description}
            </p>
          </BlurFade>
        )}
      </div>
      {action && (
        <BlurFade inView delay={0.12} className="shrink-0">
          {action}
        </BlurFade>
      )}
    </div>
  )
}

// Tarjetas: blancas con borde fino y sombra suave, como las de los planes. El color de marca va solo
// en el recuadro del ícono (IconBadge), nunca de fondo de la tarjeta. Los tonos de color quedan como
// nombres para no tocar cada llamada; todos se ven blancos.
const WHITE_CARD =
  "bg-background ring-1 ring-foreground/[0.08] shadow-[0_1px_2px_rgb(26_26_26/0.04),0_16px_40px_-20px_rgb(26_26_26/0.18)]"

const CARD_TONES = {
  white: WHITE_CARD,
  paper: WHITE_CARD,
  green: WHITE_CARD,
  pink: WHITE_CARD,
  orange: WHITE_CARD,
  ink: "surface-dark bg-primary",
}

export type CardTone = keyof typeof CARD_TONES

export function cardClass(tone: CardTone, className?: string) {
  return cn("relative overflow-hidden rounded-xl", CARD_TONES[tone], className)
}

// Link de texto con la flecha animada
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <IconHoverArea className={cn("inline-flex", className)}>
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-md text-[15px] font-semibold underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        {children}
        <HoverIcon name="arrow-right" size={16} />
      </Link>
    </IconHoverArea>
  )
}

// Botón cuadrado con la flecha, para las tarjetas que son links
export function ArrowBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-foreground shadow-[0_6px_16px_-8px_rgb(26_26_26/0.35)] transition-transform duration-300 ease-premium group-hover:translate-x-0.5",
        className
      )}
    >
      <HoverIcon name="arrow-right" size={16} />
    </span>
  )
}

export function SampleTag() {
  return (
    <span className="rounded-md bg-foreground/[0.07] px-2 py-0.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
      Ejemplo
    </span>
  )
}

// ─── Franjas oscuras ─────────────────────────────────────────────────────────────────────

// Fondo negro de marca con la grilla titilante de Magic UI (Flickering Grid), sin más adornos
export function DarkBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-primary">
      <FlickeringGrid
        squareSize={3}
        gridGap={7}
        flickerChance={0.1}
        maxOpacity={0.3}
        color={BRAND_HEX.white}
        className="absolute inset-0 opacity-50 [mask-image:radial-gradient(75%_70%_at_50%_50%,white,transparent)]"
      />
    </div>
  )
}

// `screen` hace que ocupe la pantalla en escritorio; los cierres con botones van más bajos.
export function DarkSection({
  id,
  className,
  screen = true,
  backdrop,
  children,
}: {
  id?: string
  className?: string
  screen?: boolean
  // Fondo propio (p. ej. una foto con velo negro); sin él, la grilla titilante
  backdrop?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        "surface-dark relative isolate scroll-mt-0 overflow-hidden text-foreground",
        screen && "lg:flex lg:min-h-svh lg:flex-col"
      )}
    >
      {backdrop ?? <DarkBackdrop />}
      <div
        className={cn(
          PAGE_WIDTH_CLASS,
          "relative w-full py-24 md:py-28",
          screen && "lg:my-auto lg:pt-24 lg:pb-12",
          className
        )}
      >
        {children}
      </div>
    </section>
  )
}

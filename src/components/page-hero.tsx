import { AuroraText } from "@/components/ui/aurora-text"
import { BlurFade } from "@/components/ui/blur-fade"
import { TextAnimate } from "@/components/ui/text-animate"
import { AURORA_COLORS } from "@/config/brand-effects"
import { cn } from "@/lib/utils"

type PageHeroProps = {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export const HERO_TITLE_CLASS =
  "font-heading text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl md:text-7xl"

export const PAGE_TITLE_CLASS =
  "font-heading text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-5xl"

type PageTitleProps = { children: React.ReactNode; className?: string; delay?: number }

// Título de página. Si es texto, entra palabra por palabra con Text Animate de Magic UI; si
// trae partes destacadas (BrandHighlight), entra completo con Blur Fade.
export function PageTitle({ children, className, delay = 0 }: PageTitleProps) {
  if (typeof children === "string") {
    return (
      <TextAnimate as="h1" animation="blurInUp" by="word" once delay={delay} duration={0.5} className={className}>
        {children}
      </TextAnimate>
    )
  }
  return (
    <BlurFade delay={delay} inView>
      <h1 className={className}>{children}</h1>
    </BlurFade>
  )
}

// Palabra destacada de un título con el degradé animado de Aurora Text en colores de marca.
export function BrandHighlight({ children }: { children: string }) {
  return <AuroraText colors={AURORA_COLORS}>{children}</AuroraText>
}

// Encabezado estándar de página con la animación de aparición escalonada del sitio.
// Todas las páginas lo usan para que entren igual.
export function PageHero({ eyebrow, title, description, actions, className, children }: PageHeroProps) {
  // El título tiene su propia animación; el resto entra con Blur Fade, todo escalonado
  const TITLE = "title"
  const items = [
    eyebrow && <div key="eyebrow">{eyebrow}</div>,
    TITLE,
    description && (
      <p
        key="description"
        className="mx-auto max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg"
      >
        {description}
      </p>
    ),
    actions && (
      <div key="actions" className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
        {actions}
      </div>
    ),
    children,
  ].filter(Boolean)

  return (
    <div
      className={cn(
        "relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center sm:gap-7",
        className
      )}
    >
      {items.map((item, i) =>
        item === TITLE ? (
          <PageTitle key={TITLE} delay={0.08 + i * 0.08} className={cn(HERO_TITLE_CLASS, "w-full")}>
            {title}
          </PageTitle>
        ) : (
          <BlurFade key={i} delay={0.08 + i * 0.08} inView className="w-full">
            {item}
          </BlurFade>
        )
      )}
    </div>
  )
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur">
      <span className="size-1.5 rounded-full bg-brand" aria-hidden />
      {children}
    </span>
  )
}

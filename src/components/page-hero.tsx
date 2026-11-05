import { BlurFade } from "@/components/ui/blur-fade"
import { Highlighter } from "@/components/ui/highlighter"
import { TextAnimate } from "@/components/ui/text-animate"
import { BRAND_HEX } from "@/config/brand-effects"
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
  "relative font-heading text-[2.5rem] leading-[1.1] font-semibold tracking-[-0.01em] text-balance sm:text-6xl md:text-[4rem]"

export const PAGE_TITLE_CLASS =
  "relative font-heading text-[2.25rem] leading-[1.1] font-semibold tracking-[-0.01em] text-balance sm:text-5xl"

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

// Parte destacada de un título: subrayada a mano, pegada al texto (Highlighter de Magic UI). Por defecto
// en naranja, que resalta sobre los gradientes claros; sobre otros fondos se le pasa el color.
export function BrandHighlight({ children, color = BRAND_HEX.brand }: { children: string; color?: string }) {
  return (
    <Highlighter
      isView
      inline
      action="underline"
      color={color}
      strokeWidth={3}
      iterations={1}
      paddingEm={-0.28}
      animationDuration={700}
    >
      {children}
    </Highlighter>
  )
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
      <p key="description" className="mx-auto max-w-xl text-base leading-relaxed text-pretty sm:text-lg">
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
    <span className="inline-flex items-center font-heading text-[13px] font-medium tracking-[0.16em] uppercase">
      {children}
    </span>
  )
}

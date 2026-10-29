import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

type PageHeroProps = {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

// Encabezado estándar de página con la animación de aparición escalonada del sitio.
// Todas las páginas lo usan para que entren igual.
export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  className,
  children,
}: PageHeroProps) {
  const items = [
    eyebrow && <div key="eyebrow">{eyebrow}</div>,
    <h1
      key="title"
      className="font-heading text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl md:text-7xl"
    >
      {title}
    </h1>,
    description && (
      <p
        key="description"
        className="mx-auto max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg"
      >
        {description}
      </p>
    ),
    actions && (
      <div
        key="actions"
        className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
      >
        {actions}
      </div>
    ),
    children,
  ].filter(Boolean)

  return (
    <div
      className={cn(
        "relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:gap-7",
        className
      )}
    >
      {items.map((item, i) => (
        <BlurFade key={i} delay={0.08 + i * 0.08} inView className="w-full">
          {item}
        </BlurFade>
      ))}
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

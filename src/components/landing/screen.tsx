import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { RegisterCta } from "@/components/cta/register-cta"
import { DarkBackdrop, HEADING_CLASS } from "@/components/landing/landing-ui"
import { PAGE_WIDTH_CLASS } from "@/components/page-band"
import { BrandHighlight } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import { cn } from "@/lib/utils"

// Piezas de pantalla completa para las páginas internas, con el estilo del inicio.

// Luces de marca difusas detrás del título de las portadas
export function HeroLights() {
  return (
    <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[46rem]">
      <div className="absolute -top-40 left-[8%] size-[36rem] rounded-full bg-brand-green/25 blur-[120px]" />
      <div className="absolute -top-24 right-[6%] size-[32rem] rounded-full bg-brand-soft/45 blur-[120px]" />
      <div className="absolute top-40 left-1/2 size-[18rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[100px]" />
    </div>
  )
}

// Sección a pantalla completa en escritorio: ocupa el alto de la ventana y centra su contenido.
// El relleno de arriba deja lugar al menú fijo. En el celular, las secciones siguen una abajo de otra.
export function ScreenSection({
  id,
  backdrop,
  className,
  innerClassName,
  children,
}: {
  id?: string
  backdrop?: React.ReactNode
  className?: string
  innerClassName?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn("relative isolate scroll-mt-0 overflow-hidden lg:flex lg:min-h-svh lg:flex-col", className)}
    >
      {backdrop}
      <div className={cn(PAGE_WIDTH_CLASS, "relative py-20 md:py-24 lg:my-auto lg:pt-24 lg:pb-12", innerClassName)}>
        {children}
      </div>
    </section>
  )
}

// Cierre negro con textura, centrado: frase manuscrita, título con subrayado y los dos botones
export function ScreenClosing({
  hand,
  title,
  highlight,
  description,
  children,
}: {
  hand?: string
  title: string
  highlight: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <ScreenSection backdrop={<DarkBackdrop />} className="surface-dark text-center text-foreground">
      <BlurFade inView className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        {hand && <p className="font-hand text-3xl leading-none font-semibold text-brand-soft sm:text-4xl">{hand}</p>}
        <h2 className={cn(HEADING_CLASS, "text-4xl leading-[1.02] sm:text-6xl lg:text-7xl")}>
          {title} <BrandHighlight>{highlight}</BrandHighlight>
        </h2>
        {description && (
          <p className="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">{description}</p>
        )}
        <div className="mt-2 w-full sm:w-auto">{children}</div>
      </BlurFade>
    </ScreenSection>
  )
}

// Los dos botones de siempre: registrarse y ver los planes
export function JoinActions({ plansLabel, className }: { plansLabel: string; className?: string }) {
  return (
    <div className={cn("flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row", className)}>
      <RegisterCta className="w-full sm:w-auto" />
      <HoverRevealLink href={ROUTES.planes} className="w-full sm:w-auto">
        {plansLabel}
      </HoverRevealLink>
    </div>
  )
}

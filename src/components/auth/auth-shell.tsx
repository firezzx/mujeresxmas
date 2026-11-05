import { BrandCard } from "@/components/account/account-card"
import { DOTS_MASK_CLASS, PAGE_WIDTH_CLASS, ZigzagEdge } from "@/components/page-band"
import { Eyebrow, HERO_TITLE_CLASS, PageTitle } from "@/components/page-hero"
import { AvatarCircles } from "@/components/ui/avatar-circles"
import { BlurFade } from "@/components/ui/blur-fade"
import { DotPattern } from "@/components/ui/dot-pattern"
import { HOME_AVATARS, HOME_HERO } from "@/content/home"
import { cn } from "@/lib/utils"

type AuthShellProps = {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  // Efecto de fondo extra (p. ej. confeti al confirmar la cuenta)
  backdrop?: React.ReactNode
}

// Estructura de las páginas de cuenta (registro, login, confirmaciones): franja verde con el título de
// un lado y la tarjeta del otro, sobre un bloque de color.
export function AuthShell({ eyebrow, title, description, children, backdrop }: AuthShellProps) {
  return (
    <main className="relative flex flex-1 flex-col">
      <section className="relative flex min-h-svh items-center overflow-hidden bg-brand-green">
        <DotPattern width={22} height={22} cr={1.2} className={cn("text-background/30", DOTS_MASK_CLASS)} />
        <ZigzagEdge />
        {backdrop}

        <div
          className={cn(
            PAGE_WIDTH_CLASS,
            "relative grid items-center gap-10 pt-28 pb-24 md:pb-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-16"
          )}
        >
          <div className="flex min-w-0 flex-col items-start gap-5">
            {eyebrow && (
              <BlurFade inView>
                <Eyebrow>{eyebrow}</Eyebrow>
              </BlurFade>
            )}
            <PageTitle delay={0.06} className={HERO_TITLE_CLASS}>
              {title}
            </PageTitle>
            {description && (
              <BlurFade inView delay={0.12}>
                <p className="max-w-xl text-base leading-relaxed text-pretty opacity-80 sm:text-lg">{description}</p>
              </BlurFade>
            )}
            <BlurFade inView delay={0.18} className="max-lg:hidden">
              <div className="flex items-center gap-3">
                <AvatarCircles images={HOME_AVATARS} />
                <span className="font-heading text-lg font-medium tracking-[-0.01em]">{HOME_HERO.avatarsText}</span>
              </div>
            </BlurFade>
          </div>

          <BlurFade inView delay={0.14} className="relative w-full min-w-0">
            <div
              aria-hidden
              className="absolute -top-4 -right-3 h-1/2 w-3/5 rotate-3 rounded-xl bg-brand-soft sm:-right-5"
            />
            <div
              aria-hidden
              className="absolute -bottom-4 -left-3 h-2/5 w-1/2 -rotate-3 rounded-xl bg-foreground sm:-left-5"
            />
            <BrandCard
              className="relative shadow-[0_24px_64px_-24px_rgb(26_26_26/0.35)]"
              contentClassName="p-5 text-left sm:p-7"
            >
              {children}
            </BrandCard>
          </BlurFade>
        </div>
      </section>
    </main>
  )
}

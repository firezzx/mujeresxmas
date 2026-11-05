import { BrandCard } from "@/components/account/account-card"
import { PAGE_WIDTH_CLASS, ZigzagEdge } from "@/components/page-band"
import { Eyebrow, HERO_TITLE_CLASS, PageTitle } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
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
// un lado y la tarjeta del otro.
export function AuthShell({ eyebrow, title, description, children, backdrop }: AuthShellProps) {
  return (
    <main className="relative flex flex-1 flex-col">
      <section className="relative flex min-h-svh items-center overflow-hidden bg-brand-green">
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
          </div>

          <BlurFade inView delay={0.14} className="relative w-full min-w-0">
            <BrandCard
              className="relative"
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

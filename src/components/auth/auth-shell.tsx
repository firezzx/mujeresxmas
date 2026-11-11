import { cardClass, HEADING_CLASS, Pill } from "@/components/landing/landing-ui"
import { HeroLights } from "@/components/landing/screen"
import { LatestMembers } from "@/components/latest-members"
import { PAGE_WIDTH_CLASS } from "@/components/page-band"
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

// Estructura de las páginas de cuenta (registro, login, confirmaciones), con el estilo del inicio:
// pantalla completa clara con las luces de marca, el título grande de un lado y el formulario en
// una tarjeta blanca del otro.
export function AuthShell({ eyebrow, title, description, children, backdrop }: AuthShellProps) {
  return (
    <main className="relative flex flex-1 flex-col">
      <section className="relative isolate flex min-h-svh items-center overflow-hidden">
        <HeroLights />
        {backdrop}

        <div
          className={cn(
            PAGE_WIDTH_CLASS,
            "relative grid items-center gap-10 pt-32 pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-20 lg:pt-28 lg:pb-16"
          )}
        >
          <div className="flex min-w-0 flex-col items-start">
            {eyebrow && (
              <BlurFade>
                <Pill>{eyebrow}</Pill>
              </BlurFade>
            )}
            <BlurFade delay={0.06}>
              <h1 className={cn(HEADING_CLASS, "mt-6 text-[2.75rem] leading-[1] sm:text-6xl xl:text-7xl")}>{title}</h1>
            </BlurFade>
            {description && (
              <BlurFade delay={0.12}>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
                  {description}
                </p>
              </BlurFade>
            )}
            <BlurFade delay={0.18} className="mt-10 max-lg:hidden">
              <LatestMembers />
            </BlurFade>
          </div>

          <BlurFade delay={0.14} className="w-full min-w-0">
            <div className={cardClass("white", "p-5 text-left sm:p-8")}>{children}</div>
          </BlurFade>
        </div>
      </section>
    </main>
  )
}
